import { getOktaUser, OktaClient } from './_common';

const getLinkedProfiles = async ({ id, unifiedId }, client = new OktaClient()) => {
	const linkedUsers = [];
	let linkedCredentials = [];

	// 1) Check for linked users
	const linkedUserIds = await client.getAssociatedAccounts(id);

	// 2) Iterate through response to fetch Okta users.

	for (let i = 0; i < linkedUserIds.length; i++) {
		const userId = linkedUserIds[i];

		const user = await getOktaUser(userId, client, true);

		linkedCredentials = [...linkedCredentials, ...user?.credentials];

		delete user.credentials;

		if (user?.unifiedId === unifiedId) {
			linkedUsers.push(user);
		}
	}

	return { linkedUsers, linkedCredentials };
};

export default getLinkedProfiles;
