import { OktaClient, mergeProfiles, validateJwt } from '../../../_common';

const LINKED_OBJECT_NAME = process.env.LINKED_OBJECT_NAME;
// const LINK_SCOPES = process.env.LINK_SCOPES;

const doAuthN = async req => {
	try {
		const {
			/* 'authorization' in header === currently logged in (primary) user's JWT */
			headers,
			/* 'linkWith' === JWT for account being linked to the primary profile. */
			body: { linkWith },
		} = req || {};

		/*
		 * 	1) validate 'linkWith' JWT => should have 'user:link' scope
		 *
		 *  Will throw error if doesn't pass
		 */
		// TODO => handle use case where profile is already linked to another profile and JWT has 'primary_profile' claim already!)
		const linkedWithResult = await validateJwt({
			jwt: linkWith,
			// assertClaims: { 'scp.includes': [LINK_SCOPES.split(' ')] },
		});

		if (!linkedWithResult?.isValid) {
			return linkedWithResult;
		}

		// 2) validate 'authorization' JWT => should pass basic validation
		const { isValid, error } = await validateJwt({}, headers);

		return { isValid, accessToken: linkedWithResult?.accessToken, error };
	} catch (error) {
		return { isValid: false, error };
	}
};
module.exports = async (req, res) => {
	try {
		const client = new OktaClient();

		const {
			query: { id },
		} = req || {};

		// 1) Validate both JWTs

		const { isValid, accessToken, error } = await doAuthN(req);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		const associatedUserId = accessToken?.claims?.uid;
		const associatedLogin = accessToken?.claims?.sub;

		// 2) Link objects

		const url = `/api/v1/users/${associatedUserId}/linkedObjects/${LINKED_OBJECT_NAME}/${id}`;

		const response = await client.fetch({ url, options: { method: 'put' } });

		if (response.status === 204) {
			// 3) Link success! Now onto the profile merge...
			return res.send(await mergeProfiles(id, associatedUserId, associatedLogin, client));
		}
	} catch (error) {
		return res
			.status(error?.statusCode ?? 500)
			.json({ code: error?.code, message: error?.message.toString() });
	}
};
