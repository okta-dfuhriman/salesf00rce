import { getLinkedProfiles, getOktaUser } from './_common';

const getUnifiedProfile = async accessToken => {
	const {
		claims: { sub },
	} = accessToken;

	// 2) Get the Okta user
	const user = await getOktaUser(sub);

	const {
		id,
		profile: { unifiedId },
		credentials,
	} = user;

	// 3) Get linked users
	const { linkedUsers, linkedCredentials } = await getLinkedProfiles({
		id,
		unifiedId,
	});

	return { ...user, linkedUsers, credentials: [...credentials, ...linkedCredentials] };
};

export default getUnifiedProfile;
