import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class FLASHMEMBERSHIPPage {
	navigateTo() {
		return browser.get('/');
	}

	getParagraphText() {
		return element(by.css('app-root h1')).getText();
	}
}
