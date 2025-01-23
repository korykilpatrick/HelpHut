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

export class ActivityLog {
    'id'?: string;
    'userId'?: string;
    'action'?: string;
    'tableName'?: string;
    'recordId'?: string;
    'oldValue'?: string;
    'newValue'?: string;
    'createdAt'?: Date;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "string"
        },
        {
            "name": "userId",
            "baseName": "user_id",
            "type": "string"
        },
        {
            "name": "action",
            "baseName": "action",
            "type": "string"
        },
        {
            "name": "tableName",
            "baseName": "table_name",
            "type": "string"
        },
        {
            "name": "recordId",
            "baseName": "record_id",
            "type": "string"
        },
        {
            "name": "oldValue",
            "baseName": "old_value",
            "type": "string"
        },
        {
            "name": "newValue",
            "baseName": "new_value",
            "type": "string"
        },
        {
            "name": "createdAt",
            "baseName": "created_at",
            "type": "Date"
        }    ];

    static getAttributeTypeMap() {
        return ActivityLog.attributeTypeMap;
    }
}

