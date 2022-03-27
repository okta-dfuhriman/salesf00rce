import { Auth, LDS } from '../../../common';

const SignUpCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { isSignUp } = Auth.useAuthState();
	const { toggleSignUp } = Auth.useAuthActions();

	return (
		<div className='slds-card tbid-card_white tds-color_midnight' id='learn-more-v2-card'>
			<img alt='astro-login' className='astro-login' src='assets/images/astro-login.svg' />
			<table style={{ width: '80%', marginLeft: '20%' }}>
				<tbody>
					<tr>
						<td>Don’t have your free Trailblazer.me account yet? Start here.</td>
						<td>
							<LDS.Button
								label='Sign Up'
								onClick={() => toggleSignUp(dispatch, isSignUp)}
								className='slds-p-horizontal_large color-text-link slds-m-left_x-small'
								style={{ whiteSpace: 'nowrap' }}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default SignUpCard;
