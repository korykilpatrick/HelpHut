import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DeliveryCard } from '../components/DeliveryCard';
import { Ticket } from '../../../../../lib/types/generated/api';
import BaseText from '../../../shared/components/base/BaseText';
import { BaseButton } from '../../../shared/components/base/BaseButton';
import { axiosInstance } from '../../../core/api';

const ITEMS_PER_PAGE = 10;

export const DeliveryHistory: React.FC = () => {
  const [page, setPage] = useState(1);

  // Fetch delivery history
  const { data, isLoading, isFetching } = useQuery<{ history: Ticket[]; total: number }>({
    queryKey: ['volunteer', 'delivery-history', page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/volunteer/tickets/history?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`
      );
      return data;
    }
  });

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

  if (isLoading) {
    return (
      <div className="p-4">
        <BaseText>Loading delivery history...</BaseText>
      </div>
    );
  }

  if (!data?.history?.length) {
    return (
      <div className="p-4">
        <BaseText>No completed deliveries yet.</BaseText>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BaseText size="xl" weight="bold">Delivery History</BaseText>
        <BaseText size="sm" className="text-gray-600">
          View your past deliveries and their impact
        </BaseText>
      </div>

      <div className="space-y-4 mb-6">
        {data.history.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            ticket={delivery}
            showActions={false}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <BaseButton
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
          >
            Previous
          </BaseButton>

          <BaseText size="sm" className="text-gray-600">
            Page {page} of {totalPages}
          </BaseText>

          <BaseButton
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
          >
            Next
          </BaseButton>
        </div>
      )}
    </div>
  );
}; 
