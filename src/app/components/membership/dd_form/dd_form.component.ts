import {
	Component,
	Output,
	EventEmitter,
	trigger,
	transition,
	style,
	animate,
	state
} from '@angular/core';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Analytics, PaymentService } from './../../../services/';

@Component({
	selector: 'm-dd-form',
	templateUrl: './dd_form.html',
	animations: [
		trigger('fadeInOut', [
			state('active', style({ opacity: 1 })),
			state('void, inactive', style({ opacity: 0 })),
			transition('active => *', [animate('350ms')]),
			transition('* => active', [animate('350ms 350ms')])
		])
	]
})
export class DirectDebitFormComponent {
	@Output() onPaymentTypeChange = new EventEmitter();
	@Output() onSuccess = new EventEmitter();
	validationDetails: any;
	isLoadingValidate: boolean = false;
	isValidating: boolean = false;
	isReadyValidate: boolean = false;

	constructor(
		private _paymentService: PaymentService,
		private _analytics: Analytics,
		private _uiStore: UIStore,
		private _dataStore: DataStore
	) {

	}

	triggerValidationLoading($event) {
		if ($event) {
			this.isLoadingValidate = true;
		} else {
			this.isReadyValidate = false;
		}
	}

	openBankValidation($event: boolean | any) {
		this.isLoadingValidate = false;
		if ($event !== null && $event.valid) {
			this.isReadyValidate = true;
			this.isValidating = false;
			this.validationDetails = $event;
		}
	}

	updatePaymentType(type) {
		this._analytics.triggerEvent('payments-bank-type', null, type);
	}

	swapPaymentType() {
		this.onPaymentTypeChange.next(true);
	}

	triggerValidation() {
		if (this.isReadyValidate) {
			this.isValidating = true;
		}
	}

	makePayment() {
		this._analytics.triggerPaymentEvent('Bank', 'success');
		this.onSuccess.next(this.validationDetails.accepted);
	}
}