import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataStore } from './../../../stores/datastore.store';
import { QuoteService } from './../../../services/quote.service';

@Injectable()
export class CanActivateConfirmation implements CanActivate {
	convertedQuote: any;

	constructor(
		private _quoteService: QuoteService,
		private _dataStore: DataStore,
		private router: Router) { }

	canActivate() {
		if (this.convertedQuote = this._dataStore.get(['config', 'convertedQuote'])) {
			return true;
		} else {
			this.router.navigate(['/']);
			return false;
		}

	}
}
