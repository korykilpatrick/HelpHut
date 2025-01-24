import React from 'react';
import { type PortalConfig } from '../types';
import { 
  ClipboardList, 
  BarChart3, 
  BookOpen,
  Clock
} from 'lucide-react';

export const donorPortalConfig: PortalConfig = {
  role: 'donor',
  title: 'Donor Portal',
  description: 'Manage your food donations and track your impact',
  features: [
    {
      id: 'quick-donate',
      title: 'Quick Donate',
      description: 'Submit a new food donation quickly',
      icon: <ClipboardList className="w-6 h-6" />,
      path: '/donor/donate'
    },
    {
      id: 'donation-history',
      title: 'Donation History',
      description: 'View and manage your past donations',
      icon: <Clock className="w-6 h-6" />,
      path: '/donor/history'
    },
    {
      id: 'impact-metrics',
      title: 'Your Impact',
      description: 'See how your donations are making a difference',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/donor/impact'
    },
    {
      id: 'guidelines',
      title: 'Donation Guidelines',
      description: 'Learn about food donation best practices',
      icon: <BookOpen className="w-6 h-6" />,
      path: '/donor/guidelines'
    }
  ]
}; 