import React from 'react';
import { type PortalConfig } from '../types';
import { 
  Home,
  Package,
  Calendar,
  Users,
  BarChart3,
  BookOpen
} from 'lucide-react';

export const donorPortalConfig: PortalConfig = {
  role: 'donor',
  title: 'Donor Portal',
  description: 'Manage your food donations and track your impact',
  features: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your donation metrics and activity',
      icon: Home,
      path: '/donor/dashboard'
    },
    {
      id: 'quick-donate',
      title: 'Quick Donate',
      description: 'Submit a new food donation quickly',
      icon: Package,
      path: '/donor/donate'
    },
    {
      id: 'donation-history',
      title: 'Donation History',
      description: 'View and manage your past donations',
      icon: Calendar,
      path: '/donor/history'
    },
    {
      id: 'impact-metrics',
      title: 'Your Impact',
      description: 'See how your donations are making a difference',
      icon: BarChart3,
      path: '/donor/impact'
    },
    {
      id: 'recipients',
      title: 'Recipients',
      description: 'View organizations receiving your donations',
      icon: Users,
      path: '/donor/recipients'
    },
    {
      id: 'guidelines',
      title: 'Donation Guidelines',
      description: 'Learn about food donation best practices',
      icon: BookOpen,
      path: '/donor/guidelines'
    }
  ]
}; 