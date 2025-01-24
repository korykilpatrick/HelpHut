import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthUser, AuthState } from './types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Try to restore auth state from localStorage
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        return {
          user: parsed.user,
          isLoading: false
        };
      } catch (e) {
        localStorage.removeItem('auth');
      }
    }
    return {
      user: null,
      isLoading: false,
    };
  });

  // Persist auth state changes
  useEffect(() => {
    if (authState.user) {
      localStorage.setItem('auth', JSON.stringify({ user: authState.user }));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState.user]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authState.user) {
      if (location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    } else if (location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [authState.user, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Implement actual login logic
      const mockUser: AuthUser = {
        id: '1',
        email,
        role: 'donor',
        name: 'Test User',
      };
      setAuthState({ user: mockUser, isLoading: false });
    } catch (error) {
      setAuthState({ user: null, isLoading: false, error: 'Login failed' });
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      localStorage.removeItem('auth');
      setAuthState({ user: null, isLoading: false });
      navigate('/login', { replace: true });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: 'Logout failed' }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 
