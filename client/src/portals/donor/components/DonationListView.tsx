import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/core/api';
import { Input } from '@/shared/components/inputs/Input';
import { Select } from '@/shared/components/inputs/Select';
import { Button } from '@/shared/components/buttons/Button';
import { toast } from '@/shared/components/toast';

interface Donation {
  id: string;
  foodType: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickupWindowStart: string;
  pickupWindowEnd: string;
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

export function DonationListView() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [dateRange, setDateRange] = React.useState({
    start: '',
    end: '',
  });

  // Fetch donations with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['donations', page, status, searchQuery, dateRange],
    queryFn: async () => {
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const response = await api.donations.getDonations({
          limit: ITEMS_PER_PAGE,
          offset,
          status: status === 'all' ? undefined : status,
          search: searchQuery || undefined,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        });
        return response.data as { donations: Donation[] };
      } catch (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }
    },
  });

  if (error) {
    toast.error('Failed to load donations. Please try again.');
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Input
          type="text"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search donations..."
        />
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Input
          type="date"
          label="Start Date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
        />
        <Input
          type="date"
          label="End Date"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
        />
      </div>

      {/* Donations Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Food Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pickup Window
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
              data.donations.map((donation: Donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.foodType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.quantity} {donation.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(donation.pickupWindowStart).toLocaleString()} - 
                    {new Date(donation.pickupWindowEnd).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        donation.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        donation.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="secondary"
                      onClick={() => {/* TODO: View details */}}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
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
      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {page}
        </span>
        <Button
          variant="secondary"
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.donations?.length || data.donations.length < ITEMS_PER_PAGE || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 
