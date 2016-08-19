import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app',
	templateUrl: 'app.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./../styles/app.scss']
})
export class AppComponent {
	constructor(
		private router: Router
	) {
		this.router.events.subscribe((next) => {
			window.scrollTo(0, 0);
		});
	}
}
