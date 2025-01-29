import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  
  console.log('=== useAuth Hook Called ===');
  console.log('Auth context:', context);
  console.log('User from context:', context?.user);
  
  if (!context) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 