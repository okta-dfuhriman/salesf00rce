import { useLoginMutation, silentAuth, signInWithRedirect } from './useLoginMutation';
import { useLinkAccountMutation } from './useLinkAccountMutation';
import { useLogoutMutation } from './useLogoutMutation';
import { useUserInfoQuery, userInfoQueryFn } from './useUserInfoQuery';
import { useUserProfileQuery } from './useUserProfileQuery';
import { useUnlinkAccountMutation } from './useUnlinkAccountMutation';

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

export { silentAuth, signInWithRedirect, userInfoQueryFn };

export * from './useAuthDispatch';
export * from './useAuthState';
export * from './useBodyClass';
export * from './useLockBodyScroll';
