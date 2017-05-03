import { Component, OnDestroy, ElementRef, OnInit, AfterViewInit, ViewChild, Query } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { DataStore, UIStore } from './../../stores/stores.modules';
import { Observable } from 'rxjs/Observable';
import { Utils } from './../../shared/utilities/utilities.component';
import { CanDeactivate } from '@angular/router';
import { CONSTS, ERRORS } from './../../constants';
import { QuoteService, MyAAService, Analytics, ErrorService } from './../../services/index';
import { AddressSearchComponent } from './../../components/membership/address-search/address-search.component';
import * as _ from 'lodash';

/**
 *  Your Details Page Component
 */

@Component({
	selector: 'p-your-details',
	templateUrl: './your_details.html'
})
export class MembershipYourDetailsPageComponent implements OnInit, AfterViewInit, CanDeactivate<boolean>, OnDestroy {
	@ViewChild(AddressSearchComponent) addressSearch: AddressSearchComponent;
	// Default Settings for Your Details Page
	page: UIPage;
	primaryAdultUser: MemberType;
	fields: JourneyField[];
	addressFields: JourneyField[];
	// Ctrls generated with Validator and Values from the Fields Array
	ctrls: any = {};
	userDetailsForm: FormGroup;

	address: any;
	validatedAddress: any;
	// Boolean for checking whether thet address is validated
	isValidated: boolean = false;
	// Boolean for show/hide button based on whether all address controls are valid
	isReadyToValidate: boolean = false;
	isReadyLoading: boolean = false;
	isAddressListVisible: boolean = false;
	validateAddressText: string = 'Validate Address';
	// Detect Attempt to Navigate Forward
	isNavigatingNext: boolean = false;
	isFieldsWarningVisible: boolean = false;
	isUpdatingMultipleAddressFields = false;

	sub: ISubscriptionDefinition<any>;

	isUserFormAccepted: Observable<any> = new Observable();

	constructor(
		private myAA: MyAAService,
		private analyics: Analytics,
		private uiStore: UIStore,
		private errorService: ErrorService,
		private el: ElementRef,
		private dataStore: DataStore,
		private formBuilder: FormBuilder,
		private quoteService: QuoteService
	) {
		this.page = this.uiStore.getPage('yourDetails');
		this.primaryAdultUser = this.dataStore.getGeneratedMember('adults', 0);
		this.sub = this.dataStore.subscribe(CONSTS.LOGIN_UPDATE, this.onUserUpdate);
	}


	ngOnInit() {
		this.fields = this.primaryAdultUser.fields.slice(0, 6);
		this.addressFields = this.primaryAdultUser.fields.slice(6);

		_.forEach(this.fields, (e: JourneyField) => {
			let valids = Utils.retrieveValidator(e.validation);
			this.ctrls[e.name] = [
				isPresent(this.primaryAdultUser.values) ? this.primaryAdultUser.values[e.name] : '',
				isPresent(valids) && valids.length > 0 ? Validators.compose(valids) : null
			];
		});
		this.userDetailsForm = this.formBuilder.group(this.ctrls);
		this.userDetailsForm['name'] = 'Your Details Form';

		// Adds in Journey Schema details into the form control, to let
		// the age requirements validation have values to work with
		this.userDetailsForm['defaults'] = this.primaryAdultUser;

		console.log('addresssSearch', );


	}

	ngAfterViewInit() { }




	setValidatedAddress(obj: addressObject) {
		this.validatedAddress = obj;
		this.isValidated = true;
		this.uiStore.update(['pages', 'yourDetails', 'options', 'validAddress'], this.validatedAddress);

	}

	onUserUpdate = (user) => {
		let sessionUser = this.dataStore.constructUserObjFromSession('adults', 0);
		if (sessionUser) {
			this.analyics.triggerEvent('aa-populate-fields', 'success');
			_.forIn(sessionUser, (e, k) => {
				if (this.userDetailsForm.controls[k]) {
					let control: any = this.userDetailsForm.controls[k];
					control.setValue(e);
					control.markAsTouched();
				}
				if (this.addressSearch.addressForm.controls[k]) {
					let control: any = this.userDetailsForm.controls[k];
					control.setValue(e);
					control.markAsTouched();
				}
			});
		}
	}

	submitForm() {
		let member = _.assign({}, this.userDetailsForm.value, this.validatedAddress);
		_.assign(member, {
			price: this.primaryAdultUser.price,
			typeDisplay: this.primaryAdultUser.typeDisplay,
			type: this.primaryAdultUser.type,
			index: 0
		});
		this.dataStore.update(['config', 'members', 'adults', 0], member, CONSTS.MEMBER_UPDATE);


	}

	updateQuoteProposal() {
		return new Promise((res, rej) => {
			this.quoteService.updateProposal({
				email: this.userDetailsForm.value.email,
				firstName: this.userDetailsForm.value.firstName,
				surname: this.userDetailsForm.value.surname,
				title: this.userDetailsForm.value.title,
				dateOfBirth: this.userDetailsForm.value.dateOfBirth,
				phoneNumber: this.userDetailsForm.value.phoneNumber
			}).subscribe((next) => {
				this.submitForm();
				res(true);
				if (next.text() !== '' && next.json().renewal) {
					this.myAA.triggerRenewalProccess();
				}
			}, (err) => {
				this.errorService.errorHandlerWithNotification(err, ERRORS.saveMember);
				rej(false);
			});
		});

	}

	navigateNext(e: Event) {
		this.isNavigatingNext = true;
		if (this.isReadyToValidate && !this.isValidated) {
			let button = this.el.nativeElement.querySelector('#validateAddBtn');
			Utils.scrollToElement(button);
			Velocity(button, 'callout.shake');
			if (this.validateAddressText === 'Please click here to validate your address') {
				this.validateAddressText = 'You must validate your address to contiunue';
			} else {
				this.validateAddressText = 'Please click here to validate your address';
			}
		}
		if (!this.userDetailsForm.valid) {
			for (let control in this.userDetailsForm.controls) {
				if (this.userDetailsForm.controls[control]) {
					this.userDetailsForm.controls[control].markAsTouched();
					this.userDetailsForm.controls[control].markAsDirty();
				}
			}
			Utils.scrollTo(<HTMLElement>document.querySelector('.ng-invalid:not(form)').parentElement, 30);
		}
	}


	canDeactivate(): boolean | Observable<any> | Promise<any> {
		this.errorService.clearErrorNotifications();
		if (!this.isNavigatingNext) {
			return true;
		}
		if (this.isNavigatingNext && this.userDetailsForm.valid && this.isValidated) {
			return Promise.resolve(this.updateQuoteProposal());
		} else if (this.isNavigatingNext && !this.userDetailsForm.valid) {
			this.isNavigatingNext = false;
			return false;
		} else {
			return false;
		}

	}

	ngOnDestroy() {
		this.dataStore.unsubscribe(this.sub);
	}


}
