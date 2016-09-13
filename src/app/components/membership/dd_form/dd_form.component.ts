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
import { Analytics } from './../../../services/';

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
		private analytics: Analytics,
	) {}

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
		this.analytics.triggerEvent('payments-bank-type', null, type);
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
		this.analytics.triggerPaymentEvent('Bank', 'success');
		this.onSuccess.next(this.validationDetails.accepted);
	}
}