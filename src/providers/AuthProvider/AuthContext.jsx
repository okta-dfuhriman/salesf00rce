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
	const { getUser } = useAuthActions();

	useEffect(() => {
		if (!state?.user) {
			return getUser(dispatch);
		}
	}, [oktaAuth, state?.user]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
		...useAuthActions(),
		...state,
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
