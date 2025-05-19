import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('ユーザー情報の取得に失敗しました:', userError);
      return null;
    }

    const { data: orgs, error: orgsError } = await supabase
    .from('organizations')
    .select('*');
  
    console.log("すべての組織を取得: ");
    console.log(orgs);

    if (orgsError || !orgs) {
      console.error('組織の取得に失敗しました:', orgsError);
      return NextResponse.json({ message: '組織の取得に失敗しました: ' + orgsError.message }, { status: 500 });
    }

    return NextResponse.json(orgs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '取得処理でエラーが発生しました' }, { status: 500 });
  }
} 