import {
	LDS,
	ReactQuery,
	getProfilePicture,
	getUserName,
	useUserInfoQuery,
	useUserProfileQuery,
} from '../../common';

import DropdownCard from '../DropdownCard';

const UserMenu = () => {
	const isPendingLogout = ReactQuery.useIsMutating('logout') > 0;

	const { isLoading: isLoadingUserInfo, data: userInfo } = useUserInfoQuery();

	const { data: user } = useUserProfileQuery();

	const { profile } = user || {};

	return (
		<>
			{isPendingLogout || isLoadingUserInfo || !userInfo?.sub ? (
				<div
					className='slds-m-right_small'
					style={{ position: 'relative', width: '8rem', height: '3rem' }}
				>
					<LDS.Spinner
						variant='brand'
						size='small'
						containerClassName='slds-align_absolute-center slds-p-around_large '
						containerStyle={{ left: 'unset', right: 'unset' }}
					/>
				</div>
			) : (
				<>
					<div className='slds-m-right_small'>
						<LDS.Dropdown
							className='header-dropdown'
							align='right'
							width='small'
							menuStyle={{ width: '16rem', border: 'none', boxShadow: 'none' }}
						>
							<DropdownCard />
							<LDS.DropdownTrigger>
								<LDS.Button variant='base' className='tds-avatar'>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignContent: 'center',
											alignItems: 'center',
											justifyContent: 'flex-start',
										}}
									>
										<div
											className='tds-text-size_3 tds-text_bold slds-text-align_right slds-m-right_small slds-truncate'
											style={{ color: 'black' }}
										>
											{getUserName(userInfo, profile)}
										</div>
										<LDS.Avatar
											imgSrc={getProfilePicture(userInfo, profile)}
											imgAlt={profile?.email ?? userInfo?.email ?? 'user avatar'}
											size='medium'
										/>
									</div>
								</LDS.Button>
							</LDS.DropdownTrigger>
						</LDS.Dropdown>
					</div>
				</>
			)}
		</>
	);
};

export default UserMenu;
