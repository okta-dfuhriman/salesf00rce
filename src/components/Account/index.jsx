import { Auth, LDS, React } from '../../common';
import AccountCard from './AccountCard';

const Account = props => {
	const { isLoadingUserProfile } = Auth.useAuthState();

	const { header, subtitle, type, accounts } = props;

	const buttonLabel = type === 'email' ? 'Add Email' : 'Connect';

	const socialButtons = (
		<>
			<LDS.Button title='Facebook' label='Connect Facebook' />
			<LDS.Button title='Google' label='Connect Google' />
			<LDS.Button title='LinkedIn' label='Connect LinkedIn' />
			<LDS.Button title='Apple' label='Connect Apple' />
		</>
	);

	return (
		<div className='slds-m-bottom_xx-large'>
			<h3 className='slds-text-title_caps slds-m-vertical_small'>{header}</h3>
			<p className='slds-m-vertical_small slds-text-title tds-color_meteorite'>{subtitle}</p>
			{isLoadingUserProfile && (
				<div>
					<LDS.Spinner containerStyle={{ opacity: 0.33 }} />
				</div>
			)}
			{!isLoadingUserProfile && accounts.map(account => <AccountCard account={account} />)}
			{/* <AccountCard {...props} /> */}
			{type !== 'social' && <LDS.Button title={buttonLabel} label={buttonLabel} />}
			{type === 'social' && socialButtons}
		</div>
	);
};

export default Account;
