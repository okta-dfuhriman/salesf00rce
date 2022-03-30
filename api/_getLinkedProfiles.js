import Utils from './_utils';
import { ApiError } from '../../../_error';
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
