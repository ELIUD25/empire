import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api.ts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActivated: boolean;
  balance: number;
  referralCode: string;
  referrals: number;
  totalEarnings: number;
  referredBy?: string;
  referralLink: string;
  activatedAt?: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkReferralCode: (code: string) => Promise<boolean>;
  activateAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('empire_mine_token');
      
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch {
          console.error('Failed to get current user');
          localStorage.removeItem('empire_mine_token');
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string, referralCode?: string) => {
    const response = await apiService.register({ name, email, password, referralCode });
    setUser(response.user);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const checkReferralCode = async (code: string): Promise<boolean> => {
    const response = await apiService.checkReferralCode(code);
    return response.valid;
  };

  const activateAccount = async () => {
    const response = await apiService.activateAccount();
    setUser(response.user);
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch {
      console.error('Failed to refresh user');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkReferralCode,
    activateAccount,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};