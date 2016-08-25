import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor/globals';

export class FLASH_FRIENDS_AND_FAMILY_PAGE {
	navigateTo() {
		return browser.get('#/friends_and_family');
	}
	addMember(index: number) {
		element(by.css(`m-add-member-card:nth-child(${index})`)).click();
	}
	enterMemberFirstName(index, value) {
		element(by.css(`m-add-member-card:nth-child(${index}).isEditing #firstName`)).sendKeys(value);
	}
	enterMemberSurname(index, value) {
		element(by.css(`m-add-member-card:nth-child(${index}).isEditing #surname`)).sendKeys(value);
	}
	enterMemberDateOfBirth(index, value) {
		element(by.css(`m-add-member-card:nth-child(${index}).isEditing #dateOfBirth`)).sendKeys(value);
	}
	saveMember(index) {
		element(by.css(`m-add-member-card:nth-child(${index}).isEditing > div > div.o-flag__body > c-error-button > button`)).click();
	}
	deleteMember(index) {
		element(by.css(`m-add-member-card:nth-child(${index}) > div > div.o-flag__body > div.c-add_member_close`)).click();
	}
}