import { LDS } from '../../common';

const statesList = [
	{ id: 0, label: 'Alabama' },
	{ id: 1, label: 'Alaska' },
	{ id: 2, label: 'American Samoa' },
	{ id: 3, label: 'Arizona' },
	{ id: 4, label: 'Arkansas' },
	{ id: 5, label: 'California' },
	{ id: 6, label: 'Colorado' },
	{ id: 7, label: 'Connecticut' },
	{ id: 8, label: 'Delaware' },
	{ id: 9, label: 'District of Columbia' },
	{ id: 10, label: 'Federated States of Micronesia' },
	{ id: 11, label: 'Florida' },
	{ id: 12, label: 'Georgia' },
	{ id: 13, label: 'Guam' },
	{ id: 14, label: 'Hawaii' },
	{ id: 15, label: 'Idaho' },
	{ id: 16, label: 'Illinois' },
	{ id: 17, label: 'Indiana' },
	{ id: 18, label: 'Iowa' },
	{ id: 19, label: 'Kansas' },
	{ id: 20, label: 'Kentucky' },
	{ id: 21, label: 'Louisiana' },
	{ id: 22, label: 'Maine' },
	{ id: 23, label: 'Marshall Islands' },
	{ id: 24, label: 'Maryland' },
	{ id: 25, label: 'Massachusetts' },
	{ id: 26, label: 'Michigan' },
	{ id: 27, label: 'Minnesota' },
	{ id: 28, label: 'Mississippi' },
	{ id: 29, label: 'Missouri' },
	{ id: 30, label: 'Montana' },
	{ id: 31, label: 'Nebraska' },
	{ id: 32, label: 'Nevada' },
	{ id: 33, label: 'New Hampshire' },
	{ id: 34, label: 'New Jersey' },
	{ id: 35, label: 'New Mexico' },
	{ id: 36, label: 'New York' },
	{ id: 37, label: 'North Carolina' },
	{ id: 38, label: 'North Dakota' },
	{ id: 39, label: 'Northern Mariana Islands' },
	{ id: 40, label: 'Ohio' },
	{ id: 41, label: 'Oklahoma' },
	{ id: 42, label: 'Oregon' },
	{ id: 43, label: 'Palau' },
	{ id: 44, label: 'Pennsylvania' },
	{ id: 45, label: 'Puerto Rico' },
	{ id: 46, label: 'Rhode Island' },
	{ id: 47, label: 'South Carolina' },
	{ id: 48, label: 'South Dakota' },
	{ id: 49, label: 'Tennessee' },
	{ id: 50, label: 'Texas' },
	{ id: 51, label: 'Utah' },
	{ id: 52, label: 'Vermont' },
	{ id: 53, label: 'Virginia' },
	{ id: 54, label: 'Virgin Islands' },
	{ id: 55, label: 'Washington' },
	{ id: 56, label: 'West Virginia' },
	{ id: 57, label: 'Wisconsin' },
	{ id: 58, label: 'Wyoming' },
];

const countryList = [
	{
		id: 0,
		label: 'United States of America',
	},
	{
		id: 1,
		label: 'Afghanistan',
	},
	{
		id: 2,
		label: 'Albania',
	},
	{
		id: 3,
		label: 'Algeria',
	},
	{
		id: 4,
		label: 'Andorra',
	},
	{
		id: 5,
		label: 'Angola',
	},
	{
		id: 6,
		label: 'Anguilla',
	},
	{
		id: 7,
		label: 'Antigua and Barbuda',
	},
	{
		id: 8,
		label: 'Argentina',
	},
	{
		id: 9,
		label: 'Armenia',
	},
	{
		id: 10,
		label: 'Aruba',
	},
	{
		id: 11,
		label: 'Ascension',
	},
	{
		id: 12,
		label: 'Australia',
	},
	{
		id: 13,
		label: 'Austria',
	},
	{
		id: 14,
		label: 'Azerbaijan',
	},
	{
		id: 15,
		label: 'Bahamas',
	},
	{
		id: 16,
		label: 'Bahrain',
	},
	{
		id: 17,
		label: 'Bangladesh',
	},
	{
		id: 18,
		label: 'Barbados',
	},
	{
		id: 19,
		label: 'Belarus',
	},
	{
		id: 20,
		label: 'Belgium',
	},
	{
		id: 21,
		label: 'Belize',
	},
	{
		id: 22,
		label: 'Benin',
	},
	{
		id: 23,
		label: 'Bermuda',
	},
	{
		id: 24,
		label: 'Bhutan',
	},
	{
		id: 25,
		label: 'Bolivia',
	},
	{
		id: 26,
		label: 'Bonaire, Sint Eustatius, and Saba',
	},
	{
		id: 27,
		label: 'Bosnia-Herzegovina',
	},
	{
		id: 28,
		label: 'Botswana',
	},
	{
		id: 29,
		label: 'Brazil',
	},
	{
		id: 30,
		label: 'British Virgin Islands',
	},
	{
		id: 31,
		label: 'Brunei Darussalam',
	},
	{
		id: 32,
		label: 'Bulgaria',
	},
	{
		id: 33,
		label: 'Burkina Faso',
	},
	{
		id: 34,
		label: 'Burma',
	},
	{
		id: 35,
		label: 'Burundi',
	},
	{
		id: 36,
		label: 'Cambodia',
	},
	{
		id: 37,
		label: 'Cameroon',
	},
	{
		id: 38,
		label: 'Canada',
	},
	{
		id: 39,
		label: 'Cape Verde',
	},
	{
		id: 40,
		label: 'Cayman Islands',
	},
	{
		id: 41,
		label: 'Central African Republic',
	},
	{
		id: 42,
		label: 'Chad',
	},
	{
		id: 43,
		label: 'Chile',
	},
	{
		id: 44,
		label: 'China',
	},
	{
		id: 45,
		label: 'Colombia',
	},
	{
		id: 46,
		label: 'Comoros',
	},
	{
		id: 47,
		label: 'Congo, Democratic Republic of the',
	},
	{
		id: 48,
		label: 'Congo, Republic of the',
	},
	{
		id: 49,
		label: 'Costa Rica',
	},
	{
		id: 50,
		label: "Cote d'Ivoire",
	},
	{
		id: 51,
		label: 'Croatia',
	},
	{
		id: 52,
		label: 'Cuba',
	},
	{
		id: 53,
		label: 'Curacao',
	},
	{
		id: 54,
		label: 'Cyprus',
	},
	{
		id: 55,
		label: 'Czech Republic',
	},
	{
		id: 56,
		label: 'Denmark',
	},
	{
		id: 57,
		label: 'Djibouti',
	},
	{
		id: 58,
		label: 'Dominica',
	},
	{
		id: 59,
		label: 'Dominican Republic',
	},
	{
		id: 60,
		label: 'Ecuador',
	},
	{
		id: 61,
		label: 'Egypt',
	},
	{
		id: 62,
		label: 'El Salvador',
	},
	{
		id: 63,
		label: 'Equatorial Guinea',
	},
	{
		id: 64,
		label: 'Eritrea',
	},
	{
		id: 65,
		label: 'Estonia',
	},
	{
		id: 66,
		label: 'Eswatini',
	},
	{
		id: 67,
		label: 'Ethiopia',
	},
	{
		id: 68,
		label: 'Falkland Islands',
	},
	{
		id: 69,
		label: 'Faroe Islands',
	},
	{
		id: 70,
		label: 'Fiji',
	},
	{
		id: 71,
		label: 'Finland',
	},
	{
		id: 72,
		label: 'France',
	},
	{
		id: 73,
		label: 'French Guiana',
	},
	{
		id: 74,
		label: 'French Polynesia',
	},
	{
		id: 75,
		label: 'Gabon',
	},
	{
		id: 76,
		label: 'Gambia',
	},
	{
		id: 77,
		label: 'Georgia, Republic of',
	},
	{
		id: 78,
		label: 'Germany',
	},
	{
		id: 79,
		label: 'Ghana',
	},
	{
		id: 80,
		label: 'Gibraltar',
	},
	{
		id: 81,
		label: 'Greece',
	},
	{
		id: 82,
		label: 'Greenland',
	},
	{
		id: 83,
		label: 'Grenada',
	},
	{
		id: 84,
		label: 'Guadeloupe',
	},
	{
		id: 85,
		label: 'Guatemala',
	},
	{
		id: 86,
		label: 'Guinea',
	},
	{
		id: 87,
		label: 'Guinea-Bissau',
	},
	{
		id: 88,
		label: 'Guyana',
	},
	{
		id: 89,
		label: 'Haiti',
	},
	{
		id: 90,
		label: 'Honduras',
	},
	{
		id: 91,
		label: 'Hong Kong',
	},
	{
		id: 92,
		label: 'Hungary',
	},
	{
		id: 93,
		label: 'Iceland',
	},
	{
		id: 94,
		label: 'India',
	},
	{
		id: 95,
		label: 'Indonesia',
	},
	{
		id: 96,
		label: 'Iran',
	},
	{
		id: 97,
		label: 'Iraq',
	},
	{
		id: 98,
		label: 'Ireland',
	},
	{
		id: 99,
		label: 'Israel',
	},
	{
		id: 100,
		label: 'Italy',
	},
	{
		id: 101,
		label: 'Jamaica',
	},
	{
		id: 102,
		label: 'Japan',
	},
	{
		id: 103,
		label: 'Jordan',
	},
	{
		id: 104,
		label: 'Kazakhstan',
	},
	{
		id: 105,
		label: 'Kenya',
	},
	{
		id: 106,
		label: 'Kiribati',
	},
	{
		id: 107,
		label: 'Korea, Democratic Peoples Republic of (North Korea)',
	},
	{
		id: 108,
		label: 'Korea, Republic of (South Korea)',
	},
	{
		id: 109,
		label: 'Kosovo, Republic of',
	},
	{
		id: 110,
		label: 'Kuwait',
	},
	{
		id: 111,
		label: 'Kyrgyzstan',
	},
	{
		id: 112,
		label: 'Laos',
	},
	{
		id: 113,
		label: 'Latvia',
	},
	{
		id: 114,
		label: 'Lebanon',
	},
	{
		id: 115,
		label: 'Lesotho',
	},
	{
		id: 116,
		label: 'Liberia',
	},
	{
		id: 117,
		label: 'Libya',
	},
	{
		id: 118,
		label: 'Liechtenstein',
	},
	{
		id: 119,
		label: 'Lithuania',
	},
	{
		id: 120,
		label: 'Luxembourg',
	},
	{
		id: 121,
		label: 'Macao',
	},
	{
		id: 122,
		label: 'Madagascar',
	},
	{
		id: 123,
		label: 'Malawi',
	},
	{
		id: 124,
		label: 'Malaysia',
	},
	{
		id: 125,
		label: 'Maldives',
	},
	{
		id: 126,
		label: 'Mali',
	},
	{
		id: 127,
		label: 'Malta',
	},
	{
		id: 128,
		label: 'Martinique',
	},
	{
		id: 129,
		label: 'Mauritania',
	},
	{
		id: 130,
		label: 'Mauritius',
	},
	{
		id: 131,
		label: 'Mexico',
	},
	{
		id: 132,
		label: 'Moldova',
	},
	{
		id: 133,
		label: 'Mongolia',
	},
	{
		id: 134,
		label: 'Montenegro',
	},
	{
		id: 135,
		label: 'Montserrat',
	},
	{
		id: 136,
		label: 'Morocco',
	},
	{
		id: 137,
		label: 'Mozambique',
	},
	{
		id: 138,
		label: 'Namibia',
	},
	{
		id: 139,
		label: 'Nauru',
	},
	{
		id: 140,
		label: 'Nepal',
	},
	{
		id: 141,
		label: 'Netherlands',
	},
	{
		id: 142,
		label: 'New Caledonia',
	},
	{
		id: 143,
		label: 'New Zealand',
	},
	{
		id: 144,
		label: 'Nicaragua',
	},
	{
		id: 145,
		label: 'Niger',
	},
	{
		id: 146,
		label: 'Nigeria',
	},
	{
		id: 147,
		label: 'North Macedonia, Republic of',
	},
	{
		id: 148,
		label: 'Norway',
	},
	{
		id: 149,
		label: 'Oman',
	},
	{
		id: 150,
		label: 'Pakistan',
	},
	{
		id: 151,
		label: 'Panama',
	},
	{
		id: 152,
		label: 'Papua New Guinea',
	},
	{
		id: 153,
		label: 'Paraguay',
	},
	{
		id: 154,
		label: 'Peru',
	},
	{
		id: 155,
		label: 'Philippines',
	},
	{
		id: 156,
		label: 'Pitcairn Island',
	},
	{
		id: 157,
		label: 'Poland',
	},
	{
		id: 158,
		label: 'Portugal',
	},
	{
		id: 159,
		label: 'Qatar',
	},
	{
		id: 160,
		label: 'Reunion',
	},
	{
		id: 161,
		label: 'Romania',
	},
	{
		id: 162,
		label: 'Russia',
	},
	{
		id: 163,
		label: 'Rwanda',
	},
	{
		id: 164,
		label: 'Saint Helena',
	},
	{
		id: 165,
		label: 'Saint Kitts and Nevis',
	},
	{
		id: 166,
		label: 'Saint Lucia',
	},
	{
		id: 167,
		label: 'Saint Pierre and Miquelon',
	},
	{
		id: 168,
		label: 'Saint Vincent and the Grenadines',
	},
	{
		id: 169,
		label: 'Samoa',
	},
	{
		id: 170,
		label: 'San Marino',
	},
	{
		id: 171,
		label: 'Sao Tome and Principe',
	},
	{
		id: 172,
		label: 'Saudi Arabia',
	},
	{
		id: 173,
		label: 'Senegal',
	},
	{
		id: 174,
		label: 'Serbia, Republic of',
	},
	{
		id: 175,
		label: 'Seychelles',
	},
	{
		id: 176,
		label: 'Sierra Leone',
	},
	{
		id: 177,
		label: 'Singapore',
	},
	{
		id: 178,
		label: 'Sint Maarten',
	},
	{
		id: 179,
		label: 'Slovak Republic (Slovakia)',
	},
	{
		id: 180,
		label: 'Slovenia',
	},
	{
		id: 181,
		label: 'Solomon Islands',
	},
	{
		id: 182,
		label: 'Somalia',
	},
	{
		id: 183,
		label: 'South Africa',
	},
	{
		id: 184,
		label: 'South Sudan, Republic of',
	},
	{
		id: 185,
		label: 'Spain',
	},
	{
		id: 186,
		label: 'Sri Lanka',
	},
	{
		id: 187,
		label: 'Sudan',
	},
	{
		id: 188,
		label: 'Suriname',
	},
	{
		id: 189,
		label: 'Sweden',
	},
	{
		id: 190,
		label: 'Switzerland',
	},
	{
		id: 191,
		label: 'Syrian Arab Republic (Syria)',
	},
	{
		id: 192,
		label: 'Taiwan',
	},
	{
		id: 193,
		label: 'Tajikistan',
	},
	{
		id: 194,
		label: 'Tanzania',
	},
	{
		id: 195,
		label: 'Thailand',
	},
	{
		id: 196,
		label: 'Timor-Leste, Democratic Republic of',
	},
	{
		id: 197,
		label: 'Togo',
	},
	{
		id: 198,
		label: 'Tonga',
	},
	{
		id: 199,
		label: 'Trinidad and Tobago',
	},
	{
		id: 200,
		label: 'Tristan da Cunha',
	},
	{
		id: 201,
		label: 'Tunisia',
	},
	{
		id: 202,
		label: 'Turkey',
	},
	{
		id: 203,
		label: 'Turkmenistan',
	},
	{
		id: 204,
		label: 'Turks and Caicos Islands',
	},
	{
		id: 205,
		label: 'Tuvalu',
	},
	{
		id: 206,
		label: 'Uganda',
	},
	{
		id: 207,
		label: 'Ukraine',
	},
	{
		id: 208,
		label: 'United Arab Emirates',
	},
	{
		id: 209,
		label: 'United Kingdom of Great Britain and Northern Ireland',
	},
	{
		id: 210,
		label: 'Uruguay',
	},
	{
		id: 211,
		label: 'Uzbekistan',
	},
	{
		id: 212,
		label: 'Vanuatu',
	},
	{
		id: 213,
		label: 'Vatican City',
	},
	{
		id: 214,
		label: 'Venezuela',
	},
	{
		id: 215,
		label: 'Vietnam',
	},
	{
		id: 216,
		label: 'Wallis and Futuna Islands',
	},
	{
		id: 217,
		label: 'Yemen',
	},
	{
		id: 218,
		label: 'Zambia',
	},
	{
		id: 219,
		label: 'Zimbabwe',
	},
];

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
							options={statesList}
							selection={[5]}
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
							options={countryList}
							selection={['1']}
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
