'use client';

import SignUpForm from '../login/components/SignUpForm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import SignupIllustration from "@/components/illustrations/signup-illustration";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
    {/* Left Column - Illustration */}
    <div className="hidden md:block md:w-1/2 bg-[#17304F] p-6 flex-shrink-0">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-shadow">アカウント作成</h1>
          <p className="text-white text-shadow">新しいアカウントを作成して始めましょう</p>
        </div>
        <SignupIllustration />
      </div>
    </div>

    {/* Right Column - Form */}
    <div className="w-full md:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 md:hidden">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">アカウント作成</h1>
          <p className="text-gray-500">新しいアカウントを作成して始めましょう</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">新規登録</CardTitle>
            <CardDescription className="text-center">
              メールアドレスとパスワードを入力して登録してください
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <SignUpForm
              onSignUpSuccess={() => {
                // サインアップ成功後の処理 (例: ログインページへリダイレクト)
                window.location.href = "/login";
              }}
            />
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
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                ログインはこちら
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
  );
}