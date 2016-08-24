import { Component, OnInit, Input, Optional, SkipSelf, Host, HostBinding } from '@angular/core';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { TabsDispatcher } from './tab_dispatcher';
import { TabGroupComponent } from './tab_group';

@Component({
	selector: 'c-tab',
	templateUrl: './tab.html'
})
export class TabComponent implements OnInit {

	@Input('id') set id(v) { this._id = v ? v : 'tab'; };
	@Input('name') name: string;
	@Input('tabIndex') set tabIndex(v) { this._tabIndex = v ? v : -1; };
	@Input('value') value: string;

	@HostBinding('id') get _attrId() { return this._id; };
	@HostBinding('attr.tabindex') get attrTabIndex() { return this._tabIndex; };
	@HostBinding('class.selected') get attrSelected() { return this._isSelected; };
	@HostBinding('class.aria-disabled') get attrDisabled() { return this._isDisabled; };

	@Input('disabled')
	set disabled(v: boolean) { this._isDisabled = v ? v : false; }

	@Input('selected') set isSelected(v) {
		this._isSelected = v ? v : false;
	}

	get isSelected() {
		return this._isSelected;
	}

	private _isSelected: boolean;
	private _id;
	private _tabIndex: number;
	private _isDisabled: boolean = false;


	constructor(
		@Optional() @SkipSelf() @Host() public tabGroup: TabGroupComponent,
		public tabsDispatcher: TabsDispatcher
	) { }

	ngOnInit() {
		this.tabsDispatcher.listen((name) => {
			if (name === this.name) {
				this._isSelected = false;
			}
		});
		this.name = this.tabGroup.getName();
		this.tabGroup.register(this);
		if (isPresent(this._isSelected)) {
			this.tabGroup.select(this);
		}
	}

	isDisabled(): boolean {
		return this._isDisabled || (isPresent(this.tabGroup) && this.tabGroup.disabled);
	}

	get disabled(): boolean {
		return this.isDisabled();
	}

}
