"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, AuthResponse } from '../services/auth.service';
import { apiClient } from '../lib/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on mount if token exists
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // We have a token, fetch the user profile to confirm it's valid
        const userData = await authService.getCurrentUser();
        setUser(userData.data || userData);
      }
    } catch (error) {
      console.error('Auth verification failed', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    if(data.tokens.refreshToken) localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user);
    
    // Redirect based on role
    if (data.user.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (data.user.role === 'agent') {
      router.push('/dashboard/vendor');
    } else {
      router.push('/dashboard/buyer');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      // Remove header just in case
      delete apiClient.defaults.headers.common['Authorization'];
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
