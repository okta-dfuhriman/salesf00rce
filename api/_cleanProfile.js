import * as _ from 'lodash';

const cleanProfile = async profile => {
	const result = {};

	for (const key in profile) {
		if (!_.isEmpty(profile[key])) {
			result[key] = profile[key];
		}
	}

	return result;
};

export default cleanProfile;
