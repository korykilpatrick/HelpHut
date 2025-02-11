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
/**
 * 
 * @export
 * @interface Donation
 */
export interface Donation {
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    donorId: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    foodTypeId: string;
    /**
     * 
     * @type {number}
     * @memberof Donation
     */
    quantity: number;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    unit: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    expirationDate?: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    storageRequirements?: string;
    /**
     * 
     * @type {boolean}
     * @memberof Donation
     */
    requiresRefrigeration?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Donation
     */
    requiresFreezing?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Donation
     */
    isFragile?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Donation
     */
    requiresHeavyLifting?: boolean;
    /**
     * Additional notes about the donation
     * @type {string}
     * @memberof Donation
     */
    notes?: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    pickupWindowStart: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    pickupWindowEnd: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    donatedAt?: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    createdAt?: string;
    /**
     * 
     * @type {string}
     * @memberof Donation
     */
    updatedAt?: string;
}

/**
 * Check if a given object implements the Donation interface.
 */
export function instanceOfDonation(value: object): value is Donation {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('donorId' in value) || value['donorId'] === undefined) return false;
    if (!('foodTypeId' in value) || value['foodTypeId'] === undefined) return false;
    if (!('quantity' in value) || value['quantity'] === undefined) return false;
    if (!('unit' in value) || value['unit'] === undefined) return false;
    if (!('pickupWindowStart' in value) || value['pickupWindowStart'] === undefined) return false;
    if (!('pickupWindowEnd' in value) || value['pickupWindowEnd'] === undefined) return false;
    return true;
}

export function DonationFromJSON(json: any): Donation {
    return DonationFromJSONTyped(json, false);
}

export function DonationFromJSONTyped(json: any, ignoreDiscriminator: boolean): Donation {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'donorId': json['donor_id'],
        'foodTypeId': json['food_type_id'],
        'quantity': json['quantity'],
        'unit': json['unit'],
        'expirationDate': json['expiration_date'] == null ? undefined : json['expiration_date'],
        'storageRequirements': json['storage_requirements'] == null ? undefined : json['storage_requirements'],
        'requiresRefrigeration': json['requires_refrigeration'] == null ? undefined : json['requires_refrigeration'],
        'requiresFreezing': json['requires_freezing'] == null ? undefined : json['requires_freezing'],
        'isFragile': json['is_fragile'] == null ? undefined : json['is_fragile'],
        'requiresHeavyLifting': json['requires_heavy_lifting'] == null ? undefined : json['requires_heavy_lifting'],
        'notes': json['notes'] == null ? undefined : json['notes'],
        'pickupWindowStart': json['pickup_window_start'],
        'pickupWindowEnd': json['pickup_window_end'],
        'donatedAt': json['donated_at'] == null ? undefined : json['donated_at'],
        'createdAt': json['created_at'] == null ? undefined : json['created_at'],
        'updatedAt': json['updated_at'] == null ? undefined : json['updated_at'],
    };
}

export function DonationToJSON(json: any): Donation {
    return DonationToJSONTyped(json, false);
}

export function DonationToJSONTyped(value?: Donation | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'donor_id': value['donorId'],
        'food_type_id': value['foodTypeId'],
        'quantity': value['quantity'],
        'unit': value['unit'],
        'expiration_date': value['expirationDate'],
        'storage_requirements': value['storageRequirements'],
        'requires_refrigeration': value['requiresRefrigeration'],
        'requires_freezing': value['requiresFreezing'],
        'is_fragile': value['isFragile'],
        'requires_heavy_lifting': value['requiresHeavyLifting'],
        'notes': value['notes'],
        'pickup_window_start': value['pickupWindowStart'],
        'pickup_window_end': value['pickupWindowEnd'],
        'donated_at': value['donatedAt'],
        'created_at': value['createdAt'],
        'updated_at': value['updatedAt'],
    };
}

