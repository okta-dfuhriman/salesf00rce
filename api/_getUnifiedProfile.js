import { getLinkedProfiles, getOktaUser } from './_common';

const getUnifiedProfile = async sub => {
	// 1) Get the Okta user
	const user = await getOktaUser(sub);

	const { id, profile: userProfile } = user;

	// 2) Get linked users
	const linkedUsers = await getLinkedProfiles({ id, unifiedId: userProfile?.unifiedId });

	const { login, providers } = userProfile;
	const _linkedUsers = [...linkedUsers, { id, login, providers }];

	// 3) Generate accounts per linked user
	const accounts = _linkedUsers
		.map(({ id: linkedId, login, providers = [] }) =>
			providers.map(provider => {
				return { id: linkedId, login, provider, isLoggedIn: id !== linkedId };
			})
		)
		.flat();

	return { ...user, profile: { ...userProfile, linkedUsers, accounts } };
};

export default getUnifiedProfile;
