import { getIdps, OktaClient } from './_common';

const getOktaUser = async (id, client = new OktaClient(), truncated = false) => {
	const user = await client.getUser(id);

	const {
		id: userId,
		credentials: {
			password,
			provider: { type: providerType },
		},
		profile: { login },
	} = user;

	if (!user) {
		throw new Error('Unable to find user!');
	}
	const providers = await getIdps(userId, client);

	if (providerType === 'OKTA') {
		if (password) {
			providers.push({ name: 'password' });
		}
		providers.push({ name: 'email' });
	}

	const credentials = providers.map(provider => ({
		id: userId,
		login,
		provider,
	}));

	const profile = { ...(await client.cleanProfile(user.profile)) };

	if (truncated) {
		return { id, ...profile, credentials };
	}

	delete user._links;
	delete user.profile;

	return { ...user, profile, credentials };
};

export default getOktaUser;
