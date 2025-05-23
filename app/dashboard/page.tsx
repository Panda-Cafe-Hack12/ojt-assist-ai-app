"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Calendar,
  CheckCircle2,
  BarChart2,
  Settings,
  X,
} from "lucide-react";
import { GoalProgressChart } from "@/components/goal-progress-chart";
import { SearchHistoryChart } from "@/components/search-history-chart";
import { FileViewTable } from "@/components/file-view-table";
import { CategorySearchTable } from "@/components/category-search-table";
import { SearchInput } from "@/components/SearchInput";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  // This would come from your API in a real implementation
  const ojtData = {
    ojtPeriod: "2025/5/1 - 2025/6/30",
    ojtEndDate: "2025/6/30",
    daysRemaining: 28,
    learnFiles: [
      {
        fileName: "ファイル1",
        goalLevel: 2,
        viewCount: 3,
        totalPages: 5,
        currentPage: 5,
      },
      {
        fileName: "ファイル2",
        goalLevel: 3,
        viewCount: 15,
        totalPages: 36,
        currentPage: 24,
      },
      {
        fileName: "ファイル3",
        goalLevel: 1,
        viewCount: 3,
        totalPages: 5,
        currentPage: 3,
      },
      {
        fileName: "ファイル4",
        goalLevel: 4,
        viewCount: 20,
        totalPages: 45,
        currentPage: 34,
      },
      {
        fileName: "ファイル5",
        goalLevel: 5,
        viewCount: 25,
        totalPages: 80,
        currentPage: 49,
      },
    ],
    totalReadPages: 95,
    totalPages: 125,
    completionRate: 75,
  };

  const searchData = [
    { categoryName: "AWS", searchCount: 3 },
    { categoryName: "コンテナ", searchCount: 5 },
    { categoryName: "Bash", searchCount: 7 },
    { categoryName: "ネットワーク基礎", searchCount: 10 },
    { categoryName: "CI/CD", searchCount: 24 },
  ];

  useEffect(() => {
    // 何らかの条件に基づいてリフレッシュを行う
    const shouldRefresh = true; // 例: ログイン直後など

    if (shouldRefresh) {
      router.refresh();
    }
  }, []); // 空の依存配列で初回レンダリング時のみ実行

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories based on search term
  const filteredCategories = searchData.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSearches = filteredCategories.reduce(
    (sum, item) => sum + item.searchCount,
    0
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSearch = () => {};

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-white p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">OJT完了日</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ojtData.ojtEndDate}</div>
              <p className="text-xs text-muted-foreground">
                残り {ojtData.daysRemaining} 日
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">達成率</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ojtData.completionRate}%
              </div>
              <Progress value={ojtData.completionRate} className="mt-2 h-2.5" />
              <p className="text-xs text-muted-foreground mt-2">
                {ojtData.totalReadPages}/{ojtData.totalPages} ページ完了
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                ファイル閲覧
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ojtData.learnFiles.reduce(
                  (sum, file) => sum + file.viewCount,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">合計閲覧回数</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">検索回数</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {searchData.reduce((sum, item) => sum + item.searchCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">合計検索回数</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle>スキル目標</CardTitle>
              <CardDescription>OJT期間: {ojtData.ojtPeriod}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FileViewTable files={ojtData.learnFiles} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle>達成率</CardTitle>
              <CardDescription>目標に対する現在の進捗状況</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-6">
              <GoalProgressChart
                completionRate={ojtData.completionRate}
                totalReadPages={ojtData.totalReadPages}
                totalPages={ojtData.totalPages}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">スキルサーチ履歴</TabsTrigger>
              <TabsTrigger value="views">ファイル閲覧履歴</TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle>カテゴリー別検索回数</CardTitle>
                  <CardDescription>各カテゴリーの検索頻度</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px]">
                    <SearchHistoryChart searchData={filteredCategories} />
                  </div>
                  <div className="mt-6 border-t pt-4">
                    <SearchInput
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                      onClearSearch={clearSearch}
                      onSearch={handleSearch}
                      placeholder="カテゴリーを検索..."
                    />
                    {filteredCategories.length === 0 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        検索結果がありません。別のキーワードをお試しください。
                      </div>
                    )}
                    {searchTerm && filteredCategories.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium">
                          {filteredCategories.length}
                        </span>{" "}
                        件の結果が見つかりました
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <CategorySearchTable categories={filteredCategories} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="views">
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle>ファイル閲覧状況</CardTitle>
                  <CardDescription>各ファイルの閲覧回数と進捗</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-[300px]">
                    <SearchHistoryChart
                      searchData={ojtData.learnFiles.map((file) => ({
                        categoryName: file.fileName,
                        searchCount: file.viewCount,
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
