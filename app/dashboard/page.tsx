import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GoogleFirstAuth  from '@/components/GoogleFirstAuth';
// import SignOutButton from "@/components/SignOutButton";
import { User } from '../types/user';

async function getUserInfo(supabasePromise: ReturnType<typeof createClient>, email: string): Promise<User | null> {
  const supabase = await supabasePromise;

  const { data, error } = await supabase
    .rpc('get_user_login', { user_email: email })
    .single(); 

  if (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return null;
  }
  
  return data as User;
}

export default async function DashboardPage() {

  const supabasePromise = createClient()
  const supabase = await supabasePromise;
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }
  
  // ログイン時、クライアントは一度取得してcontextに保存済みだけど、
  // サーバーサイドは毎回DBから取得する
  const userEmail = user.email ?? ''; 
  const userData = await getUserInfo(supabasePromise, userEmail);
  if (!userData) {
    redirect('/')
  }

  return (
    <div className="flex flex-col items-center h-screen gap-8">
      <h2 className="text-xl font-bold mb-4">ダッシュボード</h2>
      {/* <h1>Welcome to the Dashboard</h1> */}
      {/* <SignOutButton /> */}
      <div className="mt-4 flex justify-center gap-4">
        {/* <GoogleFirstAuth/> */}
        <Link href="/api/auth/gdrive">
          <Button>Google Drive 初回認証</Button>
        </Link>
        <Link href="/dummy_gdrive">
          <Button>Google Drive 接続テスト</Button>
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Link href="/dummy_rag_chat?mode=manual">
          <Button>社内マニュアルQ&A</Button>
        </Link>
        <Link href="/dummy_rag_chat?mode=skill">
          <Button>スキルナレッジ検索</Button>
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Link href="/dummy_product/register">
          <Button>商品登録テスト</Button>
        </Link>
        <Link href="/dummy_product/list">
          <Button>商品一覧テスト</Button>
        </Link>
        <Link href="/edge_test">
          <Button>エッジ関数テスト</Button>
        </Link>
        <Link href="/mock_test">
          <Button>モックテスト</Button>
        </Link>
        { userData.role_id === 1 && (
          <Link href="/dashboard/organizations">
            <Button>組織登録ページへ</Button>
          </Link>
        )}
        
      </div>
    </div>
  );
}