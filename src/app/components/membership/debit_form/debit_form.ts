import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataStore } from './../../../stores/stores.modules';
import { Utils } from './../../../shared/utilities/utilities.component';
import { Subject, Observable } from 'rxjs/Rx';
import { PaymentService, ErrorService } from './../../../services/index';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { ERRORS } from './../../../constants';


@Component({
	selector: 'm-debit-form',
	templateUrl: './debit_form.html',
})

export class DebitFormComponent {
	@Output('onValidationInit') onValidationInit: EventEmitter<any> = new EventEmitter();
	@Output('onValidationSuccess') onValidationSuccess: EventEmitter<any> = new EventEmitter();
	@Output('onPaymentTypeChange') onPaymentTypeChange: EventEmitter<any> = new EventEmitter();
	data: any;
	update: any;
	fields: JourneyField;
	ctrls: any = {};
	form: FormGroup;
	isUpdating: boolean = false;
	isAccountValidated: boolean = false;
	accountValidationStatus: boolean = false;
	accountToValidate: Subject<any> = new Subject();
	sub: ISubscriptionDefinition<any>;

	constructor(
		private errorService: ErrorService,
		private paymentService: PaymentService,
		private fb: FormBuilder,
		private dataStore: DataStore
	) {

		this.isAccountValidated = false;
		this.accountValidationStatus = false;
		this.accountToValidate
			.do((x) => { this.onValidationInit.next(false); })
			.debounce((x) => { return Observable.timer(500); })
			.filter((x) => { return this.form.valid && !this.isUpdating; })
			.do((x) => { this.onValidationInit.next(true); })
			.switchMap((x) => this.paymentService.validateBankDetails(x))
			.subscribe((next) => {
				this.errorService.clearErrorNotifications();
				let acc: any = next.json();
				this.isAccountValidated = true;
				if (isPresent(acc.valid) && acc.valid === 'true') {
					this.onValidationSuccess.next(acc);
					this.dataStore.update(['paymentMethods', 'debit', 'values'], this.form.value);
					this.accountValidationStatus = true;
				} else {
					this.dataStore.remove(['paymentMethods', 'debit', 'values']);
					this.onValidationSuccess.next(false);
					this.accountValidationStatus = false;
				}
			}, (err) => {
				this.errorService.errorHandlerWithNotification(ERRORS.bankValidation);
			});

		this.data = this.dataStore.get(['paymentMethods', 'debit']);
		this.fields = this.data.fields;
		_.forEach(this.data.fields, (e: any) => {
			let valids = Utils.retrieveValidator(e.validation);
			this.ctrls[e.name] = [
				isPresent(this.data.values) ? this.data.values[e.name] : '',
				isPresent(e.validation) ? Validators.compose(valids) : null
			];
		});
		if (this.ctrls['accountName'][0] === '') {
			this.ctrls['accountName'][0] = this.dataStore.get(['utils', 'userName']);
		}
		this.form = this.fb.group(this.ctrls);
		this.form['name'] = 'Direct Debit Form';
		this.form.valueChanges.subscribe(this.accountToValidate);
	}

}
