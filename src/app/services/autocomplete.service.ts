import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Response, Headers } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { CONSTS, ERRORS } from './../constants';
import { ErrorService, } from './error.service';
import { isJsObject, isBlank } from '@angular/platform-browser/src/facade/lang';
import { AuthHttp } from './../shared/common/authHttp';
import * as _ from 'lodash';

@Injectable()
export class AutoCompleteService {
	baseURL = CONSTS.getBaseUrlWithContext();
	private _ADDRESS_URL = `${this.baseURL}xref/address`;
	areas: Subject<any> = new Subject();
	counties: Subject<any> = new Subject();
	address: Subject<any> = new Subject();
	searching: Subject<any> = new Subject();
	_filter: string;

	public area: any;
	public county: any;

	constructor(
		private errorService: ErrorService,
		public http: Http,
		private auth: AuthHttp,
	) {

	}

	/**
	 * 	Sets a filter from a single autocomplete that will affect all linked autocompletes
	 * 	@param string type - Restricts one autocomplete with the selection from another
	 */
	setFilter(type) {
		this._filter = type;
	}

	/**
	 * 	Calls the XRef Area Service
	 */
	getArea(input: {}) {
		let options = new RequestOptions({
			search: new URLSearchParams(`town_filter=${input}`)
		});
		return this.http.get(`${this.baseURL}xref/area2`, options)
			.retryWhen((attempts) => {
				return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.townAreaService, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			})
			.map((res: Response) => { return res.json(); });
	}

	getCounty(input: {}) {
		let options = new RequestOptions({
			search: new URLSearchParams(`county_filter=${input}`)
		});
		return this.http.get(`${this.baseURL}xref/area2`, options)
			.retryWhen((attempts) => {
				return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.townAreaService, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			})
			.map((res: Response) => { return res.json() });

	}

	getAddress(input: any) {
		let address = {
			'addressLine1': input,
			'addressLine2': '',
			'area': this.area.description || this.area,
			'county': this.county.description || this.county,
		};

		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.auth
			.put(this._ADDRESS_URL, JSON.stringify(address), options)
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

	reset() {
		this._filter = null;
	}

	search(type: string, inputs: Observable<string>) {
		switch (type) {
			case 'address':
				return inputs.filter(input => { return input.length >= 3 })
					.debounceTime(400)
					.do((x) => { this.searching.next(true); })
					.switchMap(input => this.getAddress(input))
					.map((x) => x.json())
					.subscribe((res: any) => {
						this.searching.next(false);
						this.address.next({
							options: _.map(res.lookups, (el: any) => {
								return { id: el.id, description: el.address }
							})
						});

					}, (err) => {
						this.errorService.errorHandlerWithNotification(err, ERRORS.townAreaService);
					});
			case 'counties':
				return inputs.filter(input => { return input.length >= 3 })
					.debounceTime(400)
					.do((x) => { this.searching.next(true); })
					.switchMap(input => this.getCounty(input))
					.do((x) => { this.searching.next(false); })
					.subscribe((res: any) => {
						if (this._filter !== 'areas') {
							this.counties.next({ options: res.counties });
							this.areas.next({ options: res.towns });
						}
					}, (err) => {
						this.errorService.errorHandlerWithNotification(err, ERRORS.townAreaService);
					});

			case 'areas':
				return inputs.filter(input => { return input.length >= 3 })
					.debounceTime(400)
					.do((x) => { this.searching.next(true); })
					.switchMap(input => this.getArea(input))
					.do((x) => { this.searching.next(false); })
					.subscribe((res: any) => {
						if (this._filter !== 'counties') {
							this.areas.next({ options: res.towns });
							this.counties.next({ options: res.counties });
						}
					}, (err) => {
						this.errorService.errorHandlerWithNotification(err, ERRORS.townAreaService);
					});
			default:
				break;
		}
	}

	url(url) {
		return this.http.get(url);
	}
}
