"use client";
import { useState, useEffect } from "react";

export default function UserRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // APIから組織一覧取得
    fetch("/api/organizations")
      .then(res => res.json())
      .then(data => setOrganizations(Array.isArray(data) ? data : []));
    // APIからロール一覧取得
    fetch("/api/roles")
      .then(res => res.json())
      .then(data => setRoles(Array.isArray(data) ? data : []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          department,
          organization_id: organizationId,
          role_id: roleId,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.message || "登録に失敗しました");
      } else {
        setMessage("登録が完了しました。メールを送信しました。");
        setName("");
        setEmail("");
        setDepartment("");
        setOrganizationId("");
        setRoleId("");
      }
    } catch (err) {
      setError("登録処理でエラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">ユーザー登録</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{message}</div>}
          <div>
            <label className="block mb-1 font-medium">氏名</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">メールアドレス</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">部署</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={department} onChange={e => setDepartment(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">所属組織</label>
            <select className="w-full border rounded px-3 py-2" value={organizationId} onChange={e => setOrganizationId(e.target.value)} required>
              <option value="">選択してください</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">ロール</label>
            <select className="w-full border rounded px-3 py-2" value={roleId} onChange={e => setRoleId(e.target.value)} required>
              <option value="">選択してください</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
            {loading ? '登録中...' : '登録'}
          </button>
        </form>
      </div>
    </div>
  );
} 