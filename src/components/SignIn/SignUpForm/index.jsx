import { Auth, LDS } from '../../../common';

import AuthButtons from '../AuthButtons';

const SignUpForm = () => {
	const dispatch = Auth.useAuthDispatch();
	const { isSignUp } = Auth.useAuthState();
	const { toggleSignUp } = Auth.useAuthActions();

	return (
		<div>
			<div className='astro-signin'></div>
			<h1 className='slds-m-bottom_xx-small slds-text-align_center tbid-banner-font-family tbid-banner-font-style'>
				Let's get started, Trailblazer!
			</h1>
			<div className='slds-text-align_center slds-text-body_regular slds-m-bottom_large tds-color_midnight'>
				How do you want to sign up?
			</div>
			<AuthButtons />
			<div className='tbid-card__footer'>
				<span className='slds-col'>
					<LDS.Button
						variant='base'
						label='Log In'
						onClick={() => toggleSignUp(dispatch, isSignUp)}
					/>
				</span>
			</div>
		</div>
	);
};

export default SignUpForm;
