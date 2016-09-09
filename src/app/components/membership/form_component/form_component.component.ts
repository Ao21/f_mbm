import {Component, Input, OnInit, ElementRef, Renderer, AfterViewInit} from '@angular/core';
import {FormGroup, FormControl, AbstractControl } from '@angular/forms';
import {BooleanFieldValue} from './../../../shared/common/booleanFactory';
import {Analytics} from './../../../services/analytics.service';
import {Subject} from 'rxjs/Rx';

/**
 *  Form Component
 *
 *  Loads a type of input that will then be added to the form as a control, and will
 *  automatically attach a Show Error Component to it
 *
 *  Available types:
 *  + email
 *  + title
 *  + text
 *  + password
 *  + data
 *  + number
 *  + autocomplete
 *
 *  @selector form-component
 *  @input {String} control
 *  @input {Object} field
 *  @input {String} placeholder
 *  @input {String} type - Determins which type of input it will be
 *
 *  @host [class.active] active - Active Class applied on
 *  @host [class.invalid] !control.valid' -
 *  @host [class.untouched] !control.touched' -
 *  @host [class.touched] !control.touched' -
 *
 *  ### Example (Model)
 *   ````html
 *  <form [formGroup]="form">
 *      <form-component
 *          class="c-form-component--default" 
 *          [form]="userDetailsForm" 
 *          [field]="field">
 *      </form-component>
 *  </form>
 *  ````
 */

@Component({
	selector: 'form-component',
	templateUrl: './form_component.html'
})

export class FormComponent implements OnInit, AfterViewInit {
	@Input('aria-label') ariaLabel: string;
	@Input('aria-labelledby') ariaLabelledBy: string;
	@Input('aria-disabled') @BooleanFieldValue() ariaDisabled: boolean;
	@Input('aria-required') @BooleanFieldValue() ariaRequired: boolean;
	@Input('aria-invalid') @BooleanFieldValue() ariaInvalid: boolean;


	@Input('form') form: FormGroup;
	@Input() field: JourneyField;
	@Input() placeholder: string = null;
	@Input() tabIndex: number = null;
	@Input() name: string = null;
	@Input() @BooleanFieldValue() autoFocus: boolean = false;
	@Input() @BooleanFieldValue() disabled: boolean = false;
	@Input() @BooleanFieldValue() readOnly: boolean = false;
	@Input() @BooleanFieldValue() required: boolean = false;
	@Input() @BooleanFieldValue() spellCheck: boolean = false;

	loadingVisible: boolean = false;

	hasValue: boolean;

	valueThrottle: Subject<any> = new Subject();

	dynamicControl: AbstractControl;
	errorList = [];
	input: any;


	constructor(
		private _renderer: Renderer,
		private _el: ElementRef,
		private _analytics: Analytics
	) {
		this.errorList = ['required',
			'invalidPasswordConf',
			'invalidChoice',
			'invalidIBAN',
			'invalidDOB',
			'invalidEmail',
			'invalidPassword',
			'invalidOnlyNumber',
			'invalidChoice',
			'invalidSpecial',
			'invalidBIC',
			'invalidCCV',
			'invalidIBAN',
			'underage',
			'overage',
			'invalidAccount',
			'invalidSortCode',
			'invalidPhoneNumber'];

		this.valueThrottle.debounceTime(50).subscribe((next) => {
			this.hasValue = next === '' ? false : true;
			if (this.hasValue) {
				this.dynamicControl.markAsTouched();
			}
		});
	}

	/**
	 *  @angular OnInit
	 *
	 *  Adds a fc--{{control}} to the Div and links this control to the form's control,
	 *  also adds the field to the control for validation
	 */

	ngOnInit() {
		this._renderer.setElementClass(this._el.nativeElement, `fc--${this.field.name}`, true);
		this.dynamicControl = this.form.controls[this.field.name];
		this.dynamicControl['field'] = this.field;
		this.placeholder = this.field.placeholder;

		if (this.dynamicControl.value) {
			this.hasValue = true;
			this.dynamicControl.markAsTouched();
		}

		this.dynamicControl.statusChanges.distinctUntilChanged().debounceTime(500).subscribe((e) => {
			this.triggerAnalyticEvent(this.field.name, this.dynamicControl, e);
		});
	}

	ngAfterViewInit() {
		this.dynamicControl.valueChanges.subscribe(this.valueThrottle);
	}

	triggerLoading(active: boolean) {
		this.loadingVisible = active;
	}


	triggerAnalyticEvent(name, control: any, e) {
		if (control['_ignoreAnalyticEvent']) {
			control['_ignoreAnalyticEvent'] = false;
			return;
		}
		let evt: AnalyticsFormEvent = {
			'form-label': control.root.name ? control.root.name : 'User Form',
			'input-name': name,
			'input-status-value': e,
			'input-value': control.value
		};
		if (!control.touched && e === 'INVALID') {
			evt['input-status-value'] = 'INIT-INVALID';
		}
		if (this.field.type === 'password') {
			delete evt[`input-value`];
		}
		this._analytics.formEvents.next(evt);

	}

	reset(evt: Event) {
		this.dynamicControl.reset();
		this.triggerAnalyticEvent(this.field.name, this.dynamicControl, 'RESET');
		this.dynamicControl.setValue('');
	}


}
