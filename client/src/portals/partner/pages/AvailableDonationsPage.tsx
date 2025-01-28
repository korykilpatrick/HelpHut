import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search,
  AlertCircle,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  Package
} from 'lucide-react';
import { api } from '../../../core/api';
import BaseCard from '../../../shared/components/base/BaseCard';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import BaseText from '../../../shared/components/base/BaseText';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseInput from '../../../shared/components/base/BaseInput';

interface DonationRequest {
  id: string;
  foodType: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  urgency: 'low' | 'medium' | 'high';
  requestedDate: string;
  donorName?: string;
  notes?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'rejected':
      return XCircle;
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
    case 'rejected':
      return 'error';
    default:
      return 'warning';
  }
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function AvailableDonationsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<keyof DonationRequest>('requestedDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Fetch available donations data
  const { data: donationsData, isLoading } = useQuery({
    queryKey: ['availableDonations'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call to /partners/donations/available
        return {
          donations: [
            {
              id: '1',
              foodType: 'Fresh Produce',
              quantity: 100,
              unit: 'lbs',
              status: 'pending',
              urgency: 'high',
              requestedDate: '2024-01-25T14:30:00Z',
              notes: 'Fresh vegetables and fruits available'
            },
            {
              id: '2',
              foodType: 'Canned Goods',
              quantity: 200,
              unit: 'items',
              status: 'pending',
              urgency: 'medium',
              requestedDate: '2024-01-24T10:00:00Z',
              donorName: 'Local Market',
              notes: 'Non-perishable items available'
            },
            {
              id: '3',
              foodType: 'Bread',
              quantity: 50,
              unit: 'loaves',
              status: 'pending',
              urgency: 'low',
              requestedDate: '2024-01-23T09:00:00Z',
              donorName: 'City Bakery',
              notes: 'Fresh bread available for pickup'
            }
          ] as DonationRequest[]
        };
      } catch (error) {
        console.error('Error fetching available donations:', error);
        throw error;
      }
    }
  });

  const sortedAndFilteredDonations = React.useMemo(() => {
    let donations = [...(donationsData?.donations || [])];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      donations = donations.filter(donation => 
        donation.foodType.toLowerCase().includes(query) ||
        donation.notes?.toLowerCase().includes(query) ||
        donation.donorName?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    donations.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return donations;
  }, [donationsData?.donations, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof DonationRequest) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Donations</h1>
        <p className="mt-2 text-muted-foreground">
          View and claim available food donations
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
                  onClick={() => handleSort('foodType')}
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
                  onClick={() => handleSort('urgency')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Urgency</span>
                    <ArrowUpDown className="h-4 w-4" />
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
                  onClick={() => handleSort('requestedDate')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Available Since</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedAndFilteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <BaseText>{donation.foodType}</BaseText>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <BaseText>{donation.quantity} {donation.unit}</BaseText>
                  </td>
                  <td className="px-4 py-4">
                    <BaseBadge variant={getUrgencyColor(donation.urgency)}>
                      {donation.urgency.charAt(0).toUpperCase() + donation.urgency.slice(1)}
                    </BaseBadge>
                  </td>
                  <td className="px-4 py-4">
                    <BaseText>{donation.donorName || 'Anonymous'}</BaseText>
                  </td>
                  <td className="px-4 py-4">
                    <BaseText>{formatDate(donation.requestedDate)}</BaseText>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <BaseButton
                      variant="default"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement claim functionality
                        console.log('Claim donation:', donation.id);
                      }}
                    >
                      Claim
                    </BaseButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedAndFilteredDonations.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <BaseText variant="muted" className="mt-2">
                No available donations found
              </BaseText>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 