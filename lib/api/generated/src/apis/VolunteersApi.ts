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


import * as runtime from '../runtime';
import type {
  ErrorResponse,
  Volunteer,
  VolunteerCreate,
  VolunteerUpdate,
} from '../models/index';
import {
    ErrorResponseFromJSON,
    ErrorResponseToJSON,
    VolunteerFromJSON,
    VolunteerToJSON,
    VolunteerCreateFromJSON,
    VolunteerCreateToJSON,
    VolunteerUpdateFromJSON,
    VolunteerUpdateToJSON,
} from '../models/index';

export interface CreateVolunteerRequest {
    volunteerCreate: VolunteerCreate;
}

export interface DeleteVolunteerRequest {
    id: string;
}

export interface GetVolunteerRequest {
    id: string;
}

export interface ListVolunteersRequest {
    limit?: number;
    offset?: number;
}

export interface UpdateVolunteerRequest {
    id: string;
    volunteerUpdate: VolunteerUpdate;
}

/**
 * VolunteersApi - interface
 * 
 * @export
 * @interface VolunteersApiInterface
 */
export interface VolunteersApiInterface {
    /**
     * 
     * @summary Create a new volunteer
     * @param {VolunteerCreate} volunteerCreate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof VolunteersApiInterface
     */
    createVolunteerRaw(requestParameters: CreateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>>;

    /**
     * Create a new volunteer
     */
    createVolunteer(requestParameters: CreateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer>;

    /**
     * 
     * @summary Delete a volunteer by ID
     * @param {string} id UUID of the resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof VolunteersApiInterface
     */
    deleteVolunteerRaw(requestParameters: DeleteVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>>;

    /**
     * Delete a volunteer by ID
     */
    deleteVolunteer(requestParameters: DeleteVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

    /**
     * 
     * @summary Retrieve a volunteer by ID
     * @param {string} id UUID of the resource
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof VolunteersApiInterface
     */
    getVolunteerRaw(requestParameters: GetVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>>;

    /**
     * Retrieve a volunteer by ID
     */
    getVolunteer(requestParameters: GetVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer>;

    /**
     * 
     * @summary List volunteers
     * @param {number} [limit] Maximum number of items to return
     * @param {number} [offset] Number of items to skip before starting to collect results
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof VolunteersApiInterface
     */
    listVolunteersRaw(requestParameters: ListVolunteersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Volunteer>>>;

    /**
     * List volunteers
     */
    listVolunteers(requestParameters: ListVolunteersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Volunteer>>;

    /**
     * 
     * @summary Update a volunteer by ID
     * @param {string} id UUID of the resource
     * @param {VolunteerUpdate} volunteerUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof VolunteersApiInterface
     */
    updateVolunteerRaw(requestParameters: UpdateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>>;

    /**
     * Update a volunteer by ID
     */
    updateVolunteer(requestParameters: UpdateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer>;

}

/**
 * 
 */
export class VolunteersApi extends runtime.BaseAPI implements VolunteersApiInterface {

    /**
     * Create a new volunteer
     */
    async createVolunteerRaw(requestParameters: CreateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>> {
        if (requestParameters['volunteerCreate'] == null) {
            throw new runtime.RequiredError(
                'volunteerCreate',
                'Required parameter "volunteerCreate" was null or undefined when calling createVolunteer().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/volunteers`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: VolunteerCreateToJSON(requestParameters['volunteerCreate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => VolunteerFromJSON(jsonValue));
    }

    /**
     * Create a new volunteer
     */
    async createVolunteer(requestParameters: CreateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer> {
        const response = await this.createVolunteerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a volunteer by ID
     */
    async deleteVolunteerRaw(requestParameters: DeleteVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling deleteVolunteer().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/volunteers/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a volunteer by ID
     */
    async deleteVolunteer(requestParameters: DeleteVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteVolunteerRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve a volunteer by ID
     */
    async getVolunteerRaw(requestParameters: GetVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling getVolunteer().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/volunteers/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => VolunteerFromJSON(jsonValue));
    }

    /**
     * Retrieve a volunteer by ID
     */
    async getVolunteer(requestParameters: GetVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer> {
        const response = await this.getVolunteerRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List volunteers
     */
    async listVolunteersRaw(requestParameters: ListVolunteersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Volunteer>>> {
        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['offset'] != null) {
            queryParameters['offset'] = requestParameters['offset'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/volunteers`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(VolunteerFromJSON));
    }

    /**
     * List volunteers
     */
    async listVolunteers(requestParameters: ListVolunteersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Volunteer>> {
        const response = await this.listVolunteersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a volunteer by ID
     */
    async updateVolunteerRaw(requestParameters: UpdateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Volunteer>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling updateVolunteer().'
            );
        }

        if (requestParameters['volunteerUpdate'] == null) {
            throw new runtime.RequiredError(
                'volunteerUpdate',
                'Required parameter "volunteerUpdate" was null or undefined when calling updateVolunteer().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("BearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/volunteers/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: VolunteerUpdateToJSON(requestParameters['volunteerUpdate']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => VolunteerFromJSON(jsonValue));
    }

    /**
     * Update a volunteer by ID
     */
    async updateVolunteer(requestParameters: UpdateVolunteerRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Volunteer> {
        const response = await this.updateVolunteerRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
