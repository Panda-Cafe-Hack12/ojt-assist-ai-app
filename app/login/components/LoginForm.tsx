'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
// import { createClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/user';

interface LoginFormProps {}

export default function LoginForm({}: LoginFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    const initializeSupabase = async () => {
      const client = createClient();
      setSupabase(client);
    };
    initializeSupabase();
  }, []);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase クライアントの初期化に失敗しました');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
     
        // 実際のAPIエンドポイントにリクエストを送信
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'ログインに失敗しました');
        }

        const userData: User = await response.json(); 

        login(userData); // グローバルな状態を更新
        router.push('/dashboard'); // ログイン成功後にダッシュボードへリダイレクト
      }       
    } catch (err: any) {
      setError('ログインに失敗しました');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
         <Alert variant="destructive" className="animate-in fade-in-50">
         <AlertCircle className="h-4 w-4" />
         <AlertDescription>{error}</AlertDescription>
       </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="pl-10"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">パスワード</Label>
          <a href="/forgot-password" className="text-sm text-primary hover:underline">
            パスワードをお忘れですか？
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            className="pl-10"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          disabled={loading || !supabase}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ログイン中...
            </>
          ) : (
            "ログイン"
          )}
        </Button>
      </div>
      <div className="text-sm text-center text-muted-foreground">デモ用: demo@example.com / password</div>
    </form>
  );
}