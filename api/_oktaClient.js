import { Client } from '@okta/okta-sdk-nodejs';
import { ApiError } from './_common';

const ORG_URL = process.env.REACT_APP_OKTA_URL;
const CLIENT_ID = process.env.CLIENT_ID_USER_SERVICE;
const SCOPES = process.env.SCOPES_USER_SERVICE.split(' ');
const KEY = process.env.PRIVATE_KEY_USER_SERVICE;

export default class OktaClient extends Client {
	constructor(config) {
		super({
			orgUrl: ORG_URL,
			authorizationMode: 'PrivateKey',
			clientId: CLIENT_ID,
			scopes: SCOPES,
			privateKey: KEY,
			...config,
		});
	}

	async fetch({ baseUrl, url, options }) {
		// TODO swap SSWS out for Okta-4-OAuth
		const _options = {
			method: 'get',
			...options,
		};

		return await this.http.http(`${baseUrl ?? this.baseUrl}/${url}`, _options);
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

		return (await response.json()) || [];
	}
}
