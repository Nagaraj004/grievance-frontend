import { createContext, useContext, useState, ReactNode } from 'react';
import apiClient from '../services/apiClient';

export type UserRole = 'admin' | 'minister' | null;

interface AuthContextType {
  role: UserRole;
  username: string | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  username: null,
  login: async () => ({ ok: false }),
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(() => localStorage.getItem('tn_role') as UserRole || null);
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('tn_username'));

  const login = async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await apiClient.post('/auth/login', { username, password });
      const { access_token, role: userRole, username: uname } = res.data;
      localStorage.setItem('tn_access_token', access_token);
      localStorage.setItem('tn_role', userRole);
      localStorage.setItem('tn_username', uname);
      setRole(userRole as UserRole);
      setUsername(uname);
      return { ok: true };
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('tn_access_token');
    localStorage.removeItem('tn_role');
    localStorage.removeItem('tn_username');
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ role, username, login, logout, isAuthenticated: role !== null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
