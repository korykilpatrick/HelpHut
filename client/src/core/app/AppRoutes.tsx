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
import { Dashboard as VolunteerDashboard } from '../../portals/volunteer/pages/Dashboard';
import { ActiveDeliveries } from '../../portals/volunteer/pages/ActiveDeliveries';
import { DeliveryHistory } from '../../portals/volunteer/pages/DeliveryHistory';
import { ProfilePage } from '../../portals/volunteer/pages/ProfilePage';
import { partnerPortalConfig } from '../../portals/partner/config';
import { DashboardPage as PartnerDashboard } from '../../portals/partner/pages/DashboardPage';
import { InventoryPage } from '../../portals/partner/pages/InventoryPage';
import { RequestsPage } from '../../portals/partner/pages/RequestsPage';
import { DeliverySchedulePage } from '../../portals/partner/pages/DeliverySchedulePage';
import { RouteGuard } from '../auth/RouteGuard';

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes - these don't use the portal layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* Donor Portal */}
      <Route 
        path="/donor" 
        element={
          <RouteGuard allowedRoles={['admin', 'donor']}>
            <PortalLayout config={donorPortalConfig}><Outlet /></PortalLayout>
          </RouteGuard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="donate" element={<DonationSubmissionPage />} />
        <Route path="history" element={<DonationListPage />} />
      </Route>

      {/* Volunteer Portal */}
      <Route
        path="/volunteer"
        element={
          <RouteGuard allowedRoles={['admin', 'volunteer']}>
            <PortalLayout config={volunteerPortalConfig}><Outlet /></PortalLayout>
          </RouteGuard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VolunteerDashboard />} />
        <Route path="pickups/available" element={<AvailablePickupsPage />} />
        <Route path="deliveries" element={<ActiveDeliveries />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Partner Portal */}
      <Route
        path="/partner"
        element={
          <RouteGuard allowedRoles={['admin', 'partner']}>
            <PortalLayout config={partnerPortalConfig}><Outlet /></PortalLayout>
          </RouteGuard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="schedule" element={<DeliverySchedulePage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
