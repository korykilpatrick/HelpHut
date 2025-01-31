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
    <BaseCard className="hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-3">
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <BaseBadge variant={status.variant} className="shadow-sm">{status.label}</BaseBadge>
            {ticket.priority !== 'Routine' && (
              <BaseBadge variant="warning" icon={<AlertTriangle className="h-4 w-4" />} className="shadow-sm">
                {ticket.priority}
              </BaseBadge>
            )}
          </div>
          {showActions && ticket.status !== 'Completed' && onStatusUpdate && (
            <div className="flex gap-2">
              {ticket.status === 'Submitted' && (
                <button
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow"
                  onClick={() => onStatusUpdate('Scheduled')}
                >
                  Schedule Pickup
                </button>
              )}
              {ticket.status === 'Scheduled' && (
                <button
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-sm hover:shadow"
                  onClick={() => onStatusUpdate('InTransit')}
                >
                  Start Delivery
                </button>
              )}
              {ticket.status === 'InTransit' && (
                <button
                  className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition-colors duration-200 shadow-sm hover:shadow"
                  onClick={() => onStatusUpdate('Delivered')}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          )}
        </div>

        {ticket.donation && (
          <div className="flex flex-col gap-4">
            {/* Main Delivery Info */}
            <div className="flex flex-col gap-3 bg-gray-50/80 p-4 rounded-lg border border-gray-100">
              {/* Pickup Details */}
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col gap-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <BaseText variant="default" weight="medium" className="text-blue-900">{ticket.donation.donor?.organizationName || 'Anonymous Donor'}</BaseText>
                    <div className="flex items-center gap-3">
                      {ticket.donation.donor?.phone && (
                        <a href={`tel:${ticket.donation.donor.phone}`} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                          <Phone className="h-4 w-4" />
                          <BaseText variant="muted">{ticket.donation.donor.phone}</BaseText>
                        </a>
                      )}
                      {ticket.donation.donor?.email && (
                        <a href={`mailto:${ticket.donation.donor.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
                          <Mail className="h-4 w-4" />
                          <BaseText variant="muted">{ticket.donation.donor.email}</BaseText>
                        </a>
                      )}
                    </div>
                  </div>
                  <BaseText variant="muted" className="text-gray-600">{formatAddress(ticket.pickupLocation)}</BaseText>
                </div>
              </div>

              {/* Dropoff Details */}
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex flex-col gap-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <BaseText variant="default" weight="medium" className="text-green-900">{ticket.partner?.name || 'Partner'}</BaseText>
                    <div className="flex items-center gap-3">
                      {ticket.partner?.contactPhone && (
                        <a href={`tel:${ticket.partner.contactPhone}`} className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors">
                          <Phone className="h-4 w-4" />
                          <BaseText variant="muted">{ticket.partner.contactPhone}</BaseText>
                        </a>
                      )}
                      {ticket.partner?.contactEmail && (
                        <a href={`mailto:${ticket.partner.contactEmail}`} className="flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors">
                          <Mail className="h-4 w-4" />
                          <BaseText variant="muted">{ticket.partner.contactEmail}</BaseText>
                        </a>
                      )}
                    </div>
                  </div>
                  <BaseText variant="muted" className="text-gray-600">{formatAddress(ticket.dropoffLocation)}</BaseText>
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="flex flex-col gap-3 px-1">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <Package className="h-5 w-5 text-gray-600" />
                </div>
                <BaseText variant="default" className="text-gray-900">
                  {ticket.donation.foodType || 'Unknown Food Type'} - {ticket.donation.quantity} {ticket.donation.unit}
                </BaseText>
              </div>

              {/* Notes if present */}
              {ticket.donation.notes && (
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <BaseText variant="muted" className="text-gray-600">{ticket.donation.notes}</BaseText>
                </div>
              )}

              {/* Time Window */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <BaseText variant="muted" className="text-gray-600">
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
              <div className="flex gap-2 pt-1">
                {ticket.donation.requirements.refrigeration && (
                  <BaseBadge variant="primary" icon={<Thermometer className="h-4 w-4" />} className="shadow-sm">
                    Refrigeration
                  </BaseBadge>
                )}
                {ticket.donation.requirements.freezing && (
                  <BaseBadge variant="primary" icon={<Snowflake className="h-4 w-4" />} className="shadow-sm">
                    Freezing
                  </BaseBadge>
                )}
                {ticket.donation.requirements.heavyLifting && (
                  <BaseBadge variant="primary" icon={<Weight className="h-4 w-4" />} className="shadow-sm">
                    Heavy Lifting
                  </BaseBadge>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseCard>
  );
} 
