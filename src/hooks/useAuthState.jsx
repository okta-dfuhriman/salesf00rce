/** @format */

import { useContext } from 'react';
import { AuthStateContext } from '../providers/AuthProvider/AuthContext';

const useAuthState = () => {
	const context = useContext(AuthStateContext);

	if (context === undefined) {
		throw new Error('useAuthState must be used within an AuthProvider!');
	}
	return context;
};

export default useAuthState;
