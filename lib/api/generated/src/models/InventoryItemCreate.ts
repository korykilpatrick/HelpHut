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
import type { InventoryStatus } from './InventoryStatus';
import {
    InventoryStatusFromJSON,
    InventoryStatusFromJSONTyped,
    InventoryStatusToJSON,
    InventoryStatusToJSONTyped,
} from './InventoryStatus';

/**
 * 
 * @export
 * @interface InventoryItemCreate
 */
export interface InventoryItemCreate {
    /**
     * 
     * @type {string}
     * @memberof InventoryItemCreate
     */
    donationId?: string;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemCreate
     */
    foodTypeId?: string;
    /**
     * 
     * @type {number}
     * @memberof InventoryItemCreate
     */
    quantity?: number;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemCreate
     */
    unit?: string;
    /**
     * 
     * @type {Date}
     * @memberof InventoryItemCreate
     */
    expirationDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemCreate
     */
    partnerOrgId?: string;
    /**
     * 
     * @type {InventoryStatus}
     * @memberof InventoryItemCreate
     */
    status?: InventoryStatus;
}



/**
 * Check if a given object implements the InventoryItemCreate interface.
 */
export function instanceOfInventoryItemCreate(value: object): value is InventoryItemCreate {
    return true;
}

export function InventoryItemCreateFromJSON(json: any): InventoryItemCreate {
    return InventoryItemCreateFromJSONTyped(json, false);
}

export function InventoryItemCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): InventoryItemCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'donationId': json['donation_id'] == null ? undefined : json['donation_id'],
        'foodTypeId': json['food_type_id'] == null ? undefined : json['food_type_id'],
        'quantity': json['quantity'] == null ? undefined : json['quantity'],
        'unit': json['unit'] == null ? undefined : json['unit'],
        'expirationDate': json['expiration_date'] == null ? undefined : (new Date(json['expiration_date'])),
        'partnerOrgId': json['partner_org_id'] == null ? undefined : json['partner_org_id'],
        'status': json['status'] == null ? undefined : InventoryStatusFromJSON(json['status']),
    };
}

export function InventoryItemCreateToJSON(json: any): InventoryItemCreate {
    return InventoryItemCreateToJSONTyped(json, false);
}

export function InventoryItemCreateToJSONTyped(value?: InventoryItemCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'donation_id': value['donationId'],
        'food_type_id': value['foodTypeId'],
        'quantity': value['quantity'],
        'unit': value['unit'],
        'expiration_date': value['expirationDate'] == null ? undefined : ((value['expirationDate']).toISOString()),
        'partner_org_id': value['partnerOrgId'],
        'status': InventoryStatusToJSON(value['status']),
    };
}

