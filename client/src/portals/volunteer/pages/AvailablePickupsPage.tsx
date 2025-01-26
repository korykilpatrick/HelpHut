import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin,
  Clock,
  Package,
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Input } from '../../../shared/components/inputs/Input';
import { Select } from '../../../shared/components/inputs/Select';
import { toast } from '../../../shared/components/toast';

interface AvailablePickup {
  id: string;
  donorName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  foodType: string;
  quantity: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
  requirements: {
    refrigeration: boolean;
    freezing: boolean;
    heavyLifting: boolean;
  };
}

const urgencyColors = {
  low: 'default',
  medium: 'warning',
  high: 'error'
} as const;

const urgencyLabels = {
  low: 'Standard',
  medium: 'Time-Sensitive',
  high: 'Urgent'
} as const;

export function AvailablePickupsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [urgencyFilter, setUrgencyFilter] = React.useState('all');
  const [distanceSort, setDistanceSort] = React.useState('nearest');

  // Fetch available pickups
  const { data: pickups, isLoading } = useQuery({
    queryKey: ['availablePickups', { urgencyFilter, distanceSort }],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return [
          {
            id: '1',
            donorName: 'Central Market Downtown',
            pickupLocation: '4001 N Lamar Blvd, Austin, TX',
            deliveryLocation: 'Austin Food Bank',
            pickupWindow: {
              start: '2024-01-25T14:30:00Z',
              end: '2024-01-25T15:30:00Z'
            },
            foodType: 'Produce',
            quantity: '50 lbs',
            distance: 2.4,
            urgency: 'high',
            requirements: {
              refrigeration: true,
              freezing: false,
              heavyLifting: false
            }
          },
          {
            id: '2',
            donorName: 'Whole Foods Market',
            pickupLocation: '525 N Lamar Blvd, Austin, TX',
            deliveryLocation: 'Salvation Army',
            pickupWindow: {
              start: '2024-01-25T16:00:00Z',
              end: '2024-01-25T17:00:00Z'
            },
            foodType: 'Prepared Meals',
            quantity: '25 meals',
            distance: 3.1,
            urgency: 'medium',
            requirements: {
              refrigeration: true,
              freezing: false,
              heavyLifting: false
            }
          }
        ] as AvailablePickup[];
      } catch (error) {
        console.error('Error fetching available pickups:', error);
        throw error;
      }
    }
  });

  // Claim pickup mutation
  const claimMutation = useMutation({
    mutationFn: async (pickupId: string) => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availablePickups'] });
      toast.success('Pickup claimed successfully!');
    },
    onError: (error: any) => {
      console.error('Error claiming pickup:', error);
      toast.error('Failed to claim pickup. Please try again.');
    }
  });

  const formatTimeWindow = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return `${startDate.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${endDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`;
  };

  const filteredPickups = React.useMemo(() => {
    if (!pickups) return [];

    let filtered = [...pickups];

    // Apply urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(p => p.urgency === urgencyFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.donorName.toLowerCase().includes(query) ||
        p.pickupLocation.toLowerCase().includes(query) ||
        p.deliveryLocation.toLowerCase().includes(query) ||
        p.foodType.toLowerCase().includes(query)
      );
    }

    // Apply distance sort
    filtered.sort((a, b) => {
      if (distanceSort === 'nearest') {
        return a.distance - b.distance;
      } else {
        return b.distance - a.distance;
      }
    });

    return filtered;
  }, [pickups, urgencyFilter, searchQuery, distanceSort]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Pickups</h1>
        <p className="mt-2 text-muted-foreground">
          Find and claim food rescue assignments in your area
        </p>
      </div>

      {/* Filters */}
      <BaseCard className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, food type..."
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Urgency"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Urgency' },
                { value: 'high', label: 'Urgent Only' },
                { value: 'medium', label: 'Time-Sensitive' },
                { value: 'low', label: 'Standard' }
              ]}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Sort By Distance"
              value={distanceSort}
              onChange={(e) => setDistanceSort(e.target.value)}
              options={[
                { value: 'nearest', label: 'Nearest First' },
                { value: 'farthest', label: 'Farthest First' }
              ]}
            />
          </div>
        </div>
      </BaseCard>

      {/* Results */}
      <div className="space-y-4">
        {filteredPickups.map((pickup) => (
          <BaseCard
            key={pickup.id}
            variant="elevated"
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge
                    variant={urgencyColors[pickup.urgency]}
                    icon={<AlertCircle className="h-3.5 w-3.5" />}
                  >
                    {urgencyLabels[pickup.urgency]}
                  </BaseBadge>
                  <BaseText size="sm" weight="medium" truncate>
                    {pickup.donorName}
                  </BaseText>
                </div>

                {/* Details */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted" truncate>
                      {pickup.distance} miles away
                    </BaseText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted" truncate>
                      {formatTimeWindow(pickup.pickupWindow.start, pickup.pickupWindow.end)}
                    </BaseText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted" truncate>
                      {pickup.foodType} • {pickup.quantity}
                    </BaseText>
                  </div>
                </div>

                {/* Requirements */}
                {(pickup.requirements.refrigeration || 
                  pickup.requirements.freezing || 
                  pickup.requirements.heavyLifting) && (
                  <div className="mt-3 flex gap-2">
                    {pickup.requirements.refrigeration && (
                      <BaseBadge variant="info" size="sm">
                        Refrigeration
                      </BaseBadge>
                    )}
                    {pickup.requirements.freezing && (
                      <BaseBadge variant="info" size="sm">
                        Freezing
                      </BaseBadge>
                    )}
                    {pickup.requirements.heavyLifting && (
                      <BaseBadge variant="info" size="sm">
                        Heavy Lifting
                      </BaseBadge>
                    )}
                  </div>
                )}
              </div>

              {/* Action */}
              <BaseButton
                variant="default"
                size="lg"
                className="shrink-0"
                onClick={() => claimMutation.mutate(pickup.id)}
                disabled={claimMutation.isPending}
              >
                Claim Pickup
                <ChevronRight className="ml-2 h-4 w-4" />
              </BaseButton>
            </div>
          </BaseCard>
        ))}

        {/* Empty State */}
        {filteredPickups.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <BaseText variant="muted" className="mt-4">
              No available pickups found
            </BaseText>
            <BaseText size="sm" variant="muted" className="mt-1">
              Try adjusting your filters or check back later
            </BaseText>
          </div>
        )}
      </div>
    </div>
  );
} 