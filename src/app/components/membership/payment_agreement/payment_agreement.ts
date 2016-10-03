import {
	Component,
	trigger,
	state,
	style,
	HostBinding,
	transition,
	EventEmitter,
	animate,
	Output,
	Input,
	keyframes
} from '@angular/core';
import { COLORS } from './../../../constants';
import { NotificationService, PaymentService } from './../../../services/index';

@Component({
	selector: 'm-payment-agreement',
	templateUrl: './payment_agreement.html',
	animations: [
		trigger('successBump', [
			transition('inactive => active', animate(350, keyframes([
				style({ backgroundColor: '#ffcc00', offset: 0 }),
				style({ backgroundColor: '#44b491', offset: 0.5 })
			])))
		]),
		trigger('errorBump', [
			transition('inactive => active', animate(1000, keyframes([
				style({ borderColor: '#9a9c9a', offset: 0 }),
				style({ borderColor: '#e84236', offset: .1 }),
				style({ borderColor: '#c7c8c7', offset: 1 })
			])))
		]),
		trigger('toggleAllProducts', [
			state('void', style({
				opacity: 0,
				position: 'absolute'
			})),
			state('inactive', style({
				opacity: 0,
				position: 'absolute'
			})),
			state('active', style({
				opacity: 1,
				position: 'absolute'
			})),
			transition('active => inactive', animate('250ms ease-in')),
			transition('inactive => active', animate('500ms 250ms ease-in'))
		]),
		trigger('toggleSingleProduct', [
			state('void', style({
				opacity: 0
			})),
			state('inactive', style({
				opacity: 0
			})),
			state('active', style({
				opacity: 1
			})),
			transition('active => inactive', animate('250ms ease-in')),
			transition('* => active', animate('750ms 250ms ease-in-out'))
		])
	]
})
export class PaymentAgreementComponent {
	@Input('frequency') frequency: string;
	@Input('type') type: string;
	@Output('onSuccess') onSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
	@HostBinding('attr.id') id: string = 'payment-agreement';

	consentAllProductState: boolean = true;
	toggleAllProductsState: string = 'active';
	toggleSingleProductState: string = 'inactive';
	singleSuccessBtn = 'inactive';
	singleErrorBtn = false;
	state: string = null;


	constructor(
		private paymentService: PaymentService,
		private notificationService: NotificationService
	) { }

	acceptAgreement(type) {
		let all = type === 'all' ? true : false;
		this.paymentService.confirmTermsConditions(all).subscribe(next => {
		}, (err) => {});
		this.notificationService.clearNotifications();
		setTimeout(() => {
			this.onSuccess.next(true);
		}, 350);

	}
}
