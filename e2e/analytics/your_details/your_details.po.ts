import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class FLASH_YOUR_DETAILS_PAGE {
	navigateTo() {
		return browser.get('#/your_details');
	}

	inputPasswordMyAA(value) {
		return element(by.css('#password')).sendKeys(value);
	}

	loginToMyAA() {
		return element(by.css('body > app > c-notification-bar > c-notification-login > div > section > form > c-error-button > button')).click();
	}

	inputTextToEmail(value) {
		return element(by.css('#email')).sendKeys(value);
	}
	inputTextToFirstName(value) {
		return element(by.css('#firstName')).sendKeys(value);
	}
	inputTextToSurname(value) {
		return element(by.css('#surname')).sendKeys(value);
	}
	inputTextToDateOfBirth(value) {
		return element(by.css('#dateOfBirth')).sendKeys(value);
	}
	inputTextToPhoneNumber(value) {
		return element(by.css('#phoneNumber')).sendKeys(value);
	}
	inputTextToAddressLine1(value) {
		return element(by.css('#addressLine1')).sendKeys(value);
	}
	inputTextToAddressLine2(value) {
		return element(by.css('#addressLine2')).sendKeys(value);
	}
	inputTextOnlyToArea(value) {
		return element(by.css('form-component.fc--area > .form-group > c-auto-complete > input')).sendKeys(value);
	}
	inputAndSelectTextToArea(value) {
		element(by.css('form-component.fc--area > .form-group > c-auto-complete > input')).sendKeys(value);
		browser.sleep(1500);
		let EC = ExpectedConditions;
		let e = element(by.css('form-component.fc--area > .form-group > c-auto-complete > div > div > button'));
		browser.wait(EC.presenceOf(e), 10000);
		return element(by.css('form-component.fc--area > .form-group > c-auto-complete > div > div > button')).click();
	}
	inputTextOnlyToCounty(value) {
		return element(by.css('form-component.fc--county > .form-group > c-auto-complete > input')).sendKeys(value);
	}
	inputAndSelectTextToCounty(value) {
		element(by.css('form-component.fc--county > .form-group > c-auto-complete > input')).sendKeys(value);
		let EC = ExpectedConditions;
		let e = element(by.css('form-component.fc--county > .form-group > c-auto-complete > div > div > button'));
		browser.wait(EC.presenceOf(e), 10000);
		return element(by.css('form-component.fc--county > .form-group > c-auto-complete > div > div > button')).click();
	}
	resetArea() {
		return element(by.css('form-component.fc--area > .form-group > button.rset')).click();
	}
	resetCounty() {
		return element(by.css('form-component.fc--county > .form-group > button.rset')).click();
	}
	chooseAddress() {
		let EC = ExpectedConditions;
		let e = element(by.css('#validateAddBtn'));
		browser.wait(EC.presenceOf(e), 10000);
		browser.sleep(1000);
		return e.click();
	}
	selectFirstAddress() {
		return element(by.css('body > app > main > p-your-details > section > m-address-list > section > button:nth-child(1)')).click();
	}
	selectNoAddress() {
		return element(by.css('body > app > main > p-your-details > section > m-address-list > section > button.isEcho')).click();
	}
}