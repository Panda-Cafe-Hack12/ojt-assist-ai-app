'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';


interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export type User = {
  id: string;
  name: string;
  email: string;
  organization_id: string;
  department_id: number;
  role_id: number; 
  training_template_id: number;
  organization_name: string;
  department_name: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    // アプリケーションの初期化時に保存されたユーザー情報を読み込む（例：localStorage）
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data for login:', error);
        // エラー処理：localStorageから削除するなど
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // ログイン時にユーザー情報を保存
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // ログアウト時にユーザー情報を削除
    // 必要に応じて他のログアウト処理（API呼び出しなど）を追加
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};