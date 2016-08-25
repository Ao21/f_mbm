import { OVERVIEW_COMPONENT } from './overview.po';
import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor/globals';

describe('Overview Component Analytics', function () {
	let overview: OVERVIEW_COMPONENT;

	beforeEach(() => {
		overview = new OVERVIEW_COMPONENT();
	});

	it('should be able to open the overview and trigger an event', () => {
		overview.navigateTo();
		browser.sleep(500);
		overview.toggleOverView();
		browser.sleep(500);
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let evt = E2EUtils.getLastEvent(eventList);
				expect(evt.event).toEqual('overview');
				expect(evt.staus).toEqual('visiblity');
				expect(evt.value).toEqual(true);
			});
	});
	it('should be able to close the overview and trigger an event', () => {
		overview.navigateTo();
		browser.sleep(500);
		overview.toggleOverView();
		overview.toggleOverView();
		browser.sleep(500);
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let evt = E2EUtils.getLastEvent(eventList);
				expect(evt.event).toEqual('overview');
				expect(evt.staus).toEqual('visiblity');
				expect(evt.value).toEqual(false);
			});
	});
});
