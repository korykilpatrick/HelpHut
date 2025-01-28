import React from 'react';
import BaseCard from '../../../shared/components/base/BaseCard';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseText from '../../../shared/components/base/BaseText';
import { Ticket, TicketStatus } from '../../../../../lib/types/generated/api';

interface DeliveryCardProps {
  ticket: Ticket;
  showActions?: boolean;
  onStatusUpdate?: (ticketId: string, status: TicketStatus) => void;
}

const statusColors: Record<TicketStatus, { variant: 'default' | 'primary' | 'warning' | 'success'; label: string }> = {
  Submitted: { variant: 'default', label: 'Available' },
  Scheduled: { variant: 'primary', label: 'Scheduled' },
  InTransit: { variant: 'warning', label: 'In Transit' },
  Delivered: { variant: 'success', label: 'Delivered' },
  Completed: { variant: 'success', label: 'Completed' }
};

export const DeliveryCard: React.FC<DeliveryCardProps> = ({ 
  ticket, 
  showActions = false,
  onStatusUpdate 
}) => {
  const status = statusColors[ticket.status || TicketStatus.Submitted];

  return (
    <BaseCard className="mb-4">
      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BaseText size="lg" weight="semibold">
              Pickup #{ticket.id}
            </BaseText>
            <BaseBadge variant={status.variant}>
              {status.label}
            </BaseBadge>
          </div>
          
          <div className="space-y-2">
            <div>
              <BaseText size="sm" weight="medium" className="text-gray-600">
                Pickup Location
              </BaseText>
              <BaseText>{ticket.pickup_location_id}</BaseText>
            </div>
            
            <div>
              <BaseText size="sm" weight="medium" className="text-gray-600">
                Dropoff Location
              </BaseText>
              <BaseText>{ticket.dropoff_location_id}</BaseText>
            </div>

            <div>
              <BaseText size="sm" weight="medium" className="text-gray-600">
                Created
              </BaseText>
              <BaseText>
                {ticket.created_at && new Date(ticket.created_at).toLocaleDateString()}
              </BaseText>
            </div>
          </div>
        </div>

        {showActions && onStatusUpdate && ticket.status !== TicketStatus.Completed && (
          <div className="flex flex-col gap-2">
            {ticket.status === TicketStatus.Scheduled && (
              <button
                onClick={() => ticket.id && onStatusUpdate(ticket.id, TicketStatus.InTransit)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Pickup
              </button>
            )}
            {ticket.status === TicketStatus.InTransit && (
              <button
                onClick={() => ticket.id && onStatusUpdate(ticket.id, TicketStatus.Delivered)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Complete Delivery
              </button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
}; 
