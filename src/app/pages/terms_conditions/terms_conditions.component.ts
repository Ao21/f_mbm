import {
	Component,
	OnInit
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {PaymentService, QuoteService} from './../../services/';
import {UIStore, DataStore} from './../../stores/stores.modules';

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
		private _quoteService: QuoteService,
		private _paymentService: PaymentService,
		private route: ActivatedRoute,
		private _dataStore: DataStore,
		private _router: Router,
		private _uiStore: UIStore
	) {
		this.page = this._uiStore.getPage('termsConditions');
		this.paymentFrequency = this._dataStore.get(['pricing', 'frequency']);
		if (this.paymentFrequency === 'monthly') {
			this.paymentType = 'Card';
			this.isPaymentTypeSet = true;
			this._paymentService.updatePaymentType('Card', this.paymentFrequency).subscribe((next) => {
			}, (err) => {
				this._router.navigateByUrl('/breakdown');
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
		this._dataStore.update(['pricing', 'type'], type);
		this.paymentType = type;
		this._paymentService.updatePaymentType(type, this.paymentFrequency).subscribe((next) => {
		}, (err) => {
			this._router.navigateByUrl('/breakdown');
			});
		this.isPaymentTypeSet = true;
	}
	continue() {
		setTimeout(() => { this._router.navigate([this._uiStore.getPageUrl(this.page.next)]); }, 300);

	}
}
