import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar as CalendarIcon,
  Clock,
  Truck,
  Package,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Select } from '../../../shared/components/inputs/Select';

interface DeliverySchedule {
  id: string;
  donationId: string;
  expectedDeliveryTime: string;
  status: 'scheduled' | 'in_transit' | 'completed' | 'delayed';
  donorName: string;
  foodType: string;
  quantity: string;
  handlingInstructions?: string;
  volunteerName?: string;
  estimatedArrivalTime?: string;
}

interface DeliveryMetrics {
  todayDeliveries: number;
  weekDeliveries: number;
  delayedDeliveries: number;
  completedToday: number;
}

export function DeliverySchedulePage() {
  const [viewMode, setViewMode] = React.useState<'calendar' | 'list'>('calendar');
  const [dateFilter, setDateFilter] = React.useState('today');

  // Fetch delivery schedule
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['deliverySchedule', { dateFilter }],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          metrics: {
            todayDeliveries: 5,
            weekDeliveries: 23,
            delayedDeliveries: 1,
            completedToday: 3
          },
          deliveries: [
            {
              id: '1',
              donationId: 'DON-001',
              expectedDeliveryTime: '2024-03-25T14:30:00Z',
              status: 'scheduled',
              donorName: 'Local Market',
              foodType: 'Fresh Produce',
              quantity: '50 lbs',
              handlingInstructions: 'Keep refrigerated',
              volunteerName: 'John Doe'
            },
            {
              id: '2',
              donationId: 'DON-002',
              expectedDeliveryTime: '2024-03-25T15:00:00Z',
              status: 'in_transit',
              donorName: 'City Bakery',
              foodType: 'Baked Goods',
              quantity: '100 items',
              volunteerName: 'Jane Smith',
              estimatedArrivalTime: '2024-03-25T15:15:00Z'
            }
          ] as DeliverySchedule[]
        };
      } catch (error) {
        console.error('Error fetching delivery schedule:', error);
        throw error;
      }
    }
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadgeProps = (status: DeliverySchedule['status']) => {
    switch (status) {
      case 'scheduled':
        return {
          variant: 'default' as const,
          icon: <Clock className="h-3.5 w-3.5" />
        };
      case 'in_transit':
        return {
          variant: 'warning' as const,
          icon: <Truck className="h-3.5 w-3.5" />
        };
      case 'completed':
        return {
          variant: 'success' as const,
          icon: <CheckCircle2 className="h-3.5 w-3.5" />
        };
      case 'delayed':
        return {
          variant: 'error' as const,
          icon: <AlertCircle className="h-3.5 w-3.5" />
        };
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery Schedule</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track incoming deliveries
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <BaseCard>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {scheduleData?.metrics.todayDeliveries}
              </BaseText>
              <BaseText variant="muted">Today's Deliveries</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {scheduleData?.metrics.weekDeliveries}
              </BaseText>
              <BaseText variant="muted">This Week</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {scheduleData?.metrics.delayedDeliveries}
              </BaseText>
              <BaseText variant="muted">Delayed</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {scheduleData?.metrics.completedToday}
              </BaseText>
              <BaseText variant="muted">Completed Today</BaseText>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BaseButton
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </BaseButton>
          <BaseButton
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <Filter className="mr-2 h-4 w-4" />
            List View
          </BaseButton>
        </div>

        <Select
          label="Date Range"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'tomorrow', label: 'Tomorrow' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' }
          ]}
        />
      </div>

      {/* Delivery List (temporary until calendar view is implemented) */}
      <BaseCard>
        <div className="space-y-6">
          {scheduleData?.deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="border-b pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BaseText weight="medium">{delivery.donorName}</BaseText>
                    <BaseBadge {...getStatusBadgeProps(delivery.status)}>
                      {delivery.status.replace('_', ' ')}
                    </BaseBadge>
                  </div>
                  <BaseText variant="muted" className="mt-1">
                    Expected: {formatDateTime(delivery.expectedDeliveryTime)}
                  </BaseText>
                </div>
                <BaseButton variant="outline" size="sm">
                  View Details
                </BaseButton>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <BaseText size="sm" variant="muted">
                    Food Type
                  </BaseText>
                  <BaseText>{delivery.foodType}</BaseText>
                </div>
                <div>
                  <BaseText size="sm" variant="muted">
                    Quantity
                  </BaseText>
                  <BaseText>{delivery.quantity}</BaseText>
                </div>
                <div>
                  <BaseText size="sm" variant="muted">
                    Volunteer
                  </BaseText>
                  <BaseText>{delivery.volunteerName || 'Unassigned'}</BaseText>
                </div>
              </div>

              {delivery.handlingInstructions && (
                <div className="mt-4">
                  <BaseText size="sm" variant="muted">
                    Handling Instructions
                  </BaseText>
                  <BaseText>{delivery.handlingInstructions}</BaseText>
                </div>
              )}
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
} 
