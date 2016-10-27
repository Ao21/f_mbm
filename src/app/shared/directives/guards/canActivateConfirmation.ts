import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ErrorService } from './../../../services/error.service';
import { DataStore } from './../../../stores/datastore.store';
import { AsyncSubject } from 'rxjs/Rx';
import { ERRORS } from './../../../constants';
import { PaymentService } from './../../../services/payment.service';


@Injectable()
export class CanActivateConfirmation implements CanActivate {
	convertedQuote: any;
	_canActivate: AsyncSubject<any> = new AsyncSubject();

	constructor(
		private errorService: ErrorService,
		private paymentService: PaymentService,
		private dataStore: DataStore,
		private router: Router) { }

	canActivate() {
		this._canActivate = new AsyncSubject();
		if (this.dataStore.get(['quote', 'convertedQuote'])) {
			this._canActivate.next(true);
			this._canActivate.complete();
		} else {
			this.paymentService.isQuotePurchasedPromise().then((next) => {
				if (next.reference && next.purchased === null) {
					this.dataStore.update(['quote', 'convertedQuote'], next);
					this._canActivate.next(true);
					this._canActivate.complete();
				} else {
					this._canActivate.next(false);
					this._canActivate.complete();
					this.router.navigate(['/']);
				}
			}).catch((err) => {
				this.errorService.errorHandlerWithNotification(err, ERRORS.isQuotePurchasedFailure);
				this._canActivate.next(false);
				this._canActivate.complete();
			});
		}

		return this._canActivate;

	}
}
