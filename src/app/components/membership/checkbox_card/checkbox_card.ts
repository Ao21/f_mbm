import {
	Input,
	Output,
	Component,
	EventEmitter,
	state,
	transition,
	style,
	HostBinding,
	HostListener,
	animate,
	trigger
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Utils } from './../../../shared/utilities/index';

/**
 *  Checkbox Card
 *
 *  Card's that can be toggled
 *
 *  @selector c-checkbox-card
 *
 *  @host role checkbox - Sets ARIA-ROLE
 *  @host [attr.aria-labelledby] lableId - sets the Aria Label to {{id}}-label
 *  @host (click) onInteractionEvent(E) - toggles isSelected if not disabled
 *  @host (keyup.space) onInteractionEvent(E) - toggles isSelected if not disabled
 *  @host (keydown.space) onSpaceDown - prevents EventPropagation for space
 *  @host [attr.aria-disabled] isDisabled - sets ARIA-Disabled
 *  @host [attr.aria-checked] isSelected - sets ARIA-checked
 *  @host [attr.tabindex] disabled ? null : tabindex' - Enables/Disables Tabindex based on disabled
 *
 *  ### Example
 *  ````html
 *  <c-checkbox-card (onSelect)='makeSelection($event)' [selected]='option.active' [disabled]='option.disabled'>
 *      <article title>Title</article>
 *      <article content>I am content</article>
 *  </c-checkbox-card>
 *  ````
 *
 */

@Component({
	selector: 'c-checkbox-card',
	templateUrl: './checkbox_card.html',
	animations: [
		trigger('collapseContent', [
			state('hidden', style({ marginTop: '-200px' })),
			state('visible', style({ marginTop: '0' })),
			transition('hidden => visible', [animate('350ms')]),
			transition('visible => hidden', [animate('350ms')])
		])
	]
})

export class CheckboxCardComponent {
	public isContentCollapsed: string = 'visible';
	public isContentCollapsable: boolean = false;

	// Event Emitted on toggling of the checkbox
	@Output() onSelect: EventEmitter<any> = new EventEmitter();
	// Tab index for the checkbox
	@Input() tabindex: number = 0;
	// Either get an ID from the component or autogenerate one
	@Input('name') name: string;
	// Set whether the Checkbox is preselected
	@Input('isSelected') private isSelected: boolean = false;
	// Whether the checkbox is disabled - prevents it from being toggled
	@Input('isDisabled') private isDisabled: boolean = false;
	// The Index of the Checkbox that is emitted by the onSelect event
	@Input('index') private index: number;

	@HostBinding('attr.role') role: string = 'checkbox';
	@HostBinding('class.c-checkbox-card') checkBoxClass: boolean = true;
	@HostBinding('class.isDisabled') get _disabled() { return this.isDisabled; };
	@HostBinding('class.isChecked') get _checked() { return this.isSelected; };
	@HostBinding('attr.aria-disabled') get _ariaDisabled() { return this.isDisabled; };
	@HostBinding('attr.aria-checked') get _ariaChecked() { return this.isSelected; };
	@HostBinding('attr.tabIndex') get _tabIndex() { return this.tabindex; };

	/** The id that is attached to the checkbox's label. */
	@HostBinding('attr.aria-labelledby') get labelId() { return `${this.name}--${this.index}-label`; };

	@HostBinding('id') get attrId() {
		if (this.name) {
			return `${this.name}--${this.index}`;
		} else {
			return `md-checkbox--${this.index}`;
		}
	}

	constructor() {
		let resizeEvent = Observable.fromEvent(window, 'resize')
			.debounceTime(50);
		resizeEvent.subscribe(() => {
			if (Utils.isViewportMobile()) {
				this.isContentCollapsed = 'hidden';
				this.isContentCollapsable = true;
			} else {
				this.isContentCollapsed = 'visible';
				this.isContentCollapsable = false;
			}
		});

		this.isContentCollapsed = Utils.isViewportMobile() ? 'hidden' : 'visible';
		this.isContentCollapsable = Utils.isViewportMobile();
	}


	// Event Handler for Click & Space down
	@HostListener('keyup.space', ['$event'])
	@HostListener('click', ['$event'])
	onInteractionEvent(event: Event) {
		if (this.isDisabled && event) {
			// event.stopPropagation();
			return;
		}
		this.toggleCheckboxActive();
	}

	// Prevent Spacebar bubbling (Scrolling Down)
	@HostListener('keydown.space', ['$event'])
	onSpaceDown(evt: Event) {
		evt.preventDefault();
	}

	toggleContentCollapse(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		if (Utils.isViewportMobile()) {
			this.isContentCollapsed = this.isContentCollapsed === 'visible' ? 'hidden' : 'visible';
		}
	}

	/** Toggles the checked state of the checkbox. If the checkbox is disabled, this does nothing. */

	toggleCheckboxActive() {
		if (!this.isDisabled) {
			this.isSelected = !this.isSelected;
			let update = {
				index: this.index,
				isSelected: this.isSelected
			};
			this.onSelect.next(update);
		}
	}
}
