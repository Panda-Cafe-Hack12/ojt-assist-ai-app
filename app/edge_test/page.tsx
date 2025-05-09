"use client";

import { useState } from "react";
// import { SubmitButton } from "@/components/submit-button";


export default function EdgeTestPage() {
  // const [message, setMessage] = useState("");
  const [edgeResponse, setEdgeResponse] = useState(null);
  const [edgeName, setEdgeName] = useState<string>('');
  // const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEdgeSubmit = async (e: React.FormEvent) => {
    console.log("handleEdgeSubmit called!! 呼ばれたよ！");
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEdgeResponse(null);

    try {
      const res = await fetch('/api/proxy-to-edge/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: edgeName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(`Failed to send data: ${res.statusText} - ${errorData?.error || ''}`);
        console.log("エッジ関数アクセス失敗！");
      } else {
        const result = await res.json();
        setEdgeResponse(result.message);
        console.log("エッジ関数アクセス成功！");
      }
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);
      console.log("エッジ関数アクセス失敗！");
    } finally {
      setLoading(false);
    }

  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">エッジ関数テストページ</h1>      
    <div>

      <form className="space-y-4" onSubmit={handleEdgeSubmit}>
        <div>
          <label className="block text-sm font-medium" htmlFor="edgeName">Name:</label>
          <input
            className="border p-2 w-full mt-2"
            type="text"
            id="edgeName"
            value={edgeName}
            onChange={(e) => setEdgeName(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'エッジ関数に送信'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {edgeResponse && (
        <div style={{ marginTop: '20px' }}>
          <h2>Response from Edge Function:</h2>
          <p className="mt-4 text-green-500">{edgeResponse}</p>
        </div>
      )}
    </div>
    
      
    </div>
  );
}