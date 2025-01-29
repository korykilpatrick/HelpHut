import { Ticket as BaseTicket } from '@lib/types/generated/api';

export interface TicketWithDonation extends Omit<BaseTicket, 'created_at'> {
  createdAt?: string;
  donation?: {
    foodType: string;
    quantity: number;
    unit: string;
    pickupWindow: {
      start: string;
      end: string;
    };
    requirements: {
      refrigeration: boolean;
      freezing: boolean;
      heavyLifting: boolean;
    };
    donor: {
      organizationName: string;
      locationId?: string;
      phone?: string;
      email?: string;
    };
    notes?: string;
  };
  pickupLocation?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  dropoffLocation?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  partner?: {
    name: string;
    contactPhone: string;
    contactEmail: string;
  };
  volunteer?: {
    displayName: string;
    phone: string;
    vehicleType?: string;
  };
} 
