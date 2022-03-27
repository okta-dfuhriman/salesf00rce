/** @format */
import { Auth, LDS, useEffect } from '../../common';

export const AppLoginCallback = () => {
	const dispatch = Auth.useAuthDispatch();
	const { login } = Auth.useAuthActions();

	useEffect(() => {
		return login(dispatch);
	}, [login, dispatch]);

	return <LDS.Spinner size='large' variant='brand' />;
};

export default AppLoginCallback;
