import { FLASH_TERMS_CONDITIONS } from './../terms_conditions/terms_conditions.po';
import { FLASH_PAYMENT_PAGE } from './payment.po';

import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions } from 'protractor/globals';

describe('Payments Analytics', () => {
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
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'payment-event');
				expect(evt.type).toEqual('Card');
				expect(evt.status).toEqual('success');
			});
			done();
		});
		it('should emit a convert quote event on bank success', (done) => {
			termsConditionsPage.navigateTo('Bank');
			browser.sleep(500);
			termsConditionsPage.agreeTermsAndConditions();
			browser.sleep(500);
			paymentPage.enterIban('Sixto Cantolla', 'IE38BOFI90003344938316', 'BOFIIE2DXXX');
			paymentPage.agreeValidation();
			paymentPage.waitForConfirmation();
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'convert-quote');
				expect(evt).toBeDefined();
			});
			done();
		})
		it('should be able to fire an event on credit failure', (done) => {
			termsConditionsPage.navigateTo('Card');
			browser.sleep(500);
			termsConditionsPage.agreeTermsAndConditions();
			browser.sleep(500);
			paymentPage.selectAgreeCardholder(1);
			browser.sleep(500);
			paymentPage.storePaymentDetails(1);
			browser.sleep(500);
			paymentPage.enterDefaultFailureCreditCardDetails();
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'payment-event');
				expect(evt.type).toEqual('Card');
				expect(evt.status).toEqual('declined');
			});
			done();
		});
	});
	describe('Bank Payments', () => {
		it('should be able to fire an event on bank success', (done) => {
			termsConditionsPage.navigateTo('Bank');
			browser.sleep(500);
			termsConditionsPage.agreeTermsAndConditions();
			browser.sleep(500);
			paymentPage.enterIban('Sixto Cantolla', 'IE38BOFI90003344938316', 'BOFIIE2DXXX');
			paymentPage.agreeValidation();
			paymentPage.waitForConfirmation();
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'payment-event');
				expect(evt.type).toEqual('Bank');
				expect(evt.status).toEqual('success');
			});
			done();
		});
		it('should emit a convert quote event on bank success', (done) => {
			termsConditionsPage.navigateTo('Bank');
			browser.sleep(500);
			termsConditionsPage.agreeTermsAndConditions();
			browser.sleep(500);
			paymentPage.enterIban('Sixto Cantolla', 'IE38BOFI90003344938316', 'BOFIIE2DXXX');
			paymentPage.agreeValidation();
			paymentPage.waitForConfirmation();
			browser.executeScript('return window.dataLayer;').then((eventList: any[]) => {
				let evt = E2EUtils.getLastEventOfEventType(eventList, 'convert-quote');
				expect(evt).toBeDefined();
			});
			done();
		})
	});
});
