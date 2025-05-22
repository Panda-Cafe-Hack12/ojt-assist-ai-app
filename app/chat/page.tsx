"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; content: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleSend = () => {
    const text = inputRef.current?.value ?? "";
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    inputRef.current!.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 w-full">
      {messages.length === 0 && (
        <h1 className="text-2xl font-bold mb-4">
          わからないことを質問してみましょう。
        </h1>
      )}

      {/* メッセージ表示エリア */}
      <div className="flex flex-col gap-2 overflow-y-auto w-full p-4 rounded-lg bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[70%] px-4 py-2 rounded-xl ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="メッセージを入力"
            className="flex-1 border px-3 py-2 rounded"
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isComposing) {
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend}>送信</Button>
        </div>
      </div>
    </div>
  );
}
