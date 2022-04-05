import {
	Auth,
	LDS,
	AppleIcon,
	EmailIcon,
	FacebookIcon,
	GoogleIcon,
	LinkedInIcon,
	SalesforceIcon,
} from '../../../common';

const AuthButtons = () => {
	const dispatch = Auth.useAuthDispatch();
	const { isSignUp, isEmailAuth } = Auth.useAuthState();
	const { login, toggleEmailAuth } = Auth.useAuthActions();

	const handleClick = idp => {
		login(dispatch, { idp });
	};

	return (
		<span id='authButtons'>
			<div className='slds-m-bottom_small'>
				<button
					className='button slds-button slds-button_brand tds-button_full tds-button_large'
					id='signup_or_signin_with_salesforce'
					onClick={() => handleClick('salesforce')}
					type='button'
				>
					<SalesforceIcon className='slds-button__icon slds-button__icon_large' />
					<span>Salesforce</span>
				</button>
			</div>
			<div align='center' className='div-or slds-m-bottom_medium slds-m-top_large'>
				<hr className='hr-or' />
				<span className='tds-color_midnight slds-m-horizontal_small'>Or</span>
				<hr className='hr-or' />
			</div>
			<div align='center' className='divwithbuttonsandtooltips'>
				<LDS.Tooltip align='top' content='Email'>
					<button
						aria-label='Email'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => toggleEmailAuth(dispatch, { isSignUp, isEmailAuth })}
						type='button'
					>
						<EmailIcon className='slds-button__icon slds-button__icon_large' />
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='Google'>
					<button
						aria-label='Google'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('google')}
						type='button'
					>
						<GoogleIcon className='slds-button__icon slds-button__icon_large' />
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='LinkedIn'>
					<button
						aria-label='LinkedIn'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('linkedin')}
						type='button'
					>
						<LinkedInIcon className='slds-button__icon slds-button__icon_large' />
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='Apple'>
					<button
						aria-label='Apple'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('apple')}
						type='button'
						disabled
					>
						<AppleIcon height={'1.5rem'} width={'1.5rem'} />
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='Facebook'>
					<button
						aria-label='Facebook'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('facebook')}
						type='button'
					>
						<FacebookIcon className='slds-button__icon slds-button__icon_large' />
					</button>
				</LDS.Tooltip>
			</div>
		</span>
	);
};

export default AuthButtons;
