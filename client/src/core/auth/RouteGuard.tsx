import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { UserRole } from './types';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User's role is not authorized, redirect to their default portal
    const defaultPath = getDefaultPath(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  // Authorized, render children
  return <>{children}</>;
}

// Helper to get default redirect path based on role
function getDefaultPath(role: UserRole): string {
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
} 