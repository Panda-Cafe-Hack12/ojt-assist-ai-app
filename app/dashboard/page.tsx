import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { createServerClient } from '@supabase/ssr';
import { createClient } from '@/utils/supabase/server'
// import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GoogleFirstAuth  from '@/components/GoogleFirstAuth';
// import SignOutButton from "@/components/SignOutButton";
import { User } from '../types/user';

type TrainingData = {
  end_date: string;
  period: number;
}

type ViewedData = {
  file_name: string;
  level: number;
  viewed_count: number;
  viewed_page: number;
  total_page: number;
}

type SearchData = {
  category: string;
  search_count: number;
}

type DataSet = {
  end_date: string;
  remain_day: number;
  viewed_data: ViewedData[];
  search_data: SearchData[];
}

async function getUserInfo(supabasePromise: ReturnType<typeof createClient>, email: string): Promise<User | null> {
  const supabase = await supabasePromise;

  const { data, error } = await supabase
    .rpc('get_user_login', { user_email: email })
    .single(); 

  if (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return null;
  }
  
  return data as User;
}

function calculateRemainingDays(endDateString: string): number {
  // 1. 今日の日付（時刻を 00:00:00 に設定）を取得
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. end_date を Date オブジェクトに変換
  const endDate = new Date(endDateString);

  // 3. 日付の差をミリ秒単位で計算
  const differenceInMilliseconds = endDate.getTime() - today.getTime();

  // 4. ミリ秒を日数に変換
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const remainingDays = Math.ceil(differenceInMilliseconds / millisecondsInDay);

  return remainingDays;
}

async function getChartData(supabasePromise: ReturnType<typeof createClient>, userId: string): Promise<DataSet | null> {
  const supabase = await supabasePromise;

  // const { data: training, error: trainingError } = await supabase
  // .rpc('get_training_data', { user_id: userId })
  // .single(); 

  // if (trainingError) {
  //   console.error('トレーニングデータの取得に失敗しました:', trainingError);
  //   return null;
  // }
  // if (!training) {
  //   console.error('トレーニングデータが見つかりません');
  //   return null;
  // }

  // const { end_date, period } = training as TrainingData;
  // const { data: viewed, error: viewedError } = await supabase
  //   .rpc('get_viewed_data', { user_id: userId })
  //   .single(); 

  // if (viewedError) {
  //   console.error('閲覧履歴の取得に失敗しました:', viewedError);
  //   return null;
  // }

  // const { data: search, error: searchError } = await supabase
  //   .rpc('get_search_data', { user_id: userId })
  //   .single(); 

  // if (searchError) {
  //   console.error('検索履歴の取得に失敗しました:', searchError);
  //   return null;
  // }

  // const dataset: DataSet = {
  //   end_date: end_date,
  //   period: period,
  //   viewed_data: viewed as ViewedData[],
  //   search_data: search as SearchData[],
  // }

  // 残り日数を計算
  const endDate = "2025-06-30T10:00:00+00:00";
  const remaining = calculateRemainingDays(endDate);
  console.log(`end_date までの残り日数: ${remaining} 日`);

  const dummyViewedData: ViewedData[] = [
    { file_name: 'ファイル1', level: 1, viewed_count: 5, viewed_page: 10, total_page: 20 },
    { file_name: 'ファイル2', level: 2, viewed_count: 3, viewed_page: 8, total_page: 15 },
    { file_name: 'ファイル3', level: 3, viewed_count: 7, viewed_page: 12, total_page: 25 },
    { file_name: 'ファイル4', level: 4, viewed_count: 7, viewed_page: 24, total_page: 36 },
    { file_name: 'ファイル5', level: 5, viewed_count: 12, viewed_page: 34, total_page: 48 },
  ];

  const dummySearchData: SearchData[] = [
    { category: 'AWS', search_count: 5 }, 
    { category: 'CI/CD', search_count: 3 },
    { category: 'コンテナ', search_count: 7 },
    { category: 'Bash', search_count: 2 },
    { category: 'ネットワーク基礎', search_count: 8 },  
  ];

  const dataset: DataSet = {
    end_date: endDate,
    remain_day: remaining,
    viewed_data: dummyViewedData,
    search_data: dummySearchData,
  }
  
  return dataset;
}

export default async function DashboardPage() {

  const supabasePromise = createClient()
  const supabase = await supabasePromise;
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }
  
  // ログイン時、クライアントは一度取得してcontextに保存済みだけど、
  // サーバーサイドは毎回DBから取得する
  const userEmail = user.email ?? ''; 
  const { data: { session } } = await supabase.auth.getSession();

  if (user?.user_metadata) {
    console.log('ユーザー名:', user.user_metadata.user_name);
    console.log('組織名:', user.user_metadata.organization_name);
  } else {
    console.log('セッションにメタデータがありません');
  }

  const userData = await getUserInfo(supabasePromise, userEmail);
  if (!userData) {
    redirect('/')
  }

  const dataSet = await getChartData(supabasePromise, userData.id);
  console.log("データセット:");
  console.log(dataSet);

  return (
    <div className="flex flex-col items-center h-screen gap-8">
      <h2 className="text-xl font-bold mb-4">ダッシュボード</h2>
      {/* <h1>Welcome to the Dashboard</h1> */}
      {/* <SignOutButton /> */}
      <div className="mt-4 flex justify-center gap-4">
        {/* <GoogleFirstAuth/> */}
        <Link href="/api/auth/gdrive">
          <Button>Google Drive 初回認証</Button>
        </Link>
        <Link href="/dummy_gdrive">
          <Button>Google Drive 接続テスト</Button>
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Link href="/dummy_rag_chat?mode=manual">
          <Button>社内マニュアルQ&A</Button>
        </Link>
        <Link href="/dummy_rag_chat?mode=skill">
          <Button>スキルナレッジ検索</Button>
        </Link>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Link href="/dummy_product/register">
          <Button>商品登録テスト</Button>
        </Link>
        <Link href="/dummy_product/list">
          <Button>商品一覧テスト</Button>
        </Link>
        <Link href="/edge_test">
          <Button>エッジ関数テスト</Button>
        </Link>
        <Link href="/mock_test">
          <Button>モックテスト</Button>
        </Link>
        { userData.role_id === 1 && (
          <Link href="/dashboard/organizations">
            <Button>組織登録ページへ</Button>
          </Link>
        )}
        
      </div>
    </div>
  );
}