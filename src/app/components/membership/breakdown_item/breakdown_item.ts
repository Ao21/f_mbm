import { Component, ElementRef, AfterViewInit, Input, OnInit, Output, EventEmitter, OnDestroy, Renderer } from '@angular/core';

@Component({
	selector: 'm-breakdown-item',
	templateUrl: './breakdown_item.html'
})
export class BreakdownItemComponent implements OnInit {
	@Input('item') item: any;
	@Input('frequencyControl') frequencyControl: any;
	@Output('onRemoveItem') onRemoveItem: EventEmitter<any> = new EventEmitter();
	isOpen: boolean = false;
	constructor() {

	}
	ngOnInit() {

	}
	toggleOpen($event) {
		this.isOpen = $event;
	}

	removeItem(item) {
		this.onRemoveItem.next(item);
	}
}