/** @format */
import { LDS, Mutations, Okta, React, ReactQuery } from '../../common';
import ErrorHandler from '../../components/ErrorHandler';

export const UserLinkCallback = () => {
	const { authState } = Okta.useOktaAuth();

	const queryClient = ReactQuery.useQueryClient();

	const { handleLinkRedirect } = Mutations.useLinkAccountMutation();

	const [callbackError] = React.useState();

	React.useEffect(() => {
		console.log('handling callback');
		handleLinkRedirect.mutate({ queryClient });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const authError = authState?.error;
	const displayError = callbackError || authError;
	if (displayError) {
		return <ErrorHandler error={displayError} />;
	}

	return <LDS.Spinner size='large' variant='brand' />;
};

export default UserLinkCallback;
