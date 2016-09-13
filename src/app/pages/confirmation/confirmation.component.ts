import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../stores/stores.modules';

/**
 *  Confirmation Page Component
 */

@Component({
	selector: 'c-page-confirmation',
	templateUrl: './confirmation.html'
})
export class MembershipConfirmationPageComponent implements OnInit {
	// UI Settings for Confirmation
	page: UIPage;
	convertedQuote: QuoteConverted;
	primaryUser: any;
	members: any = [];

	constructor(
		private changeRef: ChangeDetectorRef,
		private uiStore: UIStore,
		private dataStore: DataStore,
		private router: Router
	) {}

	ngOnInit() {
		this.page = this.uiStore.getPage('confirmation');
		this.convertedQuote = this.dataStore.get(['config', 'convertedQuote']);
		if (!this.convertedQuote) {
			this.convertedQuote = JSON.parse(sessionStorage.getItem('convertedQuote'));
			if (!this.convertedQuote) {
				this.router.navigate(['/']);
			} else {
				this.init();
			}
			this.dataStore.deleteConvertedQuote();
		} else {
			this.init();
		}
		// Workaround for Safari not updating
		this.changeRef.detectChanges();
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
		this.dataStore.resetConfig();
	}

}
