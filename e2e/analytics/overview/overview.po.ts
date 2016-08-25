import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class OVERVIEW_COMPONENT {
	navigateTo() {
		return browser.get('/');
	}
	toggleOverView() {
		return element(by.css('/html/body/app/c-top-nav/div[2]')).click();
	}
}