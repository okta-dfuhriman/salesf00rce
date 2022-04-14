import { ApiError } from './_common';

const getIdps = async (id, client) => {
	try {
		const idps = await client.getIdps(id);

		const providers = [];

		for (let i = 0; i < idps.length; i++) {
			const { id: idpId, name } = idps[i];

			providers.push({ id: idpId, name: name?.toLowerCase() });
		}

		return providers;
	} catch (error) {
		console.error(error);
		throw new ApiError({ statusCode: error?.statusCode, message: error?.message });
	}
};

export default getIdps;
