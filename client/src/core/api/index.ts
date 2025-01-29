import axios from 'axios';
import type { SignupData } from '@/portals/auth/types';
import { toCamelCase, toSnakeCase } from '../../../../lib/utils/case-transform';

// Get initial token from localStorage
const savedAuth = localStorage.getItem('auth');
const initialToken = savedAuth ? JSON.parse(savedAuth).token : null;

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    ...(initialToken && { Authorization: `Bearer ${initialToken}` })
  },
});

// Function to update the token
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Add request interceptor for case transformation
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === 'object') {
      config.data = toSnakeCase(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and case transformation
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      localStorage.removeItem('auth');
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface GetDonationsParams {
  limit?: number;
  offset?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Types
export interface Ticket {
  id: string;
  donorName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  foodType: string;
  quantity: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
  requirements: {
    refrigeration: boolean;
    freezing: boolean;
    heavyLifting: boolean;
  };
  status: 'submitted' | 'scheduled' | 'in_transit' | 'delivered' | 'completed';
}

export interface ActiveDelivery {
  id: string;
  status: 'scheduled' | 'in_transit' | 'delivered';
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  foodType: string;
  quantity: string;
}

export interface DeliveryRecord {
  id: string;
  date: string;
  pickupLocation: string;
  deliveryLocation: string;
  foodType: string;
  quantity: string;
  impact: {
    mealsProvided: number;
    carbonSaved: number;
  };
  rating?: {
    score: number;
    feedback?: string;
  };
}

interface Donation {
  id: string;
  foodTypeId: string;
  foodTypeName: string;
  quantity: number;
  unit: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  donorId: string;
  donorName: string;
  notes?: string;
  requiresRefrigeration: boolean;
  requiresFreezing: boolean;
  isFragile: boolean;
  requiresHeavyLifting: boolean;
  createdAt: string;
  updatedAt: string;
  ticket: {
    id: string;
    status: string;
    volunteerId?: string;
    volunteerName?: string;
  };
}

interface ClaimTicketResponse {
  ticket: {
    id: string;
    donationId: string;
    status: string;
    priority: string;
    volunteerId?: string;
    partnerOrgId?: string;
    pickupLocationId?: string;
    dropoffLocationId?: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export const api = {
  auth: {
    login: (email: string, password: string) => 
      axiosInstance.post('/auth/login', { email, password }),
    signup: (data: SignupData) =>
      axiosInstance.post('/auth/signup', data),
    logout: () => 
      axiosInstance.post('/auth/logout'),
    getSession: () => 
      axiosInstance.get('/auth/session'),
  },
  donations: {
    createDonation: (data: any) => 
      axiosInstance.post('/donations', data),
    getDonations: (params: GetDonationsParams) =>
      axiosInstance.get('/donations', { params }),
    getDonation: (id: string) =>
      axiosInstance.get(`/donations/${id}`),
    updateDonation: (id: string, data: any) =>
      axiosInstance.patch(`/donations/${id}`, data),
    deleteDonation: (id: string) =>
      axiosInstance.delete(`/donations/${id}`),
    listDonationsByDonor: async (params: { donorId: string; limit?: number; offset?: number }) => {
      const response = await axiosInstance.get(`/donors/${params.donorId}/donations`, {
        params: {
          limit: params.limit,
          offset: params.offset
        }
      });
      
      // Let the middleware handle case transformation
      return response.data;
    },
  },
  partners: {
    // List available donations
    async listAvailableDonations(): Promise<Donation[]> {
      const { data } = await axiosInstance.get('/partners/donations/available');
      return data.donations;
    },
    // List claimed donations
    async listClaimedDonations(): Promise<Donation[]> {
      const { data } = await axiosInstance.get('/partners/donations/claimed');
      return data.donations;
    },
    // Claim a donation
    async claimDonation(id: string): Promise<ClaimTicketResponse> {
      const { data } = await axiosInstance.post(`/partners/donations/${id}/claim`);
      return data;
    }
  },
  donors: {
    list: () => axiosInstance.get('/donors'),
    get: (id: string) => axiosInstance.get(`/donors/${id}`),
  },
  foodTypes: {
    list: () => axiosInstance.get('/food-types'),
  },
  volunteer: {
    // List available tickets
    async listAvailablePickups(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/pickups/available');
      return data.pickups;
    },

    // Claim a ticket
    async claimPickup(pickupId: string): Promise<void> {
      await axiosInstance.post(`/volunteer/tickets/${pickupId}/claim`);
    },

    // Update ticket status
    async updatePickupStatus(
      pickupId: string,
      status: 'in_transit' | 'delivered'
    ): Promise<void> {
      await axiosInstance.post(`/volunteer/tickets/${pickupId}/status`, { status });
    },

    // List active tickets
    async listActivePickups(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/pickups/active');
      return data.pickups;
    },

    // Get ticket history
    async getPickupHistory(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/pickups/history');
      return data.history;
    }
  }
} as const;

export type Api = typeof api; 
