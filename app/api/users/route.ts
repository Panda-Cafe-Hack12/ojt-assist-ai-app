import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import { sendMail } from '@/utils/sendMail'; // メール送信ユーティリティ（仮）

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, department_id, organization_id, role_id } = body;

    if (!name || !email || !organization_id || ! department_id || !role_id) {
      return NextResponse.json({ message: '必須項目が不足しています' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('users').insert([
      {
        name,
        email,
        department_id: Number(department_id),
        organization_id,
        role_id: Number(role_id),
        // auth_id: null,
        valid: "1",
      },
    ]);

    

    if (error) {
      return NextResponse.json({ message: 'ユーザー登録に失敗しました: ' + error.message }, { status: 500 });
    }

    // メール送信処理（仮実装: 実際はsendMail等で送信）
    // await sendMail(email, ...);
    console.log(`メール送信: ${email} 宛に登録URLを送信しました`);

    return NextResponse.json({ message: '登録が完了しました。メールを送信しました。' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '登録処理でエラーが発生しました' }, { status: 500 });
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
    .select('*')
    .eq('auth_id', user.id)
    .single();
  
    console.log("ユーザープロフィールを取得: ");
    console.log(profile);

    if (profileError || !profile) {
      console.error('ユーザープロフィールの取得に失敗しました:', profileError);
      return null;
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '取得処理でエラーが発生しました' }, { status: 500 });
  }
} 