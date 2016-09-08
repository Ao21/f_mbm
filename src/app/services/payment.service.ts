import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { AuthHttp } from './../shared/common/authHttp';
import { CONSTS } from './../constants';
import { Analytics } from './analytics.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PaymentService {
	BASE_URL: string = CONSTS.getBaseUrlWithContext();
	CONVERT_QUOTE_URL: string = this.BASE_URL + 'convert/';
	UPDATE_PROPOSAL_URL: string = this.BASE_URL + 'users/me';
	UPDATE_PAYMENT_URL: string = this.BASE_URL + 'users/me/payment';
	BANK_URL: string = this.BASE_URL + 'users/me/bank';
	TOKEN_AGREEMENT: string = this.BASE_URL + 'users/me/payment/cardAgreement';

	constructor(
		private _analytics: Analytics,
		private _auth: AuthHttp,
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
		this._analytics.triggerEvent('paymentOptions', 'type', type);
		return this._auth.put(this.UPDATE_PAYMENT_URL, JSON.stringify({ type: type, frequency: frequency }), { headers: jsonHeader });
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
		return this._auth.put(this.TOKEN_AGREEMENT, JSON.stringify({ all: all }), { headers: jsonHeader });
	}

	/**
	 * 	Validates Bank Account Details
	 * 	@param AccountDetails accountDetails
	 * 	@url /users/me/bank
	 * 	@return Observable<AccountDetails>
	 */
	validateBankDetails(accountDetails: AccountDetails): Observable<Response> {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this._auth.put(this.BANK_URL, JSON.stringify(accountDetails), { headers: jsonHeader });
	}

	/**
	 * 	Convert the Quote
	 * 	@param string quoteReference
	 * 	@url /convert/[QUOTE_REFERENCE]
	 * 	@return Observable<QuoteConverted>
	 * 	
	 */
	convertQuote(quoteReference: string): Observable<Response> {
		return this._auth.get(this.CONVERT_QUOTE_URL + quoteReference);
	}


}
