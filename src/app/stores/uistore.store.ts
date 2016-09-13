import { Injectable } from '@angular/core';
import { DefaultStore } from './../shared/common/default_store';
import { Analytics } from './../services/analytics.service';

@Injectable()
export class UIStore extends DefaultStore {
	constructor(
		private _analytics: Analytics
	) {
		super('UIStore', new UI());
		this.update('activePage', this.get(['pages', 'included']));
	}

	set pageAccessToken(active: boolean) {
		sessionStorage.setItem('pageAccessToken', `${active}`);
	}

	get pageAccessToken() {
		return;
	}

	openModal(modal: string) {
		this.update(['modals', modal], true);
	}

	closeAllModals() {
		let modals = this.get('modals');
		for (let key in modals) {
			if (modals[key]) {
				this.update(['modals', key], false);
			}
		}
	}
	getPage(page: any) {
		if (page) {
			let pg = this.get(['pages', page]);
			this.update(['activePage'], pg);
			this._analytics.pageEvents.next(pg);
			return pg;
		}
	}

	getPageUrl(page) {
		return this.get(['pages', page]).address;
	}

	reset() {
		this.update('UIOptions', new UIOptions());
	}
};

export class UI {
	activePage: any;
	overview: Overview = new Overview();
	pages: Pages = new Pages();
	UIOptions: UIOptions = new UIOptions();
	modals: Modals = new Modals();
}

export class Overview {
	isVisible = false;
}

export class UIOptions implements UIOptions {
	isTestimonialsTriggered = false;
	isFieldsWarningVisible = false;
	isFrequencySelectorVisible = true;
	topNavVisible = true;
	footerVisible = true;
	isQuoteSaved = false;
	isSaveQuoteVisible = 'visible';
}

export class Pages {
	home: UIPage = {
		title: `Home`,
		address: `/home`,
		options: {}
	};
	included: UIPage = {
		title: `What's Included`,
		address: `/`,
		next: 'yourDetails',
		prev: null,
		options: {}
	};
	yourDetails: UIPage = {
		title: `Your Details`,
		address: `/your_details`,
		next: 'friendsFamily',
		prev: 'included',
		options: {
			aaLoginLoading: false,
			userDetected: false
		}
	};
	friendsFamily: UIPage = {
		title: `Friends and Family`,
		address: '/friends_and_family',
		next: 'priceBreakdown',
		prev: 'yourDetails',
		options: {}
	};
	priceBreakdown: UIPage = {
		title: `Price Breakdown`,
		address: '/breakdown',
		next: 'termsConditions',
		prev: 'friendsFamily',
		options: {}
	};
	paymentOptions: UIPage = {
		title: `Payment Options`,
		address: '/payment_options',
		next: 'termsConditions',
		prev: 'priceBreakdown',
		options: {}
	};
	termsConditions: UIPage = {
		title: `Terms and Conditions`,
		address: '/terms_and_conditions',
		next: 'payment',
		prev: 'priceBreakdown',
		options: {
			paymentFrequencyHidden: true
		}
	};
	error: UIPage = {
		title: '',
		address: '/error',
		options: {
			navHidden: true,
			footerHidden: true
		}
	};
	payment: UIPage = {
		title: `Payment`,
		address: '/payment',
		next: 'confirmation',
		prev: 'termsConditions',
		options: {
			paymentFrequencyHidden: true
		}
	};

	confirmation: UIPage = {
		title: `Confirmation`,
		address: '/confirmation',
		next: null,
		prev: null,
		options: {
			footerHidden: true,
			navHidden: true,
			paymentFrequencyHidden: true
		}
	};

	confirmationHidden: UIPage = {
		title: ``,
		address: '/confirmation',
		next: null,
		prev: null,
		options: {
			footerHidden: true,
			navHidden: true,
			paymentFrequencyHidden: true
		}
	};
}

export class Modals {
	validateAddress: boolean = false;
	userSignIn: boolean = false;
	additionalMember: boolean = false;
	testimonials: boolean = false;
}

