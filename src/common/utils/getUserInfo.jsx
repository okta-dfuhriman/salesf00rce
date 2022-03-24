/** @format */
import { actionTypes } from 'common';

const getUserInfo = async (oktaAuth, dispatch) => {
	try {
		const isAuthenticated = await oktaAuth.isAuthenticated();

		if (dispatch) {
			dispatch({
				type: actionTypes.user.info.fetch.start,
				payload: { isAuthenticated },
			});
		}

		let payload = { isAuthenticated, isLoadingProfile: false };

		if (isAuthenticated) {
			// console.debug('Fetching user info...');
			const user = await oktaAuth.getUser();

			if (user?.headers) {
				delete user.headers;
			}

			payload = { ...payload, user };

			localStorage.setItem('user', JSON.stringify(user));

			if (dispatch) {
				dispatch({ type: actionTypes.user.info.fetch.success, payload });
			}
		}
		return payload;
	} catch (error) {
		if (dispatch) {
			// console.error(error);
			dispatch({ type: actionTypes.user.info.fetch.error, error });
		} else {
			throw new Error(error);
		}
	}
};

export default getUserInfo;
