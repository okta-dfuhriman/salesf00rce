import { Auth, LDS, useState } from '../../../common';

const EmailAuth = () => {
	const dispatch = Auth.useAuthDispatch();
	const {
		content: {
			header: { headline, subheadline },
			primaryCTA,
		},
		isSignUp,
		isEmailAuth,
		isRecovery,
	} = Auth.useAuthState();
	const { toggleEmailAuth } = Auth.useAuthActions();

	const [emailAddress, setEmailAddress] = useState();

	return (
		<LDS.IconSettings path='assets/icons'>
			<span>
				<span>
					<button
						className='slds-button slds-button--icon-border-filled tds-button_icon slds-button_icon tds-button_icon tds-button_icon-medium tbid-card__back'
						onClick={() => toggleEmailAuth(dispatch, { isRecovery, isSignUp, isEmailAuth })}
					>
						<img src='assets/images/arrow.png' alt='Back' />
						<span className='slds-assistive-text'>Back</span>
					</button>

					<div>
						<div className='slds-m-bottom_xx-small slds-m-top_x-small slds-text-align_center tbid-card-title-font'>
							<div>{headline}</div>
						</div>
						<div className='slds-text-align_center slds-text-body_regular slds-m-bottom_large tds-color_midnight'>
							<span>{subheadline}</span>
						</div>
						<form
							id='loginPage:email-card-form'
							name='lgoinPage:email-card-form'
							onSubmit={() => console.log(emailAddress)}
						>
							<LDS.Input
								id='loginPage:email-input'
								name='email-input'
								type='email'
								label='Email Address'
								placeholder='astro@example.org'
								value={emailAddress}
								onChange={e => setEmailAddress(() => e?.target?.value)}
								required
								autofocus
							/>
							<div className='slds-m-bottom_small'></div>
							<LDS.Button
								variant='brand'
								className='tds-button_full tds-button_large'
								id='submit-email'
								type='submit'
								label={primaryCTA}
								disabled
							/>
						</form>
						{!isRecovery && (
							<div className='tbid-card__footer'>
								<a
									href='https://help.salesforce.com/articleView?id=what_is_otp_trailblazer_identity.htm'
									id='otp_help_link'
									target='_blank'
									rel='noreferrer'
								>
									Tell Me More About Single Use Codes
								</a>
							</div>
						)}
					</div>
					{isRecovery && (
						<div>
							<div className='tbid-card__footer'>
								<span className='tds-color_meteorite'>
									<a
										href='https://help.salesforce.com/articleView?id=get_started_with_trailblazer_id.htm'
										target='_blank'
										rel='noreferrer'
									>
										Learn more about logging in to your account{' '}
									</a>{' '}
									or{' '}
									<a
										href='https://help.salesforce.com/articleView?id=get_started_with_trailblazer_id.htm'
										target='_blank'
										rel='noreferrer'
									>
										get Trailblazer.me Support
									</a>
								</span>
							</div>
						</div>
					)}
				</span>
			</span>
		</LDS.IconSettings>
	);
};

export default EmailAuth;
