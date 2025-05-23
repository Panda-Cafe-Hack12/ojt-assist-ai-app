import { redirect } from 'next/navigation';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers';
import LoginForm from './components/LoginForm';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";
import LoginIllustration from "@/components/illustrations/login-illustration";

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 bg-indigo-900 p-6 flex-shrink-0">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-shadow">ようこそ</h1>
          </div>
          <LoginIllustration />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">ようこそ</h1>
            <p className="text-gray-500">アカウントにログインして続行してください</p>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
              <CardDescription className="text-center">認証情報を入力してログインしてください</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <LoginForm />
            </CardContent>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">または</span>
              </div>
            </div>

            <CardFooter className="flex flex-col gap-4 pt-0">
              <Link href="/signup" className="w-full">
                <Button variant="outline" className="w-full" size="lg">
                  <UserPlus className="mr-2 h-4 w-4" />
                  新規登録はこちら
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}