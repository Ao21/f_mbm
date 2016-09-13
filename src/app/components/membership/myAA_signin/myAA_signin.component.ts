import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {SHARED_MODULES} from './../../shared/shared_modules';
import { MyAAService, Analytics } from './../../../services/index';
import { Utils } from './../../../shared/utilities/utilities.component';

@Component({
	selector: 'm-save-quote-signin',
	templateUrl: './myAA_signin.html',
})
export class MyAASaveQuoteSignInComponent {
	// Event Emitters
	@Output('onSuccessLogin') onSuccessLogin: EventEmitter<any> = new EventEmitter<any>();
	// Login Observable
	loginLoading: boolean;
	retryActive: boolean = false;
	isLoginToMyAA: boolean = false;
	// Login Form Controls
	loginForm: FormGroup;
	registrationForm: FormGroup;
	resetPassword: boolean = false;
	emailField: JourneyField = {
		name: 'email',
		label: 'Email',
		placeholder: 'example@myaa.ie',
		type: 'email-basic',
		validation: Utils.retrieveValidator(['required', 'emailValidator'])
	};
	passwordField = {
		name: 'password',
		label: 'Password',
		placeholder: 'password',
		type: 'password',
		validation: Utils.retrieveValidator(['required', 'invalidPassword'])
	};
	passwordFieldConf = {
		name: 'confirmPassword',
		label: 'Confirm password',
		placeholder: 'password',
		type: 'password',
		validation: Utils.retrieveValidator(['required', 'invalidPassword', 'invalidPasswordConf'])
	};

	loginVisible: boolean = true;

	constructor(
		private analytics: Analytics,
		private formBuilder: FormBuilder,
		private myAA: MyAAService) {
		let loginCtrls = [];
		loginCtrls['email'] = ['', Validators.compose(this.emailField.validation)];
		loginCtrls['password'] = ['', Validators.compose(this.passwordField.validation)];
		this.loginForm = this.formBuilder.group(loginCtrls);
		this.loginForm['name'] = 'Login to MyAA Form';

		let registerCtrls = [];
		registerCtrls['email'] = ['', Validators.compose(this.emailField.validation)];
		registerCtrls['password'] = ['', Validators.compose(this.passwordField.validation)];
		registerCtrls['confirmPassword'] = ['', Validators.compose(this.passwordFieldConf.validation)];
		this.registrationForm = this.formBuilder.group(registerCtrls);
		this.loginForm['name'] = 'Register for MyAA Form';

		this.loginForm.controls['password'].valueChanges.subscribe((next) => {
			Utils.resetCustomValidators(this.loginForm.controls['password']);
		});

		this.registrationForm.controls['confirmPassword'].valueChanges.subscribe((next) => {
			Utils.resetCustomValidators(this.registrationForm.controls['confirmPassword']);
		});

	}

	login() {
		this.loginLoading = true;
		this.myAA.login(this.loginForm.value.email, this.loginForm.value.password, false)
			.subscribe((next) => {
				this.onSuccessLogin.next(true);
				this.loginLoading = false;
			}, (err) => {
				this.loginForm.controls['password']['invalidPassword'] = true;
				this.loginForm.controls['password'].updateValueAndValidity();
				this.resetPassword = true;
				this.loginLoading = false;
			});
	}

	register() {
		if (this.loginVisible) {
			this.resetPassword = false;
			return this.loginVisible = false;
		}

		if (this.registrationForm.controls['password'].value !== this.registrationForm.controls['confirmPassword'].value) {
			this.registrationForm.controls['confirmPassword']['invalidPasswordConf'] = true;
			this.registrationForm.controls['confirmPassword'].updateValueAndValidity();
			return;
		}

		this.myAA.register(this.registrationForm.value.email, this.registrationForm.value.password)
			.subscribe((next) => {
				this.onSuccessLogin.next(true);
			}, (err) => {
				this.registrationForm.controls['confirmPassword']['invalidPassword'] = true;
				this.registrationForm.controls['confirmPassword'].updateValueAndValidity();
				return;
			});
	}




}
