import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataStore } from './../../../stores/stores.modules';
import { Utils } from './../../../shared/utilities/utilities.component';
import { Subject, Observable } from 'rxjs/Rx';
import { PaymentService, ErrorService } from './../../../services/index';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { ERRORS } from './../../../constants';

@Component({
	selector: 'm-iban-form',
	templateUrl: './iban_form.html',
})

export class IbanFormComponent {
	@Output('onValidationInit') onValidationInit: EventEmitter<any> = new EventEmitter();
	@Output('onValidationSuccess') onValidationSuccess: EventEmitter<any> = new EventEmitter();
	@Output('onPaymentTypeChange') onPaymentTypeChange: EventEmitter<any> = new EventEmitter();
	data: any;
	update: any;
	fields: JourneyField;
	ctrls: any = {};
	form: FormGroup;
	isAccountValidated: boolean = false;
	accountValidationStatus: boolean = false;
	accountToValidate: Subject<any> = new Subject();

	constructor(
		private paymentService: PaymentService,
		private errorService: ErrorService,
		private fb: FormBuilder,
		private dataStore: DataStore
	) {
		this.data = this.data = this.dataStore.get(['paymentMethods', 'iban']);
		this.isAccountValidated = false;
		this.accountValidationStatus = false;

		this.accountToValidate
			.do((x) => { this.onValidationInit.next(false); })
			.debounce((x) => { return Observable.timer(500); })
			.filter((x) => { return this.form.valid; })
			.do((x) => { this.onValidationInit.next(true); })
			.switchMap((x) => this.paymentService.validateBankDetails(x))
			.subscribe(
			(next) => this.validateAccount(next),
			(err) => this.errorService.errorHandlerWithNotification(ERRORS.bankValidation));
		this.init();
	}

	init() {
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
		this.form['name'] = 'Iban Form';
		this.form.valueChanges.subscribe(this.accountToValidate);
	}

	validateAccount(next) {
		this.errorService.clearErrorNotifications();
		let acc: any = next.json();
		this.isAccountValidated = true;
		if (isPresent(acc.valid) && acc.valid === true) {
			this.accountValidationStatus = true;
			this.onValidationSuccess.next(acc);
			this.dataStore.update(['paymentMethods', 'iban', 'values'], this.form.value);
		} else {
			this.dataStore.remove(['paymentMethods', 'iban', 'values']);
			this.onValidationSuccess.next(false);
			this.accountValidationStatus = false;
		}
	}


}
