import { Component, ViewEncapsulation } from '@angular/core';
import { RulesEngineService } from './services/rules_engine.service';
import { UIStore } from './stores/uistore.store';

import { Router } from '@angular/router';
import * as flexibility from 'flexibility';

@Component({
	selector: 'app',
	templateUrl: 'app.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: []
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
		let doc = document.documentElement;
		doc.setAttribute('data-useragent', navigator.userAgent);
		flexibility(document.documentElement);
		this.router.events.subscribe((next) => {
			this.uiStore.update(['overview', 'isVisible'], false);
			window.scrollTo(0, 0);
		});
	}
}
