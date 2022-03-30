/** @format */
import { Auth, LDS, Okta, React } from '../../common';
import ErrorHandler from '../../components/ErrorHandler';

export const UserLinkCallback = () => {
	const { authState } = Okta.useOktaAuth();
	const [callbackError, setCallbackError] = React.useState();
	const dispatch = Auth.useAuthDispatch();
	const { linkUser } = Auth.useAuthActions();

	React.useEffect(() => {
		return linkUser(dispatch);
	}, [linkUser, dispatch]);

	const authError = authState?.error;
	const displayError = callbackError || authError;
	if (displayError) {
		return <ErrorHandler error={displayError} />;
	}

	return <LDS.Spinner size='large' variant='brand' />;
};

export default UserLinkCallback;
