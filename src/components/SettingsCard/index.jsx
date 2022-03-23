import { _, LDS } from '../../common';

const SettingsCard = props => {
	const { header, subheader, content, children } = props;

	return (
		<LDS.Card
			id={_.snakeCase(header)}
			className='tds-card'
			header={
				<LDS.MediaObject
					className='slds-is-relative'
					body={
						<div className='slds-card__header-title' style={{ display: 'block' }}>
							<h2 className='slds-text-heading_medium'>{header}</h2>
							<div className='slds-text-title slds-m-top_xx-small'>{subheader}</div>
						</div>
					}
				/>
			}
			bodyClassName='slds-card__body_inner'
		>
			{content}
			{children}
		</LDS.Card>
	);
};

export default SettingsCard;
