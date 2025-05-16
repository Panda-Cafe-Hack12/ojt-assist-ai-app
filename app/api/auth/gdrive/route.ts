import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 環境変数から認証情報を取得（.env.localに設定）
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// function generateCodeVerifier() {
//   return crypto.randomBytes(32).toString('hex');
// }

// function generateCodeChallenge(codeVerifier: string) {
//   const hash = crypto.createHash('sha256').update(codeVerifier).digest();
//   const base64 = Buffer.from(hash).toString('base64');
//   return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// }

// スコープ（必要に応じて変更）
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];



export async function GET(req: NextRequest) {
  // const codeVerifier = generateCodeVerifier();
  // const codeChallenge = generateCodeChallenge(codeVerifier);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // リフレッシュトークンを取得するため
    scope: SCOPES,
    prompt: 'consent',
    // code_challenge: codeChallenge,
    // code_challenge_method: CodeChallengeMethod.S256,
  });
  return NextResponse.redirect(authUrl);
}

