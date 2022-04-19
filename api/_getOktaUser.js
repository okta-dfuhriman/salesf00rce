import { getCredentials, OktaClient } from './_common';

const getOktaUser = async (id, client = new OktaClient(), truncated = false) => {
	const user = await client.getUser(id);

	if (!user) {
		throw new Error('Unable to find user!');
	}

	const credentials = await getCredentials({ user }, client);

	const profile = { ...(await client.cleanProfile(user.profile)) };

	if (truncated) {
		return { id, ...profile, credentials };
	}

	delete user._links;
	delete user.profile;

	return { ...user, profile, credentials };
};

export default getOktaUser;
