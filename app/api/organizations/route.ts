import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, knowledge_repo, is_delete } = body;

    if (!name || !knowledge_repo) {
      return NextResponse.json({ message: '必須項目が不足しています' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('organizations').insert([
      { name, knowledge_repo, is_delete: !!is_delete }
    ]);

    if (error) {
      return NextResponse.json({ message: '登録に失敗しました: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '登録が完了しました' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '登録処理でエラーが発生しました' }, { status: 500 });
  }
} 