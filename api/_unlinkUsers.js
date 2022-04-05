const LINKED_OBJECT_NAME = 'primaryUser';

const unlinkUsers = async (req, res, client) => {
	try {
		const {
			query: { id: associatedUserId },
			// headers,
		} = req || {};
		// TODO 1) Validate JWT

		// if (!isValid) {
		// 	if (error) {
		// 		throw error;
		// 	} else {
		// 		return res.status(401).json('Unauthorized');
		// 	}
		// }

		// 2) Unlink objects

		const url = `/api/v1/users/${associatedUserId}/linkedObjects/${LINKED_OBJECT_NAME}`;

		const response = await client.fetch({ url, options: { method: 'delete' } });

		if (response.status === 204) {
			// 3) Unlink success! Now onto the profile un-merge...
			// TODO should we really be putting a 'linkedUsers' array on the primary profile?

			// 4) Remove unifiedId from profile.
			const user = await client.getUser(associatedUserId);

			user.profile.unifiedId = '';
			user.profile.isUnifiedProfile = false;

			await user.update();

			return res.status(204).send();
		}
	} catch (error) {
		console.error(error);
		return res.status(error?.statusCode ?? 500).json({
			code: error?.code,
			message: error?.message,
		});
	}
};

export default unlinkUsers;
