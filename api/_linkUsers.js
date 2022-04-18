import { ErrorResponse, mergeProfiles, validateJwt } from './_common';

const LINKED_OBJECT_NAME = 'primaryUser';

const doAuthN = async (req, linkWith) => {
	try {
		/*
		 * 	1) validate 'linkWith' idToken => should have 'user:link' scope
		 *
		 *  Will throw error if doesn't pass
		 */
		// TODO => handle use case where profile is already linked to another profile!
		const linkWithResult = await validateJwt(
			{
				idToken: linkWith,
			},
			req
		);

		const { isValid: linkWithIsValid, idToken } = linkWithResult;

		if (!linkWithIsValid) {
			return linkWithResult;
		}

		// 2) validate 'authorization' JWT => should pass basic validation
		const { isValid, error, accessToken } = await validateJwt(
			{ assertClaims: { 'scp.includes': ['user:read:self', 'user:update:self'] } },
			req
		);

		return { isValid, idToken, accessToken, error };
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

		const { isValid, idToken, accessToken, error } = await doAuthN(req, linkWith);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return new ErrorResponse(401, res);
			}
		}

		// TODO account for scenario where associatedUid !== associatedSub
		const {
			claims: { sub: associatedSub },
		} = idToken;

		const {
			claims: { sub: primarySub },
		} = accessToken;

		// 2) Link objects

		const id = primarySub || uid;

		// If a `primaryId` is present, the new associated account should be linked to it, not the logged in user's Id.

		const url = `/api/v1/users/${associatedSub}/linkedObjects/${LINKED_OBJECT_NAME}/${id}`;

		const response = await client.fetch({ url, options: { method: 'put' } });

		if (response.status === 204) {
			// 3) Link success! Now onto the profile merge...

			await mergeProfiles({ primaryId: id, associatedSub }, client);

			res.status(204).send();
		}
	} catch (error) {
		console.error(error);
		return new ErrorResponse(error, res);
	}
};

export default linkUsers;
