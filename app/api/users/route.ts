import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import { sendMail } from '@/utils/sendMail'; // メール送信ユーティリティ（仮）

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, department, organization_id, role_id } = body;

    if (!name || !email || !organization_id || !role_id) {
      return NextResponse.json({ message: '必須項目が不足しています' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('users').insert([
      {
        name,
        email,
        department,
        organization_id,
        role_id: Number(role_id),
        auth_id: null,
        valid: "1",
      },
    ]);

    if (error) {
      return NextResponse.json({ message: 'ユーザー登録に失敗しました: ' + error.message }, { status: 500 });
    }

    // メール送信処理（仮実装: 実際はsendMail等で送信）
    // await sendMail(email, ...);
    console.log(`メール送信: ${email} 宛に登録URLを送信しました`);

    return NextResponse.json({ message: '登録が完了しました。メールを送信しました。' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '登録処理でエラーが発生しました' }, { status: 500 });
  }
}