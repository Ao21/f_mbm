import { Attribute, Component, ElementRef, Renderer, HostBinding } from '@angular/core';
import { Popup } from './../popups/popup';
import { UIStore }from './../../../stores/uistore.store';

@Component({
	selector: 'pu-fullscreen',
	templateUrl: 'fullscreen_popup.html',
})
export class FullscreenPopupComponent extends Popup {
	@HostBinding('class.isVisible') isVisible: boolean;
	data: any;
	header: any;
	channel: string;

	constructor(
		@Attribute('header') header: string,
		@Attribute('channel') channel: string,
		private store: UIStore,
		el: ElementRef,
		renderer: Renderer

	) {
		super(store, el, renderer);
		this.header = header;
		this.channel = channel;
	}

}
