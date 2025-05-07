'use client';

import SignUpForm from '../login/components/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          新規登録
        </h2>
        <SignUpForm onSignUpSuccess={() => {
          // サインアップ成功後の処理 (例: ログインページへリダイレクト)
          window.location.href = '/login';
        }} />
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}