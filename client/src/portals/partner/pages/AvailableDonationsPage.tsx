import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { toast } from '../../../shared/components/toast';

// Define the base donation type
interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  foodTypeId: string;
  foodTypeName: string;
  quantity: number;
  unit: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  notes?: string;
}

interface DonationWithUrgency extends Donation {
  urgency: 'low' | 'medium' | 'high';
}

type SortableFields = keyof Pick<DonationWithUrgency, 'pickupWindowStart' | 'foodTypeName' | 'quantity' | 'urgency' | 'donorName'>;

function getUrgencyFromDates(start: Date, end: Date): 'low' | 'medium' | 'high' {
  const now = new Date();
  const hoursUntilEnd = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (hoursUntilEnd <= 4) return 'high';
  if (hoursUntilEnd <= 12) return 'medium';
  return 'low';
}

function getUrgencyColor(urgency: 'low' | 'medium' | 'high'): 'success' | 'warning' | 'error' {
  switch (urgency) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
  }
}

function formatPickupWindow(start: string | null, end: string | null) {
  console.log('📅 [formatPickupWindow] Input:', { start, end });
  
  try {
    // Handle empty or invalid inputs
    if (!start || !end) {
      console.log('❌ [formatPickupWindow] Empty input:', { start, end });
      return 'Pickup window not set';
    }

    // Parse the ISO date strings
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    console.log('📅 [formatPickupWindow] Parsed dates:', {
      startDate: {
        value: startDate,
        isValid: !isNaN(startDate.getTime()),
        timestamp: startDate.getTime(),
        toString: startDate.toString(),
        toISOString: startDate.toISOString()
      },
      endDate: {
        value: endDate,
        isValid: !isNaN(endDate.getTime()),
        timestamp: endDate.getTime(),
        toString: endDate.toString(),
        toISOString: endDate.toISOString()
      }
    });
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('❌ [formatPickupWindow] Invalid date detected:', {
        start: {
          input: start,
          parsed: startDate,
          timestamp: startDate.getTime(),
          isValid: !isNaN(startDate.getTime())
        },
        end: {
          input: end,
          parsed: endDate,
          timestamp: endDate.getTime(),
          isValid: !isNaN(endDate.getTime())
        }
      });
      return 'Invalid date format';
    }
    
    const formatDateTime = (date: Date) => {
      const formatted = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      console.log('📅 [formatPickupWindow] Formatted datetime:', { 
        input: date.toString(),
        formatted,
        timestamp: date.getTime(),
        iso: date.toISOString()
      });
      return formatted;
    };

    const result = `${formatDateTime(startDate)} - ${formatDateTime(endDate)}`;
    console.log('✨ [formatPickupWindow] Final formatted result:', result);
    return result;
  } catch (error) {
    console.error('❌ [formatPickupWindow] Error:', error, { start, end });
    return 'Error formatting dates';
  }
}

export function AvailableDonationsPage() {
  console.log('🔄 AvailableDonationsPage rendering');
  
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<SortableFields>('pickupWindowStart');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  // Fetch available donations data
  const { data: donationsData, isLoading, error } = useQuery({
    queryKey: ['availableDonations'],
    queryFn: async () => {
      console.log('📡 [AvailableDonationsPage] Fetching available donations...');
      try {
        const donations = await api.partners.listAvailableDonations();
        console.log('🔍 [AvailableDonationsPage] Raw API response:', {
          type: typeof donations,
          isArray: Array.isArray(donations),
          length: donations.length,
          firstItem: donations[0]
        });
        
        console.log('🔄 [AvailableDonationsPage] Donation dates from API:', donations.map(d => ({
          id: d.id,
          pickupWindowStart: {
            value: d.pickupWindowStart,
            type: typeof d.pickupWindowStart,
            constructor: d.pickupWindowStart?.constructor?.name
          },
          pickupWindowEnd: {
            value: d.pickupWindowEnd,
            type: typeof d.pickupWindowEnd,
            constructor: d.pickupWindowEnd?.constructor?.name
          }
        })));

        const mappedDonations = donations.map((donation: Donation) => {
          console.log('🔍 Processing single donation:', {
            id: donation.id,
            dates: {
              pickupWindowStart: donation.pickupWindowStart,
              pickupWindowEnd: donation.pickupWindowEnd,
              startType: typeof donation.pickupWindowStart,
              endType: typeof donation.pickupWindowEnd,
              startKeys: typeof donation.pickupWindowStart === 'object' ? Object.keys(donation.pickupWindowStart) : [],
              endKeys: typeof donation.pickupWindowEnd === 'object' ? Object.keys(donation.pickupWindowEnd) : []
            }
          });

          // Add debug check for empty object
          const isEmptyObject = (obj: any) => {
            console.log('🔍 Checking if empty object:', {
              value: obj,
              type: typeof obj,
              keys: typeof obj === 'object' && obj !== null ? Object.keys(obj) : [],
              prototype: typeof obj === 'object' && obj !== null ? Object.getPrototypeOf(obj) : null
            });
            return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
          };

          console.log('🔍 Empty object check:', {
            startIsEmpty: isEmptyObject(donation.pickupWindowStart),
            endIsEmpty: isEmptyObject(donation.pickupWindowEnd)
          });

          const urgency = getUrgencyFromDates(
            new Date(donation.pickupWindowStart as string), 
            new Date(donation.pickupWindowEnd as string)
          );
          
          return {
            ...donation,
            urgency
          };
        }) as DonationWithUrgency[];

        console.log('✨ Final mapped donations:', mappedDonations);
        return { donations: mappedDonations };
      } catch (err) {
        console.error('❌ [AvailableDonationsPage] Error fetching donations:', err);
        throw err;
      }
    }
  });

  // Claim donation mutation
  const claimDonationMutation = useMutation({
    mutationFn: async (donationId: string) => {
      console.log('🎯 Attempting to claim donation:', donationId);
      try {
        const response = await api.partners.claimDonation(donationId);
        console.log('✅ Successfully claimed donation:', response);
        return response;
      } catch (err) {
        console.error('❌ Error claiming donation:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log('🔄 Claim successful, invalidating queries...');
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['availableDonations'] });
    },
    onError: (error) => {
      console.error('❌ Claim mutation error:', error);
      toast.error("Failed to claim donation. Please try again.");
    }
  });

  const sortedAndFilteredDonations = React.useMemo(() => {
    console.log('🔄 Recalculating sorted and filtered donations');
    console.log('Current state:', {
      searchQuery,
      sortField,
      sortDirection,
      donationsCount: donationsData?.donations?.length
    });

    let donations = [...(donationsData?.donations || [])];
    
    // Apply search filter
    if (searchQuery) {
      console.log('🔍 Applying search filter:', searchQuery);
      const query = searchQuery.toLowerCase();
      donations = donations.filter(donation => {
        const matches = donation.foodTypeName.toLowerCase().includes(query) ||
          donation.donorName.toLowerCase().includes(query) ||
          donation.notes?.toLowerCase().includes(query);
        if (matches) {
          console.log('✅ Donation matches search:', donation.id);
        }
        return matches;
      });
      console.log('🔍 After search filter:', donations.length, 'donations');
    }

    // Apply sorting
    console.log('📊 Applying sort:', { field: sortField, direction: sortDirection });
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

    console.log('📊 After sorting:', donations.map(d => ({
      id: d.id,
      [sortField]: d[sortField]
    })));

    return donations;
  }, [donationsData?.donations, searchQuery, sortField, sortDirection]);

  // Log component state on each render
  React.useEffect(() => {
    console.log('📊 Component State:', {
      isLoading,
      hasError: !!error,
      donationsCount: donationsData?.donations?.length,
      filteredCount: sortedAndFilteredDonations.length,
      searchQuery,
      sortField,
      sortDirection
    });
  });

  const handleSort = (field: SortableFields) => {
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
              Error loading available donations. Please try again later.
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
                  onClick={() => handleSort('pickupWindowStart')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Pickup Window</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
                      <BaseText variant="muted" className="mt-2">
                        Loading available donations...
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
                      <BaseBadge variant={getUrgencyColor(donation.urgency)}>
                        {donation.urgency.toUpperCase()}
                      </BaseBadge>
                    </td>
                    <td className="px-4 py-4">
                      {donation.donorName}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        {formatPickupWindow(donation.pickupWindowStart, donation.pickupWindowEnd)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <BaseButton
                        variant="default"
                        size="sm"
                        onClick={() => claimDonationMutation.mutate(donation.id)}
                        disabled={claimDonationMutation.isPending}
                      >
                        {claimDonationMutation.isPending ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Claiming...
                          </>
                        ) : (
                          'Claim'
                        )}
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
                No available donations found
              </BaseText>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 