import { FLASH_FRIENDS_AND_FAMILY_PAGE } from './friends_and_family.po';
import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions } from 'protractor/globals';

describe('Friends and Family', function () {
	let page: FLASH_FRIENDS_AND_FAMILY_PAGE;

	beforeEach(() => {
		page = new FLASH_FRIENDS_AND_FAMILY_PAGE();
	});

	it('should trigger a page event', (done) => {
		page.navigateTo();
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let firstPageEvent = E2EUtils.findFirstEvent(eventList, 'event', 'page-view');
				expect(firstPageEvent['page-name']).toBe(`/friends_and_family`);
				done();
			});
	});

	describe('Additional Member', () => {
		it('should be able to edit a member and trigger a member saved event', (done) => {
			page.navigateTo();
			page.addMember(1);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('additionalMember');
					expect(evt['page-name']).toEqual('/friends_and_family');
					expect(evt['status']).toEqual('editing');
					done();
				});
		});

		it('should be able to cancel a member and trigger a member cancelled event', (done) => {
			page.navigateTo();
			page.addMember(3);
			page.enterMemberFirstName(3, 'Ronan');
			page.enterMemberDateOfBirth(3, '29121987');
			page.deleteMember(3);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('additionalMember');
					expect(evt['page-name']).toEqual('/friends_and_family');
					expect(evt['status']).toEqual('cancelled');
					expect(evt['value']).toEqual(3);
					done();
				});
		});

		it('should be able to add a member and trigger a member saved event', (done) => {
			page.navigateTo();
			page.addMember(1);
			page.enterMemberFirstName(1, 'Ronan');
			page.enterMemberSurname(1, 'Brett');
			page.enterMemberDateOfBirth(1, '29121987');
			page.saveMember(1);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('additionalMember');
					expect(evt['page-name']).toEqual('/friends_and_family');
					expect(evt['status']).toEqual('saved');
					expect(evt['value']).toEqual(1);
					done();
				});
		});

		it('should be able to remove a member and trigger a member deleted event', (done) => {
			page.navigateTo();
			page.addMember(2);
			page.enterMemberFirstName(2, 'Ronan');
			page.enterMemberSurname(2, 'Brett');
			page.enterMemberDateOfBirth(2, '29121987');
			page.saveMember(2);
			page.deleteMember(2);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('additionalMember');
					expect(evt['page-name']).toEqual('/friends_and_family');
					expect(evt['status']).toEqual('deleted');
					expect(evt['value']).toEqual(2);
					done();
				});
		});

	});
});
