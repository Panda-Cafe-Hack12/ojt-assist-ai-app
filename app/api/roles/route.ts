import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('roles').select('id, name');
    if (error) {
      return NextResponse.json({ message: '取得に失敗しました: ' + error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '取得処理でエラーが発生しました' }, { status: 500 });
  }
} 