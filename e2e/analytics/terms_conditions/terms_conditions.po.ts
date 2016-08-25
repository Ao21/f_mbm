import { browser, element, by, By, $, $$, ExpectedConditions } from 'protractor/globals';

export class FLASH_TERMS_CONDITIONS {

	navigateTo(value) {
		return browser.get(`#/terms_and_conditions/${value}`);
	}
	chooseCreditCard() {
		return element(by.css('body > app > main > p-terms > section > div > article > div.o-card__content > button:nth-child(1)')).click();
	}
	chooseBankPayment() {
		return element(by.css('body > app > main > p-terms > section > div > article > div.o-card__content > button:nth-child(2)')).click();
	}
	agreeTermsAndConditions() {
		return element(by.css('.o-card button')).click();
	}
}