import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ActiveDeliveries } from './pages/ActiveDeliveries';
import { DeliveryHistory } from './pages/DeliveryHistory';

export const volunteerRoutes: RouteObject[] = [
  {
    path: '/volunteer',
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'deliveries',
        element: <ActiveDeliveries />
      },
      {
        path: 'history',
        element: <DeliveryHistory />
      }
    ]
  }
]; 