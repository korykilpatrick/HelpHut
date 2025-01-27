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
  Truck,
  XCircle,
} from 'lucide-react';
import { api } from '../../../core/api';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import type { Donation } from '@lib/api/generated/src/models';

interface DashboardMetric {
  label: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface RecentDonation {
  id: string;
  foodType: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  status?: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  createdAt: string;
}

interface GetDonationsResponse {
  data: {
    donations: {
      total: number;
      donations: RecentDonation[];
    };
  };
}

const getStatusIcon = (status: string | undefined) => {
  if (!status) return Clock;
  
  switch (status.toLowerCase()) {
    case 'completed':
      return CheckCircle2;
    case 'in_progress':
      return Truck;
    case 'cancelled':
      return XCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string | undefined) => {
  if (!status) return 'text-yellow-500';
  
  switch (status.toLowerCase()) {
    case 'completed':
      return 'text-green-500';
    case 'in_progress':
      return 'text-blue-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-yellow-500';
  }
};

export function DashboardPage() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['donorDashboard'],
    queryFn: async () => {
      try {
        const { data } = await api.donations.getDonations({
          limit: 0,  // We only need the total count
        });
        
        // Calculate metrics from the response
        const donations = data.donations.donations || [];
        const total = donations.length;
        const thisMonth = donations.filter((d: Donation) => {
          const date = new Date(d.createdAt || '');
          const now = new Date();
          return date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear();
        }).length;
        
        return {
          metrics: {
            totalDonations: total,
            monthlyDonations: thisMonth,
            impactScore: Math.floor(total * 1.5),  // Simple impact calculation
            peopleHelped: Math.floor(total * 3),   // Estimate 3 people helped per donation
          }
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
  });

  // Fetch recent donations
  const { data: recentDonations, isLoading: isRecentLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await api.donations.getDonations({ limit: 5 });
      return (data.donations.donations || []).map((d: Donation) => ({
        id: d.id,
        foodType: {
          id: d.foodTypeId,
          name: 'Unknown Food Type' // TODO: Get food type name from API
        },
        quantity: d.quantity,
        unit: d.unit,
        pickupWindowStart: d.pickupWindowStart,
        pickupWindowEnd: d.pickupWindowEnd,
        createdAt: d.createdAt || new Date().toISOString()
      }));
    }
  });

  const metrics: DashboardMetric[] = [
    {
      label: 'Total Donations',
      value: dashboardData?.metrics.totalDonations || 0,
      description: 'Total number of donations made',
      icon: Package,
      trend: {
        value: 12,
        isPositive: true,
      },
    },
    {
      label: 'This Month',
      value: dashboardData?.metrics.monthlyDonations || 0,
      description: 'Donations made this month',
      icon: Calendar,
    },
    {
      label: 'Impact Score',
      value: dashboardData?.metrics.impactScore || 0,
      description: 'Your community impact score',
      icon: TrendingUp,
      trend: {
        value: 5,
        isPositive: true,
      },
    },
    {
      label: 'People Helped',
      value: dashboardData?.metrics.peopleHelped || 0,
      description: 'Estimated number of people helped',
      icon: Users,
    },
  ];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your donations and impact in the community.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex gap-4">
          <BaseButton
            onClick={() => navigate('/donor/donate')}
            className="flex-1"
          >
            Submit New Donation
          </BaseButton>
          <BaseButton
            variant="outline"
            onClick={() => navigate('/donor/history')}
            className="flex-1"
          >
            View Donation History
          </BaseButton>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-x-3">
              <div className="rounded-md border bg-background p-2 text-primary">
                <metric.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <h3 className="text-2xl font-semibold">{metric.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
              {metric.trend && (
                <div
                  className={`flex items-center text-sm ${
                    metric.trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {metric.trend.isPositive ? '+' : '-'}
                  {metric.trend.value}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Donations</h2>
        <div className="rounded-lg border bg-card">
          {isRecentLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading recent donations...
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="divide-y">
              {recentDonations.map((donation: RecentDonation) => {
                const StatusIcon = getStatusIcon(donation?.status);
                return (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-x-4">
                      <StatusIcon
                        className={`h-5 w-5 ${getStatusColor(donation?.status)}`}
                      />
                      <div>
                        <p className="font-medium">
                          {donation.quantity} {donation.unit} of {donation.foodType?.name || 'Unknown Food Type'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Created on {formatDate(donation.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          !donation?.status ? 'bg-yellow-100 text-yellow-800' :
                          donation.status.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status.toLowerCase() === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : donation.status.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {donation?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No recent donations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 