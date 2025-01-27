import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search,
  AlertCircle,
  ArrowUpDown,
  Package,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseInput from '../../../shared/components/base/BaseInput';
import { LoadingSpinner } from '../../../shared/components/base/LoadingSpinner';
import { Select } from '../../../shared/components/inputs/Select';

interface Donation {
  id: string;
  status: 'Submitted' | 'Scheduled' | 'InTransit' | 'Delivered' | 'Completed';
  foodType: string;
  quantity: number;
  unit: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  donorName?: string;
  requiresRefrigeration: boolean;
  requiresFreezing: boolean;
  isFragile: boolean;
  requiresHeavyLifting: boolean;
  notes?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return CheckCircle2;
    case 'Scheduled':
    case 'InTransit':
      return Package;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Scheduled':
    case 'InTransit':
      return 'primary';
    default:
      return 'warning';
  }
};

export function DonationRequestsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [sortField, setSortField] = React.useState<keyof Donation>('pickupWindowStart');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Fetch available donations
  const { data: availableDonations, isLoading: isAvailableLoading, error: availableError } = useQuery<Donation[]>({
    queryKey: ['availableDonations'],
    queryFn: async () => {
      const response = await api.partners.listAvailableDonations();
      return response.data;
    }
  });

  // Fetch claimed donations
  const { data: claimedDonations, isLoading: isClaimedLoading, error: claimedError } = useQuery<Donation[]>({
    queryKey: ['claimedDonations'],
    queryFn: async () => {
      const response = await api.partners.listClaimedDonations();
      return response.data;
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

  // Filter and sort donations
  const filteredDonations = React.useMemo(() => {
    let donations = statusFilter === 'claimed' ? claimedDonations || [] : availableDonations || [];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      donations = donations.filter(donation => 
        donation.foodType.toLowerCase().includes(query) ||
        donation.donorName?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    donations.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return donations;
  }, [availableDonations, claimedDonations, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: keyof Donation) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Loading state
  if (isAvailableLoading || isClaimedLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (availableError || claimedError) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <BaseText size="lg" weight="medium">Error loading donations</BaseText>
        <BaseButton variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </BaseButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Donation Requests</h1>
        <p className="mt-2 text-muted-foreground">
          View and claim available donations
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <BaseInput
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Available' },
              { value: 'claimed', label: 'Claimed' }
            ]}
          />
        </div>
      </div>

      {/* Donations List */}
      <BaseCard>
        <div className="space-y-4">
          {filteredDonations.map((donation) => {
            const StatusIcon = getStatusIcon(donation.status);
            return (
              <div
                key={donation.id}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <BaseBadge
                        variant={getStatusColor(donation.status)}
                        icon={<StatusIcon className="h-3.5 w-3.5" />}
                      >
                        {donation.status}
                      </BaseBadge>
                      <BaseText weight="medium">
                        {donation.foodType} • {donation.quantity} {donation.unit}
                      </BaseText>
                    </div>
                    <div className="mt-1 flex items-center gap-4">
                      <BaseText size="sm" variant="muted">
                        Pickup: {formatDate(donation.pickupWindowStart)}
                      </BaseText>
                      {donation.donorName && (
                        <BaseText size="sm" variant="muted">
                          From: {donation.donorName}
                        </BaseText>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusFilter === 'all' && (
                      <BaseButton
                        variant="default"
                        size="sm"
                        onClick={() => {
                          api.partners.claimDonation(donation.id);
                        }}
                      >
                        Claim Donation
                      </BaseButton>
                    )}
                    <BaseButton
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </BaseButton>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {donation.requiresRefrigeration && (
                    <BaseBadge variant="info">Requires Refrigeration</BaseBadge>
                  )}
                  {donation.requiresFreezing && (
                    <BaseBadge variant="info">Requires Freezing</BaseBadge>
                  )}
                  {donation.isFragile && (
                    <BaseBadge variant="info">Fragile</BaseBadge>
                  )}
                  {donation.requiresHeavyLifting && (
                    <BaseBadge variant="info">Heavy Lifting Required</BaseBadge>
                  )}
                </div>

                {donation.notes && (
                  <BaseText size="sm" variant="muted" className="mt-2">
                    Notes: {donation.notes}
                  </BaseText>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredDonations.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <BaseText variant="muted" className="mt-2">
                  {statusFilter === 'claimed' 
                    ? 'No claimed donations yet'
                    : 'No available donations found'
                  }
                </BaseText>
              </div>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 
