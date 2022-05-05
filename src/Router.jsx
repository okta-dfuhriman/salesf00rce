/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route, useNavigate } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import Profile from './pages/Profile';
import SecureApp from './components/SecureApp';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import UserLinkCallback from './pages/UserLinkCallback';

const Router = () => {
	const { authState, oktaAuth } = Okta.useOktaAuth();
	const navigate = useNavigate();
	const dispatch = Auth.useAuthDispatch();
	const { getUserInfo, getUser, silentAuth } = Auth.useAuthActions();
	const {
		isAuthenticated,
		isLoggedOut,
		isStaleUserInfo,
		isStaleUserProfile,
		isPendingAccountLink,
		isPendingUserInfoFetch,
		isPendingUserProfileFetch,
		userInfo,
		isPendingLogin,
		profile,
	} = Auth.useAuthState();
	React.useEffect(() => {
		const _authState = authState || oktaAuth.authStateManager.getAuthState();

		const _isAuthenticated = _authState?.isAuthenticated || isAuthenticated;

		if (
			!oktaAuth.isLoginRedirect &&
			!isLoggedOut &&
			!isPendingAccountLink &&
			!isPendingLogin &&
			!_isAuthenticated
		) {
			console.group('Router > silentAuth()');
			console.log('_isAuthenticated:', _isAuthenticated);
			console.groupEnd();

			silentAuth(dispatch);
		}
	}, [authState, isAuthenticated]);
	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		if (
			!isPendingAccountLink &&
			_isAuthenticated &&
			(isStaleUserInfo || !userInfo) &&
			!isPendingLogin &&
			!isPendingUserInfoFetch
		) {
			console.debug('Router > getUserInfo()');

			getUserInfo(dispatch);
		}
	}, [authState, isStaleUserInfo, isPendingAccountLink, isPendingLogin]);

	React.useEffect(() => {
		const _isAuthenticated = authState?.isAuthenticated || isAuthenticated;

		if (
			!isPendingAccountLink &&
			_isAuthenticated &&
			userInfo?.sub &&
			(isStaleUserProfile || !profile) &&
			!isPendingLogin &&
			!isPendingUserInfoFetch &&
			!isPendingUserProfileFetch
		) {
			console.debug('Router > getUser()');

			getUser(dispatch, { userId: userInfo.sub });
		}
	}, [
		authState?.isAuthenticated,
		isStaleUserProfile,
		isPendingAccountLink,
		isPendingLogin,
		isPendingUserInfoFetch,
	]);

	return (
		<Routes>
			<Route path='/login/callback' element={<AppLoginCallback />} />
			<Route path='/identities/callback' element={<UserLinkCallback />} />
			<Route element={<SecureApp />}>
				<Route path='/' element={<Profile />} />
				<Route path='settings' element={<Settings />} />
			</Route>
		</Routes>
	);
};

export default Router;
