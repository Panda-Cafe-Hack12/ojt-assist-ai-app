import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { OpenAI } from 'openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const openAIApiKey = process.env.OPENAI_API_KEY;

const prompt = ChatPromptTemplate.fromTemplate(`
以下のコンテキストを使用して、質問に答えてください。500文字以内にわかりやすくまとめてください。回答には適切に改行を入れてください。もしコンテキストに答えがない場合は、「わかりません」と答えてください。

コンテキスト:
{context}

質問: {question}
`);

export async function POST(request: Request) {
  console.log("チャット処理開始");

    const { question, userId, sessionId } = await request.json();

    if (!question || !userId || !sessionId) {
        return NextResponse.json({ error: '質問、ユーザーID、セッションID が必要です。' }, { status: 400 });
    }
    
    const supabase = await createClient();
    const openai = new OpenAI({ apiKey: openAIApiKey });
    const embeddings = new OpenAIEmbeddings({ openAIApiKey, modelName: 'text-embedding-3-small', dimensions: 512 });

    console.log("vectorStore作成");

    const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: 'skill_documents',
        queryName: 'match_skill_documents', // 作成した関数名
    });

    console.log("ChatOpenAI作成");

    const model = new ChatOpenAI({ openAIApiKey, modelName: 'gpt-4o-mini' });

    try {
      
      console.log("similaritySearch実行");

        // ベクトルストアから質問に関連するドキュメントを検索
        const relevantDocs = await vectorStore.similaritySearch(question, 1); // 上位5件を取得

        // 検索履歴を保存 (必要に応じて)

        // await supabase
        //     .from('search_history')
        //     .insert({
        //         user_id: userId,
        //         session_id: sessionId,
        //         query: question,
        //         results: relevantDocs.map(doc => ({
        //             pageContent: doc.pageContent,
        //             metadata: doc.metadata,
        //         })),
        //     });

        console.log("プロンプト作成");

        // プロンプトの作成
        const formattedDocs = relevantDocs.map(doc => doc.pageContent).join('\n\n');
        const promptValue = await prompt.format({
            context: formattedDocs,
            question: question,
        });

        console.log(promptValue);

        // LLM による回答の生成
        const llmResponse = await model.invoke([promptValue]);
        const answer = llmResponse.content || '参考となる資料が見つかりませんでした。';

        // 会話履歴を保存 (必要に応じて)
        // await supabase
        //     .from('chat_history')
        //     .insert([
        //         { user_id: userId, session_id: sessionId, role: 'user', content: question },
        //         { user_id: userId, session_id: sessionId, role: 'assistant', content: answer + '\n\n' + relevantDocs.map(doc => `出典: ${doc.metadata.file_name || doc.metadata.source}`).join('\n') },
        //     ]);

        return NextResponse.json({
            answer,
            sources: relevantDocs.map(doc => ({
                fileName: doc.metadata.file_name || doc.metadata.source,
                // content: doc.pageContent.substring(0, 200) + '...',
            })),
        });

    } catch (error) {
        console.error('チャット処理中にエラー:', error);
        return NextResponse.json({ error: 'チャット処理中にエラーが発生しました。' }, { status: 500 });
    }
}