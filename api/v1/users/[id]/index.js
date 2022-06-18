import { getUnifiedProfile, updateUnifiedProfile, validateJwt } from '../../../_common';
import { ErrorResponse } from '../../../_error';

const doAuthZ = async (req, res) => {
	try {
		// 1) Validate the accessToken

		const { isValid, error, accessToken } = await validateJwt({}, req);

		if (!isValid) {
			if (error) {
				throw error;
			} else {
				return new ErrorResponse(401, res);
			}
		}

		return accessToken;
	} catch (error) {}
};

const getUser = async (req, res) => {
	try {
		// 1) Validate the accessToken
		const accessToken = await doAuthZ(req, res);

		// Return the unified profile
		return res.json(await getUnifiedProfile(accessToken));
	} catch (error) {
		throw new Error(`getUser(): ${error}`);
	}
};

const updateUser = async (req, res) => {
	try {
		// 1) Validate the accessToken
		const accessToken = await doAuthZ(req, res);

		const {
			query: { id },
		} = req || {};

		return res.json(await updateUnifiedProfile({ accessToken, body: await req.json(), id }));
	} catch (error) {
		throw new Error(`updateUser(): ${error}`);
	}
};

module.exports = async (req, res) => {
	try {
		const { method } = req;

		switch (method) {
			case 'GET':
			case 'HEAD':
				return await getUser(req, res);
			case 'POST':
				return await updateUser(req, res);
			default:
				return res.status(501).send();
		}
	} catch (error) {
		return res
			.status(error?.statusCode ?? 500)
			.json({ code: error?.code, message: error?.message.toString() });
	}
};
