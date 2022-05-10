import * as _ from 'lodash';
import { Client } from '@okta/okta-sdk-nodejs';
import { ApiError } from './_common';

const ORG_URL = process.env.REACT_APP_OKTA_URL;
const CLIENT_ID = process.env.CLIENT_ID_USER_SERVICE;
const SCOPES = process.env.SCOPES_USER_SERVICE.split(' ');
const KEY = process.env.PRIVATE_KEY_USER_SERVICE;
const LINKED_OBJECT_NAME = 'primaryUser';
const API_KEY = process.env.OKTA_API_TOKEN;

export default class OktaClient extends Client {
	constructor(config) {
		if (config?.useApiKey) {
			super({
				orgUrl: ORG_URL,
				token: API_KEY,
			});
		} else {
			super({
				orgUrl: ORG_URL,
				authorizationMode: 'PrivateKey',
				clientId: CLIENT_ID,
				scopes: SCOPES,
				privateKey: KEY,
				...config,
			});
		}
	}

	async fetch({ baseUrl, url, options }) {
		// TODO swap SSWS out for Okta-4-OAuth
		const _options = {
			method: 'get',
			...options,
		};

		return await this.http.http(`${baseUrl ?? this.baseUrl}/${url}`, _options);
	}

	async parseLinkedObjects(data) {
		const users = [];

		for (let i = 0; i < data.length; i++) {
			const {
				_links: {
					self: { href },
				},
			} = data[i];

			const regex = /(?<=users\/).*/;

			const path = new URL(href).pathname;

			users.push(regex.exec(path)[0] || undefined);
		}
		return users;
	}

	/**
	 *
	 * Fetches the sub/child accounts for a given identifier, which is assumed to be a primary/parent `userId`
	 *
	 * @param {string} id The primary/parent user identifier.
	 * @returns An array of userIds
	 */
	async getAssociatedAccounts(id) {
		const url = `api/v1/users/${id}/linkedObjects/${LINKED_OBJECT_NAME}Of`;

		const response = await this.fetch({ url });

		if (!response.ok) {
			throw new ApiError({ statusCode: response?.statusCode, message: await response.json() });
		}

		return await this.parseLinkedObjects(await response.json());
	}

	/**
	 *
	 * Fetches the parent account for a given identifier, which is assumed to be a sub/child `userId`.
	 *
	 * @param {string} id The sub/child user identifier.
	 * @returns A single `userId` for the parent account (if there is one).
	 */
	async getParentAccount(id) {
		const url = `api/v1/users/${id}/linkedObjects/${LINKED_OBJECT_NAME}`;

		const response = await this.fetch({ url });

		if (!response.ok) {
			throw new ApiError({ statusCode: response?.statusCode, message: await response.json() });
		}

		const result = await this.parseLinkedObjects(await response.json());

		if (result.length > 1) {
			throw new ApiError({
				statusCode: 500,
				message: `${result.length} results returned. Only one parent account is permitted!`,
			});
		}

		return result[0];
	}

	async unlinkAssociatedAccount(associatedUserId) {
		const url = `api/v1/users/${associatedUserId}/linkedObjects/${LINKED_OBJECT_NAME}`;

		const response = await this.fetch({ url, options: { method: 'delete' } });

		if (response.status !== 204) {
			throw new ApiError({ statusCode: response.status, message: (await response.json()) || '' });
		}

		return;
	}

	async unlinkIdp(id, idpId) {
		const url = `api/v1/idps/${idpId}/users/${id}`;

		const response = await this.fetch({ url, options: { method: 'delete' } });

		if (response.status !== 204) {
			throw new ApiError({ statusCode: response.status, message: (await response.json()) || '' });
		}

		return;
	}

	async getIdps(id) {
		const url = `api/v1/users/${id}/idps`;

		const response = await this.fetch({ url });

		if (!response.ok) {
			throw new ApiError({
				statusCode: response?.statusCode,
				message: "Unable to fetch user's Idps",
				json: await response.json(),
			});
		}

		const body = await response.json();

		const providers = [];

		for (let i = 0; i < body.length; i++) {
			const { id: idpId, name } = body[i];

			providers.push({ id: idpId, name: name?.toLowerCase() });
		}

		return providers;
	}

	async cleanProfile(profile) {
		const astro =
			"data:image/svg+xml,%3Csvg viewBox='0 0 180 181' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='90' cy='90' fill='%23f5f5f5' r='90'/%3E%3Cpath d='M119.7 144.7c2.1-.8 3.2-1.4 3.2-1.4 38.1-24.1 31.9-54.8 13.7-79.1 8.1-45.7-21.7-21.9-27.8-16.6-17.3-4-34.4-1.3-34.4-1.3-1.5 0-2.9.2-4.3.3-5.8-5.4-34.9-30.4-28.4 15.4-1 1.2-1.6 2-1.6 2-34.3 49.3 14.6 77.8 14.6 77.8.9.4 1.9.8 2.8 1.2-4.5.5-9.9 2.2-14.2 5-2.8 1.8-6.9 4.2-10.4 12 15.5 12.7 35.4 20.4 57 20.4 20 0 38.5-6.5 53.5-17.6-5.9-12.3-17.1-16.3-23.7-18.1z' fill='%23e9e9e9'/%3E%3Cpath d='M46.1 62c-3.4-4.3-2.9-20 3.1-22 1.7-.1 3.3.4 4.7 1.4 0 0 13 11.3 6.2 18-5.9 5.8-11.8 5.4-14 2.6zM36.7 76S15.8 114.4 54 136c0 0-30.2-26-17.3-60zM134.9 47.1c-.4-1.1-.9-2.2-1.6-3.1-.6-.9-1.5-1.5-2.4-1.9h-.8c-.7 0-1.4.1-2 .2-.9.2-1.7.6-2.4 1.2-1.5 1.3-3 2.8-4.3 4.3-1.1 1.3-2.1 2.8-3 4.3s-1.4 3.2-1.5 5c0 1.9.7 3.7 2 5 3.3 3.5 6.7 5 9.5 5 1.9.1 3.7-.6 5-2 .9-1.2 1.5-2.6 1.8-4.1.4-1.9.7-3.8.7-5.7.2-2.9-.2-5.6-1-8.2z' fill='%23dedede'/%3E%3Cpath d='M134 103.6c.4 16.1-12 30.1-29.6 35.3-4.4 1.3-8.9 2-13.5 2.1-18.9.5-35.2-8.8-41.8-22.4-.2-.4-.4-.8-.5-1.2-1.6-3.6-2.5-7.5-2.6-11.5-.5-20 19.6-37.3 43.9-37.9 4.4-.1 8.7.3 12.9 1.3 17.9 4.2 30.7 18 31.2 34.3z' fill='%23f8f8f8'/%3E%3Cg fill='%23dbdbdb'%3E%3Cellipse cx='68.5' cy='115' rx='6.5' ry='4' transform='rotate(-85.89 68.5 115) scale(.99997)'/%3E%3Cellipse cx='108.5' cy='118' rx='6.5' ry='4' transform='rotate(-85.89 108.5 118) scale(.99997)'/%3E%3Cpath d='M52.8 124s-4-25.6 2.4-26.3c0 0 3.3 4.2 5.5 4.2.4 0-1.5-13 5.4-17.1 0 0 24.8 9.6 27.6 3.9-.9-.5-10-3.9-9.6-7.9.2-2.2 19.5-2.1 28 16.7 1.4.8 3.6-2.8 4.1-8 .9-9.7 7.9 16.3 8.1 16.7.1.4 2-.6 3.7-3 1.6-2.4 1.1 15.6.8 17.5-.3 1.8 6.3-7.7 5.2-19.9s-11.9-25-21.3-28.8c-8.9-3.6-24-10.2-47.1 1.8-24.7 12.8-18.9 39-18.8 39.4.6 3.1 5 10.6 6 10.8zM89.5 180.5c5.2 0 10.4-.5 15.4-1.3-.6-9.1-.7-24.2-17.4-24.2-17.9 0-17.7 13.7-18.3 23.2 6.6 1.5 13.3 2.3 20.3 2.3z'/%3E%3C/g%3E%3C/svg%3E";

		const result = {};

		for (const key in profile) {
			if (!_.isEmpty(profile[key])) {
				result[key] = profile[key];
			}
		}

		const { displayName, firstName, lastName, picture = astro } = result;

		let name = displayName || (firstName && lastName) ? `${firstName} ${lastName}` : undefined;

		return { ...result, name, picture };
	}
}
