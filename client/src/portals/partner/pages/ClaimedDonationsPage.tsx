import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search,
  AlertCircle,
  ArrowUpDown,
  Package,
  Clock,
  User
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseInput from '../../../shared/components/base/BaseInput';
import { BaseButton } from '../../../shared/components/base/BaseButton';

function formatDate(dateString: string | Date) {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'default';
    case 'assigned':
      return 'info';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}

export function ClaimedDonationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<string>('pickupWindowStart');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Fetch claimed donations
  const { data: donationsData, isLoading, error } = useQuery({
    queryKey: ['claimedDonations'],
    queryFn: async () => {
      console.log('📡 Fetching claimed donations...');
      try {
        const donations = await api.partners.listClaimedDonations();
        console.log('✅ Claimed donations:', donations);
        return { donations };
      } catch (err) {
        console.error('❌ Error fetching claimed donations:', err);
        throw err;
      }
    }
  });

  const sortedAndFilteredDonations = React.useMemo(() => {
    console.log('🔄 Recalculating sorted and filtered donations');
    
    let donations = [...(donationsData?.donations || [])];
    
    // Apply search filter
    if (searchQuery) {
      console.log('🔍 Applying search filter:', searchQuery);
      const query = searchQuery.toLowerCase();
      donations = donations.filter(donation => 
        donation.foodTypeName.toLowerCase().includes(query) ||
        donation.donorName.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    console.log('📊 Applying sort:', { field: sortField, direction: sortDirection });
    donations.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return donations;
  }, [donationsData?.donations, searchQuery, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <BaseCard>
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-error" />
            <BaseText variant="error" className="mt-2">
              Error loading claimed donations. Please try again later.
            </BaseText>
          </div>
        </BaseCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Claimed Donations</h1>
        <p className="mt-2 text-muted-foreground">
          Track your claimed donations and their delivery status
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <BaseInput
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <BaseCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('foodTypeName')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Food Type</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Quantity</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('donorName')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Donor</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('pickupWindowStart')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Pickup Window</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span>Volunteer</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
                      <BaseText variant="muted" className="mt-2">
                        Loading claimed donations...
                      </BaseText>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredDonations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{donation.foodTypeName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {donation.quantity} {donation.unit}
                    </td>
                    <td className="px-4 py-4">
                      <BaseBadge variant={getStatusColor(donation.ticket.status)}>
                        {donation.ticket.status.toUpperCase()}
                      </BaseBadge>
                    </td>
                    <td className="px-4 py-4">
                      {donation.donorName}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span>Start: {formatDate(donation.pickupWindowStart)}</span>
                        <span className="text-sm text-muted-foreground">
                          End: {formatDate(donation.pickupWindowEnd)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {donation.ticket.volunteerId ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{donation.ticket.volunteerName}</span>
                        </div>
                      ) : (
                        <BaseText variant="muted" size="sm">Not assigned</BaseText>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <BaseButton
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </BaseButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && sortedAndFilteredDonations.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <BaseText variant="muted" className="mt-2">
                No claimed donations found
              </BaseText>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 