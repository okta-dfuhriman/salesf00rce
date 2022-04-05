import { mergeProfiles, validateJwt } from './_common';

const LINKED_OBJECT_NAME = 'primaryUser';

const doAuthN = async (req, linkWith) => {
	try {
		/*
		 * 	1) validate 'linkWith' JWT => should have 'user:link' scope
		 *
		 *  Will throw error if doesn't pass
		 */
		// TODO => handle use case where profile is already linked to another profile and JWT has 'primary_profile' claim already!)
		const linkWithResult = await validateJwt(
			{
				jwt: linkWith,
				// assertClaims: { 'scp.includes': [LINK_SCOPES.split(' ')] },
			},
			req
		);

		const {
			isValid: linkWithIsValid,
			error: linkWithError,
			accessToken: linkWithAccessToken,
		} = linkWithResult;

		if (!linkWithIsValid) {
			return linkWithResult;
		}

		// 2) validate 'authorization' JWT => should pass basic validation
		const { isValid, error, accessToken: primaryAccessToken } = await validateJwt({}, req);

		return { isValid, linkWithAccessToken, primaryAccessToken, error };
	} catch (error) {
		return { isValid: false, error };
	}
};

const linkUsers = async (req, res, client) => {
	try {
		const {
			query: { id },
			body,
		} = req || {};
		// 1) Validate both JWTs

		const { linkWith } = JSON.parse(body);

		const { isValid, linkWithAccessToken, error } = await doAuthN(req, linkWith);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		const {
			claims: { uid: associatedUserId, sub: associatedLogin },
		} = linkWithAccessToken;

		// 2) Link objects

		const url = `/api/v1/users/${associatedUserId}/linkedObjects/${LINKED_OBJECT_NAME}/${id}`;

		const response = await client.fetch({ url, options: { method: 'put' } });

		if (response.status === 204) {
			// 3) Link success! Now onto the profile merge...

			await mergeProfiles({ id, associatedUserId, associatedLogin }, client);

			res.status(204).send();
		}
	} catch (error) {
		console.error(error);
		return res.status(error?.statusCode ?? 500).json({
			code: error?.code,
			message: error instanceof Error ? error.toString() : error.message,
		});
	}
};

export default linkUsers;
