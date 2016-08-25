import { FLASH_YOUR_DETAILS_PAGE } from './your_details.po';
import { E2EUtils } from './../../e2e_utils';
import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor/globals';


describe('Your Details Page Analytics', function () {
	let page: FLASH_YOUR_DETAILS_PAGE;

	beforeEach(() => {
		page = new FLASH_YOUR_DETAILS_PAGE();
	});

	it('should trigger a page event', (done) => {
		page.navigateTo();
		browser.executeScript('return window.dataLayer;')
			.then((eventList: any[]) => {
				let firstPageEvent = E2EUtils.findFirstEvent(eventList, 'event', 'page-view');
				expect(firstPageEvent['page-name']).toBe(`/your_details`);
				done();
			});
	});

	describe('Email Events', () => {
		it('should trigger an email input invalid event', (done) => {
			page.navigateTo();
			page.inputTextToEmail('ro.brett');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('form-input');
					expect(evt['field-name']).toEqual('email');
					expect(evt['form-label']).toEqual('Your Details Form');
					expect(evt['input-status-value']).toEqual('INVALID');
					expect(evt['input-value']).toEqual('ro.brett');
					expect(evt['page-name']).toEqual('/your_details');
					done();
				});
		});

		it('should trigger an email input valid event', (done) => {
			page.navigateTo();
			page.inputTextToEmail('ro.brett@gmail.com');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEvent(eventList);
					expect(evt.event).toEqual('form-input');
					expect(evt['field-name']).toEqual('email');
					expect(evt['form-label']).toEqual('Your Details Form');
					expect(evt['input-status-value']).toEqual('VALID');
					expect(evt['input-value']).toEqual('ro.brett@gmail.com');
					expect(evt['page-name']).toEqual('/your_details');
					done();
				});
		});

		it('should trigger multiple events on changes to email input', (done) => {
			page.navigateTo();
			page.inputTextToEmail('ro.bret');
			browser.sleep(500);
			page.inputTextToEmail('t@gmail.com');
			browser.sleep(500);
			page.inputTextToEmail(protractor.Key.BACK_SPACE);
			page.inputTextToEmail(protractor.Key.BACK_SPACE);
			page.inputTextToEmail(protractor.Key.BACK_SPACE);
			page.inputTextToEmail(protractor.Key.BACK_SPACE);
			page.inputTextToEmail(protractor.Key.BACK_SPACE);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEventOfEventType(eventList, 'form-input');
					let secondLastEvt = E2EUtils.getXIndexLastEventOfEventType(eventList, 1, 'form-input');
					let thirdLastEvt = E2EUtils.getXIndexLastEventOfEventType(eventList, 2, 'form-input');
					expect(lastEvt['input-status-value']).toBe('INVALID');
					expect(secondLastEvt['input-status-value']).toBe('VALID');
					expect(thirdLastEvt['input-status-value']).toBe('INVALID');
					done();
				});
		});

		it('should trigger a user detected event on email recognised', (done) => {
			page.navigateTo();
			page.inputTextToEmail('brettr@theaa.ie');
			let EC = protractor.ExpectedConditions;
			let e = element(by.css('body > app > c-notification-bar > c-notification-login'));
			browser.wait(EC.presenceOf(e), 10000);
			expect(e.isPresent()).toBeTruthy();

			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEventOfEventType(eventList, 'previous-user-detected');
					expect(lastEvt.event).toEqual('previous-user-detected');
					expect(lastEvt.status).toEqual('Registered');
					done();
				});
		});
	});

	describe('Generic Text Inputs', () => {
		it('should be able to trigger a valid event on a text input', (done) => {
			page.navigateTo();
			page.inputTextToFirstName('Ronan');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt.event).toEqual('form-input');
					expect(lastEvt['input-status-value']).toEqual('VALID');
					expect(lastEvt['input-value']).toEqual('Ronan');
					done();
				});
		});

		it('should be able to trigger an invalid event on multiple text inputs', (done) => {
			page.navigateTo();
			page.inputTextToFirstName('R');
			browser.sleep(500);
			page.inputTextToFirstName(protractor.Key.BACK_SPACE);
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					let secondLastEvent = E2EUtils.getXIndexLastEvent(eventList, 1);
					expect(lastEvt.event).toEqual('form-input');
					expect(lastEvt['input-status-value']).toEqual('INVALID');
					expect(secondLastEvent['input-status-value']).toEqual('VALID');
					done();
				});
		});

		it('should only trigger an event on status change', (done) => {
			page.navigateTo();
			page.inputTextToFirstName('Ronan');
			browser.sleep(500);
			page.inputTextToSurname('Brett');
			browser.sleep(500);
			page.inputTextToFirstName('Brett');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					let secondLastEvent = E2EUtils.getXIndexLastEvent(eventList, 1);
					expect(lastEvt['field-name']).toEqual('surname');
					expect(secondLastEvent['field-name']).toEqual('firstName');
					expect(lastEvt['input-status-value']).toEqual('VALID');
					expect(secondLastEvent['input-status-value']).toEqual('VALID');
					done();
				});
		});


	});

	describe('Date Input', () => {
		it('should be able to enter a date and trigger a valid event', (done) => {
			page.navigateTo();
			page.inputTextToDateOfBirth('29121987');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt['field-name']).toEqual('dateOfBirth');
					expect(lastEvt['input-status-value']).toEqual('VALID');
					done();
				});
		});
		it('should be able to enter a date and trigger an invalid', (done) => {
			page.navigateTo();
			page.inputTextToDateOfBirth('29');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt['field-name']).toEqual('dateOfBirth');
					expect(lastEvt['input-status-value']).toEqual('INVALID');
					done();
				});
		});
	});

	describe('Phone Input', () => {
		it('should be able to enter a date and trigger a valid event', (done) => {
			page.navigateTo();
			page.inputTextToPhoneNumber('0838000761');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt['field-name']).toEqual('phoneNumber');
					expect(lastEvt['input-status-value']).toEqual('VALID');
					done();
				});
		});
		it('should be able to enter a date and trigger an invalid', (done) => {
			page.navigateTo();
			page.inputTextToPhoneNumber('0');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt['field-name']).toEqual('phoneNumber');
					expect(lastEvt['input-status-value']).toEqual('INVALID');
					done();
				});
		});
	});

	describe('Choose Address', () => {
		it('should fire an event on address selection', (done) => {
			page.navigateTo();
			page.inputTextToAddressLine1('14');
			page.inputAndSelectTextToArea('Harcourt');
			page.inputAndSelectTextToCounty('Dublin 2');
			page.chooseAddress();
			page.selectFirstAddress();
			browser.sleep(1000);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'validateAddress');
					expect(evt.status).toEqual('selectAddress');
					done();
				});
		})
		it('should fire an event on no address selection', (done) => {
			page.navigateTo();
			page.inputTextToAddressLine1('14');
			page.inputAndSelectTextToArea('Harcourt');
			page.inputAndSelectTextToCounty('Dublin 2');
			page.chooseAddress();
			page.selectNoAddress();
			browser.sleep(1000);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'validateAddress');
					expect(evt.status).toEqual('noAddress');
					done();
				});
		})
	})

	describe('Autocomplete Input', () => {
		it('should emit a valid event on selection', (done) => {
			page.navigateTo();
			page.inputAndSelectTextToArea('Harcourt S');
			browser.sleep(500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					expect(lastEvt['field-name']).toEqual('area');
					expect(lastEvt['input-status-value']).toEqual('VALID');
					done();
				});
		});

		it('should emit a reset and init-invalid event on reset', (done) => {
			page.navigateTo();
			page.inputAndSelectTextToCounty('Dublin 2');
			browser.sleep(500);
			page.resetCounty();
			browser.sleep(1500);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let lastEvt = E2EUtils.getLastEvent(eventList);
					let secondLastEvent = E2EUtils.getXIndexLastEvent(eventList, 1);
					expect(lastEvt['field-name']).toEqual('county');
					expect(lastEvt['input-status-value']).toEqual('INIT-INVALID');
					expect(secondLastEvent['input-status-value']).toEqual('RESET');
					done();
				});
		});

	});

	describe('Prepopulate Data ', () => {
		it('should fire an event when user prepopulates data through myaa', (done) => {
			page.navigateTo();
			page.inputTextToEmail('brettr@theaa.ie');
			let EC = ExpectedConditions;
			let e = element(by.css('body > app > c-notification-bar > c-notification-login'));
			browser.wait(EC.presenceOf(e), 10000);
			expect(e.isPresent()).toBeTruthy();
			browser.sleep(1000);
			page.inputPasswordMyAA('654321');
			page.loginToMyAA();
			browser.sleep(3000);
			browser.executeScript('return window.dataLayer;')
				.then((eventList: any[]) => {
					let evt = E2EUtils.getLastEventOfEventType(eventList, 'aa-populate-fields');
					expect(evt.status).toEqual('success');
					done();
				});
		})
	})



});
