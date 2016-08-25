import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class FLASH_INCLUDED_PAGE {
	navigateTo() {
		return browser.get('#/');
	}
	checkCoverLevel(id) {
		return element(by.css(`#included_addon_checkbox--${id}`)).getAttribute('aria-checked');
	}
	selectCoverLevel(id) {
		return element(by.css(`#included_addon_checkbox--${id}`)).click();
	}
	toggleTermsConditions() {
		browser.driver.manage().window().maximize();
		browser.sleep(500);
		return element(by.css(`body > app > main > p-included > div > article > button`)).click();
	}
}