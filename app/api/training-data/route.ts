import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { user_id, training_template_id, leader_id } = await request.json();

    const { data, error } = await supabase
      .from('training_data')
      .insert([
        {
          user_id,
          training_template_id: Number(training_template_id), // bigint型に合わせて数値化
          leader_id,
          status: 'pending', // 初期状態
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Training data creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create training data' },
      { status: 500 }
    );
  }
} 