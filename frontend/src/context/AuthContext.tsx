import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getMeApi, logoutApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('it_token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await getMeApi();
          if (res && res.success && res.data) {
            setUser(res.data);
          } else {
            // Token invalid or expired
            localStorage.removeItem('it_token');
            localStorage.removeItem('it_user');
            setToken(null);
            setUser(null);
          }
        } catch (error: any) {
          // If server responded with 401/403 unauthorized, session is expired
          if (error?.response?.status === 401 || error?.response?.status === 403) {
            localStorage.removeItem('it_token');
            localStorage.removeItem('it_user');
            setToken(null);
            setUser(null);
          } else {
            // Offline fallback for demo tokens or transient network disconnection
            const savedUser = localStorage.getItem('it_user');
            if (savedUser && (savedToken.startsWith('dev-token-') || error?.code === 'ERR_NETWORK')) {
              try {
                setUser(JSON.parse(savedUser));
              } catch {
                localStorage.removeItem('it_token');
                localStorage.removeItem('it_user');
                setToken(null);
                setUser(null);
              }
            } else {
              localStorage.removeItem('it_token');
              localStorage.removeItem('it_user');
              setToken(null);
              setUser(null);
            }
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('it_token', newToken);
    localStorage.setItem('it_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors on logout
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('it_token');
    localStorage.removeItem('it_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('it_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
