// lib/auth.ts (または utils/googleAuth.ts)
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

async function getValidAccessToken(userId: string): Promise<string | null> {
  if (!supabaseUrl || !supabaseAnonKey || !googleClientId || !googleClientSecret) {
    console.error('環境変数が設定されていません。');
    return null;
  }

  const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

  let newValidAccessToken = "";
  console.log("アクセストークン処理開始: " + userId);
  // ユーザーの Google トークン情報を取得
  const { data: profile, error: profileError } = await supabaseAnon
    .from('users')
    .select('id, gdrive_access_token, gdrive_refresh_token, gdrive_token_expiry')
    .eq('auth_id', userId)
    .single();

  if (profileError || !profile) {
    console.error('ユーザープロフィールの取得に失敗しました:', profileError);
    return null;
  }

  const { gdrive_access_token, gdrive_refresh_token, gdrive_token_expiry } = profile;

  // アクセストークンを復号化
  const { data: decryptedAccessTokenData, error: decryptAccessTokenError } = await supabaseAnon.rpc('decrypt_token', { encrypted_token: gdrive_access_token });
  if (decryptAccessTokenError || !decryptedAccessTokenData) {
    console.error('アクセストークンの復号化に失敗しました:', decryptAccessTokenError);
    return null;
  }
 
   // リフレッシュトークンを復号化
  const { data: decryptedRefreshTokenData, error: decryptRefreshTokenError } = await supabaseAnon.rpc('decrypt_token', { encrypted_token: gdrive_refresh_token });
  if (decryptRefreshTokenError || !decryptedRefreshTokenData) {
    console.error('リフレッシュトークンの復号化に失敗しました:', decryptRefreshTokenError);
    return null;
  }

  console.log("decryptedAccessTokenData: " + decryptedAccessTokenData);
  console.log("decryptedRefreshTokenData: " + decryptedRefreshTokenData); 

  if (!gdrive_access_token || !gdrive_refresh_token || !gdrive_token_expiry) {
    console.error('アクセストークンまたはリフレッシュトークンが存在しません。');
    return null;
  }

  const expiryDate = new Date(gdrive_token_expiry );
  const now = new Date();

  // 有効期限が切れているか、まもなく切れる場合（念のため少し余裕を持たせる）
  if (expiryDate < now || (expiryDate.getTime() - now.getTime()) < (600000)) { // 1時間以内
    console.log('アクセストークンの有効期限切れ、またはまもなく期限切れ。リフレッシュします。');
    const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
    oauth2Client.setCredentials({
      refresh_token: decryptedRefreshTokenData,
    });

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      if (credentials && credentials.access_token && credentials.expiry_date) {
        const newExpiryDate = credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null;
        newValidAccessToken = credentials.access_token;

        // 新しいアクセストークンと有効期限をデータベースに保存
      // const { error: updateError } = await supabaseAnon.rpc('encrypt_and_store_tokens', {
      //   user_id: id, // public.users の id を使用
      //   access_token: newAccessToken,
      //   refresh_token: decryptedRefreshTokenData,
      //   expiry: newExpiryDate, // expiry_date を Date オブジェクトに変換
      // });

      // if (updateError) {
      //   console.error('アクセストークンの更新に失敗しました:', updateError);
      //   return null;
      // }

        const newAccessTokenEncrypted = await supabaseAnon.rpc('encrypt_token', { token: credentials.access_token });

        console.log("新しいアクセストークンを暗号化: ");
        console.log(newAccessTokenEncrypted);

        if (newAccessTokenEncrypted && newAccessTokenEncrypted.data) {
         
          // const newExpiryTime = Math.floor(credentials.expiry_date / 1000);
          // 新しいアクセストークンと有効期限を DB に保存
          const { error: updateError } = await supabaseAnon
            .from('users')
            .update({
              gdrive_access_token: newAccessTokenEncrypted.data,
              gdrive_token_expiry: newExpiryDate,
            })
            .eq('auth_id', userId);

          if (updateError) {
            console.error('新しいアクセストークンの保存に失敗しました:', updateError);
            return null;
          }
          console.log('アクセストークンをリフレッシュし、保存しました。');
          return credentials.access_token;
        } else {
          console.error('新しいアクセストークンの暗号化に失敗しました。');
          return null;
        }
      } else {
        console.error('アクセストークンのリフレッシュに失敗しました。');
        return null;
      }
    } catch (error: any) {
      console.error('アクセストークンのリフレッシュ中にエラーが発生しました:', error.message);
      return null;
    }
  } else {
    // 有効期限が切れていない場合は復号化したアクセストークンをそのまま返す
    newValidAccessToken = decryptedAccessTokenData;
  }

  return newValidAccessToken; // 有効な場合はそのまま返す
}

export { getValidAccessToken };