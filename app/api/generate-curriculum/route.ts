import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // リクエストボディを取得
  const body = await request.json();
  const { department, files, ojtDays } = body;

  // モックの評価結果
  const mockEvaluation = {
    goals: [
      { fileName: 'インフラ基礎.pdf', goalLevel: 3 },
      { fileName: 'ネットワーク入門.pdf', goalLevel: 2 },
      { fileName: 'セキュリティガイドライン.pdf', goalLevel: 1 },
      { fileName: 'サーバー構築手順書.pdf', goalLevel: 2 },
    ],
    message: `${department}向けのカリキュラムを${ojtDays}日間で作成しました。
この日数では厳しめの設定です。`
  };

  return NextResponse.json(mockEvaluation);
} 