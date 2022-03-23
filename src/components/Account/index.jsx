import { _, LDS } from '../../common';
import AccountCard from './AccountCard';

const Account = props => {
	const { header, subtitle, provider } = props;

	const buttonLabel = provider === 'email' ? 'Add Email' : 'Connect';

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
			<AccountCard {...props} />
			{provider !== 'social' && <LDS.Button title={buttonLabel} label={buttonLabel} />}
			{provider === 'social' && socialButtons}
		</div>
	);
};

export default Account;
