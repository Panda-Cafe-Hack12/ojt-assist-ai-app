import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // URLからクエリパラメータを取得
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');

  // モックデータ
  const mockFiles = [
    { id: '1', name: 'インフラ基礎.pdf' },
    { id: '2', name: 'ネットワーク入門.pdf' },
    { id: '3', name: 'セキュリティガイドライン.pdf' },
    { id: '4', name: 'サーバー構築手順書.pdf' },
  ];

  // 実際のAPIではfolderIdを使用してファイルをフィルタリングするかもしれません
  // ここではモックデータをそのまま返します
  return NextResponse.json(mockFiles);
} 