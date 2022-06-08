import { _, LDS } from '../../common';

const SettingsCard = props => {
	const { header, subheader, content, children, isLoading } = props;

	return (
		<LDS.Card
			id={_.snakeCase(header)}
			className='tds-card'
			header={
				<>
					<LDS.MediaObject
						className='slds-is-relative'
						verticalCenter
						body={
							<div className='slds-card__header-title'>
								<h2 className='slds-text-heading_medium'>{header}</h2>
								<div className='slds-text-title slds-m-top_xx-small'>{subheader}</div>
							</div>
						}
					/>
				</>
			}
			bodyClassName='slds-card__body_inner'
		>
			{isLoading && <LDS.Spinner />}
			{content}
			{children}
		</LDS.Card>
	);
};

export default SettingsCard;
