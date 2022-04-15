import * as _ from 'lodash';
import { ulid as ULID } from 'ulid';

/**
 *
 * @param {*} id Okta userId for the primary user.
 * @param {*} associatedUserId Okta userId for the user getting linked to the primary user.
 * @param {*} associatedLogin Okta login/username for the associated user.
 * @param {*} client Instance of Okta Node SDK.
 * @returns {Object} The primary user.
 */
const mergeProfiles = async ({ primaryId, associatedUid }, client) => {
	// 1) generate a ULID to be used for the unifiedId. This will be persisted across all profiles.
	const ulid = ULID();

	// 2) Fetch the primaryUser & associatedUser & stage the profile changes.
	const primaryUser = await client.getUser(primaryId);
	const associatedUser = await client.getUser(associatedUid);

	const {
		profile: { unifiedId },
	} = primaryUser;

	// if (linkedUsers.length > 0 && linkedUsers.includes(associatedLogin)) {
	// 	throw new ApiError({
	// 		statusCode: 400,
	// 		message: `User ${associatedLogin} (${associatedUserId}) already linked to primary user ${id}`,
	// 	});
	// }

	if (_.isEmpty(unifiedId)) {
		primaryUser.profile.unifiedId = ulid;
		associatedUser.profile.unifiedId = ulid;
	} else {
		associatedUser.profile.unifiedId = unifiedId;
	}

	// Mark as the primary/unified profile for convenience.
	primaryUser.profile.isUnifiedProfile = true;

	// 4) Update profiles and return the primary profile.
	await associatedUser.update();

	await primaryUser.update();

	return;
};

export default mergeProfiles;
