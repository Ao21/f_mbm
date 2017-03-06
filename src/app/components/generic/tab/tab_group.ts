import { Component, Attribute, EventEmitter, Input, Output } from '@angular/core';
import {isPresent, NumberWrapper} from '@angular/platform-browser/src/facade/lang';
import { TabsDispatcher } from './tab_dispatcher';
import {TabComponent} from './tab';

let _uniqueIdCounter: number = 0;


@Component({
	selector: 'c-tab-group',
	templateUrl: 'tab_group.html',
	providers: [TabsDispatcher]
})
export class TabGroupComponent {
	@Input('value') value: any;
	_name: string;
	_tabs: TabComponent[];
	activeDescendent: any;
	@Input('disabled') set disabled(value) {
		this._disabled = isPresent(value) && value !== false;
	}
	_disabled: boolean;
	selectedTabId: string;
	@Output() change: EventEmitter<any> = new EventEmitter();
	tabindex: number;

	constructor(
		@Attribute('tabindex') tabindex: string,
		@Attribute('disabled') disabled: string,
		public tabsDispatcher: TabsDispatcher
	) {
		this._name = `tabs-group-${_uniqueIdCounter++}`;
		this._tabs = [];
		this.selectedTabId = '';
		this._disabled = false;

		this.disabled = isPresent(disabled);
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseIntAutoRadix(tabindex) : 0;

	}

	getName(): string {
		return this._name;
	}

	get disabled() {
		return this._disabled;
	}


	get tabs() {
		return this._tabs;
	}

	select(tab: TabComponent) {
		this.disabled = isPresent(this.disabled) && this.disabled !== false;
		if (isPresent(tab.value) && tab.value !== '') {
			this.tabsDispatcher.notify(this._name);
			this.change.next(tab.value);
			this._tabs.forEach(_tab => {
				if (_tab.value === tab.value) {
					_tab.isSelected = true;
					this.selectedTabId = _tab.id;
					this.activeDescendent = _tab.id;

				}
			})
		}
	}

	updateValue(tab: TabComponent) {
		this.selectedTabId = tab.id;
		this.activeDescendent = tab.id;
		this.change.next(tab);
	}

	register(tab: TabComponent) {
		this._tabs.push(tab);
	}
}
