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
  console.log('=== Getting Organization ID ===');
  console.log('User data for org ID:', user);
  
  // First try to get it from the organization field
  if (user.organization?.id) {
    console.log('Using organization ID from user:', user.organization.id);
    return user.organization.id;
  }
  
  // Otherwise try to get it from role-specific data
  switch (user.role.toLowerCase()) {
    case 'donor':
      console.log('Donor data:', user.donor);
      return user.donor?.id;
    case 'volunteer':
      console.log('Volunteer data:', user.volunteer);
      return user.volunteer?.id;
    case 'partner':
      console.log('Partner data:', user.partner);
      return user.partner?.id;
    default:
      console.log('No matching role for org ID:', user.role);
      return undefined;
  }
};

// Helper to get organization name based on role
const getOrganizationName = (user: any) => {
  console.log('=== Getting Organization Name ===');
  console.log('User data:', user);
  
  // First try to get it from the organizationName field
  if (user.organizationName) {
    console.log('Using organizationName from user:', user.organizationName);
    return user.organizationName;
  }
  
  // Otherwise try to get it from role-specific data
  switch (user.role.toLowerCase()) {
    case 'donor':
      console.log('Donor organization name:', user.donor?.organization_name);
      return user.donor?.organization_name;
    case 'partner':
      console.log('Partner organization name:', user.partner?.name);
      return user.partner?.name;
    default:
      console.log('No organization name for role:', user.role);
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
          console.log('-> Full session response:', JSON.stringify(data, null, 2));
          
          const authUser: AuthUser = {
            id: user.id,
            email: user.email,
            role: user.role.toLowerCase(),
            name: user.name || user.email,
            organizationId: getOrganizationId(user),
            organizationName: getOrganizationName(user)
          };

          console.log('-> Created auth user:', authUser);
          
          setAuthState({
            user: authUser,
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
    console.log('=== Login Started ===');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('-> Making login request');
      const { data } = await api.auth.login(email, password);
      const { user, session } = data;
      
      console.log('-> Login response received');
      console.log('-> User data:', JSON.stringify(user, null, 2));
      console.log('-> Session data:', JSON.stringify(session, null, 2));
      
      // Store the session token
      const authData = { token: session.token };
      console.log('-> Storing auth data:', authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuthToken(session.token);
      
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        name: user.name || email,
        organizationId: getOrganizationId(user),
        organizationName: getOrganizationName(user)
      };
      
      console.log('-> Created auth user:', authUser);
      
      setAuthState({ 
        user: authUser,
        isLoading: false 
      });
      console.log('=== Login Completed ===');
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
