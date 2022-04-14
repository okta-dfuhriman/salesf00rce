import { ApiError, getOktaUser, OktaClient } from './_common';

const LINKED_OBJECT_NAME = 'primaryUser';

const getLinkedProfiles = async ({ primaryId: id, unifiedId }, client = new OktaClient()) => {
	const linkedUsers = [];
	let linkedCredentials = [];

	// 1) Check for linked objects
	const url = `api/v1/users/${id}/linkedObjects/${LINKED_OBJECT_NAME}Of`;

	const response = await client.fetch({ url });

	if (!response.ok) {
		throw new ApiError({ statusCode: response?.statusCode, message: await response.json() });
	}

	const body = await response.json();

	// 2) Iterate through response to fetch Okta userIds.
	for (let i = 0; i < body.length; i++) {
		const {
			_links: {
				self: { href },
			},
		} = body[i];

		const regex = /(?<=users\/).*/;

		const path = new URL(href).pathname;

		const userId = regex.exec(path)[0] || undefined;

		// 3) If a userId exists, get the user.
		if (userId) {
			const user = await getOktaUser(userId, client, true);

			linkedCredentials = [...linkedCredentials, ...user?.credentials];

			delete user.credentials;

			if (user?.unifiedId === unifiedId) {
				linkedUsers.push(user);
			}
		}
	}

	return { linkedUsers, linkedCredentials };
};

export default getLinkedProfiles;
