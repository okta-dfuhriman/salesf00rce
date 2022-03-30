import { ApiError } from '../../../_error';
import Utils from '../../../_utils';

const LINKED_OBJECT_NAME = process.env.LINKED_OBJECT_NAME;

const getLinkedProfiles = async (id, unifiedId) => {
	const client = new Utils.OktaClient();
	const result = [];

	const url = `api/v1/users/${id}/linkedObjects/${LINKED_OBJECT_NAME}Of`;

	const response = await client.fetch({ url });

	if (!response.ok) {
		throw new ApiError({ statusCode: response?.statusCode, message: await response.json() });
	}

	const body = await response.json();

	for (let i = 0; i < body.length; i++) {
		const link = body[i];

		const regex = /(?<=users\/).*/;

		const {
			_links: {
				self: { href },
			},
		} = link;

		const path = new URL(href).pathname;

		const userId = regex.exec(path)[0] || undefined;

		if (userId) {
			const { id, profile } = await client.getUser(userId);

			if (profile?.unifiedId === unifiedId) {
				result.push({ id, ...(await Utils.cleanProfile(profile)) });
			}
		}
	}

	return result;
};

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
