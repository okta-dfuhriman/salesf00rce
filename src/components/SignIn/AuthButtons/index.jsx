import { Auth, LDS } from '../../../common';

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
					<img
						alt='Salesforce'
						className='slds-button__icon slds-button__icon_large'
						src='assets/icons/salesforce.svg'
					/>
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
						<img
							alt='Email'
							className='slds-button__icon slds-button__icon_large'
							src='assets/images/email.svg'
						/>
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='Google'>
					<button
						aria-label='Google'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('google')}
						type='button'
					>
						<img
							alt='Google'
							className='slds-button__icon slds-button__icon_large'
							src='assets/images/google.svg'
						/>
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='LinkedIn'>
					<button
						aria-label='LinkedIn'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('linkedin')}
						type='button'
					>
						<img
							alt='LinkedIn'
							className='slds-button__icon slds-button__icon_large'
							src='assets/images/linkedin.svg'
						/>
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
						<img
							alt='Apple'
							className='slds-button__icon slds-button__icon_large'
							src='assets/images/apple.svg'
						/>
					</button>
				</LDS.Tooltip>
				<LDS.Tooltip align='top' content='Facebook'>
					<button
						aria-label='Facebook'
						className='tbid-button slds-button_neutral slds-icon_container slds-icon_container_circle circle-button'
						onClick={() => handleClick('facebook')}
						type='button'
					>
						<img
							alt='Facebook'
							className='slds-button__icon slds-button__icon_large'
							src='assets/images/facebook.svg'
						/>
					</button>
				</LDS.Tooltip>
			</div>
		</span>
	);
};

export default AuthButtons;
