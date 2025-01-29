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

  // Check if we have meaningful donation data
  const hasMeaningfulDonation = ticket.donation && 
    ticket.donation.foodType !== "Unknown" && 
    ticket.donation.quantity !== 0;

  return (
    <BaseCard>
      <div className="flex flex-col gap-3">
        {/* Status and Priority */}
        <div className="flex gap-2">
          <BaseBadge variant={status.variant}>{status.label}</BaseBadge>
          {ticket.priority !== 'Routine' && (
            <BaseBadge variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
              {ticket.priority}
            </BaseBadge>
          )}
        </div>

        {ticket.donation && (
          <div className="flex flex-col gap-3">
            {/* Main Delivery Info */}
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-md">
              {/* Pickup Details */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 mt-1" />
                <div className="flex flex-col gap-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <BaseText variant="default" weight="medium">Pickup from {ticket.donation.donor?.organizationName || 'Anonymous Donor'}</BaseText>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {ticket.donation.donor?.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <BaseText variant="muted">{ticket.donation.donor.phone}</BaseText>
                        </div>
                      )}
                      {ticket.donation.donor?.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <BaseText variant="muted">{ticket.donation.donor.email}</BaseText>
                        </div>
                      )}
                    </div>
                  </div>
                  <BaseText variant="muted">{formatAddress(ticket.pickupLocation)}</BaseText>
                </div>
              </div>

              {/* Dropoff Details */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-500 mt-1" />
                <div className="flex flex-col gap-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <BaseText variant="default" weight="medium">Deliver to {ticket.partner?.name || 'Partner'}</BaseText>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {ticket.partner?.contactPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <BaseText variant="muted">{ticket.partner.contactPhone}</BaseText>
                        </div>
                      )}
                      {ticket.partner?.contactEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <BaseText variant="muted">{ticket.partner.contactEmail}</BaseText>
                        </div>
                      )}
                    </div>
                  </div>
                  <BaseText variant="muted">{formatAddress(ticket.dropoffLocation)}</BaseText>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="flex flex-col gap-2">
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
                  <BaseText variant="muted">{ticket.donation.notes}</BaseText>
                </div>
              )}
            </div>

            {/* Time Window */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
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

            {/* Requirements */}
            {(ticket.donation.requirements?.refrigeration ||
              ticket.donation.requirements?.freezing ||
              ticket.donation.requirements?.heavyLifting) && (
              <div className="flex gap-2">
                {ticket.donation.requirements.refrigeration && (
                  <BaseBadge variant="primary" icon={<Thermometer className="h-4 w-4" />}>
                    Refrigeration
                  </BaseBadge>
                )}
                {ticket.donation.requirements.freezing && (
                  <BaseBadge variant="primary" icon={<Snowflake className="h-4 w-4" />}>
                    Freezing
                  </BaseBadge>
                )}
                {ticket.donation.requirements.heavyLifting && (
                  <BaseBadge variant="primary" icon={<Weight className="h-4 w-4" />}>
                    Heavy Lifting
                  </BaseBadge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && ticket.status !== 'Completed' && onStatusUpdate && (
          <div className="flex gap-2 mt-2">
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
