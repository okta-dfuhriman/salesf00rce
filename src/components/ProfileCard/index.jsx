import { _, LDS } from '../../common';
import './styles.css';

const Avatar = () => (
	<div className='about-me-avatar'>
		<Avatar
			imgSrc='https://trailblazer.me/resource/1549581942000/astro'
			imgAlt='Danny Fuhriman'
			style={{ position: 'absolute', top: '-6px' }}
			className='slds-is-relative slds-m-right_medium'
		/>
	</div>
);

const Details = () => (
	<div className='details'>
		<h1 title='Danny Fuhriman' className='name truncate'>
			Danny Fuhriman
		</h1>
		<div className='company truncate'>Okta Inc.</div>
		<div className='location'>California</div>
		<div className='social-links'></div>
	</div>
);

const ProfileCard = () => (
	<div className='card p-top_large'>
		<div className='card__body card__body_inner'>
			<div className='heading'>
				<Avatar />
			</div>
		</div>
	</div>
);

export default ProfileCard;
