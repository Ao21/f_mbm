import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../stores/stores.modules';
import { Observable } from 'rxjs/Observable';
import { CanDeactivate } from '@angular/router';
import { NotificationService, PaymentService } from './../../services/index';

/**
 *  Payment Page Component
 */

@Component({
	selector: 'p-payment',
	templateUrl: './payment.html'
})
export class MembershipPaymentPageComponent implements CanDeactivate<boolean> {
	// Default Settings for Payment Page
	page: UIPage;
	// Payment type - Card|Bank
	paymentType: string = 'Card';
	// Payment Frequency - annual|monthly
	frequency: string = 'monthly';
	quote: Quote;
	// Restrict Navigation if Quote isn't converted
	isQuoteConverted: boolean = false;
	isPaymentAgreementActive: boolean = true;

	constructor(
		private router: Router,
		private dataStore: DataStore,
		private uiStore: UIStore,
		private notifications: NotificationService,
		private paymentService: PaymentService
	) {
		this.page = this.uiStore.getPage('payment');
		// Set Frequency to monthly if no option set in store
		this.frequency = this.dataStore.get(['pricing', 'frequency']) ?
			this.dataStore.get(['pricing', 'frequency']) : 'monthly';
		this.paymentType = this.dataStore.get(['pricing', 'type']);
		this.quote = this.dataStore.get(['config', 'quotation']);

	}

	/**
	 * 	Called from onSuccess Events from Child Components
	 * 	@param string convertedQuoteReference - 
	 */
	continueToConfirmation = (convertedQuoteReference: string) => {
		this.paymentService.convertQuote(convertedQuoteReference).subscribe((next) => {
			this.isQuoteConverted = true;
			this.dataStore.convertQuote(next.json());
			this.router.navigateByUrl('confirmation');
		}, (err) => {
			this.router.navigateByUrl('error');
		});
	}

	/**
	 * 	Swap between payment types and sends the user back to the terms and conditions page
	 */
	togglePaymentType() {
		this.paymentType = this.paymentType === 'Bank' ? 'Card' : 'Bank';
		this.dataStore.update(['pricing', 'type'], this.paymentType);
		this.router.navigateByUrl(`/terms_and_conditions/${this.paymentType}`);
	}

	/**
	 * 	Hides Credit Card Agreement
	 */
	toggleAgreement(event) {
		this.isPaymentAgreementActive = event ? event : false;
	}

	/* istanbul ignore next */
	routerCanDeactivate() {
		return new Promise(res => {
			res(true);
		});
	}

	/**
	 * 	If the user tries to leave the page with an non-converted quote this will block
	 * 	them, or if they try to leave the page while credit card is active, it will trigger
	 * 	a confirmation notification with an observable promise to prevent them leaving until
	 * 	the user accepts the notification.
	 * 
	 */
	canDeactivate(): boolean | Observable<any> {
		if (this.isQuoteConverted) {
			return true;
		}
		if (this.paymentType === 'Card' && this.isPaymentAgreementActive === false) {
			// Create a Promise and Passes it to the Notification Service
			let guardPromise = new Promise((res, rej) => {
				let p = this.notifications.createConfirmationNotification(
					`If you leave your credit card information will be lost.`);

				// Listen for Notifcation Confirmation
				p.subscribe((next) => {
					res(true);
				});
			});
			// Angular (RC 1) Needed an Observable in order to guard the deactivation
			let o = Observable.fromPromise(guardPromise);
			return o;
		} else {
			return true;
		}
	}

}
