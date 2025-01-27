import axios from 'axios';
import type { SignupData } from '@/portals/auth/types';
import { toCamelCase, toSnakeCase } from '../../../../lib/utils/case-transform';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    async listAvailableTickets(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/tickets/available');
      return data.tickets;
    },

    // Claim a ticket
    async claimTicket(ticketId: string): Promise<void> {
      await axiosInstance.post(`/volunteer/tickets/${ticketId}/claim`);
    },

    // Update ticket status
    async updateTicketStatus(
      ticketId: string,
      status: 'in_transit' | 'delivered'
    ): Promise<void> {
      await axiosInstance.post(`/volunteer/tickets/${ticketId}/status`, { status });
    },

    // List active tickets
    async listActiveTickets(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/tickets/active');
      return data.tickets;
    },

    // Get ticket history
    async getTicketHistory(): Promise<Ticket[]> {
      const { data } = await axiosInstance.get('/volunteer/tickets/history');
      return data.history;
    }
  }
} as const;

export type Api = typeof api; 
