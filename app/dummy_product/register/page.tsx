"use client";

import { useState } from "react";

export default function DummyProductRegisterPage() {
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState(0);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/dummy-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, size, stock }),
    });

    if (response.ok) {
      setMessage("商品が登録されました！");
      setName("");
      setSize("");
      setStock(0);
    } else {
      setMessage("商品登録に失敗しました。");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">商品登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">サイズ</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">在庫数</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          登録
        </button>
      </form>
      <div>      

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response && (
        <div>
          <h2>Response from Edge Function:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}