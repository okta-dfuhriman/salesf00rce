import { ApiError, Okta, ReactQuery } from '../common';

const unlinkAccountMutation = async ({ dispatch, credential, oktaAuth }) => {
	try {
		dispatch({ type: 'USER_UNLINK_STARTED' });

		const {
			id,
			provider: { id: idpId },
			isLoggedIn,
		} = credential;

		if (isLoggedIn) {
			throw new Error('Cannot disconnect the currently logged in account.');
		}

		const baseUrl = `${window.location.origin}/api/v1/users/${id}/identities`;

		const url = idpId ? baseUrl + `/${idpId}` : baseUrl;

		const options = {
			method: 'delete',
			headers: {
				authorization: `Bearer ${oktaAuth.getAccessToken()}`,
			},
		};

		const response = await fetch(url, options);

		if (response.status !== 204) {
			throw new ApiError({
				statusCode: response.statusCode,
				message: `Unable to unlink user ${id}`,
				json: (await response.json()) || '',
			});
		}

		await oktaAuth.tokenManager.renew('accessToken');

		dispatch({ type: 'USER_UNLINK_SUCCEEDED' });

		return id;
	} catch (error) {
		if (dispatch) {
			dispatch({ type: 'USER_UNLINK_FAILED', error });
		} else {
			throw new Error(error);
		}
	}
};

const useUnlinkAccountMutation = options => {
	const { oktaAuth } = Okta.useOktaAuth();

	const { queryClient } = options || {};

	return ReactQuery.useMutation(
		credential => unlinkAccountMutation({ ...options, credential, oktaAuth }),
		{
			onSuccess: credentialId => {
				queryClient.setQueryData(['user', 'profile'], user => {
					const credentials = user?.credentials.filter(({ id }) => id !== credentialId);

					return {
						...user,
						credentials,
					};
				});

				queryClient.invalidateQueries('user', {}, { cancelRefetch: true });
			},
		}
	);
};

export default useUnlinkAccountMutation;
