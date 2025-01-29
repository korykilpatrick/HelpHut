import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeliveryCard } from '../components/DeliveryCard';
import { Ticket, TicketStatus } from '../../../../../lib/types/generated/api';
import BaseText from '../../../shared/components/base/BaseText';
import { axiosInstance } from '../../../core/api';
import { TicketWithDonation } from '../types';

export const ActiveDeliveries: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch active deliveries with full details in a single query
  const { data: activeDeliveries, isLoading } = useQuery<{ tickets: TicketWithDonation[] }>({
    queryKey: ['volunteer', 'active-deliveries'],
    queryFn: async () => {
      console.log('Fetching active deliveries...');
      try {
        // Get tickets that belong to this volunteer and are not completed
        const { data } = await axiosInstance.get<{ tickets: TicketWithDonation[] }>(
          '/tickets/details', {
            params: {
              volunteerId: '66f981b5-0acc-40eb-b0e8-45bb8174c59b', // TODO: Get from auth context
              status: ['Scheduled', 'InTransit']
            }
          }
        );
        console.log('Received active deliveries:', data);
        return data;
      } catch (error) {
        console.error('Error fetching active deliveries:', error);
        throw error;
      }
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
    if (!ticketId) return;
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
        {activeDeliveries.tickets.map((delivery) => {
          // Skip any deliveries without an ID
          if (!delivery.id) return null;
          
          console.log('Rendering delivery:', delivery);
          
          return (
            <DeliveryCard
              key={delivery.id}
              ticket={delivery}
              showActions
              onStatusUpdate={(status) => handleStatusUpdate(delivery.id!, status)}
            />
          );
        })}
      </div>
    </div>
  );
}; 