/** @format */

import { useContext } from 'react';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';

const useAuthDispatch = () => {
	const context = useContext(AuthDispatchContext);

	if (context === undefined) {
		throw new Error('useAuthDispatch must be used within an AuthProvider!');
	}
	return context;
};

export default useAuthDispatch;
