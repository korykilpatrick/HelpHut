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
 * @interface InventoryItem
 */
export interface InventoryItem {
    /**
     * 
     * @type {string}
     * @memberof InventoryItem
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof InventoryItem
     */
    donationId?: string;
    /**
     * 
     * @type {string}
     * @memberof InventoryItem
     */
    foodTypeId?: string;
    /**
     * 
     * @type {number}
     * @memberof InventoryItem
     */
    quantity?: number;
    /**
     * 
     * @type {string}
     * @memberof InventoryItem
     */
    unit?: string;
    /**
     * 
     * @type {Date}
     * @memberof InventoryItem
     */
    expirationDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof InventoryItem
     */
    partnerOrgId?: string;
    /**
     * 
     * @type {InventoryStatus}
     * @memberof InventoryItem
     */
    status?: InventoryStatus;
    /**
     * 
     * @type {Date}
     * @memberof InventoryItem
     */
    createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof InventoryItem
     */
    updatedAt?: Date;
}



/**
 * Check if a given object implements the InventoryItem interface.
 */
export function instanceOfInventoryItem(value: object): value is InventoryItem {
    return true;
}

export function InventoryItemFromJSON(json: any): InventoryItem {
    return InventoryItemFromJSONTyped(json, false);
}

export function InventoryItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): InventoryItem {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'donationId': json['donation_id'] == null ? undefined : json['donation_id'],
        'foodTypeId': json['food_type_id'] == null ? undefined : json['food_type_id'],
        'quantity': json['quantity'] == null ? undefined : json['quantity'],
        'unit': json['unit'] == null ? undefined : json['unit'],
        'expirationDate': json['expiration_date'] == null ? undefined : (new Date(json['expiration_date'])),
        'partnerOrgId': json['partner_org_id'] == null ? undefined : json['partner_org_id'],
        'status': json['status'] == null ? undefined : InventoryStatusFromJSON(json['status']),
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
    };
}

export function InventoryItemToJSON(json: any): InventoryItem {
    return InventoryItemToJSONTyped(json, false);
}

export function InventoryItemToJSONTyped(value?: InventoryItem | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'donation_id': value['donationId'],
        'food_type_id': value['foodTypeId'],
        'quantity': value['quantity'],
        'unit': value['unit'],
        'expiration_date': value['expirationDate'] == null ? undefined : ((value['expirationDate']).toISOString()),
        'partner_org_id': value['partnerOrgId'],
        'status': InventoryStatusToJSON(value['status']),
        'created_at': value['createdAt'] == null ? undefined : ((value['createdAt']).toISOString()),
        'updated_at': value['updatedAt'] == null ? undefined : ((value['updatedAt']).toISOString()),
    };
}

