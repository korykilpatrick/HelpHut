import React from 'react';
import { type PortalConfig } from '../types';
import { 
  Home,
  Package,
  Warehouse,
  BarChart3,
  Settings,
  Users,
  ClipboardList,
  Calendar
} from 'lucide-react';

export const partnerPortalConfig: PortalConfig = {
  role: 'partner',
  title: 'Partner Portal',
  description: 'View and claim available donations, manage inventory',
  features: [
    // Overview section
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View available donations and delivery status',
      icon: Home,
      path: '/partner/dashboard'
    },
    // Donations section
    {
      id: 'available-donations',
      title: 'Available Donations',
      description: 'View and claim available food donations',
      icon: Package,
      path: '/partner/available-donations'
    },
    {
      id: 'claimed-donations',
      title: 'Claimed Donations',
      description: 'Track your claimed donations and deliveries',
      icon: Calendar,
      path: '/partner/claimed-donations'
    },
    // Inventory section
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track and manage your food inventory',
      icon: Warehouse,
      path: '/partner/inventory'
    },
    // Impact section
    {
      id: 'impact',
      title: 'Impact Metrics',
      description: 'Track your community impact and donation history',
      icon: BarChart3,
      path: '/partner/impact'
    },
    // Organization section
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
    // Settings section
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure organization and notification preferences',
      icon: Settings,
      path: '/partner/settings'
    }
  ]
}; 