import { FLASH_TERMS_CONDITIONS } from './../terms_conditions/terms_conditions.po';
import { FLASH_PAYMENT_PAGE } from './payment.po';

import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions } from 'protractor/globals';

fdescribe('Payments Analytics', () => {
	let termsConditionsPage: FLASH_TERMS_CONDITIONS;
	let paymentPage: FLASH_PAYMENT_PAGE;

	beforeEach(() => {
		termsConditionsPage = new FLASH_TERMS_CONDITIONS();
		paymentPage = new FLASH_PAYMENT_PAGE();
	});

	describe('Credit Card Payments', () => {
		it('should be able to fire an event on credit success', (done) => {
			termsConditionsPage.navigateTo('Card');
			browser.sleep(500);
			termsConditionsPage.agreeTermsAndConditions();
			browser.sleep(500);
			paymentPage.selectAgreeCardholder(1);
			browser.sleep(500);
			paymentPage.storePaymentDetails(1);
			browser.sleep(500);
			paymentPage.enterDefaultSuccesCreditCardDetails();
			browser.sleep(3000);
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'payment-event');
				expect(evt.type).toEqual('Card');
				expect(evt.status).toEqual('success');
			});
			done();
		})
	})
})
