export class MOCKCONSTS {
	static proposalItem: ProposalObject = {
		email: 'ro.brett@gmail.com',
		firstName: 'Ronan',
		surname: 'Brett'
	};

	static additionalMember = {
		dateOfBirth: '29/12/1987',
		firstName: 'Ronan',
		surname: 'Brett'
	};

	static breakdownItem: QuoteBreakdownItem = {
		description: 'Sixto Cantolla',
		index: 0,
		type: 'cover',
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
