import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { PortalLayout } from '@/shared/components/layout/PortalLayout';
import { donorPortalConfig } from '@/portals/donor/config';
import { LoginPage } from '@/portals/auth/pages/LoginPage';
import { SignupPage } from '@/portals/auth/pages/SignupPage';
import { DashboardPage } from '@/portals/donor/pages/DashboardPage';
import { DonationSubmissionPage } from '@/portals/donor/pages/DonationSubmissionPage';
import { DonationListPage } from '@/portals/donor/pages/DonationListPage';

// TODO: Import other portal configs as they're created
// import { volunteerPortalConfig } from '../../portals/volunteer/config';
// import { partnerPortalConfig } from '../../portals/partner/config';
// import { adminPortalConfig } from '../../portals/admin/config';

export function AppRoutes() {
  const { user } = useAuth();
  
  console.log('AppRoutes render - Current user:', user);
  console.log('Current pathname:', window.location.pathname);

  // If no user, only allow access to login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user exists but is on login page, redirect to home
  if (window.location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Get the appropriate portal config based on user role
  const portalConfig = user.role === 'donor' ? donorPortalConfig : undefined;
  if (!portalConfig) {
    return <div>Invalid user role</div>;
  }

  // User is authenticated, show full app routes
  return (
    <Routes>
      <Route path="/" element={<PortalLayout config={portalConfig}><Outlet /></PortalLayout>}>
        <Route index element={<Navigate to={`/${user.role}/dashboard`} replace />} />
        
        {/* Donor Routes */}
        <Route path="/donor/dashboard" element={<DashboardPage />} />
        <Route path="/donor/donate" element={<DonationSubmissionPage />} />
        <Route path="/donor/history" element={<DonationListPage />} />
        
        {/* Add other role-specific routes here */}
      </Route>
      
      {/* Redirect authenticated users away from auth pages */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
