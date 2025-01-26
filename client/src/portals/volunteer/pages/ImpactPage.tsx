import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Truck,
  Utensils,
  Leaf,
  Clock,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import { Select } from '../../../shared/components/inputs/Select';

interface ImpactMetrics {
  totalDeliveries: number;
  totalMealsProvided: number;
  carbonSaved: number;
  hoursVolunteered: number;
  peopleHelped: number;
  impactScore: number;
  monthlyStats: {
    month: string;
    deliveries: number;
    meals: number;
    carbon: number;
  }[];
}

export function ImpactPage() {
  const [timeRange, setTimeRange] = React.useState('all');

  // Fetch impact metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['volunteerImpact', { timeRange }],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          totalDeliveries: 48,
          totalMealsProvided: 1200,
          carbonSaved: 350,
          hoursVolunteered: 36,
          peopleHelped: 450,
          impactScore: 144,
          monthlyStats: [
            {
              month: '2024-01',
              deliveries: 12,
              meals: 300,
              carbon: 85
            },
            {
              month: '2023-12',
              deliveries: 15,
              meals: 375,
              carbon: 110
            },
            {
              month: '2023-11',
              deliveries: 21,
              meals: 525,
              carbon: 155
            }
          ]
        } as ImpactMetrics;
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
        throw error;
      }
    }
  });

  const formatMonth = (monthStr: string) => {
    return new Date(monthStr).toLocaleString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Impact</h1>
        <p className="mt-2 text-muted-foreground">
          Track your contribution to the community
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-8">
        <Select
          label="Time Range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'year', label: 'Past Year' },
            { value: '6months', label: 'Past 6 Months' },
            { value: '3months', label: 'Past 3 Months' },
            { value: 'month', label: 'This Month' }
          ]}
        />
      </div>

      {/* Impact Overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.totalDeliveries}
              </BaseText>
              <BaseText variant="muted">Total Deliveries</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Utensils className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.totalMealsProvided}
              </BaseText>
              <BaseText variant="muted">Meals Provided</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.carbonSaved}kg
              </BaseText>
              <BaseText variant="muted">Carbon Saved</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.hoursVolunteered}
              </BaseText>
              <BaseText variant="muted">Hours Volunteered</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.peopleHelped}
              </BaseText>
              <BaseText variant="muted">People Helped</BaseText>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="lg">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <BaseText size="3xl" weight="bold">
                {metrics?.impactScore}
              </BaseText>
              <BaseText variant="muted">Impact Score</BaseText>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Monthly Breakdown */}
      <BaseCard>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Monthly Breakdown</h2>
            <p className="text-sm text-muted-foreground">
              Your impact over time
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {metrics?.monthlyStats.map((stat) => (
            <div key={stat.month} className="border-b pb-6 last:border-0 last:pb-0">
              <BaseText weight="medium" className="mb-3">
                {formatMonth(stat.month)}
              </BaseText>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <BaseText size="sm" variant="muted">
                    Deliveries
                  </BaseText>
                  <BaseText size="lg" weight="medium">
                    {stat.deliveries}
                  </BaseText>
                </div>
                <div>
                  <BaseText size="sm" variant="muted">
                    Meals Provided
                  </BaseText>
                  <BaseText size="lg" weight="medium">
                    {stat.meals}
                  </BaseText>
                </div>
                <div>
                  <BaseText size="sm" variant="muted">
                    Carbon Saved
                  </BaseText>
                  <BaseText size="lg" weight="medium">
                    {stat.carbon}kg
                  </BaseText>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
} 