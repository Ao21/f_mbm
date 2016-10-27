import {
	Component,
	OnInit,
	Input,
	Output,
	ChangeDetectorRef,
	OnDestroy,
	EventEmitter,
} from '@angular/core';
import { isString } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Analytics } from './../../../services/analytics.service';
import { PaymentService } from './../../../services/payment.service';
import { ErrorService } from './../../../services/error.service';
import { ERRORS } from './../../../constants'; 
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Rx';

@Component({
	selector: 'm-cc-form',
	templateUrl: './cc_form.html',

})

export class CreditCardFormComponent implements OnInit, OnDestroy {
	@Output() onPaymentTypeChange = new EventEmitter();
	@Output() onSuccess = new EventEmitter();
	@Input('quote') quote: Quote;
	@Input('frequency') frequency: string;
	throttleHeight: Subject<any> = new Subject<any>();
	paymentProcessing: boolean = false;
	iframeHeight: any;
	iframeWidth: any;
	errorMessageVisible: boolean = false;
	iframeVisible: boolean = true;
	iframeLoaded: boolean = false;
	data: any;

	interval: any;

	constructor(
		private router: Router,
		private errorService: ErrorService,
		private paymentService: PaymentService,
		private changeRef: ChangeDetectorRef,
		private analytics: Analytics,
		private uiStore: UIStore,
		private dataStore: DataStore
	) {
		this.data = this.dataStore.get(['paymentMethods', 'credit']);
		this.throttleHeight.subscribe(this.updateCCDimensions);
	}

	/**
	 * 	Method called when window recieves messages from the Realex form
	 */
	watchEvents = (evt) => {
		// TODO: Change This Origin to Real Address for Deployment
		if (evt.data !== null && isString(evt.data) && (evt.origin === 'https://hpp.sandbox.realexpayments.com' || evt.origin === 'https://hpp.realexpayments.com')) {
			let data = JSON.parse(evt.data);
			if (data.QUOTE_REFERENCE && data.RESULT === '00') {
				this.successfulCCPayment(data);
			}
			if (data.RESULT === '101') {
				this.declinedCCPayment(data);
			}
			if (data.RESULT === '500') {
				this.router.navigateByUrl(`error/realexRejection/${data.QUOTE_REFERENCE}`);
			}
			if (data.iframe) {
				this.throttleHeight.next(data.iframe);
			}
		}
	}

	successfulCCPayment(data) {
		clearInterval(this.interval);
		this.paymentProcessing = true;
		this.analytics.triggerPaymentEvent('Card', 'success');
		this.uiStore.getPage('confirmationHidden');
		this.onSuccess.next(data.QUOTE_REFERENCE);
	}

	declinedCCPayment(data) {
		this.analytics.triggerPaymentEvent('Card', 'declined');
		this.iframeVisible = false;
		this.errorMessageVisible = true;
		this.changeRef.detectChanges();
		setTimeout(() => {
			this.iframeVisible = true;
			this.changeRef.detectChanges();
		}, 10);
	}

	swapPaymentType() {
		this.onPaymentTypeChange.next(true);
	}

	updateCCDimensions = (data) => {
		this.iframeLoaded = true;
		this.iframeHeight = data.height;
		this.iframeWidth = data.width;
	}

	ngOnInit() {
		this.startCheckingPayment();
		if (window.addEventListener) {
			window.addEventListener('message', this.watchEvents, false);
		} else {
			let w: any = window;
			w.attachEvent('message', this.watchEvents);
		}
	}

	startCheckingPayment() {
		this.interval = setInterval(() => {
			if (!this.paymentProcessing) {
				this.paymentService.isQuotePurchased().subscribe((next) => {
					if (!this.paymentProcessing) {
						let isQuotePurchasedObject = next.json();
						if (isQuotePurchasedObject.purchased) {
							clearInterval(this.interval);
							this.analytics.triggerPaymentEvent('Card', 'success');
							this.errorService.errorHandler(ERRORS.iframeMessageFailureConvert);
							this.uiStore.getPage('confirmationHidden');
							this.onSuccess.next(isQuotePurchasedObject.reference);
						}
					}
				}, (err) => {
					clearInterval(this.interval);
					this.errorService.errorHandler(ERRORS.iframeMessageFailure);
					this.router.navigateByUrl(`error/realexRejection`);
				});
			}
		}, 30000);
	}

	ngOnDestroy() {
		clearInterval(this.interval);
	}
}
