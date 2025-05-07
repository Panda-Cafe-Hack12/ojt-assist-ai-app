import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold mb-4">ダッシュボード</h2>
      {/* <h1>Welcome to the Dashboard</h1> */}
      {/* <SignOutButton /> */}
      <div className="space-y-2">
        <Link href="/product/register">
          <Button>商品登録ページへ</Button>
        </Link>
        <Link href="/product/list">
          <Button>商品一覧ページへ</Button>
        </Link>
      </div>
    </div>
  );
}