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

	// Okta enrolls an email 'factor' by default when coming from an Idp
	providers.push({ name: 'email' });

	if (providerType === 'OKTA' && password) {
		providers.push({ name: 'password' });
	}

	return providers.map(provider => ({ id: userId, login, provider }));
};

export default getCredentials;
