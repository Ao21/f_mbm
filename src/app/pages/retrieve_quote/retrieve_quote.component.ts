import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService, QuoteService } from './../../services/index';
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
		private _router: Router,
		private notificationService: NotificationService,
		private _fb: FormBuilder
	) {
		this.fields = [
			{
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
			}
		];

		_.forEach(this.fields, (e: JourneyField) => {
			this.ctrls[e.name] = [
				'',
				isPresent(e.validation) ? Validators.compose(e.validation) : null,
				isPresent(e.validationAsync) ? Validators.composeAsync(e.validationAsync) : null,
			];
		});

		this.form = this._fb.group(this.ctrls);
	}

	ngOnInit() {
		// Retrieve Parameters from MYAA
		this.sub = this.route.params.subscribe(params => {
			this.myAAAccess = false;
			// On Retrieve Quote from /retrieve_quote/myaa/[CODE]
			let myaa = params['myaa'];
			// On Retrieve Quote from /retrieve_quote/[WEBREFERENCE]
			let ref = params['ref'];
			let dob = params['dob'];
			let refCtrl: any = this.form.controls['webRef'];
			let dobCtrl: any = this.form.controls['dateOfBirth'];
			if (ref) {
				refCtrl.updateValue(ref);
				refCtrl.markAsTouched();
				refCtrl.updateValueAndValidity();

			}
			if (dob) {
				dobCtrl.updateValue(moment(dob, 'DDMMYYYY').format('DD/MM/YYYY'));
				dobCtrl.markAsTouched();
				dobCtrl.updateValueAndValidity();
			}

			if (myaa) {
				// Set Auth Cookie and Retrieve Quote Directly
				this.myAAAccess = true;
				this.auth.setCookieToken();
				this.retrieveQuote(myaa);
			}
		});
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
			this.quoteService.setQuote(config, true);
		}
	}

	retrieveQuoteError = (err) => {
		if (err.status === 401) {
			if (this.myAAAccess) {
				this.notificationService.createConfirmationNotification(
					'Sorry, we were unabled to find your quote',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx');

			} else {
				this.notificationService.createError(`Sorry, there was a problem retrieving your quote.`);
				this._router.navigateByUrl('/');
			}
		}
		if (err.status === 404) {
			if (this.myAAAccess) {
				this._router.navigateByUrl('/');
				this.notificationService.createConfirmationNotification(
					'Sorry, we were unabled to find your quote',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx');

			} else {
				this.notificationService.createError(`Sorry, we were unable to find your quote.`);
			}
		}
		if (err.status === 403) {
			if (this.myAAAccess) {
				this.notificationService.createConfirmationNotification(
					'Sorry, there was a problem retrieving your quote.',
					'Go Back To MyAA',
					'https://www.theaa.ie/myaa.aspx');
				this._router.navigateByUrl('/');
			} else {
				this.notificationService.createError(`Sorry, there was a problem retrieving your AA Membership quote. 
						Please try again.`);
			}
		}
		if (err.status === 400) {
			this.notificationService.createError(`Sorry, this quote has already been purchased. 
						You can begin a new quote but your details will not be pre-populated.`);
			this._router.navigate(['/']);
		}
	}
}
