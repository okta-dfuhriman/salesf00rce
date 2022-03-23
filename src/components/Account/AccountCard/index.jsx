import { _, LDS } from '../../../common';

const AccountCardBody = ({ provider }) => (
	<>
		<div className='tds-line-height_small'>
			<strong className='break-word'>eatplaysleep@gmail.com</strong>
		</div>
		{provider === 'salesforce' && (
			<dl className='slds-dl_horizontal tds-text-size_4'>
				<dt className='slds-dl_horizontal__label'>Email:</dt>
				<dd className='slds-dl_horizontal__detail'>eatplaysleep@gmail.com</dd>
				<dt className='slds-dl_horizontal__label'>Type:</dt>
				<dd className='slds-dl_horizontal__detail'>Developer Edition</dd>
				<dt className='slds-dl_horizontal__label'>Active user:</dt>
				<dd className='slds-dl_horizontal__detail'>Yes</dd>
			</dl>
		)}
	</>
);

const AccountCard = props => {
	const { provider } = props;

	const imgSrc = provider === 'social' ? 'google' : provider;

	return (
		<div className='slds-p-around_medium slds-m-vertical_small action-item'>
			<LDS.IconSettings iconPath='/assets/icons'>
				<div
					className={
						provider === 'salesforce'
							? 'slds-media slds-media_top tds-media slds-grid_vertical-align-top'
							: 'slds-media slds-media_center slds-grid_vertical-align-center'
					}
				>
					<div className='slds-media__figure'>
						<span className='slds-icon__container'>
							<img
								src={`/assets/icons/custom/${imgSrc}-round.svg`}
								alt=''
								className='slds-icon tds-icon-social slds-icon_large'
							/>
						</span>
					</div>
					<div className='slds-media__body'>
						<AccountCardBody {...props} />
					</div>
					<div className='slds-no-flex'>
						<LDS.Button disabled label='Disconnect' />
					</div>
				</div>
			</LDS.IconSettings>
		</div>
	);
};

export default AccountCard;
