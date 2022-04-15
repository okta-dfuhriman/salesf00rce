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
			query: { id: uid },
			body,
		} = req || {};
		// 1) Validate both JWTs

		const { linkWith } = JSON.parse(body);

		const { isValid, linkWithAccessToken, primaryAccessToken, error } = await doAuthN(
			req,
			linkWith
		);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		// TODO account for scenario where associatedUid !== associatedSub
		const {
			claims: { uid: associatedUid, sub: associatedSub },
		} = linkWithAccessToken;

		const {
			claims: { sub: primarySub },
		} = primaryAccessToken;

		// 2) Link objects

		const id = primarySub || uid;

		// If a `primaryId` is present, the new associated account should be linked to it, not the logged in user's Id.

		const url = `/api/v1/users/${associatedUid}/linkedObjects/${LINKED_OBJECT_NAME}/${id}`;

		const response = await client.fetch({ url, options: { method: 'put' } });

		if (response.status === 204) {
			// 3) Link success! Now onto the profile merge...

			await mergeProfiles({ primaryId: id, associatedUid }, client);

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
