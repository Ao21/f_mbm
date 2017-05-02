import {
	Component,
	EventEmitter,
	ElementRef,
	OnInit,
	Input,
	ChangeDetectorRef,
	HostBinding,
	Output,
	forwardRef,
	AfterViewInit,
} from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { AutoCompleteService } from './../../../services/autocomplete.service';
import { Observable, Subject } from 'rxjs/Rx';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';

import { isJsObject } from '@angular/platform-browser/src/facade/lang';


export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => AutoCompleteComponent),
	multi: true
};


export class AutocompleteChangeEvent {
	value: any;
}

/**
 *  Autocomplete Component
 *
 *  Creates an autocomplete input field
 *  @input {Object} data
 *  @input {ControlGroup} form
 *  @input {String} filterBy
 *  @input {String} placeholder
 *  @input {Control} FormControl
 *
 *  @host (blur) onBlur($Event)
 *  @host [class.isOpen] isSearchResultsVisible
 *  
 *
 */

const noop = () => { };

@Component({
	providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
	selector: 'c-auto-complete',
	templateUrl: 'auto_complete.html',
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor, AfterViewInit {

	@HostBinding('class.isOpen') get isSearchResultsVisible() { return this._isSearchResultsVisible; };
	@Input('data') _dataSrc: string;
	_disabled: boolean = false;
	@Input('isDisabled')
	set disabled(v) {
		if (v) {
			this.inputValue.disable();
		} else {
			this.inputValue.enable();
		}
		this._disabled = v;
	}
	get disabled() {
		return this._disabled;
	}
	@Input('filterBy') _filterBy: any;

	@Input('form') form: FormGroup;
	@Input('id') id: string;
	@Input('placeholder') placeholder: string;

	@Output('onLoading') onLoading: EventEmitter<any> = new EventEmitter<any>();
	@Input('control') public control: FormControl;
	public active: boolean = true;
	public filter: any;
	public _isSearchResultsVisible: boolean = false;
	public options: any[] = [];
	public inputValue: FormControl = new FormControl("");

	private input: Subject<any> = new Subject();
	private loadingBarActive: string = 'inactive';
	private _data: Observable<Array<any>>;

	private _isInitialized: boolean = false;
	public hasValue: boolean = false;
	private _value: any = '';
	private _onTouchedCallback: () => void = noop;
	private _onChangeCallback: (_: any) => void = noop;


	get value() {
		return this._value;
	}


	set value(newValue: any) {
		if (this._value !== newValue) {
			// Workaround to allow reset
			if (newValue === '' || newValue === undefined || newValue === null) {
				this.reset(this.inputValue);
				return;
			}
			// Set this before proceeding to ensure no circular loop occurs with selection.
			this._value = newValue;
			if (this.value.description) {
				this.inputValue.setValue(this.value.description);

			} else {
				this.inputValue.setValue(this.value);
			}
			this.hasValue = true;

			this.inputValue.disable();
			this.inputValue.markAsTouched();
			this._onChangeCallback(this.value);
		}
	}


	constructor(
		private _el: ElementRef,
		private changeRef: ChangeDetectorRef,
		private _autoCompleteService: AutoCompleteService
	) {

		this.filter = { 'description': '*' };
	}


	reset(ctrl) {
		let control: any = ctrl;
		// Set Value to '' to Prevent Loop Between Autocompletes
		this._value = '';
		control.reset();
		this.hasValue = false;
		this.disabled = false;
		control.setValue('');
		this.inputValue.enable();
		control.updateValueAndValidity();
	}

	onBlur() {
		this._onTouchedCallback();
	}

	ngAfterViewInit() {
		this._isInitialized = true;

		if (this._filterBy && this._filterBy !== 'all') {
			this.form.controls[this._filterBy].valueChanges.subscribe((val) => {
				if (this.form.controls[this._filterBy].value === '' && this.value !== '') {
					// Ignore the Analytics from this event as its already captured in the form component
					this.reset(this.inputValue);
					this.reset(this.form.controls[this.id]);
					this._autoCompleteService.reset();
				}
			});
		}
		if (this._filterBy && this._filterBy === 'all') {
			Observable.combineLatest(
				this.form.controls['county'].valueChanges,
				this.form.controls['area'].valueChanges
			).subscribe((next) => {
				this.options = [];
				this._autoCompleteService.county = next[0];
				this._autoCompleteService.area = next[1];
			});
		}
	}

	handleChange(event: Event) {
		let iValue = (<HTMLInputElement>event.target).value;
		this._autoCompleteService.county = this.form.controls['county'].value;
		this._autoCompleteService.area = this.form.controls['area'].value;
		this.input.next(iValue);
	}

	ngOnInit() {
		this._autoCompleteService.search(this._dataSrc, this.input);
		// this._autoCompleteService.searching.subscribe((next) => {
		// 	if (!next) {
		// 		this.onLoading.next(next);
		// 	}
		// });

		this._autoCompleteService[this._dataSrc].subscribe(next => {
			// Generate a list of options from the retrieved data
			if (next.options) {
				this.options =
					_.map(next.options, (e: any) => {
						return { id: e.id, description: e.description, filter: e.items };
					});
			}


		});

		this.input.subscribe((next) => {
			this._isSearchResultsVisible = true;
			this.onLoading.next(true);
			this.filter = { 'description': next };
		});
	}



	select(event: any, option: any) {
		this.value = option;
		this.onLoading.next(false);
		this._autoCompleteService.setFilter(this._dataSrc);
		this._isSearchResultsVisible = false;
		this._onTouchedCallback();

	}


	writeValue(value: any) {
		this.value = value;
	}

	registerOnChange(fn: any) {
		this._onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this._onTouchedCallback = fn;
	}


}
