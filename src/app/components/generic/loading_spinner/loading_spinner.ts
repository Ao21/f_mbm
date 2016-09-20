import { Component, Input, OnInit } from '@angular/core';
import { isPresent } from '@angular/core/src/facade/lang';

@Component({
	selector: 'c-spinner',
	templateUrl: './loading_spinner.html'
})
export class LoadingSpinnerComponent implements OnInit {
	@Input('isLoading') isLoading: boolean = false;
	@Input('radius') radius: number = 2.5;
	@Input('width') width: number = 10;
	@Input('text') text: string;

	ngOnInit() {}


}