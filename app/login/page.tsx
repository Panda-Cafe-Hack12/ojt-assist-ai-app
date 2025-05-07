import { redirect } from 'next/navigation';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers';
import LoginForm from './components/LoginForm';
import Link from 'next/link';

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          ログイン
        </h2>
        <LoginForm />
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-blue-500 hover:underline">
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}