import { Injectable } from '@angular/core';
import {
	Router, Resolve,
	ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { isPresent } from '@angular/core/src/facade/lang';
import { InitService, ProductConfig } from './../../../services/init.service';
import { DataStore } from './../../../stores/datastore.store';

@Injectable()
export class ConfigResolveGuard implements Resolve<ProductConfig> {
	constructor(
		private initService: InitService,
		private dataStore: DataStore,
		private router: Router) { }
	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (this.initService.isProductConfigPreloaded || this.dataStore.exists(['config', 'code'])) {
			return true;
		}
		if (isPresent(window['config'])) {
			this.dataStore.setConfig(window['config']);
			return true;
		}
		return this.initService.load().then(productConfig => {
			if (productConfig) {
				this.initService.current = productConfig;
				this.dataStore.setConfig(productConfig);
				return productConfig;
			} else { // id not found
				return false;
			}
		});
	}
}