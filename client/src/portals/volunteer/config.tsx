import { 
  Home,
  User,
  Truck,
  Search,
  Clock,
  Calendar,
  MapPin,
  BarChart3,
  Trophy
} from 'lucide-react';
import { type PortalConfig } from '../types';

export const volunteerPortalConfig: PortalConfig = {
  role: 'volunteer',
  title: 'Volunteer Portal',
  description: 'Track your deliveries and manage your schedule',
  features: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your volunteer metrics and active deliveries',
      icon: Home,
      path: '/volunteer/dashboard'
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Manage your volunteer profile and preferences',
      icon: User,
      path: '/volunteer/profile'
    },
    {
      id: 'available-pickups',
      title: 'Available Pickups',
      description: 'Browse and claim available food rescue assignments',
      icon: Search,
      path: '/volunteer/pickups/available'
    },
    {
      id: 'active-deliveries',
      title: 'My Deliveries',
      description: 'Track your current and upcoming deliveries',
      icon: Truck,
      path: '/volunteer/deliveries'
    },
    {
      id: 'delivery-history',
      title: 'Delivery History',
      description: 'View your completed food rescue assignments',
      icon: Clock,
      path: '/volunteer/history'
    },
    {
      id: 'availability',
      title: 'Set Availability',
      description: 'Manage your volunteer schedule and preferences',
      icon: Calendar,
      path: '/volunteer/availability'
    },
    {
      id: 'coverage-areas',
      title: 'Coverage Areas',
      description: 'Set your preferred delivery zones',
      icon: MapPin,
      path: '/volunteer/zones'
    },
    {
      id: 'impact',
      title: 'My Impact',
      description: 'Track your contribution to the community',
      icon: BarChart3,
      path: '/volunteer/impact'
    },
    {
      id: 'leaderboard',
      title: 'Leaderboard',
      description: 'See how your contributions compare',
      icon: Trophy,
      path: '/volunteer/leaderboard'
    }
  ]
}; 