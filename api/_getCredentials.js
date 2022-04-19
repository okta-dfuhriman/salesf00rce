import { OktaClient } from './_common';

const getCredentials = async ({ user, id }, client = new OktaClient()) => {
	if (!user && !id) {
		throw new Error('Either a user object or a userId must be provided!');
	}

	const _user = user || (await client.getUser(id));

	const {
		id: userId,
		credentials: {
			password,
			provider: { type: providerType },
		},
		profile: { login },
	} = _user || {};

	const providers = await client.getIdps(userId);

	if (providerType === 'OKTA') {
		if (password) {
			providers.push({ name: 'password' });
		}
		providers.push({ name: 'email' });
	}

	return providers.map(provider => ({ id: userId, login, provider }));
};

export default getCredentials;
