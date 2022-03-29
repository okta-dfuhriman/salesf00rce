import * as okta from '@okta/okta-sdk-nodejs';

import doAuthN from '../../../_doAuthN';
import mergeProfiles from '../../../_mergeProfiles';

const API_KEY = process.env.API_KEY;
const ORG_URL = process.env.REACT_APP_OKTA_URL;
const LINKED_OBJECT_NAME = process.env.LINKED_OBJECT_NAME;
const client = new okta.Client({ orgUrl: ORG_URL, token: API_KEY });

module.exports = async (req, res) => {
	try {
		const {
			query: { id },
		} = req || {};

		// 1) Validate both JWTs
		const { isValid, linkWithJwt, error } = await doAuthN(req);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		const associatedUserId = linkWithJwt?.claims?.uid;
		const associatedLogin = linkWithJwt?.claims?.sub;

		// 2) Link objects

		const url = `/api/v1/users/${associatedUserId}/linkedObjects/${LINKED_OBJECT_NAME}/${id}`;

		// TODO swap SSWS out for Okta-4-OAuth
		const options = {
			method: 'put',
			headers: {
				Authorization: `SSWS ${API_KEY}`,
			},
		};

		const response = await client.http.http(`${client.baseUrl}/${url}`, options);

		if (response.status === 204) {
			// 3) Link success! Now onto the profile merge...
			return res.send(await mergeProfiles(id, associatedUserId, associatedLogin, client));
		}
	} catch (error) {
		const { code, message, statusCode } = error || {};

		const msg = message.toString();

		return res.status(statusCode ?? 500).json(code ? { code, message: msg } : msg);
	}
};
