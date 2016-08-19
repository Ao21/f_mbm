import { Component, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../stores/stores.modules';

/**
 *  Confirmation Page Component
 */

@Component({
	selector: 'p-confirmation',
	templateUrl: './confirmation.html'
})
export class MembershipConfirmationPageComponent implements OnInit {
	// UI Settings for Confirmation
	page: UIPage;
	convertedQuote: QuoteConverted;
	primaryUser: any;
	members: any = [];

	constructor(
		private _changeRef: ChangeDetectorRef,
		private _el: ElementRef,
		private _uiStore: UIStore,
		private _dataStore: DataStore,
		private _router: Router
	) {}

	ngOnInit() {
		this.page = this._uiStore.getPage('confirmation');
		this.convertedQuote = this._dataStore.get(['config', 'convertedQuote']);
		if (!this.convertedQuote) {
			this.convertedQuote = JSON.parse(sessionStorage.getItem('convertedQuote'));
			if (!this.convertedQuote) {
				this._router.navigate(['/']);
			} else {
				this.init();
			}
			this._dataStore.deleteConvertedQuote();
		} else {
			this.init();
		}
	}

	init() {
		let memberList = [];
		_.forEach(this.convertedQuote.members, (e) => {
			_.forEach(e, (member: any) => {
				memberList.push(member);
				this.members.push(member);
			});
		});
		this.primaryUser = memberList.shift();
		this.members = memberList;
		// Deletes all data in the journey
		this._dataStore.resetConfig();

		// Workaround for Safari Not Updating on Event
		this._changeRef.detectChanges();
		// if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
		// 	document.querySelector('body > app-root > c-top-nav > .c-top_nav__back ').classList.add('isInvisible');
		// 	document.querySelector('body > app-root > c-top-nav > .c-top_nav__header > h3 ').innerHTML = 'Confirmation';
		// 	document.querySelector('body > app-root > c-top-nav > .c-top_nav__header > h3 ').textContent = 'Confirmation';
		// 	document.querySelector('body > app-root > c-top-nav > .c-top_nav__price').classList.add('isInvisible');
		// }
	}

}
