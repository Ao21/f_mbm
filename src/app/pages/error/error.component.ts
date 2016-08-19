import {Component, OnInit, OnDestroy} from '@angular/core';
import {ErrorService} from './../../services/index';
import {UIStore} from './../../stores/stores.modules';
import {ActivatedRoute} from '@angular/router';

/**
 * 	Error Page Component
 *
 */
@Component({
	selector: 'p-error',
	templateUrl: './error.html'
})
export class MembershipErrorPageComponent implements OnInit, OnDestroy{
	page: UIPage;
	errMsg: ErrorMessage;
	private sub: any;

	constructor(
		private route: ActivatedRoute,
		private _errorService: ErrorService,
		private _uiStore: UIStore
	) {
		this.page = this._uiStore.getPage('error');		
	}

	ngOnInit() {
		this._uiStore.update('topNavVisible', false);
		// Gets the errCode from the URL Paramaters
		this.sub = this.route.params.subscribe(params => {
			let code = params['errCode'];
			this.errMsg = this._errorService.retrieveServiceError(code);
		});
	}

	ngOnDestroy() {
		this._uiStore.update('topNavVisible', true);
	}

}
