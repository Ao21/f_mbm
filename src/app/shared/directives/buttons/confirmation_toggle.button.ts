import { Directive, EventEmitter, Output, OnInit, Input, HostListener, HostBinding } from '@angular/core';
@Directive({
	selector: '[confirmationButton]'
})
export class ConfirmationToggleButtonDirective  implements OnInit{
	@Input('active') active: boolean;
	@Output('onUpdate') onUpdate: EventEmitter<any> = new EventEmitter();
	@HostBinding('class.isActive') get isSelected() { return this._isSelected; }
	_isSelected: boolean = false;

	ngOnInit() {
		this._isSelected = this.active;
	}

	@HostListener('click')
	toggleSelected() {
		this._isSelected = !this._isSelected;
		this.onUpdate.next(this._isSelected);
	}
}