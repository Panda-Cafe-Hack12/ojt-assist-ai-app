import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GoogleFirstAuth  from '@/components/GoogleFirstAuth';
// import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
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
        <Link href="/dummy_rag_chat">
          <Button>社内マニュアルQ&A</Button>
        </Link>
        <Link href="/dummy_rag_chat">
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
        <Link href="/dashboard/organizations">
          <Button>組織登録ページへ</Button>
        </Link>
      </div>
    </div>
  );
}