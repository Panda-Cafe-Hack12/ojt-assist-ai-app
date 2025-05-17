'use client';

import React, { useState, useEffect } from 'react';
import ChatScreen from '@/components/DummyChatScreen';
import { useRouter, useSearchParams } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { fileName: string; content: string }[];
}

type ChatProps = {
  mode: string; 
}

const DummyRagChatPage = (props: ChatProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Array<{ fileName: string | null | undefined; content: string }>>([]);
  const [sessionId, setSessionId] = useState(crypto.randomUUID()); // 新しいセッションIDを生成
  const userId = 'YOUR_USER_ID'; // 実際のユーザーIDに置き換えてください
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const knowledge = mode ?? 'manual'; // 知識ベースのモードかどうか

  useEffect(() => {
    console.log("mode: ", knowledge);
    // コンポーネントがマウントされたときに最初のメッセージを追加
    setChatMessages([{ role: 'assistant', content: '何かお困りですか？なんでもご質問ください' }]);
  }, []);

  const handleSendMessage = async (newMessage: string) => {
    
    console.log("メッセージ送信開始");
    console.log(newMessage);

    setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: newMessage }]);
        
    if (!newMessage.trim()) {
        return;
    }

    try {
      if(knowledge === 'manual') {
        const response = await fetch('/api/dummy-rag-chat/manual-knowledge', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: newMessage, userId, sessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          // setAnswer(data.answer);
          // setSources(data.sources || []);
          // setQuestion('');
          setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.answer, sources: data.sources }]);
        } else {
          console.error('チャット送信に失敗しました。');
          setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "エラーが発生しました。" }]);
          // setAnswer('エラーが発生しました。');
        }
      } else {

      }

    } catch (error) {
      console.error('チャット送信中にエラー:', error);
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "エラーが発生しました。" }]);
      // setAnswer('エラーが発生しました。');
    }  
  };

  return (
    <div className="container mx-auto h-screen">
      <ChatScreen messages={chatMessages} onSendMessage={handleSendMessage}     mode={knowledge} />
    </div>
  );
};

export default DummyRagChatPage;