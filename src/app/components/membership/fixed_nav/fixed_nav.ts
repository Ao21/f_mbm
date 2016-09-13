import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Analytics } from './../../../services/analytics.service';
import { UIStore } from './../../../stores/stores.modules';

/**
 *  Fixed Nav
 *
 *  @selector c-fixed-nav
 *  @input {String} next  - The name of the Next Page Object to be retrieved from the UIStore
 *  @input {String} prev - The name of the Previous Page Object to be retrieved from the UIStore
 *  @input {Boolean} disabled - Sets whether its possible to go forward, doesn't affect back
 *  @output {Event} onNavigate - Called on an attempt to navigate to the next page
 *  @output {Event} onNext - Called on successful attempt to navigate to the next page
 *  @output {Event} onPrev - Called on navigating to the previous page
 *
 *  ### Default Example
 *  ````html
 *  <c-fixed-nav [next]="page.next" [prev]="page.prev"></pu-default>
 *  ````
 *
 *  ### Event Example
 *  ````html
 *  <c-fixed-nav (onNavigate)="doSomething()" [prev]="page.prev"></pu-default>
 *  ````
 */

@Component({
	selector: 'c-fixed-nav',
	templateUrl: './fixed_nav.html',
})
export class FixedNavComponent implements OnInit {
	@Input() next: any;
	@Input() prev: any;
	@Input() disabled: boolean = false;
	@Output() onNavigate: EventEmitter<any> = new EventEmitter();
	@Output() onNext: EventEmitter<any> = new EventEmitter();
	@Output() onPrev: EventEmitter<any> = new EventEmitter();

	constructor(
		private router: Router,
		private uiStore: UIStore,
		private analytics: Analytics
	) {}

	/**
	 *  @angular ngOnInit
	 *  Attempts to get the page details for Next & Prev from the UIStore
	 */
	ngOnInit() {
		this.next = this.next ? this.uiStore.get(['pages', this.next]) : null;
		this.prev = this.prev ? this.uiStore.get(['pages', this.prev]) : null;
	}

	/**
	 *
	 *  When user clicks on the next button, this will emit an onNavigate event,
	 *  close all the Modals currently open, then attempt to navigate to the next page
	 *  if there is a next input defined and the disabled input is set to false, if successful
	 *  it will emit an onNext event and navigate to the page defined in the next input
	 *
	 *  @fires onNavigate
	 *  @fires onNext
	 */
	emitNext() {
		this.onNavigate.next(true);
		if (this.next && !this.disabled) {
			this.onNext.next(true);
			setTimeout(() => {
				this.analytics.triggerEvent('navigation-event', null, 'forward');
				this.uiStore.update('activePage', this.next);
				this.router.navigate([this.next.address]);
			}, 100);
		}
	}

	/**
	 *
	 *  When user clicks on the previous button and the prev input has been defined,
	 *  this will close all the currently open modals and navigate to the previous page
	 *  as defined in prev
	 */
	emitPrev() {
		if (this.prev) {
			// Dehydrated Error
			// this.onPrev.next(true);
			this.analytics.triggerEvent('navigation-event', null, 'back');
			this.uiStore.update('activePage', this.prev);
			this.router.navigate([this.prev.address]);
		}
	}
}
