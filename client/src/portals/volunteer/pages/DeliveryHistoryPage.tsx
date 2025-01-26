import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Truck,
  Clock,
  MapPin,
  Package,
  Filter,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Input } from '../../../shared/components/inputs/Input';
import { Select } from '../../../shared/components/inputs/Select';
import { DateRangePicker } from '../../../shared/components/inputs/DateRangePicker';

interface DeliveryRecord {
  id: string;
  date: string;
  pickupLocation: string;
  deliveryLocation: string;
  foodType: string;
  quantity: string;
  impact: {
    mealsProvided: number;
    carbonSaved: number;
  };
  rating?: {
    score: number;
    feedback?: string;
  };
}

export function DeliveryHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateRange, setDateRange] = React.useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [sortBy, setSortBy] = React.useState('newest');

  // Fetch delivery history
  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveryHistory', { dateRange, sortBy }],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return [
          {
            id: '1',
            date: '2024-01-20T14:30:00Z',
            pickupLocation: 'Central Market Downtown',
            deliveryLocation: 'Austin Food Bank',
            foodType: 'Produce',
            quantity: '50 lbs',
            impact: {
              mealsProvided: 75,
              carbonSaved: 25
            },
            rating: {
              score: 5,
              feedback: 'Great work! Very punctual and professional.'
            }
          },
          {
            id: '2',
            date: '2024-01-18T16:00:00Z',
            pickupLocation: 'Whole Foods Market',
            deliveryLocation: 'Salvation Army',
            foodType: 'Prepared Meals',
            quantity: '25 meals',
            impact: {
              mealsProvided: 25,
              carbonSaved: 15
            }
          }
        ] as DeliveryRecord[];
      } catch (error) {
        console.error('Error fetching delivery history:', error);
        throw error;
      }
    }
  });

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

  const filteredDeliveries = React.useMemo(() => {
    if (!deliveries) return [];

    let filtered = [...deliveries];

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(delivery => {
        const deliveryDate = new Date(delivery.date);
        return deliveryDate >= dateRange.start! && deliveryDate <= dateRange.end!;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(delivery => 
        delivery.pickupLocation.toLowerCase().includes(query) ||
        delivery.deliveryLocation.toLowerCase().includes(query) ||
        delivery.foodType.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortBy === 'newest' ? 
        dateB.getTime() - dateA.getTime() : 
        dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [deliveries, dateRange, searchQuery, sortBy]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery History</h1>
        <p className="mt-2 text-muted-foreground">
          View your completed food rescue deliveries and their impact
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
          <div className="w-full sm:w-72">
            <DateRangePicker
              label="Date Range"
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={setDateRange}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' }
              ]}
            />
          </div>
        </div>
      </BaseCard>

      {/* Results */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <BaseCard
            key={delivery.id}
            variant="elevated"
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <BaseBadge
                    variant="success"
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  >
                    Completed
                  </BaseBadge>
                  <BaseText size="sm" weight="medium">
                    {formatDate(delivery.date)}
                  </BaseText>
                </div>

                {/* Details */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted" truncate>
                      {delivery.pickupLocation} → {delivery.deliveryLocation}
                    </BaseText>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground/70" />
                    <BaseText size="sm" variant="muted" truncate>
                      {delivery.foodType} • {delivery.quantity}
                    </BaseText>
                  </div>
                </div>

                {/* Impact */}
                <div className="mt-3 flex flex-wrap gap-4">
                  <div>
                    <BaseText size="sm" variant="muted">
                      Meals Provided
                    </BaseText>
                    <BaseText size="lg" weight="medium">
                      {delivery.impact.mealsProvided}
                    </BaseText>
                  </div>
                  <div>
                    <BaseText size="sm" variant="muted">
                      Carbon Saved (kg)
                    </BaseText>
                    <BaseText size="lg" weight="medium">
                      {delivery.impact.carbonSaved}
                    </BaseText>
                  </div>
                </div>

                {/* Rating */}
                {delivery.rating && (
                  <div className="mt-3 border-t pt-3">
                    <BaseText size="sm" variant="muted">
                      Rating: {delivery.rating.score}/5
                    </BaseText>
                    {delivery.rating.feedback && (
                      <BaseText size="sm" variant="muted" className="mt-1">
                        "{delivery.rating.feedback}"
                      </BaseText>
                    )}
                  </div>
                )}
              </div>

              {/* Action */}
              <BaseButton
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {/* TODO: Navigate to delivery details */}}
              >
                View Details
              </BaseButton>
            </div>
          </BaseCard>
        ))}

        {/* Empty State */}
        {filteredDeliveries.length === 0 && (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <BaseText variant="muted" className="mt-4">
              No deliveries found
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