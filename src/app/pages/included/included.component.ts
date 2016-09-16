import {
	OnInit,
	Component,
	ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONSTS, ERRORS } from './../../constants';
import { DataStore, UIStore } from './../../stores/stores.modules';
import { QuoteService } from './../../services/quote.service';
import { Utils } from './../../shared/utilities/utilities.component';
import { NotificationService, ErrorService } from './../../services/index';
import { Analytics } from './../../services/analytics.service';


/**
 *  Included Page Component
 *
 */
@Component({
	selector: 'p-included',
	templateUrl: './included.html'
})
export class MembershipIncludedPageComponent implements OnInit {
	// Default Settings for Included Page
	page: UIPage;
	// Array of Journey Benefit Addon coverLevels
	public coverLevels: CoverLevel[];
	// User has accepted Terms/Conditions
	hasAgreedTermsConditions: boolean = false;
	// Set to Monthly or Annually - Sets Prices
	pricingFrequency: string;

	constructor(
		private analytics: Analytics,
		private route: ActivatedRoute,
		private dataStore: DataStore,
		private uiStore: UIStore,
		private quoteService: QuoteService,
		private el: ElementRef,
		private errorService: ErrorService,
		private notificationService: NotificationService
	) { }

	ngOnInit() {
		this.page = this.uiStore.getPage('included');
		this.route.data.forEach((data: { config: any }) => {
			this.init();
		});
		this.hasAgreedTermsConditions = this.uiStore.get(['UIOptions', 'isTermsConditionsAgreed']);
	}

	init() {
		this.dataStore.subscribeAndGet(CONSTS.PRICING_UPDATE, () => {
			this.pricingFrequency = this.dataStore.get(['pricing', 'frequency']);
		});
		this.coverLevels =
			_.cloneDeep(this.dataStore.select('config', 'coverLevel').get());
	}

	navigateNext = (e: Event) => {
		_.forEach(this.coverLevels, (level: CoverLevel) => {
			this.analytics.triggerEvent('page-completion-included', level.active, level.name);
		});
		if (!this.hasAgreedTermsConditions) {
			this.scrollToTermsAndConditions();
		}
	}

	scrollToTermsAndConditions() {
		let el = this.el.nativeElement.querySelector('body > app > main > p-included > div > article > button');
		this.errorService.errorHandlerWithNotification(ERRORS.termsConditions);
		Utils.scrollToElement(el);
	}

	/**
	 *  On Click event if an addon isnt disabled it should call this and set the local active status
	 *  in order for the animation to update and also set the dataStores option
	 */
	selectAddon(addonUpdate) {
		let level = this.dataStore.getCoverLevel(addonUpdate.index);
		this.quoteService.updateCover(level, addonUpdate.isSelected)
			.subscribe((next) => {
				this.notificationService.clearNotifications();
				this.coverLevels[addonUpdate.index].active = addonUpdate.isSelected;
				this.dataStore.toggleCoverLevel(addonUpdate.index, addonUpdate.isSelected);
			}, (err) => {
				this.errorService.errorHandlerWithNotification(ERRORS.coverLevelChange);
			});
	}

	updateTermsBool(active: boolean) {
		this.hasAgreedTermsConditions = active;
		this.uiStore.update(['UIOptions', 'isTermsConditionsAgreed'], active);
		this.analytics.triggerEvent('terms-conditions-acceptance', null, active);
		this.notificationService.clearLastErrorMsg();
		this.notificationService.clearNotifications();
	}

}
