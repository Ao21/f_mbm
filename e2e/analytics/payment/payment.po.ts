import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor/globals';

export class FLASH_PAYMENT_PAGE {
	selectAgreeCardholder(idx) {
		return element(by.css(`#paymentAgreement > div.o-card__content > button:nth-child(${idx})`)).click();
	}
	storePaymentDetailsNoCardholder(idx) {
		return element(by.css(`#paymentAgreement > div.o-card__content > button`)).click();
	}
	storePaymentDetails(idx) {
		return element(by.css(`#paymentAgreement > div.o-card__content > button:nth-child(${idx})`)).click();
	}

	waitForConfirmation() {
		let EC = ExpectedConditions;
		let condition = EC.urlContains('confirmation');
		return browser.wait(condition, 10000);
	}

	agreeValidation() {
		element(by.css('body > app > main > p-payment > section > m-dd-form > div > button.btn.btn--yellow')).click();
	}

	enterIban(name, iban, bic) {
		element(by.css('body > app > main > p-payment > section > m-dd-form > div > section > c-tab-group > div.tab__header > div:nth-child(2) > button')).click();
		element(by.css('#accountName')).sendKeys(name);
		element(by.css('#BIC')).sendKeys(bic);
		element(by.css('#IBAN')).sendKeys(iban);
		let EC = ExpectedConditions;
		let waitForElement = element(by.css('body > app > main > p-payment > section > m-dd-form > div > button.btn.btn--yellow'));
		let condition = EC.textToBePresentInElement(waitForElement, 'PAY NOW');
		browser.wait(condition, 10000);
		return waitForElement.click();
	}
	enterDebit(name, number, sort) {
		element(by.css('body > app > main > p-payment > section > m-dd-form > div > section > c-tab-group > div.tab__header > div:nth-child(1) > button')).click();
		element(by.css('#accountName')).sendKeys(name);
		element(by.css('#accountNumber')).sendKeys(name);
		element(by.css('#sortCode')).sendKeys(name);
		let EC = ExpectedConditions;
		let waitForElement = element(by.css('body > app > main > p-payment > section > m-dd-form > div > button.btn.btn--yellow.btn--expand'));
		let condition = EC.textToBePresentInElement(waitForElement, 'PAY NOW');
		browser.wait(condition, 10000);
		return waitForElement.click();

	}
	enterDefaultSuccesCreditCardDetails() {
		browser.ignoreSynchronization = true;
		let b: any = browser;
		var driver = b.driver;
		var loc = by.tagName('iframe');
		var el = driver.findElement(loc);
		b.switchTo().frame(el);
		browser.sleep(500);
		driver.findElement(by.css('#pas_ccnum')).sendKeys('4263970000005262');
		driver.findElement(by.css('#pas_ccmonth')).sendKeys('01');
		driver.findElement(by.css('#pas_ccyear')).sendKeys('20');
		driver.findElement(by.css('#pas_cccvc')).sendKeys('123');
		driver.findElement(by.css('#pas_ccname')).sendKeys('Ronan Brett');
		driver.findElement(by.css('#rxp-primary-btn')).click();
		b.switchTo().defaultContent();
		browser.ignoreSynchronization = false;
		let EC = ExpectedConditions;
		let condition = EC.urlContains('confirmation');
		return browser.wait(condition, 10000);


	}

	enterDefaultFailureCreditCardDetails() {
		browser.ignoreSynchronization = true;
		let b: any = browser;
		var driver = b.driver;
		var loc = by.tagName('iframe');
		var el = driver.findElement(loc);
		b.switchTo().frame(el);
		browser.sleep(500);
		driver.findElement(by.css('#pas_ccnum')).sendKeys('4000120000001154');
		driver.findElement(by.css('#pas_ccmonth')).sendKeys('01');
		driver.findElement(by.css('#pas_ccyear')).sendKeys('20');
		driver.findElement(by.css('#pas_cccvc')).sendKeys('123');
		driver.findElement(by.css('#pas_ccname')).sendKeys('Ronan Brett');
		driver.findElement(by.css('#rxp-primary-btn')).click();
		b.switchTo().defaultContent();
		browser.sleep(500);
		browser.ignoreSynchronization = false;
		let EC = ExpectedConditions;
		let condition = EC.presenceOf(element(by.css('body > app > main > p-payment > section > m-cc-form > div > div')));
		return browser.wait(condition, 10000);

	}

}