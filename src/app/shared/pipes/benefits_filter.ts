import {
	isBlank
} from '@angular/platform-browser/src/facade/lang';

let BENEFITS_LIST = [];
BENEFITS_LIST[`ROADSIDERESCUE`] = true;
BENEFITS_LIST[`24-7EMERGENCYCOVER`] = true;
BENEFITS_LIST[`ANYVEHICLECOVER`] = true;
BENEFITS_LIST[`UKCOVER`] = true;
BENEFITS_LIST[`FUELSAVERCARD`] = true;
BENEFITS_LIST[`AAREWARDS`] = true;
// Home Start
BENEFITS_LIST[`DOORSTEPCOVER`] = true;
// Rescue Plus
BENEFITS_LIST[`CARHIRE`] = true;
BENEFITS_LIST[`ACCOMMODATION`] = true;
BENEFITS_LIST[`TRAVELEXPENSES`] = true;

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'benefitsFilter'
})
export class BenefitsFilter implements PipeTransform{
	transform(value: any): any {
		if (isBlank(value) || value.length === 0) {
			return null;
		}
		return _.filter(value, (e: JourneyBenefit) => {
			return BENEFITS_LIST[e.code];
		});
	}
}
