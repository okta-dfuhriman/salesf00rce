/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import { Auth } from '../../common';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { PropTypes, React, userInfoQueryFn } from '../../common';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { authConfig } from '../../common/config/authConfig';
import { AuthReducer, initialState, initializeState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = React.createContext();

const oktaAuth = new OktaAuth(authConfig.oidc);

const AuthProvider = ({ children }) => {
	const queryClient = useQueryClient();

	console.log(queryClient.getDefaultOptions());

	const navigate = useNavigate();
	const { silentAuth } = Auth.useAuthActions(oktaAuth);

	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};

	const [state, dispatch] = React.useReducer(AuthReducer, initialState, initializeState);

	React.useLayoutEffect(() => {
		const initAuthState = async () => {
			if (!oktaAuth.isLoginRedirect()) {
				let isAuthenticated = (await oktaAuth.isAuthenticated()) || false;

				if (!isAuthenticated) {
					isAuthenticated = await silentAuth(null, { isAuthenticated, update: false });
				}

				return isAuthenticated;
			}
		};
		const handler = authState => {
			if (authState && !authState.isAuthenticated) {
				queryClient.invalidateQueries('user');
			}

			dispatch({ type: 'AUTH_STATE_UPDATED', payload: { authState } });
		};

		console.log('AuthContext > authStateManager.subscribe()');

		oktaAuth.authStateManager.subscribe(handler);

		console.log('AuthContext > initAuthState()');

		initAuthState()
			.then(() => oktaAuth.start())
			.finally(() => dispatch({ type: 'APP_INITIALIZED' }));

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	React.useEffect(() => {
		const { isAuthenticated, isPendingLogin, isPendingAccountLink } = state || {};

		if (
			!isPendingAccountLink &&
			isAuthenticated &&
			(!oktaAuth.isLoginRedirect() || !isPendingLogin)
		) {
			console.group('AuthContext > getUserInfo()');

			queryClient.prefetchQuery(['user-info'], () => userInfoQueryFn({ dispatch, oktaAuth }));

			console.groupEnd();
		}
	}, [state?.isPendingAccountLink, state?.isAuthenticated, state?.isPendingLogin]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...state,
	};

	return (
		<AuthStateContext.Provider value={contextValues}>
			<Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
			</Security>
		</AuthStateContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
