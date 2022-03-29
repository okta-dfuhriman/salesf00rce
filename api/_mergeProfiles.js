import * as _ from 'lodash';
import { ulid as ULID } from 'ulid';

import { ApiError } from './_error';
import cleanProfile from './_cleanProfile';

/**
 *
 * @param {*} id Okta userId for the primary user.
 * @param {*} associatedUserId Okta userId for the user getting linked to the primary user.
 * @param {*} associatedLogin Okta login/username for the associated user.
 * @param {*} client Instance of Okta Node SDK.
 * @returns {Object} The primary user.
 */
const mergeProfiles = async (id, associatedUserId, associatedLogin, client) => {
	// 1) generate a ULID to be used for the unifiedId. This will be persisted across all profiles.
	const ulid = ULID();

	// 2) Fetch the primaryUser & associatedUser & stage the profile changes.
	const primaryUser = await client.getUser(id);
	const associatedUser = await client.getUser(associatedUserId);

	const {
		profile: { unifiedId, linkedUsers },
	} = primaryUser;

	if (
		Array.isArray(linkedUsers) &&
		linkedUsers.length > 0 &&
		linkedUsers.includes(associatedLogin)
	) {
		throw new ApiError({
			statusCode: 400,
			message: `User ${associatedLogin} (${associatedUserId}) already linked to primary user ${id}`,
		});
	}

	if (_.isEmpty(unifiedId)) {
		primaryUser.profile.unifiedId = ulid;
		associatedUser.profile.unifiedId = ulid;
	} else {
		associatedUser.profile.unifiedId = unifiedId;
	}

	primaryUser.profile.linkedUsers.push(associatedLogin);

	// 4) Update profiles and return the primary profile.
	const updatedAssociatedUser = await associatedUser.update();

	const updatedPrimaryUser = await primaryUser.update();

	const primaryProfile = await cleanProfile(updatedPrimaryUser?.profile);

	primaryProfile['linkedUsers'] = [
		{
			id: associatedUserId,
			...(await cleanProfile(updatedAssociatedUser?.profile)),
		},
	];

	if (updatedPrimaryUser?.profile?.linkedUsers?.length > 1) {
		for (let i = 0; i < updatedPrimaryUser.profile.linkedUsers.length; i++) {
			const linkedUserLogin = updatedPrimaryUser.profile.linkedUsers[i];

			if (linkedUserLogin !== associatedLogin) {
				const { id, profile } = await client.getUser(linkedUserLogin);

				primaryProfile.linkedUsers.push({ id, ...(await cleanProfile(profile)) });
			}
		}
	}

	return { ...updatedPrimaryUser, profile: primaryProfile };

	// .then(user => {
	// 	return user;
	// })
	// .catch(error => {
	// 	throw new ApiError({
	// 		message: `.update() failed [${error.message.toString()}]`,
	// 	});
	// });
};

export default mergeProfiles;
