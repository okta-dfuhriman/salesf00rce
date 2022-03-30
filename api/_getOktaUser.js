import { cleanProfile, getIdps, OktaClient } from './_common';

const getOktaUser = async (id, truncated = false) => {
	const client = new OktaClient();

	const user = await client.getUser(id);

	if (!user) {
		throw new Error('Unable to find user!');
	}
	const providers = await getIdps(id);

	if (user.credentials?.provider?.type === 'OKTA') {
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
