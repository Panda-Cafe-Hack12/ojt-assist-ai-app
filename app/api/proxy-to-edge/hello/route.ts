// /app/api/proxy-to-edge/hello/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/hello-world`;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or Anon Key not found in environment variables.');
      return NextResponse.json({ error: 'Internal server error - Supabase config missing' }, { status: 500 });
    }

    const { name } = await request.json(); // リクエストボディから 'name' を取得

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        // 必要に応じて他のヘッダーを追加
      },
      body: JSON.stringify({ name }), // 'name' をJSON形式でエッジ関数に送信
    });

    if (!response.ok) {
      console.error('Error calling Supabase Edge Function:', response.status, response.statusText);
      const errorData = await response.json();
      return NextResponse.json({ error: `Failed to call edge function: ${response.statusText}`, details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in /app/api/proxy-to-edge/hello/route.ts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}