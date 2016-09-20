import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { DataStore } from './../../../stores/datastore.store';
import { AsyncSubject } from 'rxjs/Rx';
import { PaymentService } from './../../../services/payment.service';


@Injectable()
export class CanActivateConfirmation implements CanActivate {
	convertedQuote: any;
	_canActivate: AsyncSubject<any> = new AsyncSubject();

	constructor(
		private paymentService: PaymentService,
		private dataStore: DataStore,
		private router: Router) { }

	canActivate() {
		this._canActivate = new AsyncSubject();
		if (this.dataStore.get(['quote', 'convertedQuote'])) {
			this._canActivate.next(true);
			this._canActivate.complete();
		} else {
			this.paymentService.isQuotePurchased().then((next) => {
				if (next.reference) {
					this.dataStore.update(['quote', 'convertedQuote'], next);
					this._canActivate.next(true);
					this._canActivate.complete();
				} else {
					this._canActivate.next(false);
					this._canActivate.complete();
					this.router.navigate(['/']);
				}
			}).catch((err) => {
				this.router.navigate(['/']);
				this._canActivate.next(false);
				this._canActivate.complete();
			});
		}

		return this._canActivate;

	}
}
