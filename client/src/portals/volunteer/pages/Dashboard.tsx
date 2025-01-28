import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { DeliveryCard } from '../components/DeliveryCard';
import { Ticket } from '../../../../../lib/types/generated/api';
import BaseText from '../../../shared/components/base/BaseText';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import { axiosInstance } from '../../../core/api';

interface DashboardStats {
  totalDeliveries: number;
  activeDeliveries: number;
  impactMetrics: {
    poundsRescued: number;
    mealsProvided: number;
  };
}

export const Dashboard: React.FC = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['volunteer', 'dashboard-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/volunteer/stats');
      return data;
    }
  });

  // Fetch active deliveries
  const { data: activeDeliveries, isLoading: deliveriesLoading } = useQuery<{ tickets: Ticket[] }>({
    queryKey: ['volunteer', 'active-deliveries'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/volunteer/tickets/active');
      return data;
    }
  });

  // Fetch recent history
  const { data: recentHistory, isLoading: historyLoading } = useQuery<{ history: Ticket[] }>({
    queryKey: ['volunteer', 'recent-history'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/volunteer/tickets/history?limit=3');
      return data;
    }
  });

  const isLoading = statsLoading || deliveriesLoading || historyLoading;

  if (isLoading) {
    return (
      <div className="p-4">
        <BaseText>Loading dashboard...</BaseText>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <BaseText size="xl" weight="bold">Volunteer Dashboard</BaseText>
        <BaseText size="sm" className="text-gray-600">
          Welcome back! Here's an overview of your food rescue activities
        </BaseText>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BaseCard className="p-4">
          <BaseText size="sm" className="text-gray-600">Total Deliveries</BaseText>
          <BaseText size="2xl" weight="bold">{stats?.totalDeliveries || 0}</BaseText>
        </BaseCard>

        <BaseCard className="p-4">
          <BaseText size="sm" className="text-gray-600">Pounds Rescued</BaseText>
          <BaseText size="2xl" weight="bold">{stats?.impactMetrics.poundsRescued || 0}</BaseText>
        </BaseCard>

        <BaseCard className="p-4">
          <BaseText size="sm" className="text-gray-600">Meals Provided</BaseText>
          <BaseText size="2xl" weight="bold">{stats?.impactMetrics.mealsProvided || 0}</BaseText>
        </BaseCard>
      </div>

      {/* Active Deliveries Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <BaseText size="lg" weight="semibold">Active Deliveries</BaseText>
          <Link to="/volunteer/deliveries">
            <BaseButton variant="outline" size="sm">View All</BaseButton>
          </Link>
        </div>

        {activeDeliveries?.tickets.length ? (
          <div className="space-y-4">
            {activeDeliveries.tickets.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                ticket={delivery}
                showActions
              />
            ))}
          </div>
        ) : (
          <BaseCard className="p-4">
            <BaseText className="text-gray-600">No active deliveries</BaseText>
          </BaseCard>
        )}
      </section>

      {/* Recent History Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <BaseText size="lg" weight="semibold">Recent History</BaseText>
          <Link to="/volunteer/history">
            <BaseButton variant="outline" size="sm">View All</BaseButton>
          </Link>
        </div>

        {recentHistory?.history.length ? (
          <div className="space-y-4">
            {recentHistory.history.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                ticket={delivery}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <BaseCard className="p-4">
            <BaseText className="text-gray-600">No completed deliveries yet</BaseText>
          </BaseCard>
        )}
      </section>
    </div>
  );
}; 