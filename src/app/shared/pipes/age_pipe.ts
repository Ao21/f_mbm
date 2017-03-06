import {
	isBlank,
} from '@angular/platform-browser/src/facade/lang';

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
	name: 'age'
})

export class AgePipe implements PipeTransform {
	transform(value: any, args: any = null): any {

		if (isBlank(value) || value === '') {
			return null;
		}

		if (!moment(value, 'DD/MM/YYYY').isValid()) {
			throw new Error('Not a valid date');
		}

		let years = moment(value, 'DD/MM/YYYY');

		return moment().diff(years, 'years');
	}
}

