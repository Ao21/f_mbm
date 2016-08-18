import { environment } from './environments/environment';

export class CONSTS {
	static PRICING_UPDATE = 'price_update';
	static BANK_UPDATE = 'bank_update';
	static MEMBER_UPDATE = 'member_update';
	static ADDONS_UPDATE = 'addons_update';
	static QUOTE_UPDATE = 'quote_update';
	static LOGIN_UPDATE = 'login_update';
	static TITLE_OPTION = 'title_update';
	static HALT_REQUESTS = 'halt_requests_update';
	static BASE_URL = 'http://developie.theaa.local/';
	static LOCAL_CONTEXT = 'membership/';
	static UAT_CONTEXT = 'membership-uat/';

	static getBaseUrlWithContext() {
		if (environment.production) {
			return this.BASE_URL + this.UAT_CONTEXT;
		} else {
			return this.BASE_URL + this.LOCAL_CONTEXT;
		}
	}
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
}]

export const TestimonialOutcomes: Outcome[] = [{
		id: 0,
		include: [0],
		author: 'Debbie Whelan',
		description: `I was really happy with the service. Mark was so good and very helpful. He had been out to us before and he was just as brilliant this time around!`
	},
	{
		id: 1,
		include: [1],
		author: 'Mark Ward',
		description: `Absolutely amazing job, delighted with service. He gave it his best to assure a great service.`
	},
	{
		id: 2,
		include: [2],
		author: 'Mrs M Fitzgerald (Audi-142D1996)',
		description: `The AA Patrol was superb. I couldn't believe that he actually got out in 7 minutes and rescued the baby from the car.`
	},
	{
		id: 3,
		include: [3],
		author: 'Alison Rohan',
		description: `I am delighted with the level and speed of service and Michael's expert advice.`
	},
	{
		id: 4,
		include: [4],
		author: 'Sister Eileen Mullins',
		description: `I wish to thank Damien for the wonderful service he provided. He was brilliant and lovely and I can't say enough about him. `
	},
	{
		id: 5,
		include: [5],
		author: 'Ms Sarah Mc Cabe',
		description: `I was really happy with the service, Shane was lovely and very helpful. I had four kids with me and he escorted me to a garage to get a new tyre.`
	},
	{
		id: 6,
		include: [6],
		author: 'Ms Gemma Geraghty',
		description: `Excellent service - Alan was very friendly and professional.`
	},
	{
		id: 7,
		include: [7],
		author: `Ms G O'Carroll`,
		description: `I want to pass over complements to Shane McCabe, he was excellent and made me feel safe, also compliments to the whole AA for making the process so easy.`
	},
	{
		id: 8,
		include: [8],
		author: 'Helen Melady',
		description: `Thank you so much to Cormac for his assistance this morning in -5c temperatures. Never been so glad to have my AA membership.`
	},
	{
		id: 9,
		include: [9],
		author: 'Nigel Wallace',
		description: `Thank you all at the AA for the fast, efficient and helpful manner in which you dealt with my problems today. The car was collected and dropped off as requested in a very professional manner. `
	},
	{
		id: 10,
		include: [10],
		author: 'Mrs Jenny McCoy',
		description: `Please tell Michael thanks as he was very helpful and friendly.`
	},
	{
		id: 11,
		include: [11],
		author: 'Lynn Jo Chaney',
		description: `Fantastic service from the AA this morning. Ronan delivered me safely to a garage. Your staff are a credit to you.`
	},
	{
		id: 12,
		include: [12],
		author: 'Mr Brian Elliott',
		description: `I was thrilled with the help Daniel gave us last night. We were very stressed out after what happened but Daniel was very helpful and got our car  to a garage.`
	},
	{
		id: 1,
		include: [1],
		author: 'Angela McGeady',
		description: `Thank you all very much, you've been a great help to me when I was in a spot of bother. Very quick and reliable service and the AA Patrol named Derek was fantastic.`
	},
	{
		id: 13,
		include: [13],
		author: 'Ms Brid Durnin',
		description: `I just wanted to say thank you for the great service I received. I spoke to a lovely man on the phone and the AA Patrol that came out was extremely helpful and sorted the problem for me. Thanks for the great service once again!!`
	},
	{
		id: 14,
		include: [14],
		author: 'Mr M Murphy',
		description: `I want to thank the AA patrol for his amazing helpfulness. `
	},
	{
		id: 15,
		include: [15],
		author: 'Ms A Reilly',
		description: `I was extremely pleased with the service today. The girl who answered my call was extremely pleasant and the AA Patrol got out in time. The Patrol was a lovely man and was so helpful. I am a member since 1976 and this is the reason why. Great service!!`
	},
	{
		id: 16,
		include: [16],
		author: `Miss V O'Shaunnessey`,
		description: `I was a nervous wreck when her car broke down. Sean repaired it and took the time to test the car serveral times which really put my nerves at ease about continuing driving. Thanks so much!`
	},
	{
		id: 17,
		include: [17],
		author: 'Mr N Moran',
		description: `I'm calling to thank you for your service and to say that the AA Patrol man naed Pat was lovely, he took my car for a test drive and got it sorted.`
	},
	{
		id: 18,
		include: [18],
		author: 'Mrs MacEvilly',
		description: `I had the misfortune of a flat battery earlier and had an NCT to get to in half an hour, the AA had someone out within 20 minutes. Paul who came out was just super he fitted a new battery and had me going within half an hour. He also wrote me a letter to give to the NCT explaining why I was late. It is people like Paul that are the reason we joined the AA and will definitely be renewing. Thanks so much Paul!!`
	},
	{
		id: 19,
		include: [19],
		author: 'Ms A Moynihan',
		description: `I was extremely pleased with the service from the start to finish and David is an absolute credit to the company. He was amazing. Such a lovely man. `
	},
	{
		id: 20,
		include: [20],
		author: 'Ms A Mcnally',
		description: `Dave was extremely pleasant and patient with me. He was a lovely lovely man and is a credit to your company. He took time to listen to me and was extremely helpful.`
	},
	{
		id: 21,
		include: [21],
		author: 'James Murphy',
		description: `Trevor is an absolute asset to the AA. His approach to his job is utterly professional. He is a mannerly gentleman and deserves credit for the job he does. `
	}

];