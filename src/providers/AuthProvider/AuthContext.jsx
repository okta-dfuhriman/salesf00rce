/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import { createContext, useEffect, useReducer, PropTypes } from '../../common';
import { useOktaAuth } from '@okta/okta-react';
import useAuthActions from '../../hooks/useAuthActions';
import { AuthReducer, initialState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = createContext();

const AuthProvider = ({ children }) => {
	const { oktaAuth } = useOktaAuth();
	const [state, dispatch] = useReducer(AuthReducer, initialState);
	const { getUser, getUserInfo } = useAuthActions();

	useEffect(() => {
		if (
			!oktaAuth.isLoginRedirect() &&
			!state?.isLoadingLinkProfile &&
			!state?.isLoadingUserProfile &&
			(!state?.userInfo || state?.isStaleUserProfile)
		) {
			return getUserInfo(dispatch);
		}
	}, [
		state?.userInfo,
		state?.isLoadingUserProfile,
		state?.isLoadingLinkProfile,
		state?.isStaleUserProfile,
	]);

	useEffect(() => {
		if (
			state?.isAuthenticated &&
			!state?.isLoadingUserProfile &&
			!state?.isLoadingLinkProfile &&
			state?.userInfo?.sub &&
			(state?.isStaleUserProfile || !state?.user)
		) {
			return getUser(dispatch, state.userInfo.sub);
		}
	}, [
		state?.isAuthenticated,
		state?.isLoadingUserProfile,
		state?.isLoadingLinkProfile,
		state?.userInfo?.sub,
		state?.isStaleUserProfile,
		state?.user,
	]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...useAuthActions(),
		...state,
	};

	useEffect(() => {
		oktaAuth.tokenManager.on('renewed', (key, newToken, oldToken) => {
			console.info('Token with key', key, 'has been renewed');
			console.info('New token:', newToken);
		});

		return () => oktaAuth.tokenManager.off('renewed');
	}, []);

	return (
		<AuthStateContext.Provider value={contextValues}>
			<AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
