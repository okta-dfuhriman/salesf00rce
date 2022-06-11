import {
	LDS,
	Link,
	getProfilePicture,
	getUserName,
	useLogoutMutation,
	useUserInfoQuery,
	useUserProfileQuery,
} from '../../common';

import './styles.css';

const DropdownCard = () => {
	const logout = useLogoutMutation();

	const { data: userInfo } = useUserInfoQuery();
	const { data: user } = useUserProfileQuery({ userInfo });
	const { profile } = user || {};

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' />
			<div
				className='menu__banner-photo'
				style={{
					backgroundImage: `url(${getProfilePicture(userInfo, profile)})`,
				}}
			/>
			<div className='menu__header'>{getUserName(userInfo, profile)}</div>
			<ul className='menu__items'>
				<li role='presentation'>
					<Link to='/' className='menu__item' role='menuitem'>
						Profile
					</Link>
				</li>
				<li role='presentation'>
					<Link to='/settings' className='menu__item' role='menuitem'>
						Settings
					</Link>
				</li>
			</ul>
			<div className='menu__footer'>
				<LDS.Button
					className='menu__item'
					variant='base'
					label='Logout'
					onClick={() => logout.mutate({ userId: profile?.id ?? userInfo?.sub })}
				/>
			</div>
		</div>
	);
};

export default DropdownCard;
