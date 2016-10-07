import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthHttp } from './../shared/common/authHttp';
import { isJsObject, isBlank } from '@angular/platform-browser/src/facade/lang';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notifications.service';
import { ErrorService } from './error.service';
import { Analytics } from './analytics.service';
import { CONSTS, ERRORS } from './../constants';

@Injectable()
export class ReferenceService {
	private _baseURL = CONSTS.getBaseUrlWithContext();
	private _ADDRESS_URL = `${this._baseURL}xref/address`;
	private _SELECT_ADDRESS_URL = `${this._baseURL}xref/address/selected`;
	private _BANK_URL = `${CONSTS.getBaseUrlWithContext()}users/me/bank`;
	private _TITLE_URL = `${this._baseURL}xref/titles`;

	constructor(
		private analytics: Analytics,
		private errorService: ErrorService,
		private notifications: NotificationService,
		private auth: AuthHttp,
		public http: Http
	) { }

	getTitles() {
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.auth.get(this._TITLE_URL, options);
	}

	selectAddress(id) {
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.auth.post(this._SELECT_ADDRESS_URL, JSON.stringify({ id: id }), options);
	}

	checkAddress(input: any) {
		let cleanInput = _.mapValues(input, (e) => {
			if (isJsObject(e)) {
				return e.description;
			} else if (isBlank(e)) {
				return '';
			} else {
				return e;
			}
		});
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.auth
			.put(this._ADDRESS_URL, JSON.stringify(cleanInput), options)
			.retryWhen((attempts) => {
				return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.addressService, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			});

	}
}
