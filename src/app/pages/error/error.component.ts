import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorService } from './../../services/index';
import { UIStore, DataStore } from './../../stores/stores.modules';
import { ActivatedRoute } from '@angular/router';

/**
 * 	Error Page Component
 *
 */
@Component({
	selector: 'p-error',
	templateUrl: './error.html'
})
export class MembershipErrorPageComponent implements OnInit, OnDestroy {
	page: UIPage;
	errMsg: ErrorMessage;
	reference: string;
	private sub: any;

	constructor(
		private route: ActivatedRoute,
		private errorService: ErrorService,
		private uiStore: UIStore,
		private dataStore: DataStore
	) {
		this.page = this.uiStore.getPage('error');
	}

	ngOnInit() {
		this.uiStore.update('topNavVisible', false);
		// Gets the errCode from the URL Paramaters
		this.sub = this.route.params.subscribe(params => {
			let code = params['errCode'];
			this.reference = params['reference'];
			this.errMsg = this.errorService.retrieveServiceError(code);
			if (this.errMsg.resetJourney) {
				this.dataStore.resetConfig();
			}
		});
	}

	ngOnDestroy() {
		this.uiStore.update('topNavVisible', true);
	}

}
