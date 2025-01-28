import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthUser, AuthState, UserRole } from './types';
import { api, setAuthToken } from '../api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'];

// Helper to get organization ID based on role
const getOrganizationId = (user: any) => {
  switch (user.role.toLowerCase()) {
    case 'donor':
      return user.donor?.id;
    case 'volunteer':
      return user.volunteer?.id;
    case 'partner':
      return user.partner?.id;
    default:
      return undefined;
  }
};

// Helper to get default redirect path based on role
const getDefaultPath = (role: UserRole) => {
  switch (role) {
    case 'donor':
      return '/donor/dashboard';
    case 'volunteer':
      return '/volunteer/dashboard';
    case 'partner':
      return '/partner/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });
  const [initialized, setInitialized] = useState(false);

  console.log('=== AuthProvider Render ===');
  console.log('Current pathname:', location.pathname);
  console.log('Current auth state:', authState);
  console.log('Initialized:', initialized);

  // Initial session check
  useEffect(() => {
    console.log('=== Initial Auth Check ===');
    
    const initialize = async () => {
      try {
        const savedAuth = localStorage.getItem('auth');
        console.log('-> Saved auth exists:', !!savedAuth);
        
        if (savedAuth) {
          const { token } = JSON.parse(savedAuth);
          // Set token in axios instance
          setAuthToken(token);
          
          console.log('-> Checking session');
          const { data } = await api.auth.getSession();
          const { user } = data;
          
          console.log('-> Session valid, user:', user);
          
          setAuthState({
            user: {
              id: user.id,
              email: user.email,
              role: user.role.toLowerCase(),
              name: user.name || user.email,
              organizationId: getOrganizationId(user)
            },
            isLoading: false
          });
        } else {
          console.log('-> No saved auth');
          setAuthState({ user: null, isLoading: false });
        }
      } catch (error) {
        console.log('-> Auth check failed:', error);
        localStorage.removeItem('auth');
        setAuthToken(null);
        setAuthState({ user: null, isLoading: false });
      } finally {
        console.log('-> Auth check complete');
        setInitialized(true);
      }
    };

    initialize();
  }, []);

  // Navigation handler
  useEffect(() => {
    if (!initialized) {
      console.log('-> Not initialized yet, skipping navigation');
      return;
    }

    console.log('=== Navigation Check ===');
    console.log('Auth state:', authState);
    console.log('Current path:', location.pathname);

    const currentPath = location.pathname;
    const isPublicPath = PUBLIC_PATHS.includes(currentPath);

    if (!authState.isLoading) {
      if (!authState.user && !isPublicPath) {
        console.log('-> Redirecting to login, saving path:', currentPath);
        sessionStorage.setItem('redirectTo', currentPath);
        navigate('/login', { replace: true });
      } else if (authState.user && isPublicPath) {
        const savedRedirect = sessionStorage.getItem('redirectTo');
        const defaultPath = getDefaultPath(authState.user.role);
        const redirectTo = savedRedirect || defaultPath;
        
        console.log('-> Redirecting to:', redirectTo);
        sessionStorage.removeItem('redirectTo');
        navigate(redirectTo, { replace: true });
      } else if (authState.user && currentPath === '/') {
        navigate(getDefaultPath(authState.user.role), { replace: true });
      }
    }
  }, [authState, initialized, location.pathname, navigate]);

  // Don't render anything until we're initialized
  if (!initialized) {
    console.log('-> Not initialized, rendering nothing');
    return null;
  }

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data } = await api.auth.login(email, password);
      const { user, session } = data;
      
      console.log('Login response:', data);
      
      // Store the session token
      localStorage.setItem('auth', JSON.stringify({ token: session.token }));
      setAuthToken(session.token);
      
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        name: user.name || email,
        organizationId: getOrganizationId(user)
      };
      
      setAuthState({ 
        user: authUser,
        isLoading: false 
      });
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({ user: null, isLoading: false, error: 'Login failed' });
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await api.auth.logout();
      setAuthToken(null);
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
