import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PortalLayout } from '../../shared/components/layout/PortalLayout';
import { HomePage } from '../../portals/home/pages/HomePage';
import { LoginPage } from '../../portals/auth/pages/LoginPage';
import { SignupPage } from '../../portals/auth/pages/SignupPage';
import { donorPortalConfig } from '../../portals/donor/config';
import { volunteerPortalConfig } from '../../portals/volunteer/config';
import { DashboardPage as DonorDashboard } from '../../portals/donor/pages/DashboardPage';
import { DonationSubmissionPage } from '../../portals/donor/pages/DonationSubmissionPage';
import { DonationListPage } from '../../portals/donor/pages/DonationListPage';
import { AvailablePickupsPage } from '../../portals/volunteer/pages/AvailablePickupsPage';
import { SchedulePage } from '../../portals/volunteer/pages/SchedulePage';
import { DeliveryHistoryPage } from '../../portals/volunteer/pages/DeliveryHistoryPage';
import { ImpactPage } from '../../portals/volunteer/pages/ImpactPage';
import { CoverageAreasPage } from '../../portals/volunteer/pages/CoverageAreasPage';
import { LeaderboardPage } from '../../portals/volunteer/pages/LeaderboardPage';
import { ProfilePage } from '../../portals/volunteer/pages/ProfilePage';
import { DashboardPage as VolunteerDashboard } from '../../portals/volunteer/pages/DashboardPage';
import { partnerPortalConfig } from '../../portals/partner/config';
import { DashboardPage as PartnerDashboard } from '../../portals/partner/pages/DashboardPage';
import { InventoryPage } from '../../portals/partner/pages/InventoryPage';
import { RequestsPage } from '../../portals/partner/pages/RequestsPage';

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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="donate" element={<DonationSubmissionPage />} />
        <Route path="history" element={<DonationListPage />} />
      </Route>

      {/* Volunteer Portal */}
      <Route path="/volunteer" element={<PortalLayout config={volunteerPortalConfig}><Outlet /></PortalLayout>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="pickups/available" element={<AvailablePickupsPage />} />
        <Route path="deliveries/active" element={<SchedulePage />} />
        <Route path="history" element={<DeliveryHistoryPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="zones" element={<CoverageAreasPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="availability" element={<SchedulePage />} />
      </Route>

      {/* Partner Portal */}
      <Route path="/partner" element={<PortalLayout config={partnerPortalConfig}><Outlet /></PortalLayout>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="schedule" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="impact" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="donors" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="requirements" element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="settings" element={<Navigate to="/partner/dashboard" replace />} />
      </Route>

      {/* Admin Portal */}
      {/* <Route path="/admin" element={<PortalLayout config={adminPortalConfig}><Outlet /></PortalLayout>}> */}
      {/*   <Route path="dashboard" element={<AdminDashboard />} /> */}
      {/* </Route> */}

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
