import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataStore } from './../../../stores/stores.modules';
import { CONSTS } from './../../../constants';

@Component({
	selector: 'm-title-selector',
	templateUrl: './title_selector.html',
})

export class TitleSelectorComponent implements OnDestroy, OnInit {
	// Input Field
	@Input('field') field: any;
	// Field Control
	@Input() control: FormControl;
	// List of Titles
	titles: any[] = [];
	// Subscription to Datastore for updated title
	sub: ISubscriptionDefinition<any>;
	data: any;

	constructor(
		private changeRef: ChangeDetectorRef,
		private dataStore: DataStore
	) {
		this.sub = this.dataStore.subscribe(CONSTS.TITLE_OPTION, (data) => {
			this.titles = this.data = _.clone(data.get('titles'));
			this.checkForAlternateTitle();
		});
	}

	ngOnInit() {
		this.titles = _.clone(this.dataStore.getTitles());
		this.checkForAlternateTitle();
	}

	/**
	 *	If the system comes back with a non-default title (other than Mr/Mrs/Miss/Mr) this will add in the title
	 * 	to the list of titles available on the title selection
	 */
	checkForAlternateTitle() {
		if (this.titles.length > 0 && !_.find(this.titles, (e) => { return e.id === this.control.value; }) && this.control.value!=='') {
			this.titles.push({ id: this.control.value, value: this.control.value });
			this.changeRef.detectChanges();
		}
	}

	ngOnDestroy() {
		this.dataStore.unsubscribe(this.sub);
	}

}

