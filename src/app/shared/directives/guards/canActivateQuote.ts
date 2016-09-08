import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AsyncSubject } from 'rxjs/Rx';
import { DataStore } from './../../../stores/datastore.store';
import { UIStore } from './../../../stores/uistore.store';
import { QuoteService } from './../../../services/quote.service';

@Injectable()
export class CanActivateQuote implements CanActivate {
	quote: any;
	_canActivate: AsyncSubject<any> = new AsyncSubject();;

	constructor(

		private _quoteService: QuoteService,
		private _dataStore: DataStore,
		private _uiStore: UIStore,
		private router: Router) {

	}

	canActivate() {
		console.log('activate');
		this._canActivate = new AsyncSubject();
		console.log(this._uiStore.get(['UIOptions', 'isTestimonialsTriggered']))
		if (this.quote = this._dataStore.get(['config', 'quotation']) || this._uiStore.get(['UIOptions', 'isTestimonialsTriggered'])) {
			this._canActivate.next(true);
			this._canActivate.complete();
		} else {
			this._quoteService.getQuote().subscribe((next) => {
				this._dataStore.setConfig(next.json());
				this._canActivate.next(true);
				this._canActivate.complete();
			}, (err) => {
				this.router.navigate(['/error']);
				this._canActivate.next(false);
				this._canActivate.complete();
				// If No Quote - Send to Included
			});
		}
		return this._canActivate;

	}
}
