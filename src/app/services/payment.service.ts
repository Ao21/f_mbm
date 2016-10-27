import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { AuthHttp } from './../shared/common/authHttp';
import { CONSTS, ERRORS } from './../constants';
import { Analytics } from './analytics.service';
import { ErrorService } from './error.service';
import { Observable } from 'rxjs/Rx';
import { isPresent, isJsObject} from '@angular/core/src/facade/lang';

@Injectable()
export class PaymentService {
	BASE_URL: string = CONSTS.getBaseUrlWithContext();
	CONVERT_QUOTE_URL: string = this.BASE_URL + 'convert/';
	UPDATE_PROPOSAL_URL: string = this.BASE_URL + 'users/me';
	UPDATE_PAYMENT_URL: string = this.BASE_URL + 'users/me/payment';
	BANK_URL: string = this.BASE_URL + 'users/me/bank';
	PURCHASED_URL: string = this.BASE_URL + 'purchased';
	TOKEN_AGREEMENT: string = this.BASE_URL + 'users/me/payment/cardAgreement';

	quotePurchased: any = null;

	constructor(
		private errorService: ErrorService,
		private analytics: Analytics,
		private auth: AuthHttp,
		public http: Http
	) { }

	/**
	 * 	Set Payment Type & Frequency
	 * 	@param string type - Bank/Card
	 *	@param string frequency - monthly/annual
	 * 	@url users/me/payment
	 * 	@return Observable<any>
	 */
	updatePaymentType(type?: string, frequency?: string) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		this.analytics.triggerEvent('paymentOptions', 'type', type);
		return this.auth.put(this.UPDATE_PAYMENT_URL, JSON.stringify({ type: type, frequency: frequency }), { headers: jsonHeader });
	}

	/**
	 * 	Confirm Acceptance of All/Single Credit T&C's'
	 * 	@param boolean all
	 * 	@url users/me/payment/cardAgreement
	 * 	@return Observable<any>
	 */
	confirmTermsConditions(all: boolean): Observable<Response> {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this.TOKEN_AGREEMENT, JSON.stringify({ all: all }), { headers: jsonHeader });
	}

	/**
	 * 	Validates Bank Account Details - Retries on Failure
	 * 	@param AccountDetails accountDetails
	 * 	@url /users/me/bank
	 * 	@return Observable<AccountDetails>
	 */
	validateBankDetails(accountDetails: AccountDetails): Observable<Response> {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this.BANK_URL, JSON.stringify(accountDetails), { headers: jsonHeader })
		.retryWhen((attempts) => {
			return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.bankValidationRetry, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			});
	}


	/**
	 * 	Convert the Quote
	 * 	@param string quoteReference
	 * 	@url /convert/[QUOTE_REFERENCE]
	 * 	@return Observable<QuoteConverted>
	 * 	
	 */
	convertQuote(quoteReference: string): Observable<Response> {
		this.quotePurchased = null;
		this.analytics.triggerEvent('convertQuote', quoteReference);
		return this.auth.get(this.CONVERT_QUOTE_URL + quoteReference);
	}

	isQuotePurchased() {
		return this.auth.get(this.PURCHASED_URL);
	}


	isQuotePurchasedPromise(): Promise<any> {
		return new Promise((res, rej) => {
			if (this.quotePurchased !== null) {
				res(this.quotePurchased);
			} else {
				this.auth.get(this.PURCHASED_URL).subscribe((next) => {
					this.quotePurchased = next.json();
					res(this.quotePurchased);
				}, (err) => {
					rej(err);
				});
			}
		});
	}

}
