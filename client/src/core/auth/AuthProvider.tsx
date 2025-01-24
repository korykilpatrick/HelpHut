import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthUser, AuthState } from './types';
import axios from 'axios';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          const { token } = JSON.parse(savedAuth);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('/api/v1/auth/session');
          const { user } = response.data;
          
          setAuthState({
            user: {
              id: user.id,
              email: user.email,
              role: user.role.toLowerCase(),
              name: user.name || user.email,
              organizationId: user.organization_id
            },
            isLoading: false
          });
        } else {
          setAuthState({ user: null, isLoading: false });
        }
      } catch (error) {
        localStorage.removeItem('auth');
        delete axios.defaults.headers.common['Authorization'];
        setAuthState({ user: null, isLoading: false });
      }
    };

    checkSession();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!authState.isLoading) {
      if (!authState.user && !PUBLIC_PATHS.includes(location.pathname)) {
        navigate('/login', { replace: true });
      } else if (authState.user && PUBLIC_PATHS.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    }
  }, [authState.user, authState.isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { user, session } = response.data;
      
      // Store the session token
      localStorage.setItem('auth', JSON.stringify({ token: session.token }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
      
      setAuthState({ 
        user: {
          id: user.id,
          email: user.email,
          role: user.role.toLowerCase(),
          name: user.name || email,
          organizationId: user.organization_id
        }, 
        isLoading: false 
      });
    } catch (error) {
      setAuthState({ user: null, isLoading: false, error: 'Login failed' });
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await axios.post('/api/v1/auth/logout');
      delete axios.defaults.headers.common['Authorization'];
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
