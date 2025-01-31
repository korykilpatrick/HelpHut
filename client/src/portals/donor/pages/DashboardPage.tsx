import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Calendar, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
  ArrowUp
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';

export function DashboardPage() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['donor-dashboard'],
    queryFn: async () => {
      const response = await api.donor.getDashboardStats();
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <BaseText>Loading dashboard...</BaseText>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Track your donations and impact in the community.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <BaseButton 
          className="w-full py-3 text-center flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          onClick={() => navigate('/donor/donate')}
        >
          <Package className="h-5 w-5" />
          Submit New Donation
        </BaseButton>
        <BaseButton 
          className="w-full py-3 text-center flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
          onClick={() => navigate('/donor/history')}
        >
          <History className="h-5 w-5" />
          View Donation History
        </BaseButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Total Donations</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">35</BaseText>
                <BaseText size="sm" className="text-gray-500">total</BaseText>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                <BaseText size="xs" className="text-green-500">+12%</BaseText>
                <BaseText size="xs" className="text-gray-500 ml-1">vs last month</BaseText>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">This Month</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">11</BaseText>
                <BaseText size="sm" className="text-gray-500">donations</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Donations made this month</BaseText>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Impact Score</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">52</BaseText>
                <BaseText size="sm" className="text-gray-500">points</BaseText>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                <BaseText size="xs" className="text-green-500">+5%</BaseText>
                <BaseText size="xs" className="text-gray-500 ml-1">community impact</BaseText>
              </div>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">People Helped</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">105</BaseText>
                <BaseText size="sm" className="text-gray-500">people</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Estimated impact</BaseText>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Recent Donations */}
      <section className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Recent Donations</h2>
            <p className="text-gray-600">Your latest food rescue contributions</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Fresh Produce Donation */}
          <BaseCard className="p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge variant="warning" className="shadow-sm">Scheduled</BaseBadge>
                  <BaseText size="sm" weight="medium" className="text-gray-900">11 units of Fresh Produce</BaseText>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <BaseText size="sm">Pickup: Jan 31, 2025, 4:59 PM - Feb 1, 2025, 4:59 PM</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Baked Goods Donation */}
          <BaseCard className="p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge variant="warning" className="shadow-sm">Scheduled</BaseBadge>
                  <BaseText size="sm" weight="medium" className="text-gray-900">60 servings of Baked Goods</BaseText>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <BaseText size="sm">Pickup: Jan 29, 2025, 6:13 PM - Jan 30, 2025, 6:00 PM</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Other Donation */}
          <BaseCard className="p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge variant="success" className="shadow-sm">Completed</BaseBadge>
                  <BaseText size="sm" weight="medium" className="text-gray-900">14 lbs of Other</BaseText>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <BaseText size="sm">Pickup: Feb 3, 2025, 4:59 PM - Feb 7, 2025, 4:59 PM</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Pantry Items */}
          <BaseCard className="p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge variant="primary" className="shadow-sm">InTransit</BaseBadge>
                  <BaseText size="sm" weight="medium" className="text-gray-900">17 units of Pantry Items</BaseText>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <BaseText size="sm">Pickup: Feb 6, 2025, 4:59 PM - Feb 13, 2025, 4:59 PM</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>

          {/* Prepared Foods */}
          <BaseCard className="p-4 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge variant="default" className="shadow-sm">Submitted</BaseBadge>
                  <BaseText size="sm" weight="medium" className="text-gray-900">20 lbs of Prepared Foods</BaseText>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <BaseText size="sm">Pickup: Feb 9, 2025, 4:59 PM - Feb 19, 2025, 4:59 PM</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>
    </div>
  );
} 