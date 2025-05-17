import { google } from 'googleapis';
import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
import { createClient } from "@/utils/supabase/server";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

async function getAccessToken(supabase: ReturnType<typeof createClient>): Promise<string | null> {  
  const resolvedSupabase = await supabase;
  const { data: { user }, error: userError } = await resolvedSupabase.auth.getUser();
  if (userError || !user) {
    console.error('ユーザー情報の取得に失敗しました:', userError);
    return null;
  }

  console.log("ユーザーIDを取得: ");
  console.log("user ID: " + user.id);

  const { data: profile, error: profileError } = await resolvedSupabase
    .from('users')
    .select('id, gdrive_access_token, gdrive_refresh_token, gdrive_token_expiry')
    .eq('auth_id', user.id)
    .single();
  
  console.log("ユーザープロフィールを取得: ");
  console.log(profile);

  if (profileError || !profile) {
    console.error('ユーザープロフィールの取得に失敗しました:', profileError);
    return null;
  }

  const { id, gdrive_access_token, gdrive_refresh_token, gdrive_token_expiry } = profile;

  if (!gdrive_access_token || !gdrive_refresh_token || !gdrive_token_expiry) {
    console.error('アクセストークンまたはリフレッシュトークンが存在しません。');
    return null;
  }

  console.log("トークンを復号化: ");

  // トークンを復号化
  const { data: decryptedAccessTokenData, error: decryptAccessTokenError } = await resolvedSupabase.rpc('decrypt_token', { encrypted_token: gdrive_access_token });
  if (decryptAccessTokenError || !decryptedAccessTokenData) {
    console.error('アクセストークンの復号化に失敗しました:', decryptAccessTokenError);
    return null;
  }

  console.log("decryptedAccessTokenData: " + decryptedAccessTokenData);

  const { data: decryptedRefreshTokenData, error: decryptRefreshTokenError } = await resolvedSupabase.rpc('decrypt_token', { encrypted_token: gdrive_refresh_token });
  if (decryptRefreshTokenError || !decryptedRefreshTokenData) {
    console.error('リフレッシュトークンの復号化に失敗しました:', decryptRefreshTokenError);
    return null;
  }

  console.log("decryptedRefreshTokenData: " + decryptedRefreshTokenData);

  const expiryDate = new Date(gdrive_token_expiry);
  const now = new Date();

  // トークンの有効期限が切れているか、残り時間が少ない場合にリフレッシュ
  if (expiryDate < now || (expiryDate.getTime() - now.getTime()) < 3600000) { // 残り1時間未満
    const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
    oauth2Client.setCredentials({ refresh_token: decryptedRefreshTokenData });

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      const newAccessToken = credentials.access_token ?? null;
      const newExpiryDate = credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null;

      // 新しいアクセストークンと有効期限をデータベースに保存
      const { error: updateError } = await resolvedSupabase.rpc('encrypt_and_store_tokens', {
        user_id: id, // public.users の id を使用
        access_token: newAccessToken,
        refresh_token: decryptedRefreshTokenData,
        expiry: newExpiryDate, // expiry_date を Date オブジェクトに変換
      });

      if (updateError) {
        console.error('アクセストークンの更新に失敗しました:', updateError);
        return null;
      }

      console.error('アクセストークンを更新しました:', newAccessToken);
      return newAccessToken;
    } catch (refreshError) {
      console.error('アクセストークンのリフレッシュに失敗しました:', refreshError);
      return null;
    }
  }

  return gdrive_access_token;
}

export async function GET() {
  console.log("Client作成");
  const supabase = createClient();

  console.log("アクセストークン取得");
  const accessToken = await getAccessToken(supabase);

  if (!accessToken) {
    return NextResponse.json({ error: '認証に失敗しました。再度Google連携を行ってください。' }, { status: 401 });
  }

  try {
    console.log("setCredentials : ");
    const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const { data } = await drive.files.list({
      fields: 'files(id, name, mimeType)',
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Google Drive API エラー:', error);
    return NextResponse.json({ error: 'Google Drive API からのファイル情報取得に失敗しました。' }, { status: 500 });
  }
}