import {
	Component,
	trigger,
	animate,
	style,
	transition,
	OnInit,
	state,
	OnDestroy
} from '@angular/core';
import { DataStore, UIStore } from './../../stores/stores.modules';
import { QuoteService, Analytics } from './../../services/index';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CONSTS } from './../../constants';


/**
 *  Breakdown Page Component Class
 */
@Component({
	selector: 'p-breakdown',
	templateUrl: './breakdown.html',
	animations: [
		trigger('breakdownItemVisiblity', [
			state('visible', style({ opacity: 1 })),
			state('void, hidden', style({ opacity: 0 })),
			transition('* => visible', [animate('350ms')])
		]),
		trigger('saveQuoteStatus', [
			state('visible', style({ marginTop: 0 })),
			state('hidden', style({ marginTop: '-80px' })),
			state('void', style({ marginTop: 0 })),
			transition('hidden => visible', [
				animate('350ms 450ms cubic-bezier(0.77, 0, 0.175, 1)', style({
					marginTop: 0
				}))
			]),
			transition('visible => hidden', [
				animate('350ms', style({
					marginTop: '-80px'
				}))
			])
		]),
		trigger('aaSectionStatus', [
			state('visible', style({ height: '*' })),
			state('void, hidden', style({ height: 0 })),
			transition('hidden => visible', [animate('350ms')]),
			transition('visible => hidden', [animate('350ms')])
		])
	]
})
export class MembershipPriceBreakdownPageComponent implements OnDestroy, OnInit {
	// UI Settings for Breakdown Page
	page: UIPage;
	// All Active Journey Benefits except the default benefits
	options: QuoteBreakdownItem[];
	// List of All Breakdown Items
	breakdownOptions: QuoteBreakdownItem[];
	quote: Quote;
	// Calculated Journey Schema Price (Ignores multipliers set by month/annual settings)
	price: number;
	config: any;
	paymentOptions: any;

	// Animation & UI Props
	breakdownHeight: number;
	aaVisiblity = false;
	aaSectionVisiblity = 'visible';
	saveQuoteVisiblity = 'hidden';
	quoteIsSaved: boolean;
	hasRemovableItems: boolean = false;
	isLoadingQuote: boolean = false;

	// Subscription Objects	
	quoteUpdateSubscription: ISubscriptionDefinition<any>;
	pricingUpdateSubscription: ISubscriptionDefinition<any>;

	// Form Control for Payment Frequency Switch 
	frequencyControl: FormControl = new FormControl('monthly');

	constructor(
		private analytics: Analytics,
		private router: Router,
		private quoteService: QuoteService,
		private uiStore: UIStore,
		private dataStore: DataStore,
	) { }

	ngOnInit() {
		// Set Breakdown UI
		this.page = this.uiStore.getPage('priceBreakdown');
		// Watch for Quote Update Events and update on changes
		this.registerSubscriptions();
		this.init();
	}

	registerSubscriptions() {
		this.quoteUpdateSubscription = this.dataStore.subscribeAndGet(CONSTS.QUOTE_UPDATE, (e) => {
			this.config = this.dataStore.get(['config']);
			this.quote = this.config.quotation;
			this.isLoadingQuote = false;
			if (this.quote) {
				// Options without Primary Item (JS Objects are sealed so cant just splice the array)
				this.options = _.filter(this.quote.breakdown, (item, i) => { return i !== 0; });
				// Create a list of breakdown items from the quote
				this.breakdownOptions = this.quote.breakdown;
				// Check to see if there are any for Removable Items
				this.hasRemovableItems =
					_.find(this.breakdownOptions, (item: any) => { return !item.mandatory; }) === undefined ? false : true;
				this.uiStore.closeAllModals();
			}
		});

		// Watch for Pricing Update Events from Overview and update on changes		
		this.pricingUpdateSubscription = this.dataStore.subscribeAndGet(CONSTS.PRICING_UPDATE, (e) => {
			let pricingFrequency = this.dataStore.get(['pricing', 'frequency']);
			if (pricingFrequency) {
				this.frequencyControl.setValue(pricingFrequency);
			}
		});
	}

	init() {
		if (this.quote) {
			this.options = _.filter(this.quote.breakdown, (item, i) => { return i !== 0; });
			this.breakdownOptions = this.quote.breakdown;
		}
		this.paymentOptions = this.dataStore.get(['config', 'paymentOptions']);
		this.setAndWatchMyAASaveQuoteIsSaved();

		if (this.quoteIsSaved || this.dataStore.isUserLoggedIn()) {
			this.setMyAASuccessLoginUI();
		}

		if (this.uiStore.get(['UIOptions', 'isSaveQuoteVisible']) === 'hidden') {
			this.setMyAAHiddenUI();
		}

		this.price = this.dataStore.get(['pricing', 'estimate', 'calculatedPrice']);

		this.frequencyControl.valueChanges.distinctUntilChanged().subscribe((next) => {
			this.analytics.triggerEvent('paymentOptions', 'frequency', next);
			this.dataStore.setActivePaymentType(_.findIndex(this.paymentOptions, { type: next }));
		});

	}


	emitNextNavigation() {
		this.router.navigate([this.uiStore.get(['pages', this.page.next]).address]);
	}

	removeItem(item: QuoteBreakdownItem) {
		this.isLoadingQuote = true;
		this.analytics.triggerEvent('breakdown-remove-item', item.name, item.type);
		this.quoteService.removeBreakdownItem(item, (err) => {
			this.isLoadingQuote = false;
		});
	}

	toggleSaveQuoteVisibleUI(toggle) {
		if (arguments.length === 0) {
			this.aaVisiblity = !this.aaVisiblity;
		} else {
			this.aaVisiblity = toggle;
		}
		this.analytics.triggerEvent('login-save-quote', 'visibility', this.aaVisiblity);
	}

	setMyAASuccessLoginUI() {
		this.aaVisiblity = false;
		this.aaSectionVisiblity = 'hidden';
		this.saveQuoteVisiblity = 'visible';
	}

	setMyAAHiddenUI() {
		this.aaSectionVisiblity = 'hidden';
		this.saveQuoteVisiblity = 'hidden';
	}

	setAndWatchMyAASaveQuoteIsSaved() {
		this.quoteIsSaved = this.uiStore.get(['UIOptions', 'isQuoteSaved']);
		this.uiStore.select('UIOptions', 'isQuoteSaved').on('update', (update) => {
			this.quoteIsSaved = this.uiStore.get(['UIOptions', 'isQuoteSaved']);
		});
	}

	ngOnDestroy() {
		this.dataStore.unsubscribe(this.quoteUpdateSubscription);
		this.dataStore.unsubscribe(this.pricingUpdateSubscription);
	}

}
