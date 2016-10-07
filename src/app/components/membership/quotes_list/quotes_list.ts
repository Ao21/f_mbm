import {
	Component,
	Input,
	trigger,
	state,
	HostBinding,
	style,
	transition,
	animate
} from '@angular/core';
import { QuoteService, MyAAService, NotificationService, ErrorService } from './../../../services/index';
import { ERRORS } from './../../../constants';
@Component({
	selector: 'm-quotes-list',
	templateUrl: './quotes_list.html',
	animations: [
		trigger('openList', [
			state('inactive', style({
				maxHeight: '0',
				padding: '0'
			})),
			state('active', style({
				maxHeight: '500px',
				padding: '5vh 0 7vh'
			})),
			transition('* => *', animate('350ms ease-in'))
		])
	]
})
export class QuotesListComponent {
	@Input('isVisible') isVisible: boolean = false;
	@HostBinding('class.isOpen') isOpen: boolean = false;

	isLoading: boolean = false;
	quotes: any;
	open: string;

	constructor(
		private notificationService: NotificationService,
		private myAAService: MyAAService,
		private quoteService: QuoteService,
		private errorService: ErrorService
	) {

		this.quoteService.retrieveQuoteList.subscribe((next) => {
			if (next) {
				this.quotes = next;
				this.open = 'active';
				this.isVisible = true;
			}
		}, (err) => {
			this.errorService.errorHandler(ERRORS.retrieveQuote);
		});
	}

	cancel() {
		this.open = 'inactive';
		this.isVisible = false;
	}
	/**
	 * 	Retrieves an expired from the quote service, updates the dataStore with the quote
	 * 	and then closes the retrieve quote list as well as redirecting the user to the
	 * 	cover level page
	 */
	requoteQuote(quote) {
		if (this.isLoading === true) {
			return;
		}
		this.isLoading = true;
		this.quoteService.retrieveQuote(quote.reference).subscribe((res) => {
			this.isLoading = false;
			this.open = 'inactive';
			this.quoteService.setQuoteExpired(res.json());
		}, (err) => this.handleRetrieveQuoteError(err));
	}
	/**
	 * 	Retrieves a specific from the quote service, updates the dataStore with the quote
	 * 	and then closes the retrieve quote list as well as redirecting the user to the
	 * 	price breakdown page
	 */
	retrieveQuote(quote) {
		if (this.isLoading === true) {
			return;
		}
		this.isLoading = true;
		this.quoteService.retrieveQuote(quote.reference).subscribe((res) => {
			this.isLoading = false;
			this.open = 'inactive';
			this.quoteService.setQuote(res.json(), false);
		}, (err) => this.handleRetrieveQuoteError(err));

	}

	handleRetrieveQuoteError(err) {
		if (err.status === 403) {
			this.isLoading = false;
			this.errorService.errorHandlerWithNotification(err, ERRORS.retrieveQuote);
		}
	}
}
