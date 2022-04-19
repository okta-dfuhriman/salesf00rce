import { ErrorResponse, getCredentials, validateJwt } from './_common';

const getCredentialCount = async credentials => {
	const oktaCredentials =
		credentials.filter(({ id: userId, login, provider: { id: providerId, name: providerName } }) =>
			['email', 'password'].includes(providerName)
		) || [];

	const okta = oktaCredentials.length || 0;
	const social = credentials.length - okta || 0;

	return { okta, social };
};

const unlinkUsers = async (req, res, client) => {
	try {
		const {
			query: { id, idpId },
			// headers,
		} = req || {};

		// 1) Validate JWT

		// JWT validation logic TODO?
		// uid !== id ==> cannot unlink an account from itself

		const { isValid, error, accessToken } = await validateJwt(
			{
				assertClaims: { 'scp.includes': ['user:read:self', 'user:update:self'] },
			},
			req,
			client
		);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return new ErrorResponse(401, res);
			}
		}

		// 2) fetch the user
		const {
			claims: { sub, uid },
		} = accessToken;

		let user = await client.getUser(id);

		// 3) Check if the request is for the primary user or an associated user
		// const isPrimaryUser = id === sub;
		// const associatedUserId = id === sub && sub !== uid ? uid : id;

		// 3) Check if the user is SOCIAL or not
		const isSocialOnly = user?.credentials?.provider?.type === 'SOCIAL' || false;

		/*
		 * 4) If the request is for a social credential, run some additional logic...
		 *   - If the profile is SOCIAL ONLY and there is...
		 *      a) more than one Idp, we want to disconnect the Idp but not the entire Okta profile.
		 *      b) only one Idp, then completely disconnect the profile (which requires additional logic)
		 * 			-> DO NOT break the Idp link (as it will leave that profile 'orphaned')
		 *   - If the profile has Okta credentials, just disconnect the social Idp per the request.
		 */

		let numberOfSocialCredentials = 0;

		if (idpId && isSocialOnly) {
			const credentials = await getCredentials({ user });

			const { social } = await getCredentialCount(credentials);

			numberOfSocialCredentials = social;
		}

		if (idpId && (!isSocialOnly || numberOfSocialCredentials > 1)) {
			await client.unlinkIdp(id, idpId);
		} else {
			// We always want to disconnect the associated account, not the primary account.

			// If there is no idpId and the request is for the same account, throw an error
			if (!idpId && id === uid) {
				throw new ErrorResponse({
					statusCode: 401,
					errorSummary: 'Cannot unlink the currently authenticated account!',
				});
			}

			// If the `id` in the request is for the primary, we need to swap it out for the associated user to unlink it properly.
			// To simplify, we will simply fetch a new user object and then always unlink the current user.id.
			if (id === sub && sub !== uid) {
				user = await client.getUser(uid);
			}

			// do the unlinking
			await client.unlinkAssociatedAccount(user.id);

			// No error thrown so unlink is success! Now onto the profile un-merge...

			// 5) Remove unifiedId meta from the profile that has been unlinked (i.e. NOT the primary).
			user.profile.unifiedId = '';
			user.profile.isUnifiedProfile = false;

			await user.update();
		}

		return res.status(204).send();
	} catch (error) {
		console.error(error);
		return new ErrorResponse(error, res);
	}
};

export default unlinkUsers;
