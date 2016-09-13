import {
	Component,
	OnInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService, ErrorService } from './../../services/';
import { ERRORS } from './../../constants';
import { UIStore, DataStore } from './../../stores/stores.modules';

/**
 * 	Terms and Conditions PAge
 *
 */

@Component({
	selector: 'p-terms',
	templateUrl: './terms_conditions.html'
})
export class MembershipTermsConditionsComponent implements OnInit {
	page: UIPage;
	isPaymentTypeSet: boolean = false;
	paymentType: any;
	paymentFrequency: any;
	paymentSetStatusCard: string = 'inactive';
	paymentSetStatusBank: string = 'inactive';
	constructor(
		private paymentService: PaymentService,
		private route: ActivatedRoute,
		private errorService: ErrorService,
		private dataStore: DataStore,
		private router: Router,
		private uiStore: UIStore
	) {
		this.page = this.uiStore.getPage('termsConditions');
		this.paymentFrequency = this.dataStore.get(['pricing', 'frequency']);
		if (this.paymentFrequency === 'monthly') {
			this.paymentType = 'Card';
			this.isPaymentTypeSet = true;
			this.paymentService.updatePaymentType('Card', this.paymentFrequency).subscribe((next) => {
			}, (err) => {
				this.errorService.errorHandlerWithNotification(ERRORS.setPaymentType);
				this.router.navigateByUrl('/breakdown');
			});
		}
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			let type: string = params['type'];
			if (type === 'Card' || type === 'Bank') {
				this.setPaymentType(type);
			}
		});
	}

	setPaymentType(type: string) {
		this.dataStore.update(['pricing', 'type'], type);
		this.paymentType = type;
		this.paymentService.updatePaymentType(type, this.paymentFrequency)
			.subscribe((next) => {
				this.isPaymentTypeSet = true;
			}, (err) => {
				this.errorService.errorHandlerWithNotification(ERRORS.setPaymentType);
				this.router.navigateByUrl('/breakdown');
			});

	}
	continue() {
		setTimeout(() => { this.router.navigate([this.uiStore.getPageUrl(this.page.next)]); }, 300);

	}
}
