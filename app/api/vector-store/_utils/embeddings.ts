import { OpenAI } from 'openai'; 

const openAIApiKey = process.env.OPENAI_API_KEY; 

// テキストをエンベディングに変換する関数 
export async function getEmbeddings(text: string): Promise<number[] | null> {
    if (!openAIApiKey) {
        console.error('OPENAI_API_KEY が設定されていません。');
        return null;
    }

    const openai = new OpenAI({ apiKey: openAIApiKey });

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small', // 使用する埋め込みモデルを指定
            dimensions: 512, // 次元数を指定
            input: text,
        });

        if (response.data.length > 0) {
            return response.data[0].embedding;
        } else {
            console.error('OpenAI API から埋め込みデータが返されませんでした。');
            return null;
        }
    } catch (error: any) {
        console.error('OpenAI API での埋め込み生成中にエラー:', error.message);
        return null;
    }
}