import { FLASHMEMBERSHIPPage } from './app.po';
import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

describe('flash-membership App', function() {
	let page: FLASHMEMBERSHIPPage;

	beforeEach(() => {
		page = new FLASHMEMBERSHIPPage();
	});

	// it('should display message saying app works', () => {
	// 	page.navigateTo();
	// 	expect(page.getParagraphText()).toEqual('app works!');
	// });
});
