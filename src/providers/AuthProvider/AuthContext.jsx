/** @format */

import { createContext, useEffect, useReducer, PropTypes } from '../../common';
import { useOktaAuth } from '@okta/okta-react';
import useAuthActions from '../../hooks/useAuthActions';
import { AuthReducer, initialState, actions } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = createContext();

const AuthProvider = ({ children }) => {
	const { oktaAuth } = useOktaAuth();
	const [state, dispatch] = useReducer(AuthReducer, initialState);
	const { getUserInfo } = useAuthActions();

	useEffect(() => {
		if (!state?.userInfo || state?.isStaleUserProfile) {
			return getUserInfo(dispatch);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [oktaAuth, state?.userInfo, state?.isStaleUserProfile]);

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
