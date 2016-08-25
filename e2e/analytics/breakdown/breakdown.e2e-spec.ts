import { FLASH_BREAKDOWN_PAGE } from './breakdown.po';
import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor/globals';

describe('Breakdown Page Analytics', function () {
	let page: FLASH_BREAKDOWN_PAGE;

	beforeEach(() => {
		page = new FLASH_BREAKDOWN_PAGE();
	})

	it('should trigger a page event', (done) => {
		page.navigateTo();
		browser.sleep(500);
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let firstPageEvent = E2EUtils.findFirstEvent(eventList, 'event', 'page-view');
				expect(firstPageEvent['page-name']).toBe(`/breakdown`);
				done();
			});
	});


	describe('Save Quote', () => {
		it('should trigger an event on open save quote', (done) => {
			page.navigateTo();
			page.openLoginToSaveQuote();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'login-save-quote');
					expect(evt.status).toEqual('visibility');
					expect(evt.value).toEqual(true);
					done();
				});
		});
		it('should be able to enter login details but not share password in the event', (done) => {
			page.navigateTo();
			page.openLoginToSaveQuote();
			browser.sleep(500);
			page.inputSaveQuoteEmail('ro.brett@gmail.com');
			page.inputSaveQuotePassword('password');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'form-input');
					expect(evt['field-name']).toEqual('password');
					expect(evt['input-value']).toBeNull();
					done();
				});
		});
		it('should be able to successfully login to save quote and trigger an event', (done) => {
			page.navigateTo();
			page.openLoginToSaveQuote();
			browser.sleep(500);
			page.inputSaveQuoteEmail('brettr@theaa.ie');
			page.inputSaveQuotePassword('654321');
			page.selectLoginToSaveQuote();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'login-attempt');
					expect(evt['status']).toEqual('success');
					done();
				});
		})

		it('should be able to fail login to save quote and trigger an event', (done) => {
			page.navigateTo();
			page.openLoginToSaveQuote();
			browser.sleep(500);
			page.inputSaveQuoteEmail('brettr@theaa.ie');
			page.inputSaveQuotePassword('34343');
			page.selectLoginToSaveQuote();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'login-attempt');
					expect(evt['status']).toEqual('failure');
					done();
				});
		})
	});
	describe('Payment Frequency Events', () => {
		it('should fire a pay monthly event on page load by default', (done) => {
			page.navigateTo();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'paymentOptions');
					expect(evt.status).toBe('frequency');
					expect(evt.value).toBe('monthly');
					done();
				});
		});
		it('should be able to pay annually and fire an event', (done) => {
			page.navigateTo();
			page.selectPayAnnually();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'paymentOptions');
					expect(evt.status).toBe('frequency');
					expect(evt.value).toBe('annual');
					done();
				});
		});
		it('should be able to pay monthly and fire an event', (done) => {
			page.navigateTo();
			page.selectPayAnnually();
			page.selectPayMonthly();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'paymentOptions');
					expect(evt.status).toBe('frequency');
					expect(evt.value).toBe('monthly');
					done();
				});
		});
		it('should be able to swap between them and still emit the right event', (done) => {
			page.navigateTo();
			page.selectPayAnnually();
			page.selectPayMonthly();
			page.selectPayAnnually();
			page.selectPayMonthly();
			page.selectPayAnnually();
			page.selectPayMonthly();
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt0 = E2EUtils.getXIndexLastEvent(eventList, 0);
					let evt1 = E2EUtils.getXIndexLastEvent(eventList, 1);
					let evt2 = E2EUtils.getXIndexLastEvent(eventList, 2);
					let evt3 = E2EUtils.getXIndexLastEvent(eventList, 3);
					let evt4 = E2EUtils.getXIndexLastEvent(eventList, 4);
					expect(evt0.value).toBe('monthly');
					expect(evt1.value).toBe('annual');
					expect(evt2.value).toBe('monthly');
					expect(evt3.value).toBe('annual');
					expect(evt4.value).toBe('monthly');
					done();
				});
		});

	});
});
