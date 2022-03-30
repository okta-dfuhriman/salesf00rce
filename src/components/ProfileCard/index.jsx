import { Auth, LDS, Link } from '../../common';
import './ProfileCard.css';

const ProfileCard = () => {
	const { isLoadingUserInfo, userInfo } = Auth.useAuthState();

	const UserAvatar = (
		<div className='avatar'>
			<div style={{ position: 'absolute', top: '-6px' }}>
				<div className='slds-is-relative slds-m-right_medium user-avatar'>
					<LDS.Button
						style={{ backgroundImage: `url(${userInfo?.picture})` }}
						title='View Profile Picture'
						variant='base'
						className='avatar-img avatar-img_expandable'
					/>
					<div className='slds-is-absolute cAvatarUploader'>
						<LDS.Button
							title='Upload Profile Picture'
							iconCategory='utility'
							iconName='photo'
							iconVariant='border-filled'
							variant='icon'
							iconClassName='tds-button__icon tds-color_meteorite'
							className='tds-button_icon'
							style={{ width: '38px', height: '38px' }}
						/>
					</div>
				</div>
			</div>
		</div>
	);

	const UserBio = (
		<p className='bio'>
			<Link to='#' className='empty-state-link'>
				Tell us about yourself! Add a short bio.
			</Link>
		</p>
	);

	const UserDetails = (
		<div className='details'>
			<h1 title={userInfo?.name} className='name truncate'>
				{userInfo?.name}
			</h1>
			<div className='company truncate'>{userInfo?.organization ?? 'Unknown Employer'}</div>
			<div className='location'>{`${userInfo?.city ?? 'Unknown City'}, ${
				userInfo?.countryCode ?? 'Unknown Country'
			}`}</div>
			<div className='social-links'></div>
		</div>
	);

	const cardBody =
		isLoadingUserInfo || !userInfo ? (
			<LDS.Spinner variant='brand' />
		) : (
			<>
				<div className='edit'>
					<LDS.Button
						iconCategory='utility'
						iconName='edit'
						iconVariant='border-filled'
						iconSize='large'
					/>
				</div>
				<div className='heading'>
					{UserAvatar}
					{UserDetails}
				</div>
				{UserBio}
				<div className='footer'>
					<div className='slug'>
						<img
							alt=''
							src='data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2023.94%209.43%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m23.43%205.87a.93.93%200%200%200%20-.54.39%203%203%200%200%201%20-2.39%201.27%201.62%201.62%200%200%201%20-1.62-1%2014.08%2014.08%200%200%200%201.76-1.86%203.74%203.74%200%200%200%201.1-2.54%202%202%200%200%200%20-1.87-2.13h-.13c-2.84.07-4%202.74-3.94%205.3a4.65%204.65%200%200%200%20.2%201.17c-.59.68-1%201-1.25%201-.95%200-.66-1.91-.59-2.91s.34-3.15.12-3.44a3.37%203.37%200%200%200%20-1.7-.92%204.3%204.3%200%200%200%20-2.18%201.73%202.25%202.25%200%200%200%20-.09-.73%203.35%203.35%200%200%200%20-1.79-1%206.34%206.34%200%200%200%20-2.73%202.4c0-.49.24-2%200-2a4.83%204.83%200%200%200%20-2.23.29%2013.42%2013.42%200%200%200%20-.12%202.83c-.1%201.95-.41%204.16.24%205.35a2.28%202.28%200%200%200%201.73-.27%2018.25%2018.25%200%200%201%20.69-3.88%204.62%204.62%200%200%201%201.57-2.08c.2%200%20.22.63.19.9-.08%201.3-.34%204.77%200%205.16s1.71%200%202-.08a25.6%2025.6%200%200%200%20.27-3.27%204.86%204.86%200%200%201%201.59-2.74c.2%200%20.25.63.22.9%200%201.3-.12%204%20.17%204.64a1.76%201.76%200%200%200%201.44.93%206.68%206.68%200%200%200%201.78-.22%203.1%203.1%200%200%200%201.36-1.25%204.14%204.14%200%200%200%203.36%201.62%203.8%203.8%200%200%200%203.87-2.85c.08-.48-.13-.71-.49-.71zm-3.82-4.17c.08%200%20.19.09.24.27a3.63%203.63%200%200%201%20-.53%201.53%207.67%207.67%200%200%201%20-1.27%201.57c-.13-.87.29-3.52%201.56-3.37zm-17.23%206.24a1.19%201.19%200%201%201%20-1.19-1.19%201.19%201.19%200%200%201%201.19%201.19z%22%20fill%3D%22%2300a1df%22%2F%3E%3C%2Fsvg%3E'
							tabIndex='-1'
							className='slug-icon'
						/>
						<span tabIndex='-1' aria-hidden='true' className='slug-value'>
							https://trailblazer.me/id/dfuhriman1
						</span>
						<a
							href='https://trailblazer.me/id/dfuhriman1'
							target='_blank'
							rel='noopener noreferrer'
							className='slug-url truncate'
						>
							trailblazer.me/id/dfuhriman1
						</a>
						<LDS.Button
							iconCategory='utility'
							iconName='copy'
							iconVariant='border-filled'
							iconSize='large'
						/>
					</div>
				</div>
			</>
		);

	return (
		<div className='card p-top_large'>
			<div className='card__body card__body_inner' style={{ minHeight: '16rem' }}>
				{cardBody}
			</div>
		</div>
	);
};

export default ProfileCard;
