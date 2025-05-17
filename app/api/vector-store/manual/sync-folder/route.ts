import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";
import { google } from 'googleapis';
import { Readable } from 'stream';
import { getValidAccessToken } from '@/utils/googleAuth'; 
import { OpenAI } from 'openai'; 
import { getEmbeddings } from "../../_utils/embeddings"; 
import { getFileContentFromDrive } from "../../_utils/getFromDrive"; 
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface ProcessFolderResult {
    latestProcessedFileTime: string | null;
    processedFilesCount: number;
    error: any | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const openAIApiKey = process.env.OPENAI_API_KEY; 

// テキストをエンベディングに変換する関数 
async function getEmbeddings2(text: string): Promise<number[] | null> {
    if (!openAIApiKey) {
        console.error('OPENAI_API_KEY が設定されていません。');
        return null;
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small', // 使用する埋め込みモデルを指定
            dimensions: 512, // 次元数を指定
            input: text,
        });

        if (response.data.length > 0) {
            return response.data[0].embedding;
        } else {
            console.error('OpenAI API から埋め込みデータが返されませんでした。');
            return null;
        }
    } catch (error: any) {
        console.error('OpenAI API での埋め込み生成中にエラー:', error.message);
        return null;
    }
}


// Google Drive からファイルの内容を取得する関数
async function getFileContentFromDrive2(drive: any, fileId: string, mimeType: string): Promise<string | null> {
    try {
      console.log("ファイルダウンロード...");

      if (mimeType === 'application/vnd.google-apps.document') {
          const res = await drive.files.export({
              fileId: fileId,
              mimeType: 'text/plain',
          });
          return res.data as string;
      } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mimeType === 'application/msword'
      ) {
          // const res = await drive.files.get({
          //     fileId: fileId,
          //     mimeType: 'text/plain',
          // });
          const res = await drive.files.get({
            fileId: fileId,
            alt: 'media',
          }, { responseType: 'arraybuffer' });
          const buffer = Buffer.from(res.data as ArrayBuffer);
          const result = await mammoth.extractRawText({ buffer: buffer });
          const extractedText = result.value;
          console.log('Successfully extracted text from DOCX.');

          return extractedText;
      } else if (
          mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          mimeType === 'application/vnd.ms-excel'
      ) {
        // Excel ファイルの場合
        // まだ未完成
      const getResponse = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      }, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(getResponse.data as ArrayBuffer);
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      // for (const sheetName of workbook.SheetNames) {
      //   const worksheet = workbook.Sheets[sheetName];
      //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // 各行をテキスト化してベクトル DB に保存 (例)
      //   jsonData.forEach((row, rowIndex) => {
      //     const text = row.join(' '); // セルの値をスペースで結合
      //     const metadata = {
      //       fileName: fileName,
      //       sheetName: sheetName,
      //       row: rowIndex + 1,
      //     };
      //     saveToVectorDB(text, metadata);
      //   });
      // }
      // return res.status(200).json({ message: `Excel file "${fileName}" processed and saved to vector DB.` });

          const res = await drive.files.get({
              fileId: fileId,
              mimeType: 'text/csv',
          });
          return res.data as string;
      } else if (mimeType === 'text/plain') {
          const res = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' });
          let content = '';
          if (res && res.data) {
              for await (const chunk of res.data) {
                  content += chunk.toString();
              }
          }
          return content;
      }
        else {
          console.warn(`MIME タイプ "${mimeType}" のファイルは処理をスキップします。`);
          return null;
      }
    } catch (error: any) {
        console.error(`ファイル "${fileId}" の内容取得中にエラー:`, error.message);
        return null;
    }
}


async function processGoogleDriveFolder(supabase: ReturnType<typeof createClient>, drive: any, folderId: string, userId: string, latestSyncTime: string | null) : Promise<ProcessFolderResult>{
  let latestProcessedFileTime: string | null = latestSyncTime;
  let processedFilesCount = 0;
  const supabaseResolve = await supabase;
  let errorMsg: any = null;

  try {
    console.log(`フォルダ "${folderId}" を処理中...`);
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false${latestSyncTime ? ` and modifiedTime > '${latestSyncTime}'` : ''}`,           
      fields: 'files(id, name, mimeType, modifiedTime)',
    });

    console.log("フォルダ取得！");
    console.log(data);

    if (!data.files || data.files.length === 0) {
      console.log(`フォルダ "${folderId}" に更新されたファイルはありませんでした。`);
      return { latestProcessedFileTime, processedFilesCount, error: null };
    }

    for (const file of data.files) {
      const fileModifiedTime = file.modifiedTime;
      if (latestProcessedFileTime === null || new Date(fileModifiedTime) > new Date(latestProcessedFileTime)) {
          latestProcessedFileTime = fileModifiedTime;
      }

      if (file.mimeType !== 'application/vnd.google-apps.folder') {
        const content = await getFileContentFromDrive(drive, file.id!, file.mimeType!);
        console.log("取得ファイルcontent");
        console.log(content);
        if (content) {
          const embeddings = await getEmbeddings(content); 
          if (embeddings && embeddings.length === 512) {
            const metadata = {
              source: 'google_drive',
              file_id: file.id,
              file_name: file.name,
              folder_id: folderId,
              last_modified: fileModifiedTime,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            await supabaseResolve.rpc('upsert_manual_document', { // upsert を使用
                p_document_id: file.id,
                p_new_content: content,
                p_new_embedding: embeddings,
                p_new_metadata: metadata,
            });
            console.log(`ファイル "${file.name}" (${file.id}) のエンベディングを格納/更新しました。`);
            processedFilesCount++;

            // await storeEmbeddings(supabase, content, embeddings, metadata);
            // console.log(`ファイル "${file.name}" (${file.id}) のエンベディングを格納しました。`);
          } else {
            console.error(`ファイル "${file.name}" (${file.id}) のエンベディング生成に失敗しました。`);
            errorMsg = `ファイル "${file.name}" (${file.id}) のエンベディング生成に失敗しました。`;
          }
        }
      } else {
        const subFolderResult = await processGoogleDriveFolder(supabase, drive, file.id!, userId, latestSyncTime);
        if (subFolderResult.latestProcessedFileTime && (latestProcessedFileTime === null || new Date(subFolderResult.latestProcessedFileTime) > new Date(latestProcessedFileTime))) {
            latestProcessedFileTime = subFolderResult.latestProcessedFileTime;
        }
        processedFilesCount += subFolderResult.processedFilesCount;
      }
    }
    return { latestProcessedFileTime, processedFilesCount, error: errorMsg };
  } catch (error) {
    console.error('Google Drive フォルダ処理中にエラー:', error);
    return { latestProcessedFileTime, processedFilesCount: 0, error: error };
  }
}

export async function POST(request: Request) {
  const { folderPath } = await request.json();

  if (!folderPath) {
    return NextResponse.json({ error: 'フォルダIDが指定されていません。' }, { status: 400 });
  }

  const supabasePromise = createClient();
  const supabase = await supabasePromise;

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('ユーザー情報:' + user?.id);
  console.log(user);

  if (userError || !user) {
    console.error('ユーザー情報の取得に失敗しました:', userError);
    return NextResponse.json({ error: '認証に失敗しました。' }, { status: 401 });
  }

  // const { data: profile, error: profileError } = await supabase
  //   .from('users')
  //   .select('gdrive_access_token') // リフレッシュトークンはここでは不要
  //   .eq('auth_id', user.id)
  //   .single();

  // if (profileError || !profile || !profile.gdrive_access_token) {
  //   console.error('ユーザープロフィールの取得に失敗しました:', profileError);
  //   return NextResponse.json({ error: 'ユーザー情報の取得に失敗しました。' }, { status: 500 });
  // }

  const userId = user.id;

  // 有効なアクセストークンを取得
  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) {
    return NextResponse.json({ error: '有効なアクセストークンを取得できませんでした。' }, { status: 401 });
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', userId)
    .single();

  if (profileError || !profile) {
    console.error('二度目のユーザープロフィールの取得に失敗しました:', profileError);
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
  oauth2Client.setCredentials({ access_token: accessToken });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // 最新の同期ログから最終更新日時を取得
  const { data: latestLog, error: latestLogError } = await supabase
      .from('drive_sync_logs')
      .select('latest_updated_file_time')
      .eq('user_id', profile.id)
      .eq('drive_folder_id', folderPath)
      .eq('status', "success")
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

  const latestSyncTime = latestLog?.latest_updated_file_time || null;
  console.log(`前回の最新同期ファイル日時: ${latestSyncTime}`);

  // Google Drive の更新ファイルを処理
  const processResult = await processGoogleDriveFolder(supabasePromise, drive, folderPath, userId, latestSyncTime);

  // 同期ログを保存
  const { error: logError } = await supabase
      .from('drive_sync_logs')
      .insert({
          user_id: profile.id,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(), // 実際には処理終了後に更新
          status: !processResult.error ? 'success' : 'failed',
          processed_files_count: processResult.processedFilesCount,
          latest_updated_file_time: processResult.latestProcessedFileTime,
          drive_folder_id: folderPath,
          folder_type: 'manual',
      });

    if (logError) {
        console.error('同期ログの保存に失敗しました:', logError);
    }

    if (processResult.processedFilesCount >= 0) {
        return NextResponse.json({ message: 'Google Drive フォルダの同期が完了しました。', processedFiles: processResult.processedFilesCount });
    } else {
        return NextResponse.json({ error: 'Google Drive フォルダの同期中にエラーが発生しました。' }, { status: 500 });
    }
}

// ... (getFileContentFromDrive, getEmbeddings 関数の定義は変更なし)