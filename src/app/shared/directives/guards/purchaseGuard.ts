import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AsyncSubject } from 'rxjs/Rx';
import { DataStore } from './../../../stores/datastore.store';
import { UIStore } from './../../../stores/uistore.store';
import { PaymentService } from './../../../services/payment.service';

@Injectable()
export class CanActivatePurchased implements CanActivate {
	quote: any;
	_canActivate: AsyncSubject<any> = new AsyncSubject();

	constructor(
		private dataStore: DataStore,
		private paymentService: PaymentService,
		private router: Router) {

	}

	canActivate() {
		this._canActivate = new AsyncSubject();
		this.paymentService.isQuotePurchased().then((next) => {
			if (next.reference) {
				this.dataStore.update(['quote', 'convertedQuote'], next);
				this._canActivate.next(false);
				this._canActivate.complete();
				this.router.navigate(['/confirmation']);
			} else {
				this._canActivate.next(true);
				this._canActivate.complete();
			}
		}).catch((err) => {
			this.router.navigate(['/']);
			this._canActivate.next(false);
			this._canActivate.complete();
		});
		return this._canActivate;

	}
}
