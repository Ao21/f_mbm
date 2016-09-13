import { OnInit, ElementRef, Renderer} from '@angular/core';
import {UIStore} from './../../../stores/uistore.store';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import * as Velocity from 'velocity-animate';

export class Popup implements OnInit {
	channel: string;
	isVisible: boolean = false;
	transition: string;
	subscription: any;
	body: any;
	topNav: any;

	constructor(
		private uiStore: UIStore,
		private el: ElementRef,
		private renderer: Renderer
	) {
	}
	ngOnInit() {
		this.body = document.querySelector('body');
		this.topNav = document.querySelector('c-top-nav');
		this.uiStore.update(['modals', this.channel], false);
		this.uiStore.select('modals', this.channel).on('update', this.toggleVisiblity)
	}
	toggleVisiblity = (event) => {
		let toggle = event.data.currentData;
		this.isVisible = toggle ? toggle : !this.isVisible;

		let transitionString = isPresent(this.transition) ? this.transition : 'shrink';
		if (this.isVisible) {
			this.setBody(true);
			this.setNav(true);
			Velocity(this.el.nativeElement, 'transition.' + transitionString + 'In', {
				visibility: 'visible'
			});

		} else {
			this.setBody(false);
			this.setNav(false);
			Velocity(this.el.nativeElement, 'transition.' + transitionString + 'Out',
				{
					duration: 150,
					visibility: 'hidden',
					complete: () => {

					}
				});
		}
	}

	close() {
		this.uiStore.closeAllModals();
		this.setBody(false);
		this.setNav(false);
	}

	setNav(toggle) {
		// Temp if topNav for  Tests - Top Nav doesnt exist
		// Decouple this into TopNav
		if (this.topNav) {
			if (toggle) {
				this.renderer.setElementClass(this.topNav, 'zIndexZero', true);
			} else {
				this.renderer.setElementClass(this.topNav, 'zIndexZero', false);
			}
		}

	}

	setBody(toggle) {
		if (toggle) {
			this.renderer.setElementStyle(document.querySelector('body'), 'overflow', 'hidden');
			this.renderer.setElementStyle(document.querySelector('body'), 'position', 'fixed');

		} else {
			this.renderer.setElementStyle(document.querySelector('body'), 'overflow', 'visible');
			this.renderer.setElementStyle(document.querySelector('body'), 'position', 'relative');
		}
	}

}
