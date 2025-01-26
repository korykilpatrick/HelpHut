import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Truck,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3
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

interface ActiveDelivery {
  id: string;
  status: 'pending' | 'in_progress' | 'completed';
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  foodType: string;
  quantity: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'in_progress':
      return Truck;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'primary';
    default:
      return 'warning';
  }
};

export function DashboardPage() {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['volunteerDashboard'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          metrics: {
            totalDeliveries: 48,
            hoursVolunteered: 36,
            impactScore: 144,
            coverageAreas: 3
          },
          activeDeliveries: [
            {
              id: '1',
              status: 'in_progress',
              pickupLocation: 'Central Market Downtown',
              deliveryLocation: 'Austin Food Bank',
              pickupTime: '2024-01-25T14:30:00Z',
              foodType: 'Produce',
              quantity: '50 lbs'
            },
            {
              id: '2',
              status: 'pending',
              pickupLocation: 'Whole Foods Market',
              deliveryLocation: 'Salvation Army',
              pickupTime: '2024-01-25T16:00:00Z',
              foodType: 'Prepared Meals',
              quantity: '25 meals'
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
      label: 'Total Deliveries',
      value: dashboardData?.metrics.totalDeliveries || 0,
      description: 'Completed food rescues',
      icon: Truck
    },
    {
      label: 'Hours Volunteered',
      value: dashboardData?.metrics.hoursVolunteered || 0,
      description: 'Total time contributed',
      icon: Clock
    },
    {
      label: 'Impact Score',
      value: dashboardData?.metrics.impactScore || 0,
      description: 'People helped through your work',
      icon: BarChart3
    },
    {
      label: 'Coverage Areas',
      value: dashboardData?.metrics.coverageAreas || 0,
      description: 'Active delivery zones',
      icon: MapPin
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
        <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your deliveries and manage your schedule
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex gap-4">
        <BaseButton
          variant="default"
          size="lg"
          onClick={() => navigate('/volunteer/pickups')}
          className="flex-1"
        >
          View Available Pickups
        </BaseButton>
        <BaseButton
          variant="outline"
          size="lg"
          onClick={() => navigate('/volunteer/schedule')}
          className="flex-1"
        >
          Set Availability
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

      {/* Active Deliveries */}
      <BaseCard
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Active Deliveries</h2>
              <p className="text-sm text-muted-foreground">
                Your current and upcoming pickups
              </p>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/volunteer/active')}
            >
              View All
            </BaseButton>
          </div>
        }
      >
        <div className="divide-y">
          {dashboardData?.activeDeliveries.map((delivery) => {
            const StatusIcon = getStatusIcon(delivery.status);
            return (
              <div
                key={delivery.id}
                className="flex items-center justify-between py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <BaseBadge
                      variant={getStatusColor(delivery.status)}
                      icon={<StatusIcon className="h-3.5 w-3.5" />}
                    >
                      {delivery.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </BaseBadge>
                    <BaseText size="sm" weight="medium" truncate>
                      {delivery.pickupLocation} → {delivery.deliveryLocation}
                    </BaseText>
                  </div>
                  <div className="mt-1 flex items-center gap-4">
                    <BaseText size="sm" variant="muted">
                      {formatDate(delivery.pickupTime)}
                    </BaseText>
                    <BaseText size="sm" variant="muted">
                      {delivery.foodType} • {delivery.quantity}
                    </BaseText>
                  </div>
                </div>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/volunteer/active/${delivery.id}`)}
                >
                  View Details
                </BaseButton>
              </div>
            );
          })}
          {(!dashboardData?.activeDeliveries || dashboardData.activeDeliveries.length === 0) && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <BaseText variant="muted" className="mt-2">
                  No active deliveries
                </BaseText>
                <BaseButton
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/volunteer/pickups')}
                >
                  Find Available Pickups
                </BaseButton>
              </div>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 
