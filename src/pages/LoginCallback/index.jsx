/* eslint-disable react-hooks/exhaustive-deps */
/** @format */
import { LDS, React, useLoginMutation } from '../../common';

export const AppLoginCallback = () => {
	const login = useLoginMutation();

	React.useEffect(() => {
		console.debug('LoginCallback > login()');
		return login.mutate();
	}, []);

	console.debug('LoginCallback > <LDS.Spinner/>');
	return <LDS.Spinner size='large' variant='brand' />;
};

export default AppLoginCallback;
