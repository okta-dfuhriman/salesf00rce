import { Client } from '@okta/okta-sdk-nodejs';

const API_KEY = process.env.API_KEY;
const ORG_URL = process.env.REACT_APP_OKTA_URL;

export default class OktaClient extends Client {
	constructor(config) {
		super({ orgUrl: ORG_URL, token: API_KEY, ...config });
	}

	async fetch({ baseUrl, url, options }) {
		// TODO swap SSWS out for Okta-4-OAuth
		const _options = {
			method: 'get',
			headers: {
				Authorization: `SSWS ${API_KEY}`,
			},
			...options,
		};

		return await this.http.http(`${baseUrl ?? this.baseUrl}/${url}`, _options);
	}
}
