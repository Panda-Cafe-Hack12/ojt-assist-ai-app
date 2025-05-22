import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { folder_id, folder_name } = body;

    if (!folder_id) {
      return NextResponse.json({ message: '必須項目が不足しています' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('departments').update([
      { folder_id, folder_name }
    ]);

    if (error) {
      return NextResponse.json({ message: '部署更新に失敗しました: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '部署更新が完了しました' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '部署更新処理でエラーが発生しました' }, { status: 500 });
  }
}

export async function GET() {
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
    .eq('organization_id', profile.organization_id);
    
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