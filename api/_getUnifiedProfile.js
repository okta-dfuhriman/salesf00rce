import { getLinkedProfiles, getOktaUser } from './_common';

const getUnifiedProfile = async sub => {
	// 1) Get the Okta user
	const user = await getOktaUser(sub);

	const { id: primaryId, profile: primaryProfile, credentials: primaryCredentials } = user;

	// 2) Get linked users
	const { linkedUsers, linkedCredentials } = await getLinkedProfiles({
		primaryId,
		unifiedId: primaryProfile?.unifiedId,
	});

	return { ...user, linkedUsers, credentials: [...primaryCredentials, ...linkedCredentials] };
};

export default getUnifiedProfile;
