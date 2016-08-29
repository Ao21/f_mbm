import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class OVERVIEW_COMPONENT {
	navigateTo() {
		return browser.get('#/your_details');
	}
	toggleOverView() {
		return element(by.css('body > app > c-top-nav > div.c-top_nav__price')).click();
	}
}