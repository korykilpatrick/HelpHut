/* tslint:disable */
/* eslint-disable */
/**
 * HelpHut Food Rescue Management
 * Centralized platform for coordinating food donations, volunteers, and partner organizations. Aligns with the HelpHut mission to efficiently rescue food in Austin, reduce waste, and help those in need. This specification is maintained under a TDD approach, with auto-generated tests ensuring coverage of each endpoint. 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { TicketStatus } from './TicketStatus';
import {
    TicketStatusFromJSON,
    TicketStatusFromJSONTyped,
    TicketStatusToJSON,
    TicketStatusToJSONTyped,
} from './TicketStatus';
import type { TicketPriority } from './TicketPriority';
import {
    TicketPriorityFromJSON,
    TicketPriorityFromJSONTyped,
    TicketPriorityToJSON,
    TicketPriorityToJSONTyped,
} from './TicketPriority';

/**
 * 
 * @export
 * @interface TicketUpdate
 */
export interface TicketUpdate {
    /**
     * 
     * @type {string}
     * @memberof TicketUpdate
     */
    donationId?: string;
    /**
     * 
     * @type {TicketStatus}
     * @memberof TicketUpdate
     */
    status?: TicketStatus;
    /**
     * 
     * @type {TicketPriority}
     * @memberof TicketUpdate
     */
    priority?: TicketPriority;
    /**
     * 
     * @type {string}
     * @memberof TicketUpdate
     */
    volunteerId?: string;
    /**
     * 
     * @type {string}
     * @memberof TicketUpdate
     */
    partnerOrgId?: string;
    /**
     * 
     * @type {string}
     * @memberof TicketUpdate
     */
    pickupLocationId?: string;
    /**
     * 
     * @type {string}
     * @memberof TicketUpdate
     */
    dropoffLocationId?: string;
}



/**
 * Check if a given object implements the TicketUpdate interface.
 */
export function instanceOfTicketUpdate(value: object): value is TicketUpdate {
    return true;
}

export function TicketUpdateFromJSON(json: any): TicketUpdate {
    return TicketUpdateFromJSONTyped(json, false);
}

export function TicketUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): TicketUpdate {
    if (json == null) {
        return json;
    }
    return {
        
        'donationId': json['donation_id'] == null ? undefined : json['donation_id'],
        'status': json['status'] == null ? undefined : TicketStatusFromJSON(json['status']),
        'priority': json['priority'] == null ? undefined : TicketPriorityFromJSON(json['priority']),
        'volunteerId': json['volunteer_id'] == null ? undefined : json['volunteer_id'],
        'partnerOrgId': json['partner_org_id'] == null ? undefined : json['partner_org_id'],
        'pickupLocationId': json['pickup_location_id'] == null ? undefined : json['pickup_location_id'],
        'dropoffLocationId': json['dropoff_location_id'] == null ? undefined : json['dropoff_location_id'],
    };
}

export function TicketUpdateToJSON(json: any): TicketUpdate {
    return TicketUpdateToJSONTyped(json, false);
}

export function TicketUpdateToJSONTyped(value?: TicketUpdate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'donation_id': value['donationId'],
        'status': TicketStatusToJSON(value['status']),
        'priority': TicketPriorityToJSON(value['priority']),
        'volunteer_id': value['volunteerId'],
        'partner_org_id': value['partnerOrgId'],
        'pickup_location_id': value['pickupLocationId'],
        'dropoff_location_id': value['dropoffLocationId'],
    };
}

