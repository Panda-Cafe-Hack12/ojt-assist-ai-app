"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SuccessButton } from "./button-components";
import { Separator } from "./ui/separator";

interface MenuItem {
  href: string;
  label: string;
  variant?: "default" | "success";
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface HamburgerMenuProps {
  items: MenuItem[];
  isAdmin?: boolean;
}

export function HamburgerMenu({ items, isAdmin = false }: HamburgerMenuProps) {
  // メニュー項目を機能ごとにグループ化
  const menuGroups: MenuGroup[] = [
    {
      title: "Google Drive",
      items: [
        { href: "/api/auth/gdrive", label: "Google Drive 初回認証" },
        { href: "/dummy_gdrive", label: "Google Drive 接続テスト" },
      ],
    },
    {
      title: "ナレッジ検索",
      items: [
        { href: "/dummy_rag_chat?mode=manual", label: "社内マニュアルQ&A" },
        { href: "/dummy_rag_chat?mode=skill", label: "スキルナレッジ検索" },
      ],
    },
    {
      title: "テスト機能",
      items: [
        { href: "/dummy_product/register", label: "商品登録テスト" },
        { href: "/dummy_product/list", label: "商品一覧テスト" },
        { href: "/edge_test", label: "エッジ関数テスト" },
        { href: "/mock_test", label: "モックテスト" },
      ],
    },
    {
      title: "ダッシュボード",
      items: [{ href: "/dashboard/demo", label: "ダッシュボード" }],
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
          <Menu className="h-5 w-5" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">メニュー</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">
                    {group.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {group.items.map((item, index) => {
                      const ButtonComponent =
                        item.variant === "success" ? SuccessButton : Button;
                      return (
                        <SheetClose key={index} asChild>
                          <ButtonComponent
                            asChild
                            variant="ghost"
                            className="w-full justify-start px-2 hover:bg-muted/50 bg-muted/20"
                          >
                            <Link href={item.href}>{item.label}</Link>
                          </ButtonComponent>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
              ))}
              {isAdmin && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">
                      管理者メニュー
                    </h3>
                    <div className="flex flex-col gap-1">
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start px-2 hover:bg-muted/50 bg-muted/20"
                        >
                          <Link href="/dashboard/organizations">組織設定</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start px-2 hover:bg-muted/50 bg-muted/20"
                        >
                          <Link href="/users/register">社員登録</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start px-2 hover:bg-muted/50 bg-muted/20"
                        >
                          <Link href="/dashboard/curriculum">
                            カリキュラムテンプレート作成
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start px-2 hover:bg-muted/50 bg-muted/20"
                        >
                          <Link href="/dashboard/curriculum/assign">
                            カリキュラム割り当て
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
