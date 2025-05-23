import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/utils/googleAuth'; 
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

type FileInfo = {
  fileId: string;
  fileName: string;
  description: string;  
}
// const drive = google.drive('v3');
export async function analyzeCurriculumDifficulty(summary: string, pageCount: number, ojtDays: number) {
  try {
    const prompt = `以下のドキュメントの要約、ページ数、OJT期間から、このドキュメントのカリキュラムとしての難易度を評価してください。
    要約: ${summary}
    ページ数: ${pageCount} ページ
    OJT期間: ${ojtDays} 日

    難易度を「とても易しい」「易しい」「普通」「難しい」「とても難しい」のいずれかの段階評価と共に、200文字以内で回答してください。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content?.trim() || '評価できませんでした';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return '評価できませんでした';
  }
}

export async function evaluateDocumentLevel(summary: string, pageCount: number,) {
  try {
    const prompt = `以下のドキュメントの要約から、このドキュメントの学習レベルを5段階で評価してください（レベル1が最も易しく、レベル5が最も難しい）。また、その評価理由を簡潔にメッセージとして添えてください。
    要約: ${summary}
    ページ数: ${pageCount} ページ

    例: レベル: 3, メッセージ: 専門用語がいくつか含まれており、ある程度の知識が必要です。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices[0]?.message?.content?.trim() || '評価できませんでした';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return '評価できませんでした';
  }
}

export async function POST(request: Request) {
  try {
    // const { folderId, fileInfos, period } = await request.json();
    // const reqFileInfos: FileInfo[] = fileInfos;

    // const { searchParams } = new URL(request.url);
    // const folderId = searchParams.get('folderId');

    // console.log("folderId: " + folderId);
    // console.log("fileInfos: ");
    // console.log(fileInfos);
    // if (!folderId) {
    //   return NextResponse.json({ error: 'フォルダIDが指定されていません。' }, { status: 400 });
    // }

    const supabasePromise = createClient();
    const supabase = await supabasePromise;

    // スキルナレッジベクトルDBからページ数を取得
    const { folderId, fileIds, period } = await request.json();

    console.log("カリキュラム作成評価処理開始...");
    console.log("folderId: " + folderId);
    console.log(fileIds);
    console.log("OJT期間: " + period);
    if (!folderId || !fileIds || fileIds.length === 0 || !period) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    // const fileIds = fileInfos.map((file: { fileId: string, fileName: string }) => file.fileId);

    // Supabase から該当ドキュメントのページ数とメタデータを取得
    const { data: documents, error: dbError } = await supabase
      .from('skill_documents')
      .select('file_id, page_count, metadata')
      .in('file_id', fileIds)
      .eq('folder_id', folderId);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json({ error: 'Failed to fetch document data from Supabase' }, { status: 500 });
    }

    if (!documents || documents.length === 0) {
      return NextResponse.json({ message: 'No matching documents found' }, { status: 200 });
    }

    const analysisResults = await Promise.all(
      documents.map(async (doc) => {
        const description = doc.metadata?.description || 'No description available.';
        const fileName = doc.metadata?.file_name;
        const pageCount = doc.page_count || 0;

        // ドキュメントごとのレベルと難易度を評価
        const promptDocument = `以下のドキュメントについて、学習レベルを5段階で評価し（レベル1が最も易しく、レベル5が最も難しい）、以下のOJT期間で以下のページ数を習得するカリキュラムとしての難易度を「とても易しい」「易しい」「普通」「難しい」「とても難しい」のいずれかで回答してください。また、その評価理由を50文字以内に簡潔にメッセージとして添えてください。

        要約: ${description}
        ページ数: ${pageCount} ページ
        OJT期間: ${period} 日

        回答形式:
        レベル: [1-5]
        難易度: [とても易しい|易しい|普通|難しい|とても難しい]
        メッセージ: [評価理由]`;

        const completionDocument = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptDocument }],
        });

        const aiResponse = completionDocument.choices[0]?.message?.content?.trim();
        const levelMatch = aiResponse?.match(/レベル: ([1-5])/);
        const difficultyMatch = aiResponse?.match(/難易度: (易しい|普通|難しい)/);
        const messageMatch = aiResponse?.match(/メッセージ: ([^]*)/);

        return {
          fileId: doc.file_id,
          fileName: fileName,
          level: levelMatch ? parseInt(levelMatch[1]) : null,
          difficulty: difficultyMatch ? difficultyMatch[1] : null,
          message: messageMatch ? messageMatch[1] : null,
          pageCount,
          description,
        };
      })
    );

    const totalPageCount = documents.reduce((sum, doc) => sum + (doc.page_count || 0), 0);
    // 全ドキュメントを period の期間で習得する場合の難易度を評価
    const overallPrompt = `以下のドキュメント群を ${period} 日間で全てのページを熟読し、習得する場合の全体的な難易度を200文字以内で評価してください。総ページ数は ${totalPageCount} ページです。読者はベースの知識が全くない素人レベルとします。学習に使える時間は1日5時間程度とします。素人なので、少し厳しめの評価をしてください。各ドキュメントの情報は以下の通りです。

    ${analysisResults
      .map(
        (res) => `
      ファイル名: ${res.fileName}
      要約: ${res.description}
      ページ数: ${res.pageCount}
      推定レベル: ${res.level}
      推定難易度: ${res.difficulty}
      評価メッセージ: ${res.message}
    `
      )
      .join('\n\n')}

    全体的な難易度評価:`;

    const completionOverall = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: overallPrompt }],
    });

    const overallDifficultyAssessment = completionOverall.choices[0]?.message?.content?.trim();

    console.log("評価結果：");
    console.log(analysisResults);
    console.log(overallDifficultyAssessment);


    return NextResponse.json({ documents: analysisResults, overallEvaluation: overallDifficultyAssessment });

    // return NextResponse.json({ files });

  } catch (error: any) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: error.message || 'Failed to list files' }, { status: 500 });
  }
}