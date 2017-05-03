import { Component, ChangeDetectorRef, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ReferenceService, NotificationService, Analytics, ErrorService } from './../../../services/index';

import { Utils } from './../../../shared/utilities/utilities.component';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { ERRORS } from './../../../constants';


const FIELDS = [{
	'name': 'county',
	'label': 'County',
	'type': 'autocomplete',
	'placeholder': '',
	'validation': ['required'],
	'data': 'counties',
	filterBy: 'area'
},
{
	'name': 'area',
	'label': 'Town / Area',
	'type': 'autocomplete',
	'placeholder': '',
	'validation': ['required'],
	'data': 'areas',
	filterBy: 'county',
	trigger: {
		name: 'disabledBasedOnKey',
		expectedType: 'string',
		key: 'county'
	}
},
{
	'name': 'addressLine1',
	'label': 'Address',
	'type': 'autocomplete',
	'placeholder': '',
	'validation': ['required'],
	'data': 'address',
	filterBy: 'all',
	trigger: {
		name: 'disabledBasedOnKey',
		expectedType: 'string',
		key: 'area'
	}
}
];

@Component({
	selector: 'address-search',
	templateUrl: './address-search.component.html',
	styleUrls: ['./address-search.component.scss']
})
export class AddressSearchComponent implements OnInit, OnChanges {

	@Input() address: JourneyField[];

	@Output() onSelectAddress: EventEmitter<any> = new EventEmitter();
	@Input() values: any;
	fields: any[];
	ctrls: any = {};

	addressForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private referenceService: ReferenceService,
		private notificationService: NotificationService,
		private analytics: Analytics,
		private errorService: ErrorService,
		private changeRef: ChangeDetectorRef
	) {
		this.fields = FIELDS;
	}

	ngOnInit() {
		if (this.values && this.values['addressLine1']) {
			this.values = _.assign({}, this.values, {
				addressLine1: `${this.values['addressLine1']} ${this.values['addressLine2']}, ${this.values['area']}, ${this.values['county']}`
			});
		}
		_.forEach(FIELDS, (e: JourneyField) => {
			let valids = Utils.retrieveValidator(e.validation);
			this.ctrls[e.name] = [
				isPresent(this.values) ? this.values[e.name] : null,
				isPresent(valids) && valids.length > 0 ? Validators.compose(valids) : null
			];
		});
		this.addressForm = this.formBuilder.group(this.ctrls);
		this.addressForm['name'] = 'Your Details Form';
		this.addressForm['defaults'] = this.values;

		this.addressForm.get('addressLine1').valueChanges.filter((x) => x).subscribe((next) => {
			this.selectAddress(next);
		});
	}

	ngOnChanges(_) {
		
	}

	updateAddress(address) {
		this.onSelectAddress.next(address);
		let area = this.addressForm.get('area');
		let county = this.addressForm.get('county');
		area.setValue(address.area);
		county.setValue(address.county);

		this.changeRef.detectChanges();

	}

selectAddress(address: addressObject) {
		// If No Address Listed Fire a No Address Found Event for Analytics		
		this.referenceService
			.selectAddress(address.id)
			.map((x) => x.json())
			.subscribe((add) => {
				this.updateAddress(add);
				this.notificationService.clearNotifications();
				if (address.isEcho) {
					this.analytics.triggerEvent('validateAddress', 'noAddress');
				} else {
					this.analytics.triggerEvent('validateAddress', 'selectAddress');
				}

			}, (err) =>
				this.errorService.errorHandlerWithNotification(err, ERRORS.setAddress));
	}



}


