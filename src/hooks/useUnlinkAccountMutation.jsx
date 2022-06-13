import { Errors, Okta, ReactQuery } from '../common';

const unlinkAccountMutation = async ({ credential, oktaAuth }) => {
	try {
		const {
			id,
			provider: { id: idpId },
			isLoggedIn,
		} = credential;

		if (isLoggedIn) {
			throw new Errors.AppError({
				message: 'Cannot disconnect the currently logged in account.',
				type: 'USER_UNLINK_FAILED',
			});
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
			throw new Errors.ApiError({
				statusCode: response.statusCode,
				message: `Unable to unlink user ${id}`,
				json: (await response.json()) || '',
			});
		}

		await oktaAuth.tokenManager.renew('accessToken');

		return id;
	} catch (error) {
		throw new Errors.AppError({ type: 'USER_UNLINK_FAILED', error });
	}
};

export const useUnlinkAccountMutation = options => {
	const { oktaAuth } = Okta.useOktaAuth();

	const queryClient = ReactQuery.useQueryClient();

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
