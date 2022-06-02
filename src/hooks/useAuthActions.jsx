/** @format */
import { _, ApiError, Okta } from '../common';
import { getStoredUser } from '../providers/AuthProvider/AuthReducer';

const GOOGLE_IDP_ID = '0oa3cdpdvdd3BHqDA1d7';
const LINKEDIN_IDP_ID = '0oa3cdljzgEyGBMez1d7';
const APPLE_IDP_ID = '';
const FACEBOOK_IDP_ID = '0oa3cdkzv0cGPFifd1d7';
const SALESFORCE_IDP_ID = '0oa3cdq1662ouS1uG1d7';

const idpMap = {
	google: GOOGLE_IDP_ID,
	linkedin: LINKEDIN_IDP_ID,
	apple: APPLE_IDP_ID,
	facebook: FACEBOOK_IDP_ID,
	salesforce: SALESFORCE_IDP_ID,
	[GOOGLE_IDP_ID]: 'google',
	[LINKEDIN_IDP_ID]: 'linkedin',
	[FACEBOOK_IDP_ID]: 'facebook',
	[SALESFORCE_IDP_ID]: 'salesforce',
};

const useAuthActions = _oktaAuth => {
	try {
		const { authState, oktaAuth } = Okta.useOktaAuth() || { oktaAuth: _oktaAuth };

		const silentAuth = async (
			dispatch,
			{ hasSession: _hasSession, isAuthenticated: _isAuthenticated, update = true }
		) => {
			try {
				const config = {};

				let isAuthenticated = _isAuthenticated;
				let authState = {};

				// If are not sure if the user is already authenticated, double check.
				if (_isAuthenticated === undefined) {
					// Checks if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
					isAuthenticated = await oktaAuth.isAuthenticated();
				}

				let result = { type: 'SILENT_AUTH_ABORTED' };

				if (!isAuthenticated) {
					if (dispatch) {
						dispatch({ type: 'SILENT_AUTH_STARTED' });
					}

					const hasSession = _hasSession || (await oktaAuth.session.exists());

					if (hasSession) {
						// Have a session but no tokens in tokenManager.
						// ** Hail Mary attempt to authenticate via existing session. **

						const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

						if (tokens) {
							await oktaAuth.tokenManager.setTokens(tokens);

							result = {
								type: 'SILENT_AUTH_SUCCESS',
								payload: { isAuthenticated },
							};

							if (update) {
								authState = await oktaAuth.authStateManager.updateAuthState();

								result.payload = { ...result.payload, authState };
							}
						}
					}
				}

				if (dispatch) {
					dispatch(result);
				}

				return { isAuthenticated };
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'SILENT_AUTH_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithCredentials = async (dispatch, { username, password }) => {
			try {
				dispatch({ type: 'LOGIN_WITH_CREDENTIALS_STARTED' });

				oktaAuth
					.signInWithCredentials({ username, password, sendFingerprint: true })
					.then(async transaction => {
						if (transaction.status === 'SUCCESS') {
							oktaAuth.signInWithRedirect({ sessionToken: transaction.sessionToken });
						}
					});
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const signInWithRedirect = async (dispatch, options) => {
			const { idp } = options || {};

			if (dispatch) {
				dispatch({ type: 'LOGIN_WITH_REDIRECT_STARTED' });
			}

			if (idp) {
				options = {
					...options,
					idp: idpMap[idp],
				};
			}

			return await oktaAuth.signInWithRedirect(options);
		};

		const login = async (dispatch, props) => {
			try {
				const { username, password, idp, isSignUp = false } = props || {};
				// eslint-disable-next-line camelcase

				if (username && password) {
					return await loginWithCredentials(dispatch, { username, password });
				}

				if (idp) {
					return await signInWithRedirect(dispatch, idp);
				}

				if (oktaAuth.isLoginRedirect()) {
					dispatch({ type: 'LOGIN_CODE_EXCHANGE_STARTED' });

					await oktaAuth.handleLoginRedirect();

					dispatch({ type: 'LOGIN_SUCCESS' });
					return;
					// return await getUserInfo(dispatch);
				}

				if (!authState?.isAuthenticated) {
					oktaAuth.setOriginalUri(window.location.href);

					const hasSession = await oktaAuth.session.exists();

					if (!hasSession) {
						const loginHint = isSignUp ? 'signup' : props?.loginhint;

						return await signInWithRedirect(dispatch, { idp, loginHint });
					}

					return await silentAuth(dispatch, { hasSession });
				}
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const logout = async (dispatch, { userId, slo = true, postLogoutRedirect }) => {
			try {
				let config = {};

				if (postLogoutRedirect) {
					config = { postLogoutRedirectUri: postLogoutRedirect };
				}
				dispatch({ type: 'LOGOUT_STARTED' });

				console.info('executing logout...');

				// 1) Clear Idp sessions and revoke all tokens
				if (slo && userId) {
					const url = `${window.location.origin}/api/v1/users/${userId}/sessions`;

					const response = await fetch(url, { method: 'DELETE' });

					if (!response.ok) {
						throw new Error('Unable to clear user sessions!');
					}
				}

				// 2) Clear Session Storage
				sessionStorage.clear();

				// 3) Do Okta Sign Out, which results in a redirect.
				return oktaAuth.signOut(config);
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'LOGOUT_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const linkUser = async (dispatch, options) => {
			try {
				const { idp } = options || {};

				// 1) Update the redirect_uri. This will need to be restored after!
				const LINK_REDIRECT_URI = `${window.location.origin}/identities/callback`;

				oktaAuth.options.redirectUri = LINK_REDIRECT_URI;

				if (oktaAuth.isLoginRedirect()) {
					dispatch({
						type: 'USER_LINK_PENDING',
					});

					const primaryAccessToken = oktaAuth.getAccessToken();

					// The `sub` claim will always be the subject of the accessToken. The `uid` will represent that user that is actually logged in.
					const {
						payload: { uid },
					} = await oktaAuth.token.decode(primaryAccessToken);

					await oktaAuth.handleLoginRedirect();

					const linkAccessToken = oktaAuth.getAccessToken();

					const requestOptions = {
						method: 'post',
						headers: {
							Authorization: `Bearer ${primaryAccessToken}`,
						},
						body: JSON.stringify({
							linkWith: linkAccessToken,
						}),
					};

					const url = `${window.location.origin}/api/v1/users/${uid}/identities`;

					const response = await fetch(url, requestOptions);

					if (!response.ok) {
						throw new Error(await response.json());
					}

					const renewedAccessToken = await oktaAuth.tokenManager.renew('accessToken');

					// restore the redirect_uri
					oktaAuth.options.redirectUri = `${window.location.origin}/login/callback`;

					if (!renewedAccessToken) {
						return dispatch({
							type: 'USER_LINK_FAILED',
							error: 'Unable to renew the accessToken. Something went wrong!',
						});
					}

					return dispatch({
						type: 'USER_LINK_SUCCEEDED',
					});
				} else {
					const scopes = oktaAuth.options.scopes;

					dispatch({
						type: 'USER_LINK_STARTED',
					});

					console.group(' ===== CURRENT ORIGINAL URI ===== ');
					console.log(oktaAuth.getOriginalUri());
					console.groupEnd();

					// Ensures we reroute to the /settings page where we started.
					await oktaAuth.setOriginalUri(window.location.href);

					console.group(' ===== NOW RETURNING TO ===== ');
					console.log(oktaAuth.getOriginalUri());
					console.groupEnd();

					const requestOptions = {
						idp: idpMap[idp],
						prompt: 'login',
						scopes: [...scopes, 'user:link'],
					};

					if (idp === 'email' || idp === 'password') {
						delete requestOptions.idp;

						requestOptions['loginHint'] = 'email';
					}
					console.log(requestOptions);

					await oktaAuth.signInWithRedirect(requestOptions);
				}

				// call /api/v1/users/{{userId}}/identities
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'USER_LINK_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const unlinkUser = async (dispatch, credential) => {
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

				return dispatch({ type: 'USER_UNLINK_SUCCEEDED', item: credential });
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'USER_UNLINK_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		return {
			linkUser,
			login,
			logout,
			signInWithRedirect,
			silentAuth,
			unlinkUser,
		};
	} catch (error) {
		throw new Error(`useAuthActions init error [${error}]`);
	}
};

export default useAuthActions;
