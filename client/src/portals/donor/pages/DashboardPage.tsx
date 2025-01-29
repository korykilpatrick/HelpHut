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
import { useDonorProfile } from '../hooks/useDonorProfile';

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

interface DonationWithStatus {
  id: string;
  foodTypeId: string;
  foodTypes: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  createdAt: string;
  tickets?: Array<{
    id: string;
    status: string;
    volunteerId: string | null;
    partnerOrgId: string | null;
  }>;
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

const formatPickupWindow = (start: string | null, end: string | null) => {
  try {
    if (!start || !end) return 'Not specified';
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid Date';
    }
    
    const formatDateTime = (date: Date) => {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
  } catch {
    return 'Not specified';
  }
};

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: donorProfile, isLoading: isDonorLoading } = useDonorProfile();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['donorDashboard', donorProfile?.id],
    queryFn: async () => {
      try {
        if (!donorProfile?.id) {
          throw new Error('No donor profile found');
        }

        const donations = await api.donations.listDonationsByDonor({
          donorId: donorProfile.id,
          limit: 0  // We only need the total count
        });
        
        // Calculate metrics from the response
        const total = donations.length;
        const thisMonth = donations.filter((d: DonationWithStatus) => {
          const date = new Date(d.createdAt);
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
    enabled: !!donorProfile?.id
  });

  // Fetch recent donations
  const { data: recentDonations, isLoading: isRecentLoading, error: recentError } = useQuery({
    queryKey: ['donations', donorProfile?.id],
    queryFn: async () => {
      if (!donorProfile?.id) {
        throw new Error('No donor profile found');
      }

      const donations = await api.donations.listDonationsByDonor({
        donorId: donorProfile.id,
        limit: 5
      });

      return donations;
    },
    enabled: !!donorProfile?.id
  });

  // Show loading state while fetching donor profile
  if (isDonorLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Show error state if donor profile is not found
  if (!donorProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-2 text-gray-600">Could not load donor profile. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show loading state while fetching data
  if (isDashboardLoading || isRecentLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Donor Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError || recentError) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Donor Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-700 font-semibold">Error Loading Dashboard</h2>
          <p className="text-red-600 mt-1">
            {(dashboardError as Error)?.message || (recentError as Error)?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          ) : recentDonations && recentDonations.length > 0 ? (
            <div className="divide-y">
              {recentDonations.map((donation: DonationWithStatus) => {
                const StatusIcon = getStatusIcon(donation?.tickets?.[0]?.status);
                return (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-x-4">
                      <StatusIcon
                        className={`h-5 w-5 ${getStatusColor(donation?.tickets?.[0]?.status)}`}
                      />
                      <div>
                        <p className="font-medium">
                          {donation.quantity} {donation.unit} of {donation.foodTypes?.name || 'Unknown Food Type'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Pickup: {formatPickupWindow(donation.pickupWindowStart, donation.pickupWindowEnd)}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          !donation?.tickets?.[0]?.status ? 'bg-yellow-100 text-yellow-800' :
                          donation.tickets[0].status.toLowerCase() === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.tickets[0].status.toLowerCase() === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : donation.tickets[0].status.toLowerCase() === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {donation?.tickets?.[0]?.status || 'Pending'}
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