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
  Clock
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
          ]
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
  });

  const metrics: DashboardMetric[] = [
    {
      label: 'Active Requests',
      value: dashboardData?.metrics.activeRequests || 0,
      description: 'Pending donation requests',
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
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Partner Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your donation requests and inventory
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex gap-4">
        <BaseButton
          variant="default"
          size="lg"
          onClick={() => navigate('/partner/requests')}
          className="flex-1"
        >
          Create New Request
        </BaseButton>
        <BaseButton
          variant="outline"
          size="lg"
          onClick={() => navigate('/partner/inventory')}
          className="flex-1"
        >
          Update Inventory
        </BaseButton>
      </div>

      {/* Metrics Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <BaseCard
              key={metric.label}
              variant="elevated"
              padding="lg"
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <BaseText size="3xl" weight="bold">
                {metric.value}
              </BaseText>
              <BaseText variant="muted" size="sm" className="mt-1">
                {metric.label}
              </BaseText>
              <BaseText variant="muted" size="xs" className="mt-0.5">
                {metric.description}
              </BaseText>
            </BaseCard>
          );
        })}
      </div>

      {/* Recent Requests */}
      <BaseCard
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Requests</h2>
              <p className="text-sm text-muted-foreground">
                Your latest donation requests
              </p>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/partner/requests')}
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
