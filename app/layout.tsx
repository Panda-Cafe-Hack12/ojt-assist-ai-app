import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import HeaderTest from "@/components/HeaderTest";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";
import { HamburgerMenu } from "@/components/hamburger-menu";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-8 items-center">
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-pink-500/20 backdrop-blur-sm">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold whitespace-nowrap">
                      <Link
                        href={"/"}
                        className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent hover:from-indigo-600 hover:to-pink-600 transition-all duration-300"
                      >
                        OJT Assist AI
                      </Link>
                    </div>
                    <HeaderAuth />
                    <div className="flex items-center gap-4">
                      <HamburgerMenu
                        items={[
                          {
                            href: "/api/auth/gdrive",
                            label: "Google Drive 初回認証",
                          },
                          {
                            href: "/dummy_gdrive",
                            label: "Google Drive 接続テスト",
                          },
                          {
                            href: "/dummy_rag_chat?mode=manual",
                            label: "社内マニュアルQ&A",
                          },
                          {
                            href: "/dummy_rag_chat?mode=skill",
                            label: "スキルナレッジ検索",
                          },
                          {
                            href: "/dummy_product/register",
                            label: "商品登録テスト",
                          },
                          {
                            href: "/dummy_product/list",
                            label: "商品一覧テスト",
                          },
                          { href: "/edge_test", label: "エッジ関数テスト" },
                          { href: "/mock_test", label: "モックテスト" },
                          {
                            href: "/dashboard/demo",
                            label: "ダッシュボード",
                            variant: "success",
                          },
                        ]}
                        isAdmin={false}
                      />
                    </div>
                  </div>
                </nav>
                <div className="flex flex-col gap-8 max-w-5xl p-5 w-full">
                  {children}
                </div>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <ThemeSwitcher />
                </footer>
              </div>
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
