import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Analytics } from './../../../services/analytics.service';

@Component({
	selector: 'c-top-nav',
	templateUrl: './header_component.html'
})
export class HeaderComponent {
	price: any;
	prev: any = null;
	header: any;
	isPriceVisible: boolean = false;

	constructor(
		private _changeRef: ChangeDetectorRef,
		public uiStore: UIStore,
		private _analytics: Analytics,
		private _dataStore: DataStore,
		private _router: Router
	) {
		this.uiStore.select('activePage').on('update', (e) => {
			this.updateByPageObject(e.data.currentData);
		});
		this.price = this._dataStore.get(['pricing', 'estimate', 'calculatedPrice']);
		this._dataStore.select('pricing', 'estimate', 'calculatedPrice').on('update', (e) => {
			this.price = e.data.currentData;
		});
	}

	updateByPageObject = (page) => {
		this.header = page.title;
		if (page.prev) {
			this.prev = this.uiStore.get(['pages', page.prev]);
		} else {
			this.prev = null;
		}
		if (page.options && page.options.navHidden) {
			this.prev = null;
			this.isPriceVisible = false;
		} else {
			this.isPriceVisible = true;
		}
		// Safari Workaround
		this._changeRef.detectChanges();
	}

	toggleDropdown() {
		let path = ['overView', 'isVisible'];
		this.uiStore.update(path, !this.uiStore.get(path));
	}

	triggerBack() {
		if (this.prev) {
			this._analytics.triggerEvent('navigation-event', null, 'back');
			this._router.navigate([this.prev.address]);
		}
	}
}
