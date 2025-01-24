import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { PortalLayout } from '@/shared/components/layout/PortalLayout';
import { donorPortalConfig } from '@/portals/donor/config';
import { LoginPage } from '@/portals/auth/pages/LoginPage';
import { DashboardPage } from '@/portals/donor/pages/DashboardPage';
import { DonationSubmissionPage } from '@/portals/donor/pages/DonationSubmissionPage';

// TODO: Import other portal configs as they're created
// import { volunteerPortalConfig } from '../../portals/volunteer/config';
// import { partnerPortalConfig } from '../../portals/partner/config';
// import { adminPortalConfig } from '../../portals/admin/config';

export function AppRoutes() {
  const { user } = useAuth();
  
  console.log('AppRoutes render - Current user:', user);
  console.log('Current pathname:', window.location.pathname);

  // Get portal config based on user role
  const getPortalConfig = () => {
    if (!user) return null;
    console.log('Getting portal config for role:', user.role);
    switch (user.role) {
      case 'donor':
        return donorPortalConfig;
      default:
        return donorPortalConfig; // Temporary fallback
    }
  };

  const portalConfig = getPortalConfig();
  console.log('Portal config:', portalConfig);

  // If no user, only allow access to login
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user exists but is on login page, redirect to home
  if (window.location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, show full app routes
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PortalLayout config={portalConfig!}>
            <DashboardPage />
          </PortalLayout>
        }
      />

      {/* Donor routes */}
      <Route path="/donor">
        <Route 
          path="donate" 
          element={
            <PortalLayout config={portalConfig!}>
              <DonationSubmissionPage />
            </PortalLayout>
          } 
        />
        <Route 
          path="history" 
          element={
            <PortalLayout config={portalConfig!}>
              <div>Donation History</div>
            </PortalLayout>
          } 
        />
        <Route 
          path="impact" 
          element={
            <PortalLayout config={portalConfig!}>
              <div>Impact Metrics</div>
            </PortalLayout>
          } 
        />
        <Route 
          path="guidelines" 
          element={
            <PortalLayout config={portalConfig!}>
              <div>Donation Guidelines</div>
            </PortalLayout>
          } 
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
