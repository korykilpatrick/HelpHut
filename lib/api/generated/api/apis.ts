export * from './activityLogsApi';
import { ActivityLogsApi } from './activityLogsApi';
export * from './donationItemsApi';
import { DonationItemsApi } from './donationItemsApi';
export * from './donationsApi';
import { DonationsApi } from './donationsApi';
export * from './donorsApi';
import { DonorsApi } from './donorsApi';
export * from './foodTypesApi';
import { FoodTypesApi } from './foodTypesApi';
export * from './inventoryApi';
import { InventoryApi } from './inventoryApi';
export * from './locationsApi';
import { LocationsApi } from './locationsApi';
export * from './partnersApi';
import { PartnersApi } from './partnersApi';
export * from './shiftsApi';
import { ShiftsApi } from './shiftsApi';
export * from './ticketMetaApi';
import { TicketMetaApi } from './ticketMetaApi';
export * from './ticketsApi';
import { TicketsApi } from './ticketsApi';
export * from './usersApi';
import { UsersApi } from './usersApi';
export * from './volunteerMetaApi';
import { VolunteerMetaApi } from './volunteerMetaApi';
export * from './volunteersApi';
import { VolunteersApi } from './volunteersApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [ActivityLogsApi, DonationItemsApi, DonationsApi, DonorsApi, FoodTypesApi, InventoryApi, LocationsApi, PartnersApi, ShiftsApi, TicketMetaApi, TicketsApi, UsersApi, VolunteerMetaApi, VolunteersApi];
