import React from 'react';
import { type PortalConfig } from '../types';
import { 
  Calendar,
  Clock,
  MapPin,
  BarChart3,
  Truck
} from 'lucide-react';

export const volunteerPortalConfig: PortalConfig = {
  role: 'volunteer',
  title: 'Volunteer Portal',
  description: 'Manage your delivery schedule and track your impact',
  features: [
    {
      id: 'available-pickups',
      title: 'Available Pickups',
      description: 'View and claim available food rescue assignments',
      icon: <Truck className="w-6 h-6" />,
      path: '/volunteer/pickups'
    },
    {
      id: 'my-schedule',
      title: 'My Schedule',
      description: 'Set your availability and manage upcoming shifts',
      icon: <Calendar className="w-6 h-6" />,
      path: '/volunteer/schedule'
    },
    {
      id: 'active-deliveries',
      title: 'Active Deliveries',
      description: 'Track and update your current deliveries',
      icon: <Clock className="w-6 h-6" />,
      path: '/volunteer/active'
    },
    {
      id: 'coverage-area',
      title: 'Coverage Area',
      description: 'Set and view your preferred delivery areas',
      icon: <MapPin className="w-6 h-6" />,
      path: '/volunteer/coverage'
    },
    {
      id: 'impact',
      title: 'Your Impact',
      description: 'See the difference you\'re making',
      icon: <BarChart3 className="w-6 h-6" />,
      path: '/volunteer/impact'
    }
  ]
}; 