import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../stores/stores.modules';
import { Analytics } from './../../services/analytics.service';
import { CONSTS, ERRORS } from './../../constants';
import { QuoteService } from './../../services/quote.service';
import { NotificationService, ErrorService } from './../../services/index';
import { Observable } from 'rxjs/Rx';

/**
 *  Friends & Family Page Component
 *
 */

@Component({
	selector: 'p-friends-and-family',
	templateUrl: './friends_family.html'
})
export class MembershipFriendsAndFamilyPageComponent implements OnDestroy, OnInit {
	// Default Settings for Friends and Family Page
	page: UIPage;
	// Array of Members without Primary Member
	members: MemberType[];
	// Member to be removed for the Remove Member modal
	memberToBeRemoved: Member;
	placeholderMemberToBeRemoved: any;

	sub: ISubscriptionDefinition<any>;

	constructor(
		private uiStore: UIStore,
		private dataStore: DataStore,
		private el: ElementRef,
		private analytics: Analytics,
		private errorService: ErrorService,
		private notificationService: NotificationService,
		private quoteService: QuoteService
	) { }

	ngOnInit() {
		this.page = this.uiStore.getPage('friendsFamily');
		this.members = this.dataStore.getGeneratedAdditionalMembers();
		this.sub = this.dataStore.subscribeAndGet(CONSTS.MEMBER_UPDATE, (event) => {
			this.members = this.dataStore.getGeneratedAdditionalMembers();
		});
	}

	/**
	 *  Listens for onSave Event from AddMemberCard components, saves the member to the datastore
	 *  @listens onSave
	 */
	saveMember(member: Member) {
		this.quoteService.addMember(member.index, {
			firstName: member.firstName,
			surname: member.surname,
			dateOfBirth: member.dateOfBirth
		})
			.retryWhen((attempts) => {
				return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.saveAdditionalMember, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			})
			.subscribe((next) => {
				this.dataStore.saveMember(member);
				this.notificationService.clearNotifications();
			}, (err) => {
				this.errorService.errorHandlerWithNotification(err,
					_.assign({
						err: 'Delete Additional Member Failure',
						service: 'QuoteService'
					}, ERRORS.defaultServiceErrorFinal, ));
			});
	}


	/**
	 *  Calls the removeMember function of the store and closes the modals
	 *  @method
	 *  @params {Member} member
	 *
	 */
	deleteMember(member: Member) {
		this.quoteService.removeMember(member.index)
			.retryWhen((attempts) => {
				return attempts.scan((errorCount, err) => {
					if (err.status === 409) {
						this.errorService.resetSession(err);
						throw new Error('Session Has Expired');
					};
					return errorCount + 1;
				}, 0).delayWhen((errCount) => {
					let time = errCount * 6;
					this.errorService.errorHandlerWithTimedNotification(ERRORS.deleteAdditionalMember, time);
					return Observable.timer(time * 1000);
				}).takeWhile((errCount) => {
					return errCount < 3;
				});
			}).subscribe((next) => {
				this.notificationService.clearNotifications();
				this.dataStore.removeMember(member);
			}, (err) => {
				this.errorService.errorHandlerWithNotification(err,
					_.assign(
						{
							err: 'Delete Additional Member Failure',
							service: 'QuoteService'
						}, ERRORS.defaultServiceErrorFinal));
			});
		this.uiStore.closeAllModals();
	}

	/**
	 *  @method
	 *  @params {Member} member
	 *
	 */
	removePlaceholderMember(member: Member) {
		this.dataStore.removeMember(member);
		this.uiStore.closeAllModals();
		this.openTestimonials();
	}

	/**
	 *  Listens to onNavigate from the fixed navigation component,
	 *  called when user attempts to navigate forward
	 *
	 *  @listens onNavigate
	 */

	openTestimonials() {
		// This is being tested in the rules engine, and the testimonials appearing
		// will be checked in RF tests

		/* istanbul ignore next */
		if (!this.checkForPlaceholderMembers()) {
			this.analytics.triggerEvent('page-completion-ff', null, this.dataStore.getCreatedMembers().length - 1);
			this.uiStore.openModal('testimonials');
		}

	}

	/**
	 *  Finds any members in created members in the datastore with placeholder
	 *  property set to true and opens the placeholder warning modal
	 *
	 */
	checkForPlaceholderMembers() {
		let placeholder = _.find(this.dataStore.getCreatedMembers(), (e: Member) => {
			return e.placeholder;
		});

		if (isPresent(placeholder)) {
			this.errorService.errorHandlerWithNotification({}, ERRORS.placeholderMember);
			this.placeholderMemberToBeRemoved = placeholder;
			this.uiStore.openModal('removePlaceholderMember');
			return true;
		}
	}

	ngOnDestroy() {
		this.dataStore.unsubscribe(this.sub);
	}
	/* istanbul ignore next */
	routerOnActivate() {
		// this._transitions.animatePageIn(this.el);
	}
	/* istanbul ignore next */
	routerOnDeactivate() {
		// return this._transitions.animatePageOut(this.el);
	}
}
