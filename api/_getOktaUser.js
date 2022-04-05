import { cleanProfile, getIdps, OktaClient } from './_common';

const getOktaUser = async (id, client = new OktaClient(), truncated = false) => {
	const user = await client.getUser(id);

	const {
		credentials: {
			provider: { type: providerType },
		},
	} = user;

	if (!user) {
		throw new Error('Unable to find user!');
	}
	const providers = await getIdps(id, client);

	if (providerType === 'OKTA') {
		providers.push('email');
	}

	const profile = { ...(await cleanProfile(user.profile)), providers };

	if (truncated) {
		return { id, ...profile };
	}

	delete user._links;
	delete user.profile;

	return { ...user, profile };
};

export default getOktaUser;
