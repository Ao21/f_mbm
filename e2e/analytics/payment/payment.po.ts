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
		browser.sleep(500);
		browser.ignoreSynchronization = false;

	}

}