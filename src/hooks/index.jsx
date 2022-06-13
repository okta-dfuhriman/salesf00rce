import { useLoginMutation, silentAuth, signInWithRedirect } from './useLoginMutation';
import * as useLinkAccountMutation from './useLinkAccountMutation';
import * as useLogoutMutation from './useLogoutMutation';
import * as useUserInfoQuery from './useUserInfoQuery';
import * as useUserProfileQuery from './useUserProfileQuery';
import * as useUnlinkAccountMutation from './useUnlinkAccountMutation';

export const Mutations = {
	useLoginMutation,
	useLinkAccountMutation,
	useLogoutMutation,
	useUnlinkAccountMutation,
};

export const Queries = {
	useUserInfoQuery,
	useUserProfileQuery,
};

export { silentAuth, signInWithRedirect };

export * from './useAuthDispatch';
export * from './useAuthState';
export * from './useBodyClass';
export * from './useLockBodyScroll';
