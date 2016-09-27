import { Injectable } from '@angular/core';
import { AuthHttp } from './../shared/common/authHttp';
import { CONSTS } from './../constants';
import { environment } from './../../environments/environment';

export class Config {
	baseUrl: string = `${CONSTS.getBaseUrlWithContext()}config`;
}

export class ProductConfig {
	code: {
		id: string;
		description: string;
	};
	name: string;
	schemaCode: string;
	criteria: any[];
	paymentOptions: PaymentOption[];
	coverLevel: CoverLevel[];
}

@Injectable()
export class InitService {
	public current: ProductConfig = null;
	baseUrl: string = `${CONSTS.getBaseUrlWithContext()}config`;
	public isProductConfigPreloaded = false;
	constructor(
		private http: AuthHttp,
		private config: Config
	) { }

	getConfig() {
		return this.http.get(this.baseUrl);
	}

	load(): Promise<ProductConfig> {

		if (this.current !== null) {
			return new Promise((res) => {
				res(this.current);
			});
		}
		let promise = this.http.get(this.config.baseUrl, {withCredentials: true}).map(res => res.json()).toPromise();
		if (!environment.production) {
			// ENDPOINTS
			// HOMESTART
			// HOMESTARTPRICE
			// HOMESTARTPRICEADDITIONAL
			// HOMESTARTPRICEADDITIONALPLATINUM
			// QUOTEFEES
			// LANDINGPAGE2ADDITIONAL
			document.cookie = 'xsrftoken=HOMESTARTPRICEADDITIONALPLATINUM';
		}
		promise.then((site) => {
			this.current = site;
			this.isProductConfigPreloaded = true;
		}).catch((err) => {
			console.log('Product Config Load Failure');
		});
		return promise;
	}
}

export var INIT_SERVICE_PROVIDERS = [
	Config,
	ProductConfig,
	InitService
];
