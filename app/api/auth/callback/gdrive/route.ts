import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const absoluteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // const codeVerifierCookie = (await cookies()).get('google_code_verifier');
  // const codeVerifier = codeVerifierCookie?.value;
  // if (codeVerifierCookie) {
  //   console.log('取得した codeVerifier:', codeVerifier);
  //   // ... codeVerifier を使用する処理
  // } else {
  //   console.error('Cookie に google_code_verifier が見つかりません');
  //   // Cookie が存在しない場合の処理
  // }

  console.log("recieve callback request URL: " + request.url);
  console.log("code: " + code);
  if (!code) {
    return NextResponse.json({ error: '認証コードがありません' }, { status: 400 });
  }

  try {
    // const { data: authSessionData, error: authSessionError } = await supabase.auth.exchangeCodeForSession(code);

    // if (authSessionError) {
    //   console.log('Supabaseでのセッション交換に失敗しました', authSessionError);
    //   return NextResponse.redirect(`/gdrive?authError=supabase_session`);
    // } else {
    //   console.log('Supabaseでのセッション交換に成功しました', authSessionData);
    // }

    // console.log("Auth Token 取り出し ");
    // const authToken = (await cookies()).get('sb-auth-token');
    // console.log(authToken);

    console.log("user ID 取り出し ");
    const { data: { user } } = await supabase.auth.getUser();
    // const authUserId = authSessionData?.user?.id;
    console.log(user);
    const authUserId = user?.id;

    console.log("トークンを取得します");
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log("set Credentials tokesns:");
    console.log(tokens);
    oauth2Client.setCredentials(tokens);
 
    const expiryDate = tokens.expiry_date; 

    if (authUserId) {
      console.log("before token store ")

      // public.users テーブルから auth_id が一致するユーザーの id を取得
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUserId)
        .single();

      if (userError || !userData?.id) {
        console.error('public.users テーブルからユーザーIDの取得に失敗しました', userError);
        return NextResponse.redirect(absoluteUrl);
      }
      console.log("userData取得: " + userData);
      const publicUserId = userData.id;

      const { error: dbError } = await supabase.rpc('encrypt_and_store_tokens', {
        user_id: publicUserId, // public.users の id を使用
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry: expiryDate ? new Date(expiryDate).toISOString() : null, // expiry_date を Date オブジェクトに変換
      });

      console.log("after token store ")

      if (dbError) {
        console.error('トークンの保存に失敗しました', dbError);
        return NextResponse.redirect(absoluteUrl);
      }

      // CookieにSupabaseのセッション情報を設定
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionData?.session?.access_token) {
        (await cookies()).set('sb-access-token', sessionData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: sessionData.session.expires_in,
        });
        (await cookies()).set('sb-refresh-token', sessionData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 31536000, // 1 year
        });
      } else if (sessionError) {
        console.error('セッションCookieの設定に失敗しました', sessionError);
        return NextResponse.redirect(absoluteUrl);
      }

      console.log("Google Drive 認証が成功しました");

      return NextResponse.redirect(absoluteUrl);
    } else {
      console.error('ユーザーIDが取得できませんでした');
      return NextResponse.redirect(absoluteUrl);
    }
  } catch (error) {
    console.error('Google認証またはトークン処理でエラーが発生しました', error);
    return NextResponse.redirect(absoluteUrl);
  }
}