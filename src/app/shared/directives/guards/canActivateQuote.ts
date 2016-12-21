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

		private quoteService: QuoteService,
		private dataStore: DataStore,
		private uiStore: UIStore,
		private router: Router) {

	}

	canActivate() {
		this._canActivate = new AsyncSubject();
		if (this.quote = this.dataStore.get(['config', 'quotation']) || this.uiStore.get(['UIOptions', 'isTestimonialsTriggered'])) {
			this._canActivate.next(true);
			this._canActivate.complete();
		} else {
			this.quoteService.getQuote().subscribe((next) => {
				this.dataStore.setConfig(next.json());
				this._canActivate.next(true);
				this._canActivate.complete();
			}, (err) => {
				this.router.navigate(['/error']);
				this._canActivate.next(false);
				this._canActivate.complete();
			});
		}
		return this._canActivate;

	}
}
