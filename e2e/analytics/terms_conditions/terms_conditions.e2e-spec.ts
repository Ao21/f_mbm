import { FLASH_TERMS_CONDITIONS } from './terms_conditions.po';
import { FLASH_BREAKDOWN_PAGE } from './../breakdown/breakdown.po';
import { E2EUtils } from './../../e2e_utils';
import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

describe('Terms and Conditions Analytics', function(){
	let termsConditionsPage: FLASH_TERMS_CONDITIONS;
	let breakdownPage: FLASH_BREAKDOWN_PAGE;

	beforeEach(() => {
		termsConditionsPage = new FLASH_TERMS_CONDITIONS();
		breakdownPage = new FLASH_BREAKDOWN_PAGE();

		let domain = 'theaa.local';
		browser.driver.get('http://uat1-travel-insurance.' + domain + '/');
		browser.manage().addCookie('xsrftoken', 'HOMESTART', '/');
	});

	describe('Payment Type Events', () => {
		it('should be able to trigger a card payment event', (done) => {
			breakdownPage.navigateTo();
			breakdownPage.selectPayAnnually();
			breakdownPage.selectBuyNow();
			browser.sleep(1000);
			termsConditionsPage.chooseCreditCard();
			browser.sleep(1000);
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'paymentOptions');
				expect(evt.status).toEqual('type');
				expect(evt.value).toEqual('Card');
				done();
			});
		});
		it('should be able to trigger a bank payment event', (done) => {
			breakdownPage.navigateTo();
			breakdownPage.selectPayAnnually();
			breakdownPage.selectBuyNow();
			browser.sleep(1000);
			termsConditionsPage.chooseBankPayment();
			browser.sleep(1000);
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList,'paymentOptions');
				expect(evt.status).toEqual('type');
				expect(evt.value).toEqual('Bank');
				done();
			});
		})
		it('should be able to trigger a card payment event automatically if not annual selected', (done) => {
			breakdownPage.navigateTo();
			breakdownPage.selectBuyNow();
			browser.sleep(1000);
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList,'paymentOptions');
				expect(evt.status).toEqual('type');
				expect(evt.value).toEqual('Card');
				done();
			});
		})
	})
})