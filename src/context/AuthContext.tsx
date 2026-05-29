// ============================================================
// src/context/AuthContext.tsx — Global Authentication State
// ============================================================
//
// This component wraps the entire application and provides
// the user state and authentication methods (login, logout, etc.)
// to any component that needs it.
//
// KEY DESIGN DECISIONS:
//   - Uses HttpOnly cookies — NO localStorage for JWT storage
//   - On app load, calls GET /auth/me to check if a valid cookie exists
//   - login/register call the backend, which sets the HttpOnly cookie
//   - logout calls the backend, which clears the HttpOnly cookie
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '../services/api';
import { initSocket, disconnectSocket } from '../lib/socket';

// ============================================================
// Types
// ============================================================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';           // backend only has 'user' and 'admin'
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  partnerStatus: 'none' | 'pending' | 'approved' | 'rejected';
  canListItems: boolean;             // set to true when partner is approved
  isVerified?: boolean;
  isPartner?: boolean;
  isSuspended?: boolean;
  avatar?: string;
  avatarPublicId?: string;
  phone?: string;
  phoneNumber?: string;
  bio?: string;
  neighborhood?: string;
  address?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// ============================================================
// Context
// ============================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------------------------------------------------
  // Check Auth Status on Mount
  // ------------------------------------------------------------
  // When the app first loads (or on refresh), we ask the backend
  // "Who am I?". The backend reads the HttpOnly cookie and returns
  // the user data if valid.
  // ------------------------------------------------------------
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch {
      // If 401, it means there's no valid cookie. Just set user to null.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (user) {
      initSocket(user._id);
    } else if (!isLoading) {
      disconnectSocket();
    }
  }, [user, isLoading]);

  useEffect(() => {
    const handleSuspended = () => {
      setUser(prev => prev ? { ...prev, isSuspended: true } : null);
    };
    window.addEventListener('user_suspended', handleSuspended);
    return () => window.removeEventListener('user_suspended', handleSuspended);
  }, []);

  // ------------------------------------------------------------
  // Login
  // ------------------------------------------------------------
  // POST /auth/login with email & password.
  // The backend validates credentials and sets an HttpOnly cookie.
  // We get the user data back in the response body.
  // ------------------------------------------------------------
  const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data.user;
    setUser(userData);
    return userData;
  };

  // ------------------------------------------------------------
  // Register
  // ------------------------------------------------------------
  // POST /auth/register with name, email & password.
  // The backend creates the user and sets an HttpOnly cookie.
  // ------------------------------------------------------------
  const register = async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/register', { name, email, password });
    const userData = response.data.user;
    setUser(userData);
    return userData;
  };

  // ------------------------------------------------------------
  // Logout
  // ------------------------------------------------------------
  // POST /auth/logout — the backend clears the HttpOnly cookie.
  // We always clear local state even if the server call fails.
  // ------------------------------------------------------------
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed on server, but clearing local state anyway.');
    } finally {
      setUser(null);
    }
  };

  // The context value object that will be provided to children
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// useAuth Hook
// ============================================================
// A simple custom hook to make consuming the AuthContext easier.
// Instead of: const { user } = useContext(AuthContext);
// We can do:  const { user } = useAuth();
//
// It also provides a helpful error message if a developer tries
// to use the hook outside of the AuthProvider.
// ============================================================
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
