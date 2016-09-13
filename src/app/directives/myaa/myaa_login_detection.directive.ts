import { Directive, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { NotificationService, MyAAService, Analytics } from './../../services/';
import { DataStore } from './../../stores/stores.modules';

@Directive({
	selector: '[myAALoginDetection]',
	providers: [MyAAService]
})
export class MyAALoginDetectionDirective implements OnInit {
	@Input('formControl') formControl: FormControl;
	isUserLoggedIn: boolean = false;
	@Output() results: EventEmitter<any> = new EventEmitter();
	@Output() loading: EventEmitter<any> = new EventEmitter();
	emailInput: Subject<any> = new Subject;


	constructor(
		private dataStore: DataStore,
		private analytics: Analytics,
		private myAA: MyAAService,
		private notifications: NotificationService) {
		this.emailInput
			.filter(x => x.match(/.+@.+\..+/i))
			.debounce(x => Observable.timer(1000))
			.distinctUntilChanged()
			.do(() => this.loading.next(true))
			.switchMap((x: any) => this.myAA.checkIfUserExists(x))
			.do(() => this.loading.next(false))
			.map((x: any) => { return this.myAA.mapUserResponse(x); })
			.catch((err, caught) => {
				return caught;
			})
			.subscribe((res: any) => {
				if (res.login === '1' || res.login === '2') {
					this.notifications.createLogin(res.email, true);
				}
				},
				(err) => {
					this.results.next(['ERROR, see console']);
				},
				() => {
					console.log('complete');
				});

	}

	ngOnInit() {
		this.formControl.valueChanges.subscribe((e) => {
			console.log(this.isUserLoggedIn, this.dataStore.isUserLoggedIn())
			if (!this.dataStore.isUserLoggedIn() || !this.isUserLoggedIn) {
				this.emailInput.next(e);
			}

		});
	}

}
