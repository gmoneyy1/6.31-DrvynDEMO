import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const userData = await auth.getUser();
      console.log('User data received:', userData);
      
      // Verify we have valid user data
      if (userData && userData.username && userData.username !== 'User') {
        setUser(userData);
        console.log('Authentication successful, user set');
      } else {
        console.log('Invalid user data, setting user to null');
        setUser(null);
        if (window.location.pathname === '/') {
          console.log('Invalid user data on main page, redirecting to login');
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.log('Authentication check failed:', error);
      setUser(null);
      // If we're on the main page and not authenticated, redirect immediately
      if (window.location.pathname === '/') {
        console.log('Not authenticated on main page, redirecting to login');
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Force redirect to login if not authenticated after loading
  useEffect(() => {
    if (!isLoading && !user && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      console.log('Not authenticated, redirecting to login');
      window.location.href = '/login';
    }
  }, [isLoading, user]);

  // Additional check: if we're on the main page and not authenticated, redirect immediately
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (window.location.pathname === '/' && !user && !isLoading) {
        console.log('On main page but not authenticated, redirecting to login');
        window.location.href = '/login';
      }
    };
    
    checkAuthAndRedirect();
  }, [user, isLoading]);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login for:', username);
      const response = await auth.login(username, password);
      console.log('Login response:', response);
      if (response.success) {
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await auth.register(username, email, password);
      if (response.success) {
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      // Redirect to login page on frontend
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
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