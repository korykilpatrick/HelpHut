import { UsersApiImpl } from './users';

// API implementation instances
const usersApi = new UsersApiImpl();

// Export API implementations
export const api = {
  users: usersApi,
  // Add other API implementations here as they are created
} as const;

// Type helper
export type ApiImpl = typeof api; 