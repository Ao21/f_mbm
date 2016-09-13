import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuoteService, ErrorService } from './../../services/index';
import { ERRORS } from './../../constants';
import { AuthHttp } from './../../shared/common/authHttp';
import { CustomValidators } from './../../shared/validators/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import * as moment from 'moment';

@Component({
	selector: 'p-retrieve-quote',
	templateUrl: './retrieve_quote.html'
})
export class MembershipRetrieveQuoteComponent implements OnInit {
	fields: any[];
	// Ctrls generated with Validator and Values from the Fields Array
	ctrls: any = {};
	form: FormGroup;
	myAAAccess: boolean = false;

	private sub: any;


	constructor(
		private auth: AuthHttp,
		private route: ActivatedRoute,
		private quoteService: QuoteService,
		private router: Router,
		private errorService: ErrorService,
		private fb: FormBuilder
	) {
		this.registerFormControls();
	}

	registerFormControls() {
		this.fields = [{
			name: 'webRef',
			placeholder: 'WW123456789',
			label: 'Web Reference Number',
			type: 'text',
			validation: [Validators.required]
		}, {
			name: 'dateOfBirth',
			placeholder: 'DD/MM/YYYY',
			type: 'date',
			label: 'Date of Birth',
			validation: [Validators.required, CustomValidators.validDate]
		}];

		_.forEach(this.fields, (e: JourneyField) => {
			this.ctrls[e.name] = [
				'',
				isPresent(e.validation) ? Validators.compose(e.validation) : null,
				isPresent(e.validationAsync) ? Validators.composeAsync(e.validationAsync) : null,
			];
		});

		this.form = this.fb.group(this.ctrls);
	}

	ngOnInit() {
		// Retrieve Parameters from MYAA
		this.sub = this.route.params.subscribe(params => {
			this.myAAAccess = false;
			// On Retrieve Quote from /retrieve_quote/myaa/[CODE]
			let myaa = params['myaa'];
			if (myaa) {
				// Set Auth Cookie and Retrieve Quote Directly
				this.myAAAccess = true;
				this.auth.setCookieToken();
				this.retrieveQuote(myaa);
			}

			// On Retrieve Quote from /retrieve_quote/[WEBREFERENCE]
			let ref = params['ref'];
			let dob = params['dob'];
			this.mapWebReferenceControl(ref);
			this.mapDateOfBirthControl(dob);
		});
	}

	mapWebReferenceControl(reference) {
		let refCtrl: any = this.form.controls['webRef'];
		if (reference) {
			refCtrl.setValue(reference);
			refCtrl.markAsTouched();
			refCtrl.updateValueAndValidity();
		}
	}

	mapDateOfBirthControl(dob) {
		let dobCtrl: any = this.form.controls['dateOfBirth'];
		if (dob) {
			dobCtrl.setValue(moment(dob, 'DDMMYYYY').format('DD/MM/YYYY'));
			dobCtrl.markAsTouched();
			dobCtrl.updateValueAndValidity();
		}
	}

	submit() {
		if (this.form.valid) {
			this.retrieveQuoteWeb();
		} else {
			this.form.controls['webRef'].markAsTouched();
			this.form.controls['dateOfBirth'].markAsTouched();
		}
	}

	retrieveQuote(ref) {
		this.quoteService.retrieveQuote(ref).subscribe(this.retieveQuoteSetQuote, this.retrieveQuoteError);
	}

	retrieveQuoteWeb() {
		this.quoteService.retrieveQuoteWeb(this.form.value.webRef, this.form.value.dateOfBirth)
			.subscribe(this.retieveQuoteSetQuote, this.retrieveQuoteError);
	}

	retieveQuoteSetQuote = (next) => {
		let config = next.json();
		if (config.quotation.breakdown) {
			this.quoteService.setQuote(config, false);
		} else {
			this.quoteService.setQuoteExpired(config);
		}
	}

	retrieveQuoteError = (err) => {
		if (err.status === 401) {
			if (this.myAAAccess) {
				this.errorService.errorHandlerWithConfirmationNotification(
					ERRORS.retrieveQuoteProblem,
					'Sorry, we were unabled to find your quote',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx'
				);
			} else {
				this.errorService.errorHandlerWithNotification(ERRORS.retrieveQuoteProblem);
				this.router.navigateByUrl('/');
			}
		}
		if (err.status === 404) {
			if (this.myAAAccess) {
				this.router.navigateByUrl('/');
				this.errorService.errorHandlerWithConfirmationNotification(
					ERRORS.retrieveQuoteMissing,
					'Sorry, we were unabled to find your quote',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx'
				);
			} else {
				this.errorService.errorHandlerWithNotification(ERRORS.retrieveQuoteMissing);
			}
		}
		if (err.status === 403) {
			if (this.myAAAccess) {
				this.errorService.errorHandlerWithConfirmationNotification(
					ERRORS.retrieveQuoteMyAAProblem,
					'Sorry, there was a problem retrieving your quote.',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx'
				);
				this.router.navigateByUrl('/');
			} else {
				this.errorService.errorHandlerWithNotification(ERRORS.retrieveQuoteMyAAProblem);
			}
		}
		if (err.status === 400) {
			this.errorService.errorHandlerWithNotification(ERRORS.retrieveQuotePurchased);
			this.router.navigate(['/']);
		}
	}
}
