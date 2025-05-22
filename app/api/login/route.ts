// import { createClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";
// import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 必要に応じて
import { User } from '../../types/user';

// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

// const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    const publicUserData = data as User;

      // ユーザー情報を取得
    // const { data: userAuth, error: authIdError } = await supabaseAdmin
    // .from('users')
    // .select('auth_id')
    // .eq('email', email)
    // .single();

    // if (authIdError || !userAuth) {
    //   console.error('認証ID取得エラー:', error);
    //   return NextResponse.json({ message: '認証ID取得に失敗しました' }, { status: 500 });
    // }

    // console.log("ユーザーの認証ID: " + userAuth.auth_id);
    // const { data: { user }, error: userError } = await supabase.auth.getUser();

    // console.log("ユーザーの認証ID: " + userAuth.auth_id);
    // const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(userAuth.auth_id);

    // if (userError || !user) {
    //   console.error('セッションユーザー情報の取得に失敗しました:', userError);
    //   return NextResponse.json({ message: 'セッションユーザー情報の取得に失敗しました' }, { status: 500 });
    // }

  

    // const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    //   user.id, {
    //     app_metadata: {
    //       user_name: publicUserData.name,
    //       organization_id: publicUserData.organization_id,
    //       organization_name: publicUserData.organization_name,
    //       department_id: publicUserData.department_id,
    //       department_name: publicUserData.department_name,
    //       role_id: publicUserData.role_id,
    //       training_template_id: publicUserData.training_template_id,
    //       // 他に必要な情報があればここに追加
    //     },
    //   });
    
    const { data: updateUser, error: updateError } = await supabase.auth.updateUser({
      data: {
        user_id: publicUserData.id,
        user_name: publicUserData.name,
        organization_id: publicUserData.organization_id,
        organization_name: publicUserData.organization_name,
        department_id: publicUserData.department_id,
        department_name: publicUserData.department_name,
        role_id: publicUserData.role_id,
        training_data_id: publicUserData.training_data_id,
        // app_metadata: {
        //   user_name: publicUserData.name,
        //   organization_id: publicUserData.organization_id,
        //   organization_name: publicUserData.organization_name,
        //   department_id: publicUserData.department_id,
        //   department_name: publicUserData.department_name,
        //   role_id: publicUserData.role_id,
        //   training_template_id: publicUserData.training_template_id,
        //   // 他に必要な情報があればここに追加
        // },
      }
    });

    if (updateError) {
      console.error('Error updating session metadata:', updateError);
      return NextResponse.json({ message: 'セッション更新に失敗しました' }, { status: 500 });
    }

    console.log("セッション更新データ:");
    console.log(updateUser);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('セッションユーザー情報の取得に失敗しました:', userError);
      return NextResponse.json({ message: 'セッションユーザー情報の取得に失敗しました' }, { status: 500 });
    }

    console.log("セッション再取得データ:");
    console.log(user);
    console.log(user.user_metadata.user_id);
    console.log(user.user_metadata.user_name);

    return NextResponse.json(data);
    // return NextResponse.json(userResponse);

  } catch (error: any) {
    console.error('ログイン処理エラー:', error);
    return NextResponse.json({ message: 'ログイン処理中にエラーが発生しました' }, { status: 500 });
  }
}