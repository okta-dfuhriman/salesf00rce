/* eslint-disable react-hooks/exhaustive-deps */
/** @format */
import { Auth, LDS, useEffect } from '../../common';

export const AppLoginCallback = () => {
	const dispatch = Auth.useAuthDispatch();
	const { login } = Auth.useAuthActions();

	useEffect(() => {
		console.debug('LoginCallback > login()');
		return login(dispatch);
	}, []);

	console.debug('LoginCallback > <LDS.Spinner/>');
	return <LDS.Spinner size='large' variant='brand' />;
};

export default AppLoginCallback;
