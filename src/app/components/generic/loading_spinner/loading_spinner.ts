import { Component, Input } from '@angular/core';

@Component({
	selector: 'c-spinner',
	templateUrl: './loading_spinner.html'
})
export class LoadingSpinnerComponent {
	@Input('isLoading') isLoading: boolean = false;

}