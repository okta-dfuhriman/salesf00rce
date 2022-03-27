import { Auth, LDS } from '../../common';

import SignInForm from '../../components/SignIn';
import SignUpForm from '../../components/SignIn/SignUpForm';
import SignUpCard from '../../components/SignIn/SignUpCard';
import EmailAuth from '../../components/SignIn/EmailAuth';

import './styles.css';

const SignIn = () => {
	const { isSignUp, isRecovery, isEmailAuth } = Auth.useAuthState();

	const containerType = isRecovery
		? 'emailSection'
		: isSignUp
		? 'signupPrimarySection'
		: 'loginPrimarySection';

	return (
		<LDS.IconSettings path='/assets/icons'>
			<div className='tbid-page'>
				<div className='tbid-content'>
					<div className='card-holder-wrapper'>
						<div className='card-holder' id={containerType}>
							<div
								className='slds-card tbid-card_medium'
								id={isSignUp ? 'signup_card' : 'login_card'}
							>
								{!isSignUp && !isRecovery && !isEmailAuth && <SignInForm />}
								{isSignUp && !isRecovery && !isEmailAuth && <SignUpForm />}
								{(isEmailAuth || isRecovery) && <EmailAuth />}
								{}
							</div>
							{!isSignUp && !isRecovery && <SignUpCard />}
						</div>
					</div>
				</div>
			</div>
		</LDS.IconSettings>
	);
};

export default SignIn;
