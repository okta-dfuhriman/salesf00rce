import { getUnifiedProfile, validateJwt } from '../../../_common';

const getUser = async (req, res) => {
	try {
		// 1) Validate the accessToken

		const { isValid, error, accessToken } = await validateJwt({}, req);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return res.status(401).json('Unauthorized');
			}
		}

		// Return the unified profile
		return res.json(await getUnifiedProfile(accessToken));
	} catch (error) {
		throw new Error(`getUser(): ${error}`);
	}
};

module.exports = async (req, res) => {
	try {
		const { method } = req;

		switch (method) {
			case 'POST':
				// await updateUser(req, res);
				break;
			case 'GET':
			default:
				return await getUser(req, res);
		}
	} catch (error) {
		return res
			.status(error?.statusCode ?? 500)
			.json({ code: error?.code, message: error?.message.toString() });
	}
};
