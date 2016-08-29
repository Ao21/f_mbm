import * as _ from 'lodash';

export class E2EUtils {
	static findFirstEvent(list,prop, value) {
		return _.find(list, (e: any) => {
			return e[prop] === value;
		});
	}
	static getLastEvent(list) {
		return list[list.length - 1];
	}
	static getLastEventOfEventType(list, event) {
		let filteredList = _.filter(list, (e: any) => { return e.event === event; });
		return filteredList[filteredList.length - 1];
	}
	static getXIndexLastEvent(list, inx) {
		inx = inx + 1;
		return list[list.length - inx];
	}
	static getXIndexLastEventOfEventType(list, inx, event) {
		inx = inx + 1;
		let filteredList = _.filter(list, (e: any) => { return e.event === event; });
		return filteredList[filteredList.length - inx];
	}
}