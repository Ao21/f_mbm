import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QuoteService } from './../../../services/quote.service';
import { DataStore, UIStore } from './../../../stores/stores.modules';

@Component({
	selector: 'pu-testimonials',
	templateUrl: './p-testimonials.html'

})
export class TestimonialPopupComponent {
	@Input('outcome') public outcome: Outcome;
	countdownStarted: boolean = false;

	constructor(
		private _router: Router,
		private _quoteService: QuoteService,
		private _dataStore: DataStore,
		private _uiStore: UIStore
	) {
		this._uiStore.select('modals', 'testimonials').on('update', this.activate);
	}

	activate = (e) => {
		if (e.data.currentData === true) {
			this.goToBreakdownPage();
		}

	}

	goToBreakdownPage() {
		this._uiStore.update(['UIOptions', 'isTestimonialsTriggered'], true);
		this._quoteService.getQuote().subscribe(
			(next) => {
				console.log('get quote');
				this._dataStore.setConfig(next.json());
				this._router.navigate(['/breakdown']);
			},
			(err) => {
				this._router.navigate(['/error']);
			});
	}

}
