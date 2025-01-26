import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Medal,
  Star,
  Award,
  TrendingUp,
  Users,
  Truck,
  Utensils,
  Clock
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import { Select } from '../../../shared/components/inputs/Select';
import { Avatar } from '../../../shared/components/base/Avatar';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatarUrl?: string;
  stats: {
    deliveries: number;
    mealsProvided: number;
    hoursVolunteered: number;
    impactScore: number;
  };
  badges: {
    id: string;
    name: string;
    icon: 'star' | 'medal' | 'trophy' | 'award';
    color: 'gold' | 'silver' | 'bronze';
  }[];
}

const badgeIcons = {
  star: Star,
  medal: Medal,
  trophy: Trophy,
  award: Award
};

const badgeColors = {
  gold: 'text-yellow-500',
  silver: 'text-gray-400',
  bronze: 'text-amber-700'
};

export function LeaderboardPage() {
  const [timeRange, setTimeRange] = React.useState('month');
  const [category, setCategory] = React.useState('impact');

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', { timeRange, category }],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return [
          {
            id: '1',
            rank: 1,
            name: 'Sarah Johnson',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            stats: {
              deliveries: 48,
              mealsProvided: 1200,
              hoursVolunteered: 36,
              impactScore: 144
            },
            badges: [
              {
                id: '1',
                name: 'Top Contributor',
                icon: 'trophy',
                color: 'gold'
              },
              {
                id: '2',
                name: 'Food Rescue Hero',
                icon: 'medal',
                color: 'gold'
              }
            ]
          },
          {
            id: '2',
            rank: 2,
            name: 'Michael Chen',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            stats: {
              deliveries: 42,
              mealsProvided: 1050,
              hoursVolunteered: 32,
              impactScore: 126
            },
            badges: [
              {
                id: '3',
                name: 'Dedicated Volunteer',
                icon: 'medal',
                color: 'silver'
              }
            ]
          },
          {
            id: '3',
            rank: 3,
            name: 'Emily Davis',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
            stats: {
              deliveries: 36,
              mealsProvided: 900,
              hoursVolunteered: 28,
              impactScore: 108
            },
            badges: [
              {
                id: '4',
                name: 'Rising Star',
                icon: 'star',
                color: 'bronze'
              }
            ]
          }
        ] as LeaderboardEntry[];
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }
    }
  });

  const getSortValue = (entry: LeaderboardEntry) => {
    switch (category) {
      case 'deliveries':
        return entry.stats.deliveries;
      case 'meals':
        return entry.stats.mealsProvided;
      case 'hours':
        return entry.stats.hoursVolunteered;
      default:
        return entry.stats.impactScore;
    }
  };

  const getStatIcon = (category: string) => {
    switch (category) {
      case 'deliveries':
        return Truck;
      case 'meals':
        return Utensils;
      case 'hours':
        return Clock;
      default:
        return TrendingUp;
    }
  };

  const StatIcon = getStatIcon(category);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Volunteer Leaderboard</h1>
        <p className="mt-2 text-muted-foreground">
          See how your contributions compare and earn recognition
        </p>
      </div>

      {/* Filters */}
      <BaseCard className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:w-48">
            <Select
              label="Time Range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' },
                { value: 'all', label: 'All Time' }
              ]}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'impact', label: 'Impact Score' },
                { value: 'deliveries', label: 'Deliveries' },
                { value: 'meals', label: 'Meals Provided' },
                { value: 'hours', label: 'Hours Volunteered' }
              ]}
            />
          </div>
        </div>
      </BaseCard>

      {/* Leaderboard */}
      <div className="space-y-4">
        {leaderboard?.map((entry) => (
          <BaseCard
            key={entry.id}
            variant={entry.rank <= 3 ? 'elevated' : 'default'}
            className={`hover:shadow-md transition-shadow ${
              entry.rank === 1 ? 'bg-yellow-50' :
              entry.rank === 2 ? 'bg-gray-50' :
              entry.rank === 3 ? 'bg-amber-50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-none w-12 text-center">
                <BaseText
                  size="2xl"
                  weight="bold"
                  className={
                    entry.rank === 1 ? 'text-yellow-500' :
                    entry.rank === 2 ? 'text-gray-400' :
                    entry.rank === 3 ? 'text-amber-700' : ''
                  }
                >
                  #{entry.rank}
                </BaseText>
              </div>

              {/* Avatar */}
              <Avatar
                src={entry.avatarUrl}
                alt={entry.name}
                size="lg"
                fallback={entry.name.charAt(0)}
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <BaseText size="lg" weight="medium" truncate>
                  {entry.name}
                </BaseText>
                <div className="flex items-center gap-2 mt-1">
                  <StatIcon className="h-4 w-4 text-muted-foreground/70" />
                  <BaseText size="sm" variant="muted">
                    {getSortValue(entry)} {
                      category === 'impact' ? 'points' :
                      category === 'deliveries' ? 'deliveries' :
                      category === 'meals' ? 'meals' : 'hours'
                    }
                  </BaseText>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                {entry.badges.map((badge) => {
                  const BadgeIcon = badgeIcons[badge.icon];
                  return (
                    <div
                      key={badge.id}
                      className="flex items-center gap-1.5"
                      title={badge.name}
                    >
                      <BadgeIcon
                        className={`h-5 w-5 ${badgeColors[badge.color]}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </BaseCard>
        ))}

        {/* Empty State */}
        {(!leaderboard || leaderboard.length === 0) && (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <BaseText variant="muted" className="mt-4">
              No leaderboard data available
            </BaseText>
            <BaseText size="sm" variant="muted" className="mt-1">
              Complete more deliveries to appear on the leaderboard
            </BaseText>
          </div>
        )}
      </div>
    </div>
  );
} 
