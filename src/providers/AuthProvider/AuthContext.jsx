/* eslint-disable react-hooks/exhaustive-deps */
/** @format */
import * as React from 'react';
import * as Okta from '@okta/okta-auth-js';
import * as OktaReact from '@okta/okta-react';

import { Auth, PropTypes, ReactQuery, ReactRouter } from '../../common';
import AuthDispatchContext from './AuthDispatcher';
import { authConfig } from '../../common/config/authConfig';

export const AuthStateContext = React.createContext();

const oktaAuth = new Okta.OktaAuth(authConfig.oidc);

const AuthProvider = ({ children }) => {
	const queryClient = ReactQuery.useQueryClient();
	const isPendingLogin = ReactQuery.useIsMutating('login') > 0;

	const navigate = ReactRouter.useNavigate();

	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(Okta.toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	const customAuthHandler = () => {
		navigate('/', { replace: true });
	};

	const [state, dispatch] = React.useReducer(Auth.Reducer, Auth.initialState);
	React.useLayoutEffect(() => {
		const initAuthState = async () => {
			if (!oktaAuth.isLoginRedirect()) {
				let isAuthenticated = (await oktaAuth.isAuthenticated()) || false;

				console.group('initAuthState()');
				console.log('isAuthenticated:', isAuthenticated);
				console.groupEnd();

				if (!isAuthenticated) {
					const { isAuthenticated: _isAuthenticated } = await Auth.silentAuth({
						oktaAuth,
						options: {
							isAuthenticated,
							update: false,
						},
					});

					isAuthenticated = _isAuthenticated;
				}

				return isAuthenticated;
			}
		};

		const initApp = async (_oktaAuth, _queryClient) => {
			const isAuthenticated = await initAuthState(_oktaAuth);

			oktaAuth.start();

			dispatch({ type: 'APP_INITIALIZED', payload: { isAuthenticated } });
		};

		const handler = authState => {
			queryClient.invalidateQueries('user');

			dispatch({ type: 'AUTH_STATE_UPDATED', payload: { authState } });
		};

		console.log('AuthContext > authStateManager.subscribe()');

		oktaAuth.authStateManager.subscribe(handler);

		console.log('AuthContext > initAuthState()');

		initApp(oktaAuth, queryClient).catch(error =>
			console.error(`Unable to initialize app! [${error}]`)
		);

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	React.useEffect(() => {
		const { isAuthenticated } = state || {};

		if (isAuthenticated && (!oktaAuth.isLoginRedirect() || !isPendingLogin)) {
			console.log('AuthContext > getUserInfo()');

			queryClient.prefetchQuery(['user', 'info'], () => Auth.userInfoQuery({ oktaAuth }));
		}
	}, [state?.isAuthenticated, isPendingLogin]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...state,
	};

	return (
		<AuthStateContext.Provider value={contextValues}>
			<OktaReact.Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
			</OktaReact.Security>
		</AuthStateContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
