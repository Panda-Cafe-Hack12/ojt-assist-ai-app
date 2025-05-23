'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    sources?: { fileName: string; content: string }[];
}

interface ChatProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    mode: string; // 知識ベースのモードかどうか
}

const ChatScreen: React.FC<ChatProps> = ({ messages, onSendMessage, mode }) => {
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const knowledge = mode ?? "manual"; // 知識ベースのモードかどうか

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 p-4">
            <div className="flex-grow overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-md" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
        {msg.role === 'assistant' && (
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-gray-700">AIアシスタント</h2>
          </div>
        )}
                    <div key={index} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg p-3 max-w-2xl break-words ${
                            msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                        }`}>
                            
                            <p className="text-sm">{msg.content}</p>
                            {msg.role === 'assistant' &&
                             !msg.content.toLowerCase().includes('すみません。そのスキルについて回答できる社内資料は見つかりませんでした。') && !msg.content.toLowerCase().includes('すみません。その質問について回答できるマニュアルは見つかりませんでした。') && 
                             msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 text-sm text-gray-500">
                                    参照元: {msg.sources.map(source => source.fileName).join(', ')}
                                </div>
                            )}
                        </div>
                    </div>
                    </React.Fragment>
                ))}
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex">
                <input
                    type="text"
                    className="flex-grow border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="メッセージを入力..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    className="ml-2 bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    onClick={handleSendMessage}
                >
                    送信
                </button>
            </div>
        </div>
    );
};

export default ChatScreen;