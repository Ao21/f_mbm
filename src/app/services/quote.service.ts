import { Injectable, Inject, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { Headers } from '@angular/http';
import { DataStore } from './../stores/datastore.store';
import { UIStore } from './../stores/uistore.store';
import { NotificationService } from './notifications.service';
import { ErrorService } from './error.service';
import { AuthHttp } from './../shared/common/authHttp';
import { CONSTS, ERRORS } from './../constants';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class QuoteService {
	BASE_URL: string = CONSTS.getBaseUrlWithContext();
	GET_QUOTE_URL: string = this.BASE_URL + 'users/me/quote';
	RETRIEVE_QUOTE_URL: string = this.BASE_URL + 'users/me/quote?reference=';
	UPDATE_PROPOSAL_URL: string = this.BASE_URL + 'users/me';
	UPDATE_COVER_URL: string = this.BASE_URL + 'users/me/cover/';
	UPDATE_MEMBER_URL: string = this.BASE_URL + 'users/me/members/';
	retrieveQuoteList: Subject<any> = new Subject();

	constructor(
		@Inject(forwardRef(() => DataStore)) private dataStore: DataStore,
		private uiStore: UIStore,
		private errorService: ErrorService,
		private notificationService: NotificationService,
		private auth: AuthHttp,
		private router: Router,
	) { }

	/**
	 * 	Pushes an update to the Quote
	 * 	@param ProposalObject obj - Quote Object
	 */
	updateProposal(obj: ProposalObject) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this.UPDATE_PROPOSAL_URL, JSON.stringify(obj), { headers: jsonHeader });
	}

	/**
	 * 	Update the Cover Level on the server
	 * 	@param CoverLevel|QuoteBreakdownItem - Get the name of either the coverlevel or quote breakdown item
	 * 	@param boolean active - Whether the cover level is being set to active or false
	 */
	updateCover(coverLevel: CoverLevel | QuoteBreakdownItem, active: boolean) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this.UPDATE_COVER_URL + coverLevel.name, JSON.stringify({ active: active }), { headers: jsonHeader });
	}

	/**
	 * 	Add a Member on the server
	 *	@param number memberIndex - Index of Member to be added on the server
	 *	@param Member memberObject - Member to be Added
	 */
	addMember(memberIndex: number, memberObject: Member) {
		let jsonHeader = new Headers();
		jsonHeader.append('Content-Type', 'application/json');
		return this.auth.put(this.UPDATE_MEMBER_URL + memberIndex, JSON.stringify(memberObject), { headers: jsonHeader });
	}

	/**
	 * 	Remove a member on the server
	 * 	@param number memberIndex - Index of the member to be removed on the server
	 */
	removeMember(memberIndex: number) {
		return this.auth.delete(this.UPDATE_MEMBER_URL + memberIndex);
	}

	/**
	 * 	Update the local journey with the breakdown item removed from the quote and calls getQuote again
	 * 	@param QuoteBreakdownItem item
	 */
	removeBreakdownItem(item: QuoteBreakdownItem, err: (eb) => void) {
		if (item.type === 'member') {
			this.removeMember(item.index).subscribe((next) => {
				this.getQuote().subscribe((config) => {
					this.dataStore.setConfig(config.json());
				}, (error) => {
					this.errorService.errorHandlerWithNotification(ERRORS.getQuote);
					err(error);
				});
			}, (error) => {
				this.errorService.errorHandlerWithNotification(ERRORS.quoteBreakdownItem);
				err(error);
			});

		} else if (item.type === 'cover') {
			this.updateCover(item, false).subscribe((next) => {
				this.getQuote().subscribe((config) => {
					this.dataStore.setConfig(config.json());
				}, (error) => {
					this.errorService.errorHandlerWithNotification(ERRORS.getQuote);
					err(error);
				});
			}, (error) => {
				this.errorService.errorHandlerWithNotification(ERRORS.quoteBreakdownItem);
				err(error);
			});
		}
	}

	/**
	 * 	Get a Quote
	 */
	getQuote() {
		this.uiStore.update(['UIOptions', 'isSaveQuoteVisible'], 'visible');
		return this.auth.get(this.GET_QUOTE_URL);
	}

	/**
	 * 	On retrieving a quote either from the journey or retrieving a quote, updates the local
	 * 	quotation/entire configuration and directs the user either to the breakdown page.
	 * 	breakdown page.
	 */
	setQuote(config: any, isExpired: boolean, isRetrieved?: boolean) {
			this.dataStore.setQuote(config.quotation);
			this.uiStore.update(['UIOptions', 'isSaveQuoteVisible'], 'hidden');
			this.dataStore.update(['config'], config);
			this.router.navigate(['breakdown']);
	}

	/**
	 * 	On retrieving a quote either from the journey or retrieving a quote, updates the local
	 * 	quotation/entire configuration and directs the user to the whats included page
	 */

	setQuoteExpired(config: any) {
		this.dataStore.update(['config'], config);
		this.router.navigate(['/']);
	}

	/**
	 * 	Retrieves a previous quote if the user is already verified through a MyAA session cookie
	 * 	@param string quoteReference - reference number of the Quote to be retrieved
	 */
	retrieveQuote(quoteReference: string) {
		return this.auth.get(this.RETRIEVE_QUOTE_URL + quoteReference);
	}

	/**
	 * 	Retrieves a previous quote using the webreference and the users date of birth
	 * 	@param string quoteReference - reference number of the Quote to be retrieved
	 * 	@param string dateOfBirth - date of the birth of the user (01012001)
	 */
	retrieveQuoteWeb(quoteReference: string, dateOfBirth: string) {
		return this.auth.get(this.RETRIEVE_QUOTE_URL + quoteReference + '&dateOfBirth=' + dateOfBirth);
	}
}
