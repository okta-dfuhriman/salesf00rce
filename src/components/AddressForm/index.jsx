import { LDS } from '../../common';
import { countries, states } from './data';

const InputIcon = ({ ispublic }) => {
	const name = ispublic ? 'world' : 'lock';

	return <LDS.InputIcon id={`tooltip-icon-${name}`} name={name} category='utility' title={name} />;
};

const AddressForm = () => (
	<>
		<LDS.Input
			id='street'
			label='Street'
			className='address-cell'
			iconRight={<InputIcon />}
		></LDS.Input>
		<div className='slds-grid slds-wrap slds-gutters_x-small slds-m-bottom_medium'>
			<div className='slds-col slds-size_1-of-1 slds-small-size_1-of-2'>
				<span style={{ display: 'flex' }}>
					<div className='slds-col slds-size_5-of-6 slds-small-size_10-of-12 slds-flex'>
						<LDS.Input id='city' label='City' className='address-cell' />
					</div>
					<div className='slds-col slds-size_1-of-6 slds-small-size_2-of-12 slds-p-top_x-large'>
						<LDS.Icon name='lock' category='utility' size='x-small' />
					</div>
				</span>
			</div>
			<div className='slds-col slds-size_1-of-1 slds-small-size_1-of-2'>
				<span style={{ display: 'flex' }}>
					<div className='slds-col slds-size_5-of-6 slds-small-size_10-of-12 slds-flex'>
						<LDS.Combobox
							id='state'
							labels={{ label: 'State / Territory' }}
							className='address-cell'
							options={states}
							defaultValue='California'
							value='California'
							variant='readonly'
						/>
					</div>
					<div className='slds-col slds-size_1-of-6 slds-small-size_2-of-12 slds-p-top_x-large'>
						<LDS.Icon name='world' category='utility' size='x-small' />
					</div>
				</span>
			</div>
			<div className='slds-col slds-size_1-of-1 slds-small-size_1-of-2'>
				<span style={{ display: 'flex' }}>
					<div className='slds-col slds-size_5-of-6 slds-small-size_10-of-12 slds-flex'>
						<LDS.Input id='zipCode' label='Zip Code' className='address-cell' />
					</div>
					<div className='slds-col slds-size_1-of-6 slds-small-size_2-of-12 slds-p-top_x-large'>
						<LDS.Icon name='lock' category='utility' size='x-small' />
					</div>
				</span>
			</div>
			<div className='slds-col slds-size_1-of-1 slds-small-size_1-of-2'>
				<span style={{ display: 'flex' }}>
					<div className='slds-col slds-size_5-of-6 slds-small-size_10-of-12 slds-flex'>
						<LDS.Combobox
							id='country'
							labels={{ label: 'Country' }}
							className='address-cell'
							options={countries}
							defaultValue='United States of America'
							value='United States of America'
							variant='readonly'
						/>
					</div>
					<div className='slds-col slds-size_1-of-6 slds-small-size_2-of-12 slds-p-top_x-large'>
						<LDS.Icon name='world' category='utility' size='x-small' />
					</div>
				</span>
			</div>
		</div>
	</>
);

export default AddressForm;
