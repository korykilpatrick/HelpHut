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

export class VolunteerSkillCreate {
    'volunteerId': string;
    'skill': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "volunteerId",
            "baseName": "volunteer_id",
            "type": "string"
        },
        {
            "name": "skill",
            "baseName": "skill",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return VolunteerSkillCreate.attributeTypeMap;
    }
}

