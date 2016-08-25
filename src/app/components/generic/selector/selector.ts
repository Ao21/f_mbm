import { Component, HostListener, HostBinding, Optional, Host, OnInit, Input } from '@angular/core';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { SelectorGroupComponent } from './selector_group';
import { SelectorDispatcher } from './selector_dispatcher';

let _uniqueIdCounter = 0;

@Component({
	selector: 'c-selector',
	templateUrl: 'selector.html'
})
export class SelectorComponent implements OnInit {

	@HostBinding('attr.role') role: string = 'radio';
	@HostBinding('class.isSelected') get _isChecked() { return this.isChecked; };
	@HostBinding('attr.aria-checked') get _isAriaChecked() { return this.isChecked; };
	@HostBinding('attr.aria-disabled') get _isAriaDisabled() { return this.disabled; };
	@HostBinding('attr.tabindex') get _tabIndex() { return this.tabindex; };
	@HostBinding('id') get _id() { return this.id; };

	@Input('id') id: string;
	@Input('value') value: any;
	@Input('group') group: any;
	@Input('name') name: string;
	@Input('checked') checked: boolean;
	@Input('disabled') set disabled(d) { this._disabled = d; };
	isChecked: boolean;
	_disabled: boolean;
	selectorDispatcher: SelectorDispatcher;
	tabindex: number = -1;

	constructor(
		@Optional() @Host() public selectorGroup: SelectorGroupComponent,
		selectorDispatcher: SelectorDispatcher,
	) {
		this.isChecked = false;
		this.selectorDispatcher = selectorDispatcher;

		selectorDispatcher.listen((name) => {
			if (name === this.name) {
				this.isChecked = false;
			}
		});

		if (isPresent(selectorGroup)) {
			this.name = selectorGroup.getName();
			this.selectorGroup.register(this);
			if (selectorGroup.tabindex === -1) {
				this.tabindex = 0;
			}
		}

	}

	ngOnInit() {
		this.id = isPresent(this.id) ? `selector-${this.id}` : `selector-${_uniqueIdCounter++}`;
		if (isPresent(this.selectorGroup)) {
			this.name = this.selectorGroup.getName();

			if (isPresent(this.checked) && this.checked === true) {
				this.selectorDispatcher.notify(this.name);
				this.isChecked = true;
				if (isPresent(this.selectorGroup)) {
					this.selectorGroup.updateValue(this.value);
				}
			}
			if (isPresent(this.selectorGroup.init)) {
				let initValue = this.selectorGroup.init.value ? this.selectorGroup.init.value : this.selectorGroup.init;
				if (initValue !== '' && initValue === this.value) {
					this.selectorDispatcher.notify(this.name);
					this.isChecked = true;
					if (isPresent(this.selectorGroup)) {
						this.selectorGroup.updateValue(this.value);
					}
				}
			}
		}

	}

	isDisabled(): boolean {
		return this.disabled || (isPresent(this.selectorGroup) && this.selectorGroup.disabled);
	}

	get disabled(): boolean {
		return this._disabled;
	}

	@HostListener('click', ['$event'])
	@HostListener('keydown.space', ['$event'])
	select(event: Event) {
		if (this.isDisabled()) {
			event.stopPropagation();
			return;
		}

		this.selectorDispatcher.notify(this.name);

		this.isChecked = true;

		if (isPresent(this.selectorGroup)) {
			this.selectorGroup.updateValue(this.value);
		}
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.keyCode === 49) {
			event.preventDefault();
			this.select(event);
		}
	}

}
