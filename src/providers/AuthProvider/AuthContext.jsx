/* eslint-disable react-hooks/exhaustive-deps */
/** @format */

import { PropTypes, React } from '../../common';
import { AuthReducer, initialState } from './AuthReducer';
import AuthDispatchContext from './AuthDispatcher';

export const AuthStateContext = React.createContext();

const AuthProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(AuthReducer, initialState);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValues = {
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
