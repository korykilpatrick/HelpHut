import axios from 'axios';
import type { SignupData } from '@/portals/auth/types';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
    // Add other donation endpoints as needed
  },
} as const;

export type Api = typeof api; 
