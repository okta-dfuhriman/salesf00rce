import { Auth, LDS, Link, isUrl } from '../../common';

import './styles.css';

const DropdownCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { logout } = Auth.useAuthActions();
	const { profile, userInfo } = Auth.useAuthState();

	const picture = profile?.picture ?? userInfo?.picture;
	const name =
		profile?.nickName ??
		userInfo?.nickname ??
		profile?.firstName ??
		userInfo?.given_name ??
		profile?.displayName ??
		userInfo?.name ??
		'';

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' />
			<div
				className='menu__banner-photo'
				style={
					isUrl(picture)
						? {
								backgroundImage: `url(${picture})`,
						  }
						: {}
				}
			/>
			<div className='menu__header'>{name}</div>
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
					onClick={() => logout(dispatch)}
				/>
			</div>
		</div>
	);
};

export default DropdownCard;
