import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { department, files, ojtPeriod } = await request.json();

  // ここでAIを使用してテンプレートを生成
  // 実際の実装では、OpenAI APIなどを使用することを想定
  const template = `Day 1: ${department}の概要
Day 2: ${files[0]}の学習
Day 3: ${files[1]}の学習
...`;

  return NextResponse.json({ template });
} 