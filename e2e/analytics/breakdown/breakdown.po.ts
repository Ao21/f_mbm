import { browser, element, by, By, $, $$, ExpectedConditions, protractor } from 'protractor/globals';

export class FLASH_BREAKDOWN_PAGE {
	navigateTo() {
		let b: any = browser;
		b.get('#/breakdown');
		b.manage().addCookie('xsrftoken', 'HOMESTARTPRICE');
	}

	selectBuyNow() {
		return element(by.css('body > app > main > p-breakdown > section > div > section:nth-child(2) > div.c-breakdown__body > button')).click();
	}
	selectPayMonthly() {
		return element(by.css('#selector-monthly')).click();
	}
	selectPayAnnually() {
		return element(by.css('#selector-annual')).click();
	}
	openLoginToSaveQuote() {
		return element(by.css('body > app > main > p-breakdown > section > div > section.c-breakdown__myAA.c-breakdown__carousel-item > header')).click();
	}
	selectLoginToSaveQuote() {
		return element(by.css('body > app > main > p-breakdown > section > div > section.c-breakdown__myAA.c-breakdown__carousel-item > m-save-quote-signin > section > div > button:nth-child(1)')).click();
	}
	selectRegisterToSaveQuote() {
		return element(by.css('body > app > main > p-breakdown > section > div > section.c-breakdown__myAA.c-breakdown__carousel-item > m-save-quote-signin > section > div > button:nth-child(2)')).click();
	}
	inputSaveQuoteEmail(value) {
		return element(by.css('#email')).sendKeys(value);
	}
	inputSaveQuotePassword(value) {
		return element(by.css('#password')).sendKeys(value);
	}
	inputSaveQuotePasswordConfirm(value) {
		return element(by.css('#confirmPassword')).sendKeys(value);
	}
	saveQuote() {
		return element(by.css('body > app > main > p-breakdown > section > div > section:nth-child(2) > div.c-breakdown__footer > section > button')).click();
	}
};
