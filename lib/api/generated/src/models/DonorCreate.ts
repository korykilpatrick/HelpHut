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
 * @interface DonorCreate
 */
export interface DonorCreate {
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    contactEmail: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    contactPhone: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    businessHours?: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    pickupPreferences?: string;
    /**
     * 
     * @type {string}
     * @memberof DonorCreate
     */
    locationId?: string;
}

/**
 * Check if a given object implements the DonorCreate interface.
 */
export function instanceOfDonorCreate(value: object): value is DonorCreate {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('contactEmail' in value) || value['contactEmail'] === undefined) return false;
    if (!('contactPhone' in value) || value['contactPhone'] === undefined) return false;
    return true;
}

export function DonorCreateFromJSON(json: any): DonorCreate {
    return DonorCreateFromJSONTyped(json, false);
}

export function DonorCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): DonorCreate {
    if (json == null) {
        return json;
    }
    return {
        
        'userId': json['user_id'] == null ? undefined : json['user_id'],
        'name': json['name'],
        'contactEmail': json['contact_email'],
        'contactPhone': json['contact_phone'],
        'businessHours': json['business_hours'] == null ? undefined : json['business_hours'],
        'pickupPreferences': json['pickup_preferences'] == null ? undefined : json['pickup_preferences'],
        'locationId': json['location_id'] == null ? undefined : json['location_id'],
    };
}

export function DonorCreateToJSON(json: any): DonorCreate {
    return DonorCreateToJSONTyped(json, false);
}

export function DonorCreateToJSONTyped(value?: DonorCreate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'user_id': value['userId'],
        'name': value['name'],
        'contact_email': value['contactEmail'],
        'contact_phone': value['contactPhone'],
        'business_hours': value['businessHours'],
        'pickup_preferences': value['pickupPreferences'],
        'location_id': value['locationId'],
    };
}

