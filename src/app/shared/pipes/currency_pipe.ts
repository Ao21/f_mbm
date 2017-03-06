import {
	isBlank,
} from '@angular/platform-browser/src/facade/lang';

import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';
@Pipe({
	name: 'currency'
})

export class CurrencyPipe implements PipeTransform{
	transform(value: any, args: any = null): any {
		if (isBlank(value) || value === '') {
			return null;
		}


		let val;
		let digits = args.digits;
		let symbol = '€';

		let freeOptions = args.free;
		value = new Number(value);
		if (freeOptions && value === 0) {
			return 'FREE';
		}
		let sections = 3;
		let re = '\\d(?=(\\d{' + (sections || 3) + '})+' + (digits > 0 ? '\\.' : '$') + ')';
		return symbol + value.toFixed(Math.max(0, ~~digits)).replace(new RegExp(re, 'g'), '$&,');

	}
}
