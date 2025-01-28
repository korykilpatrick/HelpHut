import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliveryCard } from '../components/DeliveryCard';
import { Ticket, TicketStatus } from '../../../../../lib/types/generated/api';
import BaseText from '../../../shared/components/base/BaseText';
import { axiosInstance } from '../../../core/api';

export const ActiveDeliveries: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch active deliveries
  const { data: activeDeliveries, isLoading } = useQuery<{ tickets: Ticket[] }>({
    queryKey: ['volunteer', 'active-deliveries'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/volunteer/tickets/active');
      return data;
    }
  });

  // Update delivery status
  const updateDeliveryStatus = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: TicketStatus }) => {
      const { data } = await axiosInstance.post(`/volunteer/tickets/${ticketId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      // Refetch active deliveries after status update
      queryClient.invalidateQueries({ queryKey: ['volunteer', 'active-deliveries'] });
    }
  });

  const handleStatusUpdate = (ticketId: string, status: TicketStatus) => {
    updateDeliveryStatus.mutate({ ticketId, status });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <BaseText>Loading active deliveries...</BaseText>
      </div>
    );
  }

  if (!activeDeliveries?.tickets?.length) {
    return (
      <div className="p-4">
        <BaseText>No active deliveries at the moment.</BaseText>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BaseText size="xl" weight="bold">Active Deliveries</BaseText>
        <BaseText size="sm" className="text-gray-600">
          Manage your current pickups and deliveries
        </BaseText>
      </div>

      <div className="space-y-4">
        {activeDeliveries.tickets.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            ticket={delivery}
            showActions
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}; 