import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/core/api';
import { Input } from '@/shared/components/inputs/Input';
import { Select } from '@/shared/components/inputs/Select';
import { Button } from '@/shared/components/buttons/Button';
import { toast } from '@/shared/components/toast';

type TicketStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

interface Donation {
  id: string;
  foodTypeId: string;
  quantity: number;
  unit: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  donorId: string;
  createdAt: string;
  updatedAt: string;
  requiresRefrigeration?: boolean;
  requiresFreezing?: boolean;
  isFragile?: boolean;
  requiresHeavyLifting?: boolean;
  notes?: string;
  ticket?: {
    status: TicketStatus;
  };
}

interface StatusOption {
  value: string;
  label: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions: StatusOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const getStatusStyles = (status: TicketStatus) => {
  switch (status) {
    case 'completed':
      return {
        row: 'hover:bg-green-50',
        badge: 'bg-green-100 text-green-800'
      };
    case 'cancelled':
      return {
        row: 'hover:bg-red-50',
        badge: 'bg-red-100 text-red-800'
      };
    case 'in_progress':
      return {
        row: 'hover:bg-blue-50',
        badge: 'bg-blue-100 text-blue-800'
      };
    case 'accepted':
      return {
        row: 'hover:bg-yellow-50',
        badge: 'bg-yellow-100 text-yellow-800'
      };
    default:
      return {
        row: 'hover:bg-gray-50',
        badge: 'bg-gray-100 text-gray-800'
      };
  }
};

export function DonationListView() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateRange, setDateRange] = React.useState({
    start: '',
    end: '',
  });

  // Fetch food types
  const { data: foodTypesData } = useQuery({
    queryKey: ['foodTypes'],
    queryFn: async () => {
      const response = await api.foodTypes.list();
      return response.data.foodTypes;
    },
  });

  // Create food type map for quick lookups
  const foodTypeMap = React.useMemo(() => {
    if (!foodTypesData) return {};
    return foodTypesData.reduce((acc: Record<string, string>, foodType: any) => {
      acc[foodType.id] = foodType.name;
      return acc;
    }, {});
  }, [foodTypesData]);

  // Format date helper
  const formatDate = (dateStr: string | { value?: string } | null) => {
    try {
      // If it's null or undefined, return placeholder
      if (!dateStr) {
        return 'Not specified';
      }

      // If it's an empty object, return placeholder
      if (typeof dateStr === 'object' && Object.keys(dateStr).length === 0) {
        return 'Not specified';
      }

      // Handle string dates
      const dateValue = typeof dateStr === 'string' ? dateStr : null;
      if (dateValue) {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      
      return 'Invalid Date';
    } catch {
      return 'Invalid Date';
    }
  };

  // Debounce search query
  const debouncedSearchQuery = React.useMemo(() => {
    const timeoutId = setTimeout(() => searchQuery, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch donations with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['donations', page, status, debouncedSearchQuery, dateRange],
    queryFn: async () => {
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const params = {
          limit: ITEMS_PER_PAGE,
          offset,
          status: status === 'all' ? undefined : status,
          search: searchQuery || undefined,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        };

        const response = await api.donations.getDonations(params);
        
        console.log('API response:', response);

        // Validate response structure
        if (!response?.data?.donations?.donations || !Array.isArray(response.data.donations.donations)) {
          throw new Error('Invalid response format from server');
        }

        return {
          donations: response.data.donations.donations,
          total: response.data.donations.total || response.data.donations.donations.length,
        };
      } catch (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Handle error state
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load donations. Please try again.');
    }
  }, [error]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [status, searchQuery, dateRange]);

  const handleRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Failed to load donations</p>
        <Button
          variant="secondary"
          onClick={handleRetry}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      {/* Donations Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Food Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup Window
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="animate-spin h-5 w-5 mx-auto border-2 border-blue-500 rounded-full border-t-transparent" />
                </td>
              </tr>
            ) : data?.donations?.length ? (
              data.donations.map((donation: Donation) => {
                const statusStyles = getStatusStyles(donation.ticket?.status || 'pending');
                return (
                  <tr key={donation.id} className={`${statusStyles.row} transition-colors duration-150`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {foodTypeMap[donation.foodTypeId] || 'Unknown Food Type'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.quantity} {donation.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(donation.pickupWindowStart)} - {formatDate(donation.pickupWindowEnd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles.badge}`}>
                        {(donation.ticket?.status || 'pending').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {/* TODO: View details */}}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No donations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage(p => p + 1)}
            disabled={!data?.donations?.length || data.donations.length < ITEMS_PER_PAGE || isLoading}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <Button
                variant="secondary"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => setPage(p => p + 1)}
                disabled={!data?.donations?.length || data.donations.length < ITEMS_PER_PAGE || isLoading}
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 
