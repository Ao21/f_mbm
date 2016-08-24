export class MOCKCONSTS {


	static validateBankDetailsAttempt = {
		accountName: 'Sixto Cantolla',
		BIC: 'BOFIIE2DXXX',
		IBAN: 'IE38BOFI90003344938316'
	};
	static proposalItem: ProposalObject = {
		email: 'ro.brett@gmail.com',
		firstName: 'Ronan',
		surname: 'Brett'
	};

	static userLoginSuccess = {
		'access_token': '20000000-0000-0000-0000-000000000000',
		'token_type': 'bearer',
		'expires_in': 43190,
		'scope': 'read trust write'
	};
	static additionalMember: Member = {
		dateOfBirth: '29/12/1987',
		firstName: 'Ronan',
		surname: 'Brett',
	};

	static defaultMember: Member = {
		dateOfBirth: '29/12/1987',
		firstName: 'Ronan',
		surname: 'Brett',
		index: 2,
		price: {
			amount: 499,
			str: '4.99',
			symbol: '$',
			currency: 'USD',
			pretty: '$4.99'
		},
		typeDisplay: 'Adults',
		type: 'adults'
	};

	static breakdownItemMember: QuoteBreakdownItem = {
		description: 'Ronan Brett',
		index: 2,
		type: 'member',
		'name': 'RESCUE',
		'price': {
			'monthly': {
				'amount': 825,
				'str': '8.25',
				'symbol': '€',
				'currency': 'EUR',
				'pretty': '€8.25'
			},
			'annual': {
				'amount': 9900,
				'str': '99',
				'symbol': '€',
				'currency': 'EUR',
				'pretty': '€99'
			}
		},
		'mandatory': false
	};

	static breakdownItem: QuoteBreakdownItem = {
		description: 'Sixto Cantolla',
		index: 2,
		type: 'cover',
		name: 'RESCUEPLUS',
		'price': {
			'monthly': {
				'amount': 825,
				'str': '8.25',
				'symbol': '€',
				'currency': 'EUR',
				'pretty': '€8.25'
			},
			'annual': {
				'amount': 9900,
				'str': '99',
				'symbol': '€',
				'currency': 'EUR',
				'pretty': '€99'
			}
		},
		'mandatory': true
	};

	static coverLevel: CoverLevel = {
		active: true,
		display: 'Rescue',
		name: 'RESCUE',
		disabled: true,
		benefits: [
			{
				name: 'Roadside Rescue',
				icon: 'http://uat1-travel-insurance.theaa.local/membership3/assets/images/benefits/ROADSIDERESCUE.svg',
				pkg: 'default',
				description: `80% of the time we fix our Members cars on the roadside`,
				code: 'ROADSIDERESCUE',
			}],
		price: {
			monthly:
			{
				amount: 0,
				str: '0',
				symbol: '€',
				currency: 'EUR',
				pretty: '€0'
			},
			annual:
			{
				amount: 9900,
				str: '99',
				symbol: '€',
				currency: 'EUR',
				pretty: '€99'
			}
		}
	};
};
