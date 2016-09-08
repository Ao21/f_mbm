import { ProductConfig } from './../../services/init.service';

export var defaultConfig: ProductConfig = {
	'code': {
		'id': 'MEM100',
		'description': 'PERSONAL MEMBERSHIP'
	},
	'name': 'Personal Membership',
	'schemaCode': 'PERSONALMEMBERSHIP',
	'coverLevel': [{
		'active': true,
		'display': 'Rescue',
		'name': 'RESCUE',
		'disabled': true,
		'benefits': [{
			'name': 'Roadside Rescue',
			'icon': 'assets/images/benefits/ROADSIDERESCUE.svg',
			'pkg': 'default',
			'description': '80% of the time we fix our Members cars on the roadside*',
			'code': 'ROADSIDERESCUE'
		}, {
			'name': '24/7 Emergency Cover',
			'icon': 'assets/images/benefits/24-7EMERGENCYCOVER.svg',
			'pkg': 'default',
			'description': 'So youâ€™ll never be left stranded',
			'code': '24-7EMERGENCYCOVER'
		}, {
			'name': 'We cover you in any car even if youâ€™re a passenger',
			'icon': 'assets/images/benefits/ANYVEHICLECOVER.svg',
			'pkg': 'default',
			'description': '',
			'code': 'ANYVEHICLECOVER'
		}, {
			'name': 'UK Cover',
			'icon': 'assets/images/benefits/UKCOVER.svg',
			'pkg': 'default',
			'description': 'UK Cover',
			'code': 'UKCOVER'
		}, {
			'name': 'Fuel Saver Card',
			'icon': 'assets/images/benefits/FUELSAVERCARD.svg',
			'pkg': 'default',
			'description': 'Fuel Saver Card',
			'code': 'FUELSAVERCARD'
		}, {
			'name': 'AA Rewards',
			'icon': 'assets/images/benefits/AAREWARDS.svg',
			'pkg': 'default',
			'description': 'Access to great offers and deals across lots of big brands',
			'code': 'AAREWARDS'
		}],
		'price': {
			'monthly': {
				'amount': 0,
				'str': '0',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬0'
			},
			'annual': {
				'amount': 9900,
				'str': '99',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬99'
			}
		}
	}, {
		'active': true,
		'display': 'Home Start',
		'name': 'HOMESTART',
		'disabled': false,
		'price': {
			'monthly': {
				'amount': 408,
				'str': '4.08',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬4.08'
			},
			'annual': {
				'amount': 4900,
				'str': '49',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬49'
			}
		},
		'benefits': [{
			'name': 'Cover on your doorstep',
			'icon': 'assets/images/benefits/DOORSTEPCOVER.svg',
			'pkg': 'HOMESTART',
			'description': 'Cover at home or where your car is usually kept',
			'code': 'DOORSTEPCOVER'
		}]
	}, {
		'active': false,
		'display': 'Rescue Plus',
		'name': 'RESCUEPLUS',
		'disabled': false,
		'price': {
			'monthly': {
				'amount': 575,
				'str': '5.75',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬5.75'
			},
			'annual': {
				'amount': 6900,
				'str': '69',
				'symbol': 'â‚¬',
				'currency': 'EUR',
				'pretty': 'â‚¬69'
			}
		},
		'benefits': [{
			'name': 'Travel Expenses',
			'icon': 'assets/images/benefits/TRAVELEXPENSES.svg',
			'pkg': 'RESCUEPLUS',
			'description': 'Travel Expenses',
			'code': 'TRAVELEXPENSES'
		}, {
			'name': 'Car Hire',
			'icon': 'assets/images/benefits/CARHIRE.svg',
			'pkg': 'RESCUEPLUS',
			'description': 'Car Hire',
			'code': 'CARHIRE'
		}, {
			'name': 'Accommodation',
			'icon': 'assets/images/benefits/ACCOMMODATION.svg',
			'pkg': 'RESCUEPLUS',
			'description': 'Accommodation',
			'code': 'ACCOMMODATION'
		}]
	}],
	'paymentOptions': [{
		'display': 'Month',
		'type': 'monthly',
		'multiplier': 1,
		'active': true,
		'options': ['Card', 'Bank']
	}, {
		'display': 'Year',
		'type': 'annual',
		'multiplier': 12,
		'active': false,
		'options': ['Card', 'Bank']
	}],
	'criteria': [{
		'name': 'adults',
		'header': 'Adult 17+',
		'max': 4,
		'overrides': [{
			'index': 0,
			'type': 'primaryUser',
			'typeDisplay': 'Primary User',
			'minAge': 17,
			'maxAge': 200,
			'price': {
				'monthly': {
					'amount': 0,
					'str': '0.00',
					'symbol': 'â‚¬',
					'currency': 'EUR',
					'pretty': 'â‚¬0.00'
				},
				'annual': {
					'amount': 0,
					'str': '0',
					'symbol': 'â‚¬',
					'currency': 'EUR',
					'pretty': 'â‚¬0'
				}
			},
			'title': 'Please enter your details',
			'fields': [{
				'name': 'email',
				'label': 'Email',
				'type': 'email',
				'placeholder': 'example@theaa.ie',
				'validation': ['required', 'emailValidator']
			}, {
				'name': 'title',
				'label': 'Title',
				'type': 'title',
				'placeholder': '',
				'validation': ['required']
			}, {
				'name': 'firstName',
				'label': 'First Name',
				'type': 'text',
				'placeholder': 'Joe',
				'validation': ['required']
			}, {
				'name': 'surname',
				'label': 'Last Name',
				'type': 'text',
				'placeholder': 'Bloggs',
				'validation': ['required']
			}, {
				'name': 'dateOfBirth',
				'label': 'Date of Birth',
				'type': 'date',
				'placeholder': 'dd/mm/yyyy',
				'validation': ['required', 'ageRequirements']
			}, {
				'name': 'phoneNumber',
				'label': 'Phone Number',
				'type': 'number',
				'placeholder': '08',
				'validation': ['required', 'notLetters', 'phoneNumber']
			}, {
				'name': 'addressLine1',
				'label': 'Address Line 1',
				'type': 'text',
				'placeholder': '',
				'validation': ['required']
			}, {
				'name': 'addressLine2',
				'label': 'Address Line 2',
				'type': 'text',
				'placeholder': '',
				'validation': ['']
			}, {
				'name': 'area',
				'label': 'Area',
				'type': 'autocomplete',
				'placeholder': '',
				'validation': ['required'],
				'filterBy': 'county',
				'data': 'areas'
			}, {
				'name': 'county',
				'label': 'County',
				'type': 'autocomplete',
				'placeholder': '',
				'validation': ['required'],
				'filterBy': 'area',
				'data': 'counties'
			}]
		}],
		'defaults': {
			'type': 'adults',
			'typeDisplay': 'Adult',
			'minAge': 17,
			'maxAge': 200,
			'price': {
				'monthly': {
					'amount': 425,
					'str': '4.25',
					'symbol': 'â‚¬',
					'currency': 'EUR',
					'pretty': 'â‚¬4.25'
				},
				'annual': {
					'amount': 5100,
					'str': '51',
					'symbol': 'â‚¬',
					'currency': 'EUR',
					'pretty': 'â‚¬51'
				}
			},
			'title': '+ Add Another Adult',
			'fields': [{
				'name': 'firstName',
				'label': 'First Name',
				'type': 'text',
				'placeholder': 'Joe',
				'validation': ['required']
			}, {
				'name': 'surname',
				'label': 'Last Name',
				'type': 'text',
				'placeholder': 'Bloggs',
				'validation': ['required']
			}, {
				'name': 'dateOfBirth',
				'label': 'Date of Birth',
				'type': 'date',
				'placeholder': 'dd/mm/yyyy',
				'validation': ['required', 'ageRequirements']
			}]
		}
	}]
};
export class MockInitService {
	public current: ProductConfig = defaultConfig;
}
