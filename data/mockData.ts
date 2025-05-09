// data/mockData.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role_id: 1 | 2 | 3;
}

export let mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'john_doe',
    email: 'john.doe@example.com',
    role_id: 1,
  },
  {
    id: 'user-2',
    name: 'jane_admin',
    email: 'jane.admin@example.com',
    role_id: 2,
  },
  // ... more user data
];

const findUserById = (id: string): User | undefined => mockUsers.find((user) => user.id === id);

const updateUserById = (id: string, updatedUser: Omit<User, 'id'>): User | undefined => {
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index !== -1) {
    mockUsers[index] = { id, ...updatedUser };
    return mockUsers[index];
  }
  return undefined;
};

const deleteUserById = (id: string): boolean => {
  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter((user) => user.id !== id);
  return mockUsers.length < initialLength;
};

const addUser = (newUser: Omit<User, 'id'>): User => {
  const userToAdd: User = { id: `user-${Date.now()}`, ...newUser };
  mockUsers.push(userToAdd);
  return userToAdd;
};

const mockData = {
  users: mockUsers,
  findUserById,
  updateUserById,
  deleteUserById,
  addUser,
   // 他のダミーデータもここに追加
};

export default mockData;