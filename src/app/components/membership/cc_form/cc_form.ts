import {
	Component,
	OnInit,
	Input,
	Output,
	ChangeDetectorRef,
	EventEmitter,
} from '@angular/core';
import { isString } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Analytics } from './../../../services/analytics.service';
import { Subject } from 'rxjs/Rx';

@Component({
	selector: 'm-cc-form',
	templateUrl: './cc_form.html',

})

export class CreditCardFormComponent implements OnInit {
	@Output() onPaymentTypeChange = new EventEmitter();
	@Output() onSuccess = new EventEmitter();
	@Input('quote') quote: Quote;
	@Input('frequency') frequency: string;
	throttleHeight: Subject<any> = new Subject<any>();
	iframeHeight: any;
	iframeWidth: any;
	errorMessageVisible: boolean = false;
	iframeVisible: boolean = true;
	data: any;


	constructor(
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
		if (evt.data !== null && isString(evt.data) && evt.origin === 'https://hpp.sandbox.realexpayments.com') {
			let data = JSON.parse(evt.data);
			if (data.QUOTE_REFERENCE && data.RESULT === '00') {
				this.successfulCCPayment(data);
			}
			if (data.RESULT === '101') {
				this.declinedCCPayment(data);
			}
			if (data.iframe) {
				this.throttleHeight.next(data.iframe);
			}
		}
	}

	successfulCCPayment(data) {
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
		// TODO: Implement Updating Width/Height
		this.iframeHeight = data.height;
		this.iframeWidth = data.width;
	}

	ngOnInit() {
		if (window.addEventListener) {
			window.addEventListener('message', this.watchEvents, false);
		} else {
			let w: any = window;
			w.attachEvent('message', this.watchEvents);
		}
	}
}
