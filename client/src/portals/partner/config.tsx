import React from 'react';
import { type PortalConfig } from '../types';
import { 
  Home,
  Package,
  Warehouse,
  Calendar,
  BarChart3,
  Settings,
  Users,
  ClipboardList
} from 'lucide-react';

export const partnerPortalConfig: PortalConfig = {
  role: 'partner',
  title: 'Partner Portal',
  description: 'Request and receive food donations, manage inventory',
  features: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your donation requests and inventory status',
      icon: Home,
      path: '/partner/dashboard'
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track and manage your food inventory',
      icon: Warehouse,
      path: '/partner/inventory'
    },
    {
      id: 'requests',
      title: 'Donation Requests',
      description: 'Create and manage donation requests',
      icon: Package,
      path: '/partner/requests'
    },
    {
      id: 'schedule',
      title: 'Delivery Schedule',
      description: 'View upcoming and past deliveries',
      icon: Calendar,
      path: '/partner/schedule'
    },
    {
      id: 'impact',
      title: 'Impact Metrics',
      description: 'Track the impact of received donations',
      icon: BarChart3,
      path: '/partner/impact'
    },
    {
      id: 'donors',
      title: 'Our Donors',
      description: 'View and manage donor relationships',
      icon: Users,
      path: '/partner/donors'
    },
    {
      id: 'requirements',
      title: 'Requirements',
      description: 'Manage food handling requirements and certifications',
      icon: ClipboardList,
      path: '/partner/requirements'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure organization and notification preferences',
      icon: Settings,
      path: '/partner/settings'
    }
  ]
}; 