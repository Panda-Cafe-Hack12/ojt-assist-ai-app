"use client";
import { useState, useEffect } from "react";
import { User } from "../../types/user";
import { Employee } from "../../types/employee";
import { Organization } from "../../types/organizations";

// 社員データの型定義
// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   organization_id: string;
//   organization_name: string;
//   department_id: number;
//   department_name: string;
//   role_id: number;
//   role_name: string;
//   training_data_id: number;
// }

export default function UserRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [departmentsForOrganization, setDepartmentsForOrganization] = useState<{ id: number; name: string }[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    organization_id: '',
    department_id: 0, 
    role_id: 0,
    training_data_id: 0,
    organization_name: '',
    department_name: '',
    role_name: '',

    // その他の新規登録フォームの初期値
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // 実際のAPIエンドポイントに置き換えてください
        const response = await fetch('/api/users/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Employee[] = await response.json();
        
        setEmployees(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    try {
      // APIから組織一覧取得
      fetch("/api/organizations/all")
        .then(res => res.json())
        .then(data => setOrganizations(Array.isArray(data) ? data : []));
      // APIからロール一覧取得
      fetch("/api/roles")
        .then(res => res.json())
        .then(data => setRoles(Array.isArray(data) ? data : []));

      // 社員一覧を取得
      if(employees.length === 0) {
        fetchEmployees();
      }
        
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
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
          department_id: departmentId,
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
        setDepartmentId(undefined);
        setOrganizationId("");
        setRoleId("");
      }
    } catch (err) {
      setError("登録処理でエラーが発生しました");
    }
    setLoading(false);
  };

  const handleOrgChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrganizationId = e.target.value;
    setOrganizationId(selectedOrganizationId);
    setDepartmentId(undefined);

    if (selectedOrganizationId) {
      try {
        const response = await fetch(`/api/departments/specify-org/${selectedOrganizationId}`); // 所属部署一覧を取得するAPIエンドポイント (仮)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartmentsForOrganization(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError(`所属部署の取得に失敗しました: ${error}`);
        setDepartmentsForOrganization([]);
      }
    } else {
      setDepartmentsForOrganization([]); // 未選択時は所属部署リストを空にする
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">社員管理</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左側の社員一覧表示 */}
        <div className="bg-white shadow-md rounded-md p-4 overflow-auto md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">社員一覧</h2>
          {employees.length > 0 ? (
            
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    名前
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    所属部署
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ロール
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.department_name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{employee.role_name}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              
          ) : (
            <p>社員はいません。</p>
          )}
        </div>

        {/* 右側の社員新規登録画面 */}
        <div className="bg-white shadow-md rounded-md p-4 md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">社員新規登録</h2>
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
              <label className="block mb-1 font-medium">所属組織</label>
              <select className="w-full border rounded px-3 py-2" value={organizationId} onChange={handleOrgChange} required>
                <option value="">選択してください</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
                        <div>
              <label className="block mb-1 font-medium">部署</label>
              <select
                id="department"
                name="department"
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value === "" ? undefined : Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!organizationId} // 所属組織が選択されていない場合は disabled
              >
                <option value="">選択してください</option>
                {departmentsForOrganization.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {/* <input type="text" className="w-full border rounded px-3 py-2" value={department} onChange={e => setDepartment(e.target.value)} /> */}
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
            {/* <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              登録
            </button> */}
          </form>
          
        </div>
      </div>
    </div>
  );
  // <form onSubmit={handleSubmit} className="space-y-4">
  //           <div>
  //             <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
  //               名前:
  //             </label>
  //             <input
  //               type="text"
  //               id="name"
  //               name="name"
  //               value={newEmployee.name}
  //               // onChange={handleInputChange}
  //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
  //               メールアドレス:
  //             </label>
  //             <input
  //               type="email"
  //               id="email"
  //               name="email"
  //               value={newEmployee.email}
  //               // onChange={handleInputChange}
  //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //               required
  //             />
  //           </div>
  //           {/* その他の新規登録フォームの入力フィールド */}
  //           <button
  //             type="submit"
  //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //           >
  //             登録
  //           </button>
  //         </form>

    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //   <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
    //     <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">ユーザー登録</h2>
        // <form onSubmit={handleSubmit} className="space-y-4">
        //   {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{error}</div>}
        //   {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{message}</div>}
        //   <div>
        //     <label className="block mb-1 font-medium">氏名</label>
        //     <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
        //   </div>
        //   <div>
        //     <label className="block mb-1 font-medium">メールアドレス</label>
        //     <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        //   </div>
        //   <div>
        //     <label className="block mb-1 font-medium">部署</label>
        //     <input type="text" className="w-full border rounded px-3 py-2" value={department} onChange={e => setDepartment(e.target.value)} />
        //   </div>
        //   <div>
        //     <label className="block mb-1 font-medium">所属組織</label>
        //     <select className="w-full border rounded px-3 py-2" value={organizationId} onChange={e => setOrganizationId(e.target.value)} required>
        //       <option value="">選択してください</option>
        //       {organizations.map(org => (
        //         <option key={org.id} value={org.id}>{org.name}</option>
        //       ))}
        //     </select>
        //   </div>
        //   <div>
        //     <label className="block mb-1 font-medium">ロール</label>
        //     <select className="w-full border rounded px-3 py-2" value={roleId} onChange={e => setRoleId(e.target.value)} required>
        //       <option value="">選択してください</option>
        //       {roles.map(role => (
        //         <option key={role.id} value={role.id}>{role.name}</option>
        //       ))}
        //     </select>
        //   </div>
        //   <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
        //     {loading ? '登録中...' : '登録'}
        //   </button>
        // </form>
    //   </div>
    // </div>
  // );
} 