import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { UIStore } from './../../../stores/stores.modules';
import { MyAAService } from './../../../services/index';


@Component({
	selector: 'button[m-save-quote]',
	templateUrl: './save_quote_button.html'
})
export class SaveQuoteButtonComponent {
	_disabled: boolean = false;
	isAnimating: boolean = false;
	isError: boolean = false;

	@HostBinding('disabled')
	@HostBinding('class.btn--grey')
	get greyDisabled() { return this._disabled; };

	@HostBinding('class.btn--outline')
	@HostBinding('class.btn--dark')
	get darkDisabled() { return !this._disabled; };


	@Input('disabled')
	set disabled(v) {
		this._disabled = v ? v : false;
	}

	constructor(
		private _uiStore: UIStore,
		private _myAA: MyAAService
	) { }

	@HostListener('click', ['$event'])
	onClick(evt: Event) {
		this._myAA.saveQuote().subscribe((next) => {
			this._uiStore.update(['UIOptions', 'isQuoteSaved'], true);
			this._disabled = true;
		}, (err) => {
			this.isError = true;
		});
	}
}
