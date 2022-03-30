import { Auth } from '../../common';

const ErrorHandler = ({ err }) => {
	const { error } = Auth.useAuthState();

	const e = error ?? err;

	if (e?.isError || e?.error || err) {
		if (e?.Name && e?.Message) {
			return (
				<p>
					{e.Name}: {e.Message}
				</p>
			);
		}
		return <p>Error: {e.toString()}</p>;
	}

	return null;
};

export default ErrorHandler;
