import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const templateData = await request.json();

  // ここでデータベースに保存する処理を実装
  // 例：Prismaを使用した場合
  // await prisma.template.create({ data: templateData });

  return NextResponse.json({ success: true });
} 