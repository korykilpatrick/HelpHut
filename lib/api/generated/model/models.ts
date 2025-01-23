import localVarRequest from 'request';

export * from './activityLog';
export * from './donation';
export * from './donationCreate';
export * from './donationItem';
export * from './donationItemCreate';
export * from './donationItemUpdate';
export * from './donationUpdate';
export * from './donor';
export * from './donorCreate';
export * from './donorUpdate';
export * from './errorResponse';
export * from './foodType';
export * from './foodTypeCreate';
export * from './foodTypeUpdate';
export * from './inventoryItem';
export * from './inventoryItemCreate';
export * from './inventoryItemUpdate';
export * from './inventoryStatus';
export * from './location';
export * from './locationCreate';
export * from './locationUpdate';
export * from './partner';
export * from './partnerCreate';
export * from './partnerUpdate';
export * from './shift';
export * from './shiftCreate';
export * from './shiftUpdate';
export * from './ticket';
export * from './ticketAttachment';
export * from './ticketAttachmentCreate';
export * from './ticketAttachmentUpdate';
export * from './ticketCreate';
export * from './ticketNote';
export * from './ticketNoteCreate';
export * from './ticketNoteUpdate';
export * from './ticketPriority';
export * from './ticketStatus';
export * from './ticketTag';
export * from './ticketTagCreate';
export * from './ticketTagUpdate';
export * from './ticketUpdate';
export * from './user';
export * from './userCreate';
export * from './userRole';
export * from './userUpdate';
export * from './volunteer';
export * from './volunteerAvailabilityTime';
export * from './volunteerAvailabilityTimeCreate';
export * from './volunteerAvailabilityTimeUpdate';
export * from './volunteerAvailabilityZone';
export * from './volunteerAvailabilityZoneCreate';
export * from './volunteerAvailabilityZoneUpdate';
export * from './volunteerCreate';
export * from './volunteerSkill';
export * from './volunteerSkillCreate';
export * from './volunteerSkillUpdate';
export * from './volunteerUpdate';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { ActivityLog } from './activityLog';
import { Donation } from './donation';
import { DonationCreate } from './donationCreate';
import { DonationItem } from './donationItem';
import { DonationItemCreate } from './donationItemCreate';
import { DonationItemUpdate } from './donationItemUpdate';
import { DonationUpdate } from './donationUpdate';
import { Donor } from './donor';
import { DonorCreate } from './donorCreate';
import { DonorUpdate } from './donorUpdate';
import { ErrorResponse } from './errorResponse';
import { FoodType } from './foodType';
import { FoodTypeCreate } from './foodTypeCreate';
import { FoodTypeUpdate } from './foodTypeUpdate';
import { InventoryItem } from './inventoryItem';
import { InventoryItemCreate } from './inventoryItemCreate';
import { InventoryItemUpdate } from './inventoryItemUpdate';
import { InventoryStatus } from './inventoryStatus';
import { Location } from './location';
import { LocationCreate } from './locationCreate';
import { LocationUpdate } from './locationUpdate';
import { Partner } from './partner';
import { PartnerCreate } from './partnerCreate';
import { PartnerUpdate } from './partnerUpdate';
import { Shift } from './shift';
import { ShiftCreate } from './shiftCreate';
import { ShiftUpdate } from './shiftUpdate';
import { Ticket } from './ticket';
import { TicketAttachment } from './ticketAttachment';
import { TicketAttachmentCreate } from './ticketAttachmentCreate';
import { TicketAttachmentUpdate } from './ticketAttachmentUpdate';
import { TicketCreate } from './ticketCreate';
import { TicketNote } from './ticketNote';
import { TicketNoteCreate } from './ticketNoteCreate';
import { TicketNoteUpdate } from './ticketNoteUpdate';
import { TicketPriority } from './ticketPriority';
import { TicketStatus } from './ticketStatus';
import { TicketTag } from './ticketTag';
import { TicketTagCreate } from './ticketTagCreate';
import { TicketTagUpdate } from './ticketTagUpdate';
import { TicketUpdate } from './ticketUpdate';
import { User } from './user';
import { UserCreate } from './userCreate';
import { UserRole } from './userRole';
import { UserUpdate } from './userUpdate';
import { Volunteer } from './volunteer';
import { VolunteerAvailabilityTime } from './volunteerAvailabilityTime';
import { VolunteerAvailabilityTimeCreate } from './volunteerAvailabilityTimeCreate';
import { VolunteerAvailabilityTimeUpdate } from './volunteerAvailabilityTimeUpdate';
import { VolunteerAvailabilityZone } from './volunteerAvailabilityZone';
import { VolunteerAvailabilityZoneCreate } from './volunteerAvailabilityZoneCreate';
import { VolunteerAvailabilityZoneUpdate } from './volunteerAvailabilityZoneUpdate';
import { VolunteerCreate } from './volunteerCreate';
import { VolunteerSkill } from './volunteerSkill';
import { VolunteerSkillCreate } from './volunteerSkillCreate';
import { VolunteerSkillUpdate } from './volunteerSkillUpdate';
import { VolunteerUpdate } from './volunteerUpdate';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "InventoryStatus": InventoryStatus,
        "TicketPriority": TicketPriority,
        "TicketStatus": TicketStatus,
        "UserRole": UserRole,
}

let typeMap: {[index: string]: any} = {
    "ActivityLog": ActivityLog,
    "Donation": Donation,
    "DonationCreate": DonationCreate,
    "DonationItem": DonationItem,
    "DonationItemCreate": DonationItemCreate,
    "DonationItemUpdate": DonationItemUpdate,
    "DonationUpdate": DonationUpdate,
    "Donor": Donor,
    "DonorCreate": DonorCreate,
    "DonorUpdate": DonorUpdate,
    "ErrorResponse": ErrorResponse,
    "FoodType": FoodType,
    "FoodTypeCreate": FoodTypeCreate,
    "FoodTypeUpdate": FoodTypeUpdate,
    "InventoryItem": InventoryItem,
    "InventoryItemCreate": InventoryItemCreate,
    "InventoryItemUpdate": InventoryItemUpdate,
    "Location": Location,
    "LocationCreate": LocationCreate,
    "LocationUpdate": LocationUpdate,
    "Partner": Partner,
    "PartnerCreate": PartnerCreate,
    "PartnerUpdate": PartnerUpdate,
    "Shift": Shift,
    "ShiftCreate": ShiftCreate,
    "ShiftUpdate": ShiftUpdate,
    "Ticket": Ticket,
    "TicketAttachment": TicketAttachment,
    "TicketAttachmentCreate": TicketAttachmentCreate,
    "TicketAttachmentUpdate": TicketAttachmentUpdate,
    "TicketCreate": TicketCreate,
    "TicketNote": TicketNote,
    "TicketNoteCreate": TicketNoteCreate,
    "TicketNoteUpdate": TicketNoteUpdate,
    "TicketTag": TicketTag,
    "TicketTagCreate": TicketTagCreate,
    "TicketTagUpdate": TicketTagUpdate,
    "TicketUpdate": TicketUpdate,
    "User": User,
    "UserCreate": UserCreate,
    "UserUpdate": UserUpdate,
    "Volunteer": Volunteer,
    "VolunteerAvailabilityTime": VolunteerAvailabilityTime,
    "VolunteerAvailabilityTimeCreate": VolunteerAvailabilityTimeCreate,
    "VolunteerAvailabilityTimeUpdate": VolunteerAvailabilityTimeUpdate,
    "VolunteerAvailabilityZone": VolunteerAvailabilityZone,
    "VolunteerAvailabilityZoneCreate": VolunteerAvailabilityZoneCreate,
    "VolunteerAvailabilityZoneUpdate": VolunteerAvailabilityZoneUpdate,
    "VolunteerCreate": VolunteerCreate,
    "VolunteerSkill": VolunteerSkill,
    "VolunteerSkillCreate": VolunteerSkillCreate,
    "VolunteerSkillUpdate": VolunteerSkillUpdate,
    "VolunteerUpdate": VolunteerUpdate,
}

// Check if a string starts with another string without using es6 features
function startsWith(str: string, match: string): boolean {
    return str.substring(0, match.length) === match;
}

// Check if a string ends with another string without using es6 features
function endsWith(str: string, match: string): boolean {
    return str.length >= match.length && str.substring(str.length - match.length) === match;
}

const nullableSuffix = " | null";
const optionalSuffix = " | undefined";
const arrayPrefix = "Array<";
const arraySuffix = ">";
const mapPrefix = "{ [key: string]: ";
const mapSuffix = "; }";

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string): any {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.serialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.serialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string): any {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (endsWith(type, nullableSuffix)) {
            let subType: string = type.slice(0, -nullableSuffix.length); // Type | null => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (endsWith(type, optionalSuffix)) {
            let subType: string = type.slice(0, -optionalSuffix.length); // Type | undefined => Type
            return ObjectSerializer.deserialize(data, subType);
        } else if (startsWith(type, arrayPrefix)) {
            let subType: string = type.slice(arrayPrefix.length, -arraySuffix.length); // Array<Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (startsWith(type, mapPrefix)) {
            let subType: string = type.slice(mapPrefix.length, -mapSuffix.length); // { [key: string]: Type; } => Type
            let transformedData: { [key: string]: any } = {};
            for (let key in data) {
                transformedData[key] = ObjectSerializer.deserialize(
                    data[key],
                    subType,
                );
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
