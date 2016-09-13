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
		private router: Router,
		private quoteService: QuoteService,
		private dataStore: DataStore,
		private uiStore: UIStore
	) {
		this.uiStore.select('modals', 'testimonials').on('update', this.activate);
	}

	activate = (e) => {
		if (e.data.currentData === true) {
			this.goToBreakdownPage();
		}

	}

	goToBreakdownPage() {
		this.uiStore.update(['UIOptions', 'isTestimonialsTriggered'], true);
		this.quoteService.getQuote().subscribe(
			(next) => {
				console.log(next);
				this.dataStore.setConfig(next.json());
				this.router.navigate(['/breakdown']);
			},
			(err) => {
				this.router.navigate(['/error/sessionExpired']);
				this.uiStore.closeAllModals();
			});
	}

}
