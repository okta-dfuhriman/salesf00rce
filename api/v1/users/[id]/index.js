import {
	OktaClient,
	cleanProfile,
	getLinkedProfiles,
	getOktaUser,
	validateJwt,
} from '../../../_common';

const getUser = async (req, res) => {
	try {
		const {
			query: { id },
			headers,
		} = req;

		// 1) Validate the accessToken

		const { isValid, error } = await validateJwt(
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

		// 2) Get the user
		const user = await getOktaUser(id);

		const userProfile = user.profile;

		// 3) Get linked users
		const linkedUsers = await getLinkedProfiles(id, userProfile?.unifiedId);

		if (linkedUsers?.length > 0) {
			userProfile.isPrimary = true;
		}

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
		// console.log(linkedUsers);
		return res.json({ ...user, profile: { ...userProfile, linkedUsers } });
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
