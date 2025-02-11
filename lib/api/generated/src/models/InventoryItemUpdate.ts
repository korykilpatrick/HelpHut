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
 * @interface InventoryItemUpdate
 */
export interface InventoryItemUpdate {
    /**
     * 
     * @type {string}
     * @memberof InventoryItemUpdate
     */
    donationId?: string;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemUpdate
     */
    foodTypeId?: string;
    /**
     * 
     * @type {number}
     * @memberof InventoryItemUpdate
     */
    quantity?: number;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemUpdate
     */
    unit?: string;
    /**
     * 
     * @type {Date}
     * @memberof InventoryItemUpdate
     */
    expirationDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof InventoryItemUpdate
     */
    partnerOrgId?: string;
    /**
     * 
     * @type {InventoryStatus}
     * @memberof InventoryItemUpdate
     */
    status?: InventoryStatus;
}



/**
 * Check if a given object implements the InventoryItemUpdate interface.
 */
export function instanceOfInventoryItemUpdate(value: object): value is InventoryItemUpdate {
    return true;
}

export function InventoryItemUpdateFromJSON(json: any): InventoryItemUpdate {
    return InventoryItemUpdateFromJSONTyped(json, false);
}

export function InventoryItemUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): InventoryItemUpdate {
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

export function InventoryItemUpdateToJSON(json: any): InventoryItemUpdate {
    return InventoryItemUpdateToJSONTyped(json, false);
}

export function InventoryItemUpdateToJSONTyped(value?: InventoryItemUpdate | null, ignoreDiscriminator: boolean = false): any {
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

