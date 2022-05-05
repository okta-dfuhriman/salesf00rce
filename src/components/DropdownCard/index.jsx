import { Auth, LDS, Link, aridDunes } from '../../common';

import './styles.css';

const DropdownCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { logout } = Auth.useAuthActions();
	const { profile, userInfo } = Auth.useAuthState();

	return (
		<div className='dropdown-menu' id='dropdown'>
			<div className='menu__banner' style={{ backgroundImage: `url(${aridDunes})` }} />
			<div
				className='menu__banner-photo'
				style={
					profile?.picture || userInfo?.picture
						? {
								backgroundImage: `url(${profile?.picture || userInfo?.picture})`,
						  }
						: {}
				}
			/>
			<div className='menu__header'>{userInfo?.name}</div>
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
