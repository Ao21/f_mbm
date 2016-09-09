import { Component, ViewEncapsulation } from '@angular/core';
import { RulesEngineService } from './services/rules_engine.service';
import { UIStore } from './stores/uistore.store';

import { Router } from '@angular/router';

@Component({
	selector: 'app',
	templateUrl: 'app.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./../styles/app.scss']
})
export class AppComponent {
	// Testimonial Outcome
	outcome: Outcome;
	constructor(
		private router: Router,
		private uiStore: UIStore,
		private _rulesEngine: RulesEngineService,
	) {
		this.outcome = this._rulesEngine.random();
		this.router.events.subscribe((next) => {
			this.uiStore.update(['overView', 'isVisible'], false);
			window.scrollTo(0, 0);
		});
	}
}
