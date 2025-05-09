// app/mock_test/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/data/mockData';

const MockTestPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role_id: 3 });
  const [updateId, setUpdateId] = useState('');
  const [updateUser, setUpdateUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role_id: 2 });
  const [deleteId, setDeleteId] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mutationResult, setMutationResult] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/mock/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
      setFetchError(null);
    } catch (error: any) {
      setFetchError(error.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/mock/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data: User = await response.json();
      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, data]);
        setNewUser({ name: '', email: '', role_id: 3 });
        setMutationResult('User created successfully!');
        setTimeout(() => setMutationResult(null), 3000);
      } else {
        const errorData = await response.json();
        setMutationResult(`Failed to create user: ${errorData?.message || response.statusText}`);
      }
    } catch (error: any) {
      setMutationResult(`Failed to create user: ${error.message}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!updateId) {
      setMutationResult('Please enter an ID to update.');
      return;
    }
    try {
      const response = await fetch(`/api/mock/users?id=${updateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateUser),
      });
      if (response.ok) {
        const updatedData: User = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedData.id ? updatedData : user))
        );
        setUpdateId('');
        setUpdateUser({ name: '', email: '', role_id: 2});
        setMutationResult('User updated successfully!');
        setTimeout(() => setMutationResult(null), 3000);
      } else {
        const errorData = await response.json();
        setMutationResult(`Failed to update user: ${errorData?.message || response.statusText}`);
      }
    } catch (error: any) {
      setMutationResult(`Failed to update user: ${error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteId) {
      setMutationResult('Please enter an ID to delete.');
      return;
    }
    try {
      const response = await fetch(`/api/mock/users?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteId));
        setDeleteId('');
        setMutationResult('User deleted successfully!');
        setTimeout(() => setMutationResult(null), 3000);
      } else {
        const errorData = await response.json();
        setMutationResult(`Failed to delete user: ${errorData?.message || response.statusText}`);
      }
    } catch (error: any) {
      setMutationResult(`Failed to delete user: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Users API</h1>

      {fetchError && <div className="text-red-500 mb-2">Error fetching users: {fetchError}</div>}
      {mutationResult && <div className="text-green-500 mb-2">{mutationResult}</div>}

      <div className="mb-4 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Create New User</h2>
        <input
          type="text"
          placeholder="Username"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={newUser.role_id}
          onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value as unknown as 1 | 2 | 3 })}
        >
          <option value="2">担当者</option>
          <option value="3">新人</option>
        </select>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleCreateUser}>
          Create User
        </button>
      </div>

      <div className="mb-4 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Update User</h2>
        <input
          type="text"
          placeholder="User ID to Update"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={updateId}
          onChange={(e) => setUpdateId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Username"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={updateUser.name}
          onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="New Email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={updateUser.email}
          onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
        />
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={updateUser.role_id}
          onChange={(e) => setUpdateUser({ ...updateUser, role_id: e.target.value as unknown as 1 | 2 | 3 })}
        >
          <option value="2">担当者</option>
          <option value="3">新人</option>
        </select>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleUpdateUser}>
          Update User
        </button>
      </div>

      <div className="mb-4 border-b pb-4">
        <h2 className="text-xl font-semibold mb-2">Delete User</h2>
        <input
          type="text"
          placeholder="User ID to Delete"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleDeleteUser}>
          Delete User
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Current Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="py-2">
              {user.id}: {user.name} ({user.email}) - {user.role_id === 1 ? 'システム管理者' : user.role_id === 2 ? '担当者' : '新人'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MockTestPage;