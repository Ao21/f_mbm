import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataStore } from './../../../stores/datastore.store';

@Injectable()
export class CanActivateConfirmation implements CanActivate {
	convertedQuote: any;

	constructor(
		private dataStore: DataStore,
		private router: Router) { }

	canActivate() {
		if (this.convertedQuote = this.dataStore.get(['config', 'convertedQuote'])) {
			return true;
		} else {
			this.router.navigate(['/']);
			return false;
		}

	}
}
