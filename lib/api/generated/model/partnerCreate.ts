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

import { RequestFile } from './models';

export class PartnerCreate {
    'userId'?: string;
    'name': string;
    'maxCapacity'?: number;
    'capacity'?: number;
    'contactEmail': string;
    'contactPhone': string;
    'locationId'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "userId",
            "baseName": "user_id",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "maxCapacity",
            "baseName": "max_capacity",
            "type": "number"
        },
        {
            "name": "capacity",
            "baseName": "capacity",
            "type": "number"
        },
        {
            "name": "contactEmail",
            "baseName": "contact_email",
            "type": "string"
        },
        {
            "name": "contactPhone",
            "baseName": "contact_phone",
            "type": "string"
        },
        {
            "name": "locationId",
            "baseName": "location_id",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return PartnerCreate.attributeTypeMap;
    }
}

