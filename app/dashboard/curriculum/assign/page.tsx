'use client';

import { useState, useEffect } from 'react';
import { User, Template } from '@/types';

export default function AssignCurriculum() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedLeader, setSelectedLeader] = useState<string>('');

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('テンプレート取得エラー:', error);
      setTemplates([]);
    }
  };

  const handleUserCheckbox = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = async () => {
    try {
      await Promise.all(selectedUsers.map(async (userId) => {
        await fetch('/api/training-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            training_template_id: selectedTemplate,
            leader_id: selectedLeader,
          }),
        });
      }));

      alert('割り当てが完了しました');
      // 必要に応じてリダイレクトなど
    } catch (error) {
      console.error('割り当てエラー:', error);
    }
  };

  const leaders = users.filter(user => user.role_id === 2);
  const employees = users.filter(user => user.role_id === 3);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カリキュラム割り当て</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">割り当て対象社員（複数選択可）</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">選択</th>
              <th className="border p-2">名前</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(user => (
              <tr key={user.id}>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserCheckbox(user.id)}
                  />
                </td>
                <td className="border p-2">{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">担当リーダー</h2>
        <select
          className="border p-2 w-full"
          value={selectedLeader}
          onChange={e => setSelectedLeader(e.target.value)}
        >
          <option value="">選択してください</option>
          {leaders.map(leader => (
            <option key={leader.id} value={leader.id}>
              {leader.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">カリキュラムテンプレート</h2>
        <select
          className="border p-2 w-full"
          value={selectedTemplate}
          onChange={e => setSelectedTemplate(e.target.value)}
        >
          <option value="">選択してください</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        disabled={selectedUsers.length === 0 || !selectedTemplate || !selectedLeader}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        割り当て
      </button>
    </div>
  );
} 