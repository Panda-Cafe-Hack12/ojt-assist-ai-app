// import { createClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";
// import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 必要に応じて

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Emailを入力してください' }, { status: 400 });
    }

    const { data, error } = await supabase
        .rpc('get_user_login', { user_email: email })
        .single(); // 関数が単一の行を返すことを想定


    // emailでユーザーを検索
    // const { data, error } = await supabase
    //   .from('users')
    //   .select(`
    //     id,
    //     name,
    //     organization_id AS organizationId,
    //     department_id AS departmentId,
    //     role_id AS roleId,
    //     training_template_id AS trainingTemplateId,
    //     organizations!inner(organization_name: name),
    //     departments!inner(department_name: name)
    //   `)
    //   .eq('email', email)
    //   .single();  

    //   if (error) {
    //     console.error('Supabase query error:', error);
    //     return res.status(500).json({ error: 'Failed to fetch data from Supabase' });
    //   }
    // const { data: user, error: userError } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('email', email)
    //   .single();

    console.log("テーブルからの取得データ：");
    console.log(data);
    if (error) {
      console.error('ユーザー情報取得エラー:', error);
      return NextResponse.json({ message: 'ログインユーザー情報取得に失敗しました' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ message: 'Emailが間違っています' }, { status: 401 });
    }

    // パスワードの検証
    // const passwordMatch = await bcrypt.compare(password, user.password_hash);

    // if (!passwordMatch) {
    //   return NextResponse.json({ message: 'ユーザー名またはパスワードが間違っています' }, { status: 401 });
    // }

    // ログイン成功
    // ここでセッション管理や認証トークン（JWTなど）の発行を行うのが一般的です。
    // 簡単のため、ここではユーザー情報をJSONで返し、クライアント側で状態管理を行う例とします。

    // CookieにユーザーIDなどを設定する場合
    // cookies().set('user_id', user.id, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 7, // 7日間
    // });
    // const userResponse = {
    //   id: data.id,
    //   name: data.name,
    //   email: data.email,
    //   roleId: data.role_id,
    //   organizationId: data.organization_id,
    //   departmentId: data.department_id,
    //   trainingTemplateId: data.training_template_id,
    //   organizationName: data.organizations?.name,
    //   departmentName: data.departments?.name,
    //   // 他に必要なユーザー情報
    // };
    

    return NextResponse.json(data);
    // return NextResponse.json(userResponse);

  } catch (error: any) {
    console.error('ログイン処理エラー:', error);
    return NextResponse.json({ message: 'ログイン処理中にエラーが発生しました' }, { status: 500 });
  }
}