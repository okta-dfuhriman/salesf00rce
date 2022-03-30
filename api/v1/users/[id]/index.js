import Utils, { getLinkedProfiles } from '../../../_utils';

const getUser = async (req, res) => {
	try {
		const {
			query: { id },
			headers,
		} = req;

		// 1) Spin up the OktaClient
		const client = new Utils.OktaClient();

		// 2) Validate the accessToken

		const { isValid, error } = await Utils.validateJwt(
			{
				assertClaims: { 'scp.includes': ['user:read:self'] },
			},
			headers
		);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		const user = await client.getUser(id);

		if (!user) {
			throw new Error('Unable to find user!');
		}

		const userProfile = user.profile;

		const linkedUsers = await getLinkedProfiles(id, userProfile?.unifiedId);

		// const _linkedUsers = userProfile?.linkedUsers;
		// const unifiedId = userProfile?.unifiedId;

		// const linkedUsers = [];

		// if (Array.isArray(_linkedUsers) && _linkedUsers.length > 0) {
		// 	// Loop through linked users to fetch profiles.
		// 	for (let i = 0; i < _linkedUsers.length; i++) {
		// 		const { id, profile } = await client.getUser(_linkedUsers[i]);

		// 		if (profile?.unifiedId === unifiedId) {
		// 			linkedUsers.push({ id, ...(await Utils.cleanProfile(profile)) });
		// 		}
		// 	}
		// }

		const profile = { ...(await Utils.cleanProfile(user.profile)), linkedUsers };

		return res.json({ ...user, profile });
	} catch (error) {
		throw new Error(`getUser(): ${error}`);
	}
};

module.exports = async (req, res) => {
	try {
		const { method } = req;

		switch (method) {
			case 'POST':
				// await updateUser(req, res);
				break;
			case 'GET':
			default:
				return await getUser(req, res);
		}
	} catch (error) {
		return res
			.status(error?.statusCode ?? 500)
			.json({ code: error?.code, message: error?.message.toString() });
	}
};
