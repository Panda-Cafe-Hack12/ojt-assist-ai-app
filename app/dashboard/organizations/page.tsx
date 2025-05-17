"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Organization {
  id: string;
  name: string;
  manual_knowledge_repo: string;
  skill_knowledge_repo: string;
  is_delete: boolean;
}

type Department = {
  id: number;
  name: string;
  folder_id: string;
  folder_name: string;
};

export default function OrganizationRegisterPage() {
  const [name, setName] = useState('');
  const [manualKnowledgeRepo, setManualKnowledgeRepo] = useState('');
  const [skillKnowledgeRepo, setSkillKnowledgeRepo] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [currentDepartments, setCurrentDepartments] = useState<Department[] | null>(null);

  useEffect(() => {
    async function fetchOrganization() {
      try {
        const orgRes = await fetch('/api/organizations');
        if (!orgRes.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const orgData: Organization = await orgRes.json();
        console.log('Fetched organization:', orgData);
        setCurrentOrganization(orgData);

        const departRes = await fetch('/api/departments');
        if (!departRes.ok) {
          throw new Error('Failed to fetch departments');
        }
        const departData: Department[] = await departRes.json();
        console.log('Fetched departments:', departData);
        setCurrentDepartments(departData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }

    fetchOrganization();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, knowledge_repo: manualKnowledgeRepo, is_delete: isDelete }),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage('更新に失敗しました: ' + (result.message || '')); 
      } else {
        setMessage('更新が完了しました');
        // setName('');
        // setManualKnowledgeRepo('');
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
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mb-4">
        <div>
          <label className="block mb-1 font-medium">組織名: {currentOrganization?.name}</label>
          <Input value={name} onChange={e => setName(e.target.value)} defaultValue={currentOrganization?.name} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">社内マニュアルフォルダID:<br/>{currentOrganization?.manual_knowledge_repo}</label>
          <Input value={manualKnowledgeRepo} onChange={e => setManualKnowledgeRepo(e.target.value)} required />
        </div>
        {/* <div>
          <label className="block mb-1 font-medium">スキルナレッジフォルダ: {currentOrganization?.skill_knowledge_repo}</label>
          <Input value={skillKnowledgeRepo} onChange={e => setSkillKnowledgeRepo(e.target.value)} required />
        </div> */}
        
        <div className="flex justify-center">
          <Button type="submit" disabled={loading}>{loading ? '更新中...' : '更新'}</Button>
        </div>
        {message && <div className="mt-2 text-center text-sm">{message}</div>}
        
      </form>
      <div className="flex justify-center mb-8 ">
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" variant="secondary">マニュアルフォルダ同期</Button>
      </div>

      {currentDepartments && currentDepartments.length > 0 && 
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  部署名
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  フォルダID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  フォルダ名
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.map((department) => (
                <tr key={department.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{department.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{department.folder_id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{department.folder_name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      同期
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
} 