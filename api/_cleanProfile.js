import * as _ from 'lodash';

const cleanProfile = async profile => {
	const result = {};

	for (const key in profile) {
		if (!_.isEmpty(profile[key])) {
			result[key] = profile[key];
		}
	}

	const { displayName, nickName, firstName, lastName } = result;

	const name = displayName ?? `${firstName} ${lastName}`;

	return { ...result, name };
};

export default cleanProfile;
