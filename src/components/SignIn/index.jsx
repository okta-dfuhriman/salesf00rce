import { Auth, LDS } from '../../common';
import AuthButtons from './AuthButtons';

const SignInForm = () => {
	const dispatch = Auth.useAuthDispatch();
	const { isRecovery, actions } = Auth.useAuthState();

	const toggleRecovery = () =>
		dispatch({
			type: actions.login.init.recovery.type,
			payload: { isRecovery: !isRecovery },
		});

	return (
		<div id='signin-page'>
			<h1 className='slds-p-vertical_medium slds-text-align_center tbid-banner-font-family tbid-banner-font-style slds-p-vertical_none'>
				Howdy, Trailblazer!
			</h1>
			<div className='slds-text-align_center slds-text-body_regular slds-m-bottom_large tds-color_midnight'>
				Let's get you logged in
			</div>
			<AuthButtons />
			<div className='tbid-card__footer'>
				<span className='slds-col'>
					<LDS.Button label="Can't log in?" variant='base' onClick={toggleRecovery} />
				</span>
			</div>
		</div>
	);
};

export default SignInForm;
