import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: Request,
  { params }: { params: { organizationId: string } }
) {
  const { organizationId } = await params;
  console.log("組織ID指定所属部署一覧取得: " + organizationId);

  if (!organizationId || organizationId === "") {
    return NextResponse.json({ message: '組織IDが不正です: ' + organizationId }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('ユーザー情報の取得に失敗しました:', userError);
      return null;
    }

    const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, organization_id')
    .eq('auth_id', user.id)
    .single();
  
    console.log("ユーザープロフィールを取得: ");
    console.log(profile);

    if (profileError || !profile) {
      console.error('ユーザープロフィールの取得に失敗しました:', profileError);
      return null;
    }

    const { data, error } = await supabase
    .from('departments')
    .select('id, name, folder_id, folder_name')
    .eq('organization_id', organizationId);
    
    console.log("部署情報を取得: " );
    console.log(data);
    if (error) {
      return NextResponse.json({ message: '部署取得に失敗しました: ' + error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '部署取得処理でエラーが発生しました' }, { status: 500 });
  }
} 