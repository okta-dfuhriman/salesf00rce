/** @format */

import { createContext, useEffect, useReducer, PropTypes } from '../../common';
import { useOktaAuth } from '@okta/okta-react';
import useAuthActions from '../../hooks/useAuthActions';
import { AuthReducer, initialState, actions } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = createContext();

const AuthProvider = ({ children }) => {
	const { authState, oktaAuth } = useOktaAuth();
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			state?.userInfo?.sub &&
			(state?.isStaleUserProfile || !state?.user)
		) {
			return getUser(dispatch, state.userInfo.sub);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		oktaAuth.isLoginRedirect,
		state?.isAuthenticated,
		state?.isStaleUserProfile,
		state?.isLoadingUserProfile,
		state?.isLoadingLinkProfile,
		state?.userInfo?.sub,
	]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...useAuthActions(),
		...state,
		actions,
	};

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
