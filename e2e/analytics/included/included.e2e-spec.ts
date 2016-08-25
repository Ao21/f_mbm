import { FLASH_INCLUDED_PAGE } from './included.po';
import { E2EUtils } from './../../e2e_utils';
import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

describe('Included Page Analytics', function () {
	let page: FLASH_INCLUDED_PAGE;

	beforeEach(() => {
		page = new FLASH_INCLUDED_PAGE();
	});

	it('should trigger a page event', (done) => {
		page.navigateTo();
		browser.sleep(500);
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let firstPageEvent = E2EUtils.findFirstEvent(eventList, 'event', 'page-view');
				expect(firstPageEvent['page-name']).toBe(`/`);
				done();
			});
	});

	it('should be able to trigger a cover level event', (done) => {
		page.navigateTo();
		expect(page.checkCoverLevel(2)).toEqual('false');
		page.selectCoverLevel(2);
		expect(page.checkCoverLevel(2)).toEqual('true');

		browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
			let lastEvent = E2EUtils.getLastEvent(eventList);
			expect(lastEvent['page-name']).toBe('/');
			expect(lastEvent['event']).toBe('coverLevel');
			expect(lastEvent['status']).toBe(true);
			expect(lastEvent['value']).toBe('RESCUEPLUS');
			done();
		});
	});
	it('shouldnt trigger a cover level event if the event isnt togglable', (done) => {
		page.navigateTo();
		expect(page.checkCoverLevel(0)).toEqual('true');
		page.selectCoverLevel(0);
		expect(page.checkCoverLevel(0)).toEqual('true');
		browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
			let lastEvent = E2EUtils.getLastEvent(eventList);
			expect(lastEvent['event']).not.toBe('coverLevel');
			expect(lastEvent['status']).not.toBe(true);
			expect(lastEvent['value']).not.toBe('RESCUEPLUS');
			done();
		});
	});
	it('should trigger an terms and conditions event', (done) => {
		page.navigateTo();
		page.toggleTermsConditions();
		browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
			let lastEvent = E2EUtils.getLastEvent(eventList);
			expect(lastEvent['page-name']).toBe('/');
			expect(lastEvent['event']).toBe('terms-conditions-acceptance');
			expect(lastEvent['value']).toBe(true);
			done();
		});
	});
});
