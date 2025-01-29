import React from 'react';
import { MapPin, Package, Clock, User, Building, Phone, Mail, AlertTriangle, FileText } from 'lucide-react';
import BaseCard from '../../../shared/components/base/BaseCard';
import BaseBadge from '../../../shared/components/base/BaseBadge';
import BaseText from '../../../shared/components/base/BaseText';
import { TicketStatus } from '../../../../../lib/types/generated/api';
import { TicketWithDonation } from '../types';
import { format } from 'date-fns';
import { Thermometer, Snowflake, Weight } from 'lucide-react';

interface DeliveryCardProps {
  ticket: TicketWithDonation;
  showActions?: boolean;
  onStatusUpdate?: (status: TicketStatus) => void;
}

const statusToVariant: Record<TicketStatus, { variant: 'default' | 'primary' | 'warning' | 'success'; label: string }> = {
  Submitted: { variant: 'primary', label: 'Submitted' },
  Scheduled: { variant: 'warning', label: 'Scheduled' },
  InTransit: { variant: 'warning', label: 'In Transit' },
  Delivered: { variant: 'success', label: 'Delivered' },
  Completed: { variant: 'success', label: 'Completed' },
};

const formatAddress = (location?: { street?: string; city?: string; state?: string; zip?: string }) => {
  if (!location) return 'Location not specified';
  const parts = [location.street, location.city, location.state, location.zip].filter(Boolean);
  return parts.join(', ') || 'Location not specified';
};

export function DeliveryCard({ ticket, showActions = false, onStatusUpdate }: DeliveryCardProps) {
  const status = statusToVariant[ticket.status || 'Submitted'];

  return (
    <BaseCard>
      <div className="flex flex-col gap-4">
        {/* Header with ID, Status and Priority */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <BaseText variant="default" weight="medium">Pickup #{ticket.id}</BaseText>
            <div className="flex gap-2">
              <BaseBadge variant={status.variant}>{status.label}</BaseBadge>
              {ticket.priority !== 'Routine' && (
                <BaseBadge variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
                  {ticket.priority}
                </BaseBadge>
              )}
            </div>
          </div>
        </div>

        {ticket.donation && (
          <div className="flex flex-col gap-4">
            {/* Donor Information */}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <BaseText variant="default" weight="medium">
                {ticket.donation.donor?.organizationName || 'Anonymous Donor'}
              </BaseText>
            </div>

            {/* Food Type and Quantity */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" />
              <BaseText variant="default">
                {ticket.donation.foodType || 'Unknown Food Type'} - {ticket.donation.quantity} {ticket.donation.unit}
              </BaseText>
            </div>

            {/* Notes if present */}
            {ticket.donation.notes && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <div className="flex flex-col">
                  <BaseText variant="default" weight="medium">Notes</BaseText>
                  <BaseText variant="muted">{ticket.donation.notes}</BaseText>
                </div>
              </div>
            )}

            {/* Partner Organization */}
            {ticket.partner && (
              <div className="flex flex-col gap-2 border-t pt-4">
                <BaseText variant="default" weight="medium">Partner Organization</BaseText>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <BaseText variant="default">{ticket.partner.name}</BaseText>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <BaseText variant="muted">{ticket.partner.contactPhone}</BaseText>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <BaseText variant="muted">{ticket.partner.contactEmail}</BaseText>
                </div>
              </div>
            )}

            {/* Pickup Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <BaseText variant="default" weight="medium">Pickup Location</BaseText>
                <BaseText variant="muted">{formatAddress(ticket.pickupLocation)}</BaseText>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <BaseText variant="default" weight="medium">Dropoff Location</BaseText>
                <BaseText variant="muted">{formatAddress(ticket.dropoffLocation)}</BaseText>
              </div>
            </div>

            {/* Time Window */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div className="flex flex-col">
                <BaseText variant="default" weight="medium">Pickup Window</BaseText>
                <BaseText variant="muted">
                  {ticket.donation.pickupWindow?.start
                    ? new Date(ticket.donation.pickupWindow.start).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    : 'TBD'}{' '}
                  -{' '}
                  {ticket.donation.pickupWindow?.end
                    ? new Date(ticket.donation.pickupWindow.end).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })
                    : 'TBD'}
                </BaseText>
              </div>
            </div>

            {/* Requirements */}
            {(ticket.donation.requirements?.refrigeration ||
              ticket.donation.requirements?.freezing ||
              ticket.donation.requirements?.heavyLifting) && (
              <div className="flex flex-col gap-2">
                <BaseText variant="default" weight="medium">Requirements</BaseText>
                <div className="flex flex-wrap gap-2">
                  {ticket.donation.requirements.refrigeration && (
                    <BaseBadge variant="primary" icon={<Thermometer className="h-4 w-4" />}>
                      Refrigeration Required
                    </BaseBadge>
                  )}
                  {ticket.donation.requirements.freezing && (
                    <BaseBadge variant="primary" icon={<Snowflake className="h-4 w-4" />}>
                      Freezing Required
                    </BaseBadge>
                  )}
                  {ticket.donation.requirements.heavyLifting && (
                    <BaseBadge variant="primary" icon={<Weight className="h-4 w-4" />}>
                      Heavy Lifting Required
                    </BaseBadge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Created At */}
        <BaseText variant="muted" className="text-gray-500">
          Created {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : 'Recently'}
        </BaseText>

        {/* Actions */}
        {showActions && ticket.status !== 'Completed' && onStatusUpdate && (
          <div className="flex gap-2">
            {ticket.status === 'Submitted' && (
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => onStatusUpdate('Scheduled')}
              >
                Schedule Pickup
              </button>
            )}
            {ticket.status === 'Scheduled' && (
              <button
                className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                onClick={() => onStatusUpdate('InTransit')}
              >
                Start Delivery
              </button>
            )}
            {ticket.status === 'InTransit' && (
              <button
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={() => onStatusUpdate('Delivered')}
              >
                Mark as Delivered
              </button>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
} 
