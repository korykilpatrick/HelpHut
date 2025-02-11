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
 * @interface ShiftUpdate
 */
export interface ShiftUpdate {
    /**
     * 
     * @type {string}
     * @memberof ShiftUpdate
     */
    volunteerId?: string;
    /**
     * 
     * @type {Date}
     * @memberof ShiftUpdate
     */
    shiftDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof ShiftUpdate
     */
    startTime?: string;
    /**
     * 
     * @type {string}
     * @memberof ShiftUpdate
     */
    endTime?: string;
}

/**
 * Check if a given object implements the ShiftUpdate interface.
 */
export function instanceOfShiftUpdate(value: object): value is ShiftUpdate {
    return true;
}

export function ShiftUpdateFromJSON(json: any): ShiftUpdate {
    return ShiftUpdateFromJSONTyped(json, false);
}

export function ShiftUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): ShiftUpdate {
    if (json == null) {
        return json;
    }
    return {
        
        'volunteerId': json['volunteer_id'] == null ? undefined : json['volunteer_id'],
        'shiftDate': json['shift_date'] == null ? undefined : (new Date(json['shift_date'])),
        'startTime': json['start_time'] == null ? undefined : json['start_time'],
        'endTime': json['end_time'] == null ? undefined : json['end_time'],
    };
}

export function ShiftUpdateToJSON(json: any): ShiftUpdate {
    return ShiftUpdateToJSONTyped(json, false);
}

export function ShiftUpdateToJSONTyped(value?: ShiftUpdate | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'volunteer_id': value['volunteerId'],
        'shift_date': value['shiftDate'] == null ? undefined : ((value['shiftDate']).toISOString().substring(0,10)),
        'start_time': value['startTime'],
        'end_time': value['endTime'],
    };
}

