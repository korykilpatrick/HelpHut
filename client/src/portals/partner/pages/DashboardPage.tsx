import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Warehouse, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Bell,
  BarChart2,
  PieChart,
  LineChart,
  Box
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';

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

interface DonationRequest {
  id: string;
  status: 'pending' | 'approved' | 'completed';
  foodType: string;
  quantity: string;
  requestedDate: string;
  donorName?: string;
}

interface AnalyticData {
  foodDistribution: {
    labels: string[];
    data: number[];
  };
  topRequests: {
    item: string;
    count: number;
  }[];
  donorStats: {
    donor: string;
    contributions: number;
  }[];
  impactMetrics: {
    metric: string;
    value: number;
    change: number;
  }[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'approved':
      return Package;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'approved':
      return 'primary';
    default:
      return 'warning';
  }
};

export function DashboardPage() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['partnerDashboard'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          metrics: {
            activeRequests: 5,
            inventoryItems: 128,
            upcomingDeliveries: 3,
            impactScore: 92
          },
          recentRequests: [
            {
              id: '1',
              status: 'approved',
              foodType: 'Produce',
              quantity: '50 lbs',
              requestedDate: '2024-01-25T14:30:00Z',
              donorName: 'Local Market'
            },
            {
              id: '2',
              status: 'pending',
              foodType: 'Prepared Meals',
              quantity: '25 meals',
              requestedDate: '2024-01-25T16:00:00Z'
            }
          ],
          analytics: {
            foodDistribution: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              data: [1200, 1900, 1500, 1800, 2200, 2400]
            },
            topRequests: [
              { item: 'Fresh Produce', count: 45 },
              { item: 'Canned Goods', count: 32 },
              { item: 'Dairy Products', count: 28 },
              { item: 'Bread', count: 25 }
            ],
            donorStats: [
              { donor: 'Local Market', contributions: 1200 },
              { donor: 'City Bakery', contributions: 800 },
              { donor: 'Fresh Foods', contributions: 600 }
            ],
            impactMetrics: [
              { metric: 'Meals Provided', value: 12500, change: 15 },
              { metric: 'Families Served', value: 450, change: 8 },
              { metric: 'Food Waste Reduced', value: 2800, change: 12 }
            ]
          }
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
  });

  const metrics: DashboardMetric[] = [
    {
      label: 'Available Donations',
      value: dashboardData?.metrics.activeRequests || 0,
      description: 'Unclaimed donations',
      icon: Package
    },
    {
      label: 'Inventory Items',
      value: dashboardData?.metrics.inventoryItems || 0,
      description: 'Current stock items',
      icon: Warehouse
    },
    {
      label: 'Upcoming Deliveries',
      value: dashboardData?.metrics.upcomingDeliveries || 0,
      description: 'Scheduled deliveries',
      icon: Calendar
    },
    {
      label: 'Impact Score',
      value: dashboardData?.metrics.impactScore || 0,
      description: 'Community impact rating',
      icon: TrendingUp
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
        <p className="mt-2 text-gray-600">
          View available donations and manage deliveries
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <BaseButton 
          className="w-full py-3 text-center flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          onClick={() => navigate('/partner/available-donations')}
        >
          <Box className="h-5 w-5" />
          View Available Donations
        </BaseButton>
        <BaseButton 
          className="w-full py-3 text-center flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-colors"
          onClick={() => navigate('/partner/inventory')}
        >
          <Warehouse className="h-5 w-5" />
          Update Inventory
        </BaseButton>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Available Donations</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">5</BaseText>
                <BaseText size="sm" className="text-gray-500">items</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Unclaimed donations</BaseText>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Box className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Inventory Items</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">128</BaseText>
                <BaseText size="sm" className="text-gray-500">items</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Current stock items</BaseText>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <Warehouse className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Upcoming Deliveries</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">3</BaseText>
                <BaseText size="sm" className="text-gray-500">scheduled</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Scheduled deliveries</BaseText>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard className="p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <BaseText size="sm" className="text-gray-500 mb-1">Impact Score</BaseText>
              <div className="flex items-baseline gap-1">
                <BaseText size="3xl" weight="bold" className="text-gray-900">92</BaseText>
                <BaseText size="sm" className="text-gray-500">points</BaseText>
              </div>
              <BaseText size="xs" className="text-gray-500 mt-1">Community impact rating</BaseText>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Analytics Section */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Analytics & Insights</h2>
          <p className="text-gray-600">Track your impact and optimize operations</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Food Distribution Trends */}
          <BaseCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Food Distribution</h3>
                <p className="text-sm text-gray-600">Monthly distribution trends</p>
              </div>
              <div className="rounded-full bg-blue-100 p-2">
                <LineChart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="h-64 w-full">
              {/* TODO: Add actual chart component */}
              <div className="flex h-full items-center justify-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                Chart placeholder: Line chart showing distribution over time
              </div>
            </div>
          </BaseCard>

          {/* Most Needed Items */}
          <BaseCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Most Needed Items</h3>
                <p className="text-sm text-gray-600">Popular items this month</p>
              </div>
              <div className="rounded-full bg-green-100 p-2">
                <PieChart className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <BaseText className="text-gray-900 font-medium">Fresh Produce</BaseText>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: '100%' }}
                    />
                  </div>
                  <BaseText className="text-gray-600 min-w-[2rem] text-right">45</BaseText>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <BaseText className="text-gray-900 font-medium">Canned Goods</BaseText>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: '71%' }}
                    />
                  </div>
                  <BaseText className="text-gray-600 min-w-[2rem] text-right">32</BaseText>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <BaseText className="text-gray-900 font-medium">Dairy Products</BaseText>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: '62%' }}
                    />
                  </div>
                  <BaseText className="text-gray-600 min-w-[2rem] text-right">28</BaseText>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <BaseText className="text-gray-900 font-medium">Bread</BaseText>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: '56%' }}
                    />
                  </div>
                  <BaseText className="text-gray-600 min-w-[2rem] text-right">25</BaseText>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>

      {/* Recent Donations */}
      <BaseCard
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Donations</h2>
              <p className="text-sm text-muted-foreground">
                Your latest claimed donations
              </p>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/partner/available-donations')}
            >
              View All
            </BaseButton>
          </div>
        }
      >
        <div className="divide-y">
          {dashboardData?.recentRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.status);
            return (
              <div
                key={request.id}
                className="flex items-center justify-between py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <BaseBadge
                      variant={getStatusColor(request.status)}
                      icon={<StatusIcon className="h-3.5 w-3.5" />}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </BaseBadge>
                    <BaseText size="sm" weight="medium" truncate>
                      {request.foodType} • {request.quantity}
                    </BaseText>
                  </div>
                  <div className="mt-1 flex items-center gap-4">
                    <BaseText size="sm" variant="muted">
                      {formatDate(request.requestedDate)}
                    </BaseText>
                    {request.donorName && (
                      <BaseText size="sm" variant="muted">
                        From: {request.donorName}
                      </BaseText>
                    )}
                  </div>
                </div>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/partner/requests/${request.id}`)}
                >
                  View Details
                </BaseButton>
              </div>
            );
          })}

          {(!dashboardData?.recentRequests || dashboardData.recentRequests.length === 0) && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <BaseText variant="muted" className="mt-2">
                  No recent requests
                </BaseText>
                <BaseButton
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/partner/requests')}
                >
                  Create New Request
                </BaseButton>
              </div>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 
