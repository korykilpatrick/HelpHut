import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PortalLayout } from '../../shared/components/layout/PortalLayout';
import { HomePage } from '../../portals/home/pages/HomePage';
import { LoginPage } from '../../portals/auth/pages/LoginPage';
import { SignupPage } from '../../portals/auth/pages/SignupPage';
import { donorPortalConfig } from '../../portals/donor/config';
import { DashboardPage } from '../../portals/donor/pages/DashboardPage';
import { DonationSubmissionPage } from '../../portals/donor/pages/DonationSubmissionPage';
import { DonationListPage } from '../../portals/donor/pages/DonationListPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes - these don't use the portal layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* Donor Portal */}
      <Route path="/donor" element={<PortalLayout config={donorPortalConfig}><Outlet /></PortalLayout>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="donate" element={<DonationSubmissionPage />} />
        <Route path="history" element={<DonationListPage />} />
      </Route>

      {/* TODO: Add other portal routes */}
      {/* Volunteer Portal */}
      {/* <Route path="/volunteer" element={<PortalLayout config={volunteerPortalConfig}><Outlet /></PortalLayout>}> */}
      {/*   <Route path="dashboard" element={<VolunteerDashboard />} /> */}
      {/* </Route> */}

      {/* Partner Portal */}
      {/* <Route path="/partner" element={<PortalLayout config={partnerPortalConfig}><Outlet /></PortalLayout>}> */}
      {/*   <Route path="dashboard" element={<PartnerDashboard />} /> */}
      {/* </Route> */}

      {/* Admin Portal */}
      {/* <Route path="/admin" element={<PortalLayout config={adminPortalConfig}><Outlet /></PortalLayout>}> */}
      {/*   <Route path="dashboard" element={<AdminDashboard />} /> */}
      {/* </Route> */}

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
