import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { DataStore } from './../stores/datastore.store';
import { AuthHttp } from './../shared/common/authHttp';
import { Observable, Subject } from 'rxjs/Rx';
import { Analytics } from './analytics.service';
import { NotificationService } from './notifications.service';

import { ErrorService } from './error.service';
import { QuoteService } from './quote.service';
import { CONSTS, ERRORS } from './../constants';

export class MyAAUserResponses {
	_Registered: Number = 1;
	_NotRegisteredVerified: Number = 2;
	_NotRegistered: Number = 3;
	_RegisteredAwaitingValidation: Number = 4;
	_AlreadyRegistered: Number = 5;
	_InvalidPassword: Number = 6;
	_InvalidEmail: Number = 7;
}

@Injectable()
export class MyAAService {
	loginSubscription: Subject<any> = new Subject();
	loginFailure: Subject<any> = new Subject();
	userCheckSubscription: any = new Subject();
	baseURL = CONSTS.getBaseUrlWithContext();
	_USER_EXISTS_URL = this.baseURL + 'users/me/email';
	_LOGIN_URL = this.baseURL + 'oauth/token';
	_GET_USER_URL = this.baseURL + 'users/me';
	_SAVE_QUOTE_URL = this.baseURL + 'users/me';
	_REGISTER_URL = this.baseURL + 'users';
	_AUTH_COOKIE = this.baseURL + 'cookie/ronan';

	constructor(
		private auth: AuthHttp,
		private analytics: Analytics,
		private errorService:ErrorService,
		private http: Http,
		@Inject(forwardRef(() => DataStore)) private dataStore: DataStore,
		private quoteService: QuoteService,
		private notifications: NotificationService
	) {

		this.loginSubscription.subscribe((next) => {
			this.auth.setToken(next);
			this.getUser().subscribe(
				(user) => {
					let userObject = user.json();
					if (userObject.quotes && next.retrieveQuote) {
						this.quoteService.retrieveQuoteList.next(userObject.quotes);
					}
					this.dataStore.setAuthenticatedUser(userObject);
				}
			);
		}, (err) => {
			console.log('FAIL');
		});
	}

	checkIfUserExists(email) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this._USER_EXISTS_URL, JSON.stringify({ email: email }), { headers: jsonHeader })
			.retryWhen((attempts) => {
			return Observable.range(1, 10).zip(attempts, (i) => { return i; }).flatMap((i) => {
				let time = i * 6;
				this.errorService.errorHandlerWithTimedNotification(ERRORS.checkUserExistsError, time);
				return Observable.timer(time * 1000);
				});
			});
	}

	mapUserResponse(res) {
		let obj = res.json();
		obj.res = this.checkIfUserExistsResponseMapping(obj.login).res;
		this.analytics.triggerEvent('previous-user-detected', obj.res);
		return obj;
	}

	triggerRenewalProccess() {
		this.notifications.createNotification
					(`<a href="http://www.theaa.ie/">Are you a current AA Member looking to renew? 
					Click here to go to the renewals page.</a>`);
	}

	checkIfUserExistsResponseMapping(resID: string) {
		let USER_EXISTS_MAP = [];
		USER_EXISTS_MAP['0'] = { res: 'Not Registered' };
		USER_EXISTS_MAP['1'] = { res: 'Registered' };
		USER_EXISTS_MAP['2'] = { res: 'Logged In' };
		return USER_EXISTS_MAP[resID];
	}

	saveQuote() {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this._SAVE_QUOTE_URL, JSON.stringify({ saveMyAA: true }), { headers: jsonHeader });
	}

	register(user, pass) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');

		let res = this.auth
			.post(this._REGISTER_URL, JSON.stringify({ email: user, password: pass }), { headers: jsonHeader })
			.share();

		res.subscribe((next) => {
			this.analytics.registerEvent.next('success');
		}, (err) => {
			this.analytics.registerEvent.next('failure');
		});
		return res;
	}

	login(user: string, pass: string, triggerRetrieveQuote?: boolean) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/x-www-form-urlencoded');

		let res = this.auth.post(this._LOGIN_URL, `email=${user}&password=${pass}&grant_type=password`, { headers: jsonHeader }).share();

		res.subscribe((next: any) => {
			this.analytics.loginEvents.next('success');
			let lgnObj = next.json();
			if (triggerRetrieveQuote) {
				lgnObj.retrieveQuote = true;
			}
			this.loginSubscription.next(lgnObj);
		}, (err) => {
			this.analytics.loginEvents.next('failure');
		});

		return res;
	}

	getUser() {
		return this.auth.get(this._GET_USER_URL);
	}
}
