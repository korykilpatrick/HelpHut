import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus,
  Search,
  AlertCircle,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle
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

export function RequestsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortField, setSortField] = React.useState<keyof DonationRequest>('requestedDate');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  // Fetch requests data
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['partnerRequests'],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        return {
          requests: [
            {
              id: '1',
              foodType: 'Fresh Produce',
              quantity: 100,
              unit: 'lbs',
              status: 'pending',
              urgency: 'high',
              requestedDate: '2024-01-25T14:30:00Z',
              notes: 'Need fresh vegetables and fruits for community meal'
            },
            {
              id: '2',
              foodType: 'Canned Goods',
              quantity: 200,
              unit: 'items',
              status: 'approved',
              urgency: 'medium',
              requestedDate: '2024-01-24T10:00:00Z',
              donorName: 'Local Market',
              notes: 'Non-perishable items for food bank'
            },
            {
              id: '3',
              foodType: 'Bread',
              quantity: 50,
              unit: 'loaves',
              status: 'completed',
              urgency: 'low',
              requestedDate: '2024-01-23T09:00:00Z',
              donorName: 'City Bakery',
              notes: 'Weekly bread donation'
            }
          ] as DonationRequest[]
        };
      } catch (error) {
        console.error('Error fetching requests data:', error);
        throw error;
      }
    }
  });

  const sortedAndFilteredRequests = React.useMemo(() => {
    let requests = [...(requestsData?.requests || [])];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      requests = requests.filter(request => 
        request.foodType.toLowerCase().includes(query) ||
        request.notes?.toLowerCase().includes(query) ||
        request.donorName?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    requests.sort((a, b) => {
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

    return requests;
  }, [requestsData?.requests, searchQuery, sortField, sortDirection]);

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
        <h1 className="text-3xl font-bold">Donation Requests</h1>
        <p className="mt-2 text-muted-foreground">
          Create and manage your donation requests
        </p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm relative">
          <BaseInput
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <BaseButton
          variant="default"
          size="default"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Request
        </BaseButton>
      </div>

      {/* Requests Table */}
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
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Status</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left"
                  onClick={() => handleSort('requestedDate')}
                >
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <span>Requested Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedAndFilteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <tr key={request.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <BaseText weight="medium">{request.foodType}</BaseText>
                      {request.notes && (
                        <BaseText size="sm" variant="muted" className="mt-0.5">
                          {request.notes}
                        </BaseText>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <BaseText>{request.quantity} {request.unit}</BaseText>
                    </td>
                    <td className="px-4 py-3">
                      <BaseBadge variant={getUrgencyColor(request.urgency)}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </BaseBadge>
                    </td>
                    <td className="px-4 py-3">
                      <BaseBadge 
                        variant={getStatusColor(request.status)}
                        icon={<StatusIcon className="h-3.5 w-3.5" />}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </BaseBadge>
                    </td>
                    <td className="px-4 py-3">
                      <BaseText>{formatDate(request.requestedDate)}</BaseText>
                      {request.donorName && (
                        <BaseText size="sm" variant="muted" className="mt-0.5">
                          From: {request.donorName}
                        </BaseText>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <BaseButton
                          variant="ghost"
                          size="sm"
                        >
                          View Details
                        </BaseButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {(!requestsData?.requests || requestsData.requests.length === 0) && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <BaseText variant="muted" className="mt-2">
                  No donation requests found
                </BaseText>
                <BaseButton
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Create First Request
                </BaseButton>
              </div>
            </div>
          )}
        </div>
      </BaseCard>
    </div>
  );
} 
