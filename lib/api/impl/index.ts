import { UsersApiImpl } from './users';
import { DonorsApiImpl } from './donors';
import { VolunteersApiImpl } from './volunteers';
import { PartnersApiImpl } from './partners';
import { DonationsApiImpl } from './donations';
import { TicketsApiImpl } from './tickets';

// API implementation instances
const usersApi = new UsersApiImpl();
const donorsApi = new DonorsApiImpl();
const volunteersApi = new VolunteersApiImpl();
const partnersApi = new PartnersApiImpl();
const donationsApi = new DonationsApiImpl();
const ticketsApi = new TicketsApiImpl();

// Export API implementations
export const api = {
  users: usersApi,
  donors: donorsApi,
  volunteers: volunteersApi,
  partners: partnersApi,
  donations: donationsApi,
  tickets: ticketsApi
} as const;

// Type helper
export type ApiImpl = typeof api; 