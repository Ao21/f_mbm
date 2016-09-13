import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Response } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { CONSTS, ERRORS } from './../constants';
import { ErrorService,  } from './error.service';

@Injectable()
export class AutoCompleteService {
	baseURL = CONSTS.getBaseUrlWithContext();
	areas: Subject<any> = new Subject();
	counties: Subject<any> = new Subject();
	searching: Subject<any> = new Subject();
	_filter: string;

	constructor(
		private errorService: ErrorService,
		public http: Http
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
				return Observable.range(1, 10).zip(attempts, (i) => { return i; }).flatMap((i) => {
					let time = i * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.townAreaService, time);
					return Observable.timer(time * 1000);
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
				return Observable.range(1, 10).zip(attempts, (i) => { return i; }).flatMap((i) => {
					let time = i * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.townAreaService, time);
					return Observable.timer(time * 1000);
				});
			})
			.map((res: Response) => { return res.json() });

	}

	reset() {
		this._filter = null;
	}

	search(type: string, inputs: Observable<string>) {
		switch (type) {
			case 'counties':
				inputs.filter(input => { return input.length >= 3 })
					.throttleTime(400)
					.do((x) => { this.searching.next(true); })
					.switchMap(input => this.getCounty(input))
					.do((x) => { this.searching.next(false); })
					.subscribe((res: any) => {
						if (this._filter !== 'areas') {
							this.counties.next(res.counties);
							this.areas.next(res.towns);
						}

					}, (err) => {
						this.errorService.errorHandlerWithNotification(ERRORS.townAreaService);
					});

				break;
			case 'areas':
				inputs.filter(input => { return input.length >= 3 })
					.throttleTime(400)
					.do((x) => { this.searching.next(true); })
					.switchMap(input => this.getArea(input))
					.do((x) => { this.searching.next(false); })
					.subscribe((res: any) => {
						if (this._filter !== 'counties') {
							this.areas.next(res.towns);
							this.counties.next(res.counties);
						}
					}, (err) => {
						this.errorService.errorHandlerWithNotification(ERRORS.townAreaService);
					});
				break;
			default:
				break;
		}
	}

	url(url) {
		return this.http.get(url);
	}
}
