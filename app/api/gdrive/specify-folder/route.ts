import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/utils/googleAuth'; 
import { createClient } from '@/utils/supabase/server';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// const drive = google.drive('v3');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    console.log("folderId: " + folderId);
    if (!folderId) {
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
    
    const userId = user.id;
  
    // 有効なアクセストークンを取得
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) {
      return NextResponse.json({ error: '有効なアクセストークンを取得できませんでした。' }, { status: 401 });
    }

      const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // const auth = new google.auth.GoogleAuth({
    //   keyFile: process.env.GOOGLE_DRIVE_CREDENTIALS_PATH, // 環境変数に認証情報ファイルのパスを設定
    //   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    // });

    // const authClient = await auth.getClient();
    // google.options({ auth: authClient });

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, description, modifiedTime, size)',
      supportsAllDrives: true,
      // driveId: folderId, // フォルダIDを driveId にも指定 (共有ドライブの場合)
      // corpora: 'drive',   // 検索対象を共有ドライブまたはマイドライブに指定 (driveId があれば共有ドライブ優先)
    });

    const files = res.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      description: file.description || '',
      modifiedTime: file.modifiedTime,
      size: file.size ? parseInt(file.size, 10) : 0,
    })) || [];

    return NextResponse.json({ files });

  } catch (error: any) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: error.message || 'Failed to list files' }, { status: 500 });
  }
}