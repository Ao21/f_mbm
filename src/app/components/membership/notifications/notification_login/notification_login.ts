import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	trigger,
	state,
	style,
	transition,
	animate,
	group
} from '@angular/core';
import {FormControl,Validators, FormBuilder, FormGroup} from '@angular/forms';
import {MyAAService} from './../../../../services/myaa.service';
import {Subject} from 'rxjs/Rx';
import {Analytics} from './../../../../services/analytics.service';

import {Utils} from './../../../../shared/utilities/utilities.component';

@Component({
	selector: 'c-notification-login',
	templateUrl: './notification_login.html',
	animations: [
		trigger('visibleState', [
			state('closed', style({ margin: '-100%' })),
			state('open', style({ margin: 0 })),
			transition('* => open', [
				style({ marginTop: '-100%' }),
				group([
					animate('700ms cubic-bezier(0.215, 0.61, 0.355, 1)', style({
						marginTop: 0
					}))
				])
			]),
			transition('open => *', [
				style({ marginTop: '0%' }),
				group([
					animate('700ms cubic-bezier(0.77, 0, 0.175, 1)', style({
						marginTop: '-100%'
					}))
				])
			])
		])
	]
})
export class NotificationLoginComponent implements OnInit {
	@Input('notification') notification: AANotification;
	@Output() onClose: EventEmitter<any> = new EventEmitter();

	loginObservable: Subject<any> = new Subject();
	loginLoading: boolean;
	retryActive: boolean = false;
	isLoginToMyAA: boolean = false;

	isOpen: string;
	description: string;

	loginForm: FormGroup;
	myAAemail: FormControl = new FormControl("");
	passwordControl: FormControl = new FormControl("");

	animationTimings = Utils.isViewportMobile ? 700 : 1500;


	emailField: JourneyField = {
		name: 'email',
		label: 'email',
		placeholder: 'example@myaa.ie',
		type: 'email-basic',
		validation: Utils.retrieveValidator(['required', 'emailValidator'])
	};

	passwordField = {
		name: 'password',
		label: 'password',
		placeholder: 'password',
		type: 'password',
		validation: Utils.retrieveValidator(['required', 'invalidPassword'])
	};

	constructor(
		private _analytics: Analytics,
		private _myAA: MyAAService,
		private formBuilder: FormBuilder
	) {

		let ctrls = [];
		ctrls['email'] = ['', Validators.compose(this.emailField.validation)];
		ctrls['password'] = ['', Validators.compose(this.passwordField.validation)];

		this.loginForm = this.formBuilder.group(ctrls);
		this.loginForm['name'] = 'Login to MyAA Dropdown Form';

		this.loginForm.controls['password'].valueChanges.subscribe((next) => {
			Utils.resetCustomValidators(this.loginForm.controls['password']);
		});
	}

	ngOnInit() {
		this.isLoginToMyAA = this.notification.options.myAAStatus;
		this.description = this.notification.text;
		this.loginForm.controls['email']['_value'] = this.notification.text;
		this.loginForm.controls['email'].updateValueAndValidity();
		this.isOpen = 'open';
	}

	login() {
		this.loginLoading = true;
		this._myAA.login(this.loginForm.value.email, this.loginForm.value.password, true)
			.subscribe((next) => {
				this.emitCancel();
				this.loginLoading = false;
			}, (err) => {
				this.loginForm.controls['password']['invalidPassword'] = true;
				this.loginForm.controls['password'].updateValueAndValidity();
			});
	}

	emitCancel() {
		this.isOpen = 'closed';
		setTimeout(() => {
			this.onClose.next(this.notification.id);
		}, 740);

	}
}
