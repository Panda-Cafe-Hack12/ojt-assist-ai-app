'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import { signOutAction } from '@/app/signout/action';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      logout();
      // await signOutAction();
      router.push('/login'); // ログアウト後にリダイレクト
    };

    handleLogout(); // コンポーネントがマウントされたらすぐにログアウト処理を実行
  }, [logout, router]);

  return (
    <div>
      <p>サインアウト処理中です...</p>
    </div>
  );
}