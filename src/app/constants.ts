import { environment } from './../environments/environment';

export class CONSTS {
	static CONFIG = 'config';
	static PRICING_UPDATE = 'price_update';
	static BANK_UPDATE = 'bank_update';
	static MEMBER_UPDATE = 'member_update';
	static ADDONS_UPDATE = 'addons_update';
	static QUOTE_UPDATE = 'quote_update';
	static LOGIN_UPDATE = 'login_update';
	static TITLE_OPTION = 'title_update';
	static HALT_REQUESTS = 'halt_requests_update';
	static BASE_URL = 'http://aaweb.staging.theaa.local/aa-membership/journey/';
	static BASE_URLPROD = '/aa-membership/journey/';
	static LOCAL_CONTEXT = 'membership/';
	static UAT_CONTEXT = 'membership-uat/';

	static getBaseUrlWithContext() {
		if (environment.production) {
			return this.BASE_URLPROD;
		} else {
			return this.BASE_URL;
		}
	}
}

export class ERRORS {
	static defaultServiceError: ErrorObject = {
		notification: 'Could not connect',
		err: 'ServiceError'
	};
	static iframeMessageFailureConvert: ErrorObject = {
		err: 'realexIframeMessageFailure',
		service: 'Realex'
	}
	static iframeMessageFailure: ErrorObject = {
		err: 'realexIframeGeneralFailure',
		service: 'Realex'
	}
	static placeholderMember: ErrorObject = {
		err: 'placeholderMemberError',
		notification: 'You must either save or delete your additional members before you can continue.'
	}
	static isQuotePurchasedFailure: ErrorObject = {
		notification: `Sorry, we're having difficulties converting your quote, please try again.`,
		err: 'QuoteConversionFailure'
	};
	static convertQuoteFailure: ErrorObject = {
		notification: `Sorry, we're having difficulties converting your quote, please try again.`,
		err: 'QuoteConversionFailure'
	};
	static creditCard: ErrorObject = {
		err: 'RealexFailure',
		service: 'Realex'
	};
	static defaultServiceErrorFinal: ErrorObject = {
		notification: `We could not connect at this time, please try again later.`,
		err: 'ServiceFailure'
	};
	static checkUserExistsError: ErrorObject = {
		service: 'MYAAService',
		notification: `We're having a problem saving your email, please wait while we try again.`,
		err: `EmailDetectionSaveFailure`
	};
	static saveMember: ErrorObject = {
		service: 'QuoteService',
		notification: `We're having a problem saving your details, please try again.`,
		err: 'SaveMemberDetailsFailure'
	};
	static saveAdditionalMember: ErrorObject = {
		service: 'QuoteService',
		notification: `We're having a problem saving your details.`,
		err: `SaveAdditionalMemberFailure`
	};
	static deleteAdditionalMember: ErrorObject = {
		service: 'QuoteService',
		notification: `We're having a problem saving your details.`,
		err: `DeleteAdditionalMemberFailure`
	};
	static bankValidation: ErrorObject = {
		service: 'BankValidationService',
		notification: `Sorry, there was a problem validating your bank details, please try again.`,
		err: 'BankValidationServiceError'
	};
	static bankValidationRetry: ErrorObject = {
		service: 'BankValidationService',
		notification: `Sorry, there was a problem validating your bank details.`,
		err: 'BankValidationServiceError'
	};
	static saveQuoteError: ErrorObject = {
		service: 'MYAAService',
		err: 'SaveQuoteFailure'
	};
	static retrieveQuote: ErrorObject = {
		service: 'QuoteService',
		notification: `Sorry, there was a problem retrieving your AA Membership quote. Please try again.`,
		err: 'RetrieveQuoteFailure'
	};
	static getQuote: ErrorObject = {
		service: 'QuoteService',
		notification: `Sorry there was a problem retrieving a new quote, please try again.`,
		err: 'GetQuoteFailure'
	};
	static quoteBreakdownItem: ErrorObject = {
		service: 'QuoteService',
		notification: `Sorry, there was a problem deleting this item, please try again.`,
		err: 'RemoveBreakdownItemFailure'
	};
	static coverLevelChange: ErrorObject = {
		service: 'QuoteService',
		notification: `Sorry, There was a problem selecting this cover level, please try again.`,
		err: 'ToggleCoverFailure'
	};
	static termsConditions: ErrorObject = {
		service: 'Internal',
		notification: `You must agree to the terms and conditions before continuing.`,
		err: 'Tried to proceed without terms and conditions selected'
	};
	static retrieveQuoteProblem = {
		service: 'MYAAService',
		notification: `Sorry, there was a problem retrieving your quote.`,
		err: 'RetrieveQuoteFailure'
	};
	static retrieveQuoteMyAAProblem = {
		service: 'MYAAService',
		notification: `Sorry, there was a problem retrieving your quote.`,
		err: 'RetrieveQuoteFailure'
	};
	static retrieveQuoteMissing = {
		service: 'MYAAService',
		notification: `Sorry, there was a problem retrieving your quote.`,
		err: 'RetrieveQuoteMissing'
	};
	static retrieveQuotePurchased = {
		service: 'MYAAService',
		notification: `Sorry, this quote has already been purchased. You can begin a new quote but your details will not be pre-populated.`,
		err: 'RetrieveQuotePurchased'
	};
	static setPaymentType = {
		service: 'MYAAService',
		notification: `Sorry, there was a problem, please try again`,
		err: 'SetPaymentTypeFrequencyFailure'
	};
	static setAddress: ErrorObject = {
		service: 'ReferenceService',
		notification: 'We were unable to select an address, please try again.',
		err: 'SetAddressFailure'
	};
	static referenceService: ErrorObject = {
		service: 'ReferenceService',
		notification: 'Could not connect',
		err: 'ReferenceServiceError'
	};
	static addressService: ErrorObject = {
		service: 'ReferenceService',
		notification: 'We were unable to validate your address, please try again.',
		err: 'AdddressCheckingServiceFailure'
	};
	static townAreaService: ErrorObject = {
		service: 'ReferenceService',
		notification: 'Could not connect',
		err: 'TownAreaServiceFailure'
	};
}


export class COLORS {
	static brand: string = '#ffcc00';
	static dark: string = '#1B1918';
	static darkGrey: string = '#3d3e3c';
	static medDarkGrey: string = '#9a9c9a';
	static medLightGrey: string = '#c7c8c7';
	static lightGrey: string = '#e1e3e1';
	static light: string = '#f7f7f7';
	static yellowWarning: string = '#ffe602';
	static orangeWarning: string = '#f29922';
	static redWarning: string = '#e84236';
	static primary: string = '#44b491';
	static primaryShadow: string = '#009a77';
	static secondary: string = '#ec6355';
	static secondaryShadow: string = '#c04a3c';
	static tertiary: string = '#eb7e15';
	static tertiaryShadow: string = '#dc6a20';
}

export const TestimonialRules: Rule[] = [{
	id: 0,
	name: 'Primary Users between 25-40',
	group: ['primaryUser'],
	when: {
		age: [25, 40],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 1,
	name: 'Primary Users between 40-50',
	group: ['primaryUser'],
	when: {
		age: [40, 50],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 2,
	name: 'Primary Users between 30-40',
	group: ['primaryUser'],
	when: {
		age: [30, 40],
		gender: 'female'
	},
	isTrue: false
}, {
	id: 3,
	name: 'Primary Users between 20-30',
	group: ['primaryUser'],
	when: {
		age: [20, 30],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 4,
	name: 'Primary Users between 50-60',
	group: ['primaryUser'],
	when: {
		age: [50, 60],
		gender: 'female'
	},
	isTrue: false
}];

export const TestimonialOutcomes: Outcome[] = [{
		id: 0,
		include: [0],
		author: 'Debbie Whelan',
		description: `[About AA Patrol] I was really happy with the service. Mark was so good and very helpful. He had been out to us before and he was just as brilliant this time around!`
	},
	{
		id: 1,
		include: [1],
		author: 'Mark Ward',
		description: `[About AA Patrol] Absolutely amazing job, delighted with service. He gave it his best to assure a great service.`
	},
	{
		id: 2,
		include: [2],
		author: 'Mrs M Fitzgerald',
		description: `The AA Patrol was superb. I couldn't believe that he actually got out in 7 minutes and rescued the baby from the car.`
	},
	{
		id: 3,
		include: [3],
		author: 'Ms Sarah Mc Cabe',
		description: `[About AA Patrol] I was really happy with the service, Shane was lovely and very helpful. I had four kids with me and he escorted me to a garage to get a new tyre.`
	},
	{
		id: 4,
		include: [4],
		author: `Ms G O'Carroll`,
		description: `[About AA Patrol] I want to pass over complements to Shane McCabe, he was excellent and made me feel safe, also complements to the whole AA for making the process so easy.`
	},
	{
		id: 5,
		include: [5],
		author: 'Helen Melady',
		description: `[About AA Patrol] Thank you so much to Cormac for his assistance this morning in -5c temperatures. Never been so glad to have my AA membership.`
	},
	{
		id: 6,
		include: [6],
		author: 'Nigel Wallace',
		description: `[About AA Patrol] Thank you all at the AA for the fast, efficient and helpful manner in which you dealt with my problems today. The car was collected and dropped off as requested in a very professional manner.`
	},
	{
		id: 7,
		include: [7],
		author: 'Angela McGeady',
		description: `Thank you all very much, you've been a great help to me when I was in a spot of bother. Very quick and reliable service and the AA Patrol named Derek was fantastic.`
	},
	{
		id: 8,
		include: [8],
		author: 'Ms Brid Durnin',
		description: `I just wanted to say thank you for the great service I received. I spoke to a lovely man on the phone and the AA Patrol that came out was extremely helpful and sorted the problem for me. Thanks for the great service once again!!`
	},
	{
		id: 9,
		include: [9],
		author: 'Ms A Reilly',
		description: `I was extremely pleased with the service today. The girl who answered my call was extremely pleasant and the AA Patrol got out in time. The Patrol was a lovely man and was so helpful. I am a member since 1976 and this is the reason why. Great service!!`
	},
	{
		id: 10,
		include: [10],
		author: `Miss V O'Shaunnessey`,
		description: `I was a nervous wreck when her car broke down. Sean repaired it and took the time to test the car serveral times which really put my nerves at ease about continuing driving. Thanks so much!`
	},
	{
		id: 11,
		include: [11],
		author: 'Mr N Moran',
		description: `I'm calling to thank you for your service and to say that the AA Patrol man naed Pat was lovely, he took my car for a test drive and got it sorted.`
	},
	{
		id: 12,
		include: [12],
		author: 'Mrs MacEvilly',
		description: `I had the misfortune of a flat battery earlier and had an NCT to get to in half an hour, the AA had someone out within 20 minutes. Paul who came out was just super he fitted a new battery and had me going within half an hour. He also wrote me a letter to give to the NCT explaining why I was late. It is people like Paul that are the reason we joined the AA and will definitely be renewing. Thanks so much Paul!!`
	},
	{
		id: 13,
		include: [13],
		author: 'Ms A Moynihan',
		description: `I was extremely pleased with the service from the start to finish and David is an absolute credit to the company. He was amazing. Such a lovely man. `
	},
	{
		id: 14,
		include: [14],
		author: 'Mrs Rogers',
		description: `[About AA Patrol] I'm so happy with the service, the nicest young man - so helpful and patient. I couldn't say enough good things about this fine young man.`
	},
	{
		id: 15,
		include: [15],
		author: 'Mark Mcdermott',
		description: `[About AA Patrol] I was delighted with the level of service I received from everyone in the AA.`
	},

];
