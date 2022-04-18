import { validateJwt, ErrorResponse } from './_common';

const unlinkUsers = async (req, res, client) => {
	try {
		const {
			query: { id, idpId },
			// headers,
		} = req || {};

		if (idpId) {
			return new ErrorResponse(
				{ statusCode: 501, errorSummary: 'Unlinking a Social Idp is not currently supported' },
				res
			);
		}

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

		// 2) Unlink objects
		const {
			claims: { sub, uid },
		} = accessToken;

		const associatedUserId = id === sub ? uid : id;

		await client.unlinkAssociatedAccount(associatedUserId);

		// No error thrown so unlink is success! Now onto the profile un-merge...

		// 3) Remove unifiedId meta from profile.
		const user = await client.getUser(associatedUserId);

		user.profile.unifiedId = '';
		user.profile.isUnifiedProfile = false;

		await user.update();

		return res.status(204).send();
	} catch (error) {
		console.error(error);
		return new ErrorResponse(error, res);
	}
};

export default unlinkUsers;
