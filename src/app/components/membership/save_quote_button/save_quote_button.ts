import {Component, Input} from '@angular/core';
import {UIStore} from './../../../stores/stores.modules';
import {MyAAService} from './../../../services/index';


@Component({
	selector: 'button[m-save-quote]',
	templateUrl: './save_quote_button.html',
	host: {
		'[class.btn--grey]': 'disabled',
		'[class.btn--outline]': '!disabled',
		'[class.btn--dark]': '!disabled',
		'(click)': 'onClick($event)',
		'[disabled]': 'disabled'
	}
})
export class SaveQuoteButtonComponent {
	isAnimating: boolean = false;
	isError: boolean = false;
	@Input('disabled') disabled: boolean = false;

	constructor(
		private _uiStore: UIStore,
		private _myAA: MyAAService
	) { }

	onClick(evt: Event) {
		this._myAA.saveQuote().subscribe((next) => {
			this._uiStore.update(['UIOptions', 'isQuoteSaved'], true);
			this.disabled = true;
		}, (err) => {
			this.isError = true;
		});
	}
}
