import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // リクエストボディを取得
  const body = await request.json();
  const { department, files, ojtDays } = body;

  // モックの評価結果
  const mockEvaluation = {
    goals: [
      { fileName: 'ターミナルの基本と主要コマンド.docx', goalLevel: 3 },
      { fileName: 'インターネット基礎知識.docx', goalLevel: 2 },
      { fileName: '仮想化とコンテナ技術概要.docx', goalLevel: 1 },
      { fileName: 'CICDとインフラ自動化.docx', goalLevel: 2 },
      { fileName: 'AWS基礎.docx', goalLevel: 3 },
    ],
    message: `${department}向けのカリキュラムを${ojtDays}日間で作成しました。
この日数では厳しめの設定です。`
  };

  return NextResponse.json(mockEvaluation);
} 