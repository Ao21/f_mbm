import { Component, Host, Input, OnInit, Optional, HostBinding } from '@angular/core';
import {ErrorService} from './../../../services/error.service';
import {isPresent} from '@angular/platform-browser/src/facade/lang';

@Component({
	selector: 'c-show-error',
	templateUrl: 'show_error.html'
})
export class ShowErrorComponent implements OnInit {
	@HostBinding('class.active') get _errorMessage() { return this.errorMessage !== null; };
	@Input('controlPath') controlPath;
	@Input('form') form: any;
	@Input('display') display: string;
	@Input() errors: any;
	valid: boolean;
	control: any;
	constructor(
		private _errorService: ErrorService,
	) {}

	get errorMessage(): ErrorMessage {
		this.control = this.form.controls[this.controlPath];
		if (isPresent(this.control) && this.control.touched) {
			for (let i = 0; i < this.errors.length; ++i) {
				if (this.control.hasError(this.errors[i])) {
					return this._errorService.retrieveFieldError(this.errors[i], this.display);
				}
			}
		}
		return null;
	}

	ngOnInit() {
		this.control = this.form.controls[this.controlPath];
	}

}
