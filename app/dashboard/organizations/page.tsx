"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function OrganizationRegisterPage() {
  const [name, setName] = useState('');
  const [knowledgeRepo, setKnowledgeRepo] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, knowledge_repo: knowledgeRepo, is_delete: isDelete }),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage('登録に失敗しました: ' + (result.message || '')); 
      } else {
        setMessage('登録が完了しました');
        setName('');
        setKnowledgeRepo('');
        setIsDelete(false);
      }
    } catch (err) {
      setMessage('登録処理でエラーが発生しました');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">組織設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label className="block mb-1 font-medium">組織名</label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">ナレッジ格納先URL</label>
          <Input value={knowledgeRepo} onChange={e => setKnowledgeRepo(e.target.value)} required />
        </div>
        <div className="flex justify-center mb-2">
          <Button type="button" variant="secondary">ナレッジ同期</Button>
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={loading}>{loading ? '登録中...' : '登録'}</Button>
        </div>
        {message && <div className="mt-2 text-center text-sm">{message}</div>}
      </form>
    </div>
  );
} 