import {
	Inject,
	Injectable
} from '@angular/core';

import {TestimonialOutcomes, TestimonialRules} from './../constants';
import * as async from 'async';
import * as moment from 'moment';


@Injectable()
export class RulesEngineService {
	engine: RulesEngine;

	constructor() {
		this.engine = new RulesEngine(TestimonialOutcomes, TestimonialRules);
	}

	check(memberGroup): Promise<any> {
		return this.engine.check(memberGroup);
	}

	random() {
		return this.engine.getRandomTestimonial();
	}

}

@Injectable()
export class RulesEngine {
	ruleChecker = new RuleChecker();

	approvedRuleset: any[] = [];

	constructor(public outcomes: Outcome[], public rules: Rule[]) {
		// console.log(this);
	}

	/**
	 *  Adds Rule to the rules array
	 */
	addRule(rule) {
		this.rules.push(rule);
	}

	addOutcome(outcome) {
		this.outcomes.push(outcome);
	}

	getRandomTestimonial() {
		let out = _.map(this.outcomes, (e: any) => {
			let o: any = {};
			o.details = e;
			return o;
		});
		return out[Math.floor(Math.random() * ((this.outcomes.length - 1) - 0 + 1)) + 0];
	}




	/**
	 *  Uses the Ruleset that was generated in check(memberGroup) to compare
	 *  the rule id's to the outcome id's and match the outcome that's the closest to it
	 *
	 */

	calculateRuleOutcome = (outcomes, i) => {
		let ruleset = _.map(i, (e: Rule) => { return e.id });
		let _out = _.map(outcomes, (e: any) => {
			let o: any = {};
			o.rule = ruleset;
			o.details = e;
			o.similarity = this.outcomeDice(e.include, ruleset);
			if (_.intersection(e.reject, ruleset).length === 0 && o.similarity !== 0) {
				return o;
			}
		});
		return _.compact(_out);
	}

	// Similarity Cooefficient

	outcomeDice(arr1, arr2) {
		let common = _.intersection(arr1, arr2);
		return (2 * common.length) / (arr1.length + arr2.length);
	}

	/**
	 *
	 *  Does an asyncronous loop through each member, and calls the checkrules function on them
	 *  which returns a promise, where it adds the returned (true) rules to a checkedRules array,
	 *  once its finished checking each member, it filters them by true and erases the duplicates,
	 *  then calls the calculateRuleOutcome to determine which outcomes match to the active rules
	 *
	 */

	// getCreatedMembers()	
	check(memberGroup) {
		return new Promise((res, rej) => {
			let ruleBase = this.rules;
			let checkedRules = [];
			// For every member in the group, check them against the ruleset
			async.each(memberGroup, (member, cb) => {
				this.checkRules(this.rules, memberGroup, member).then((res) => {
					checkedRules = checkedRules.concat(res);
					cb(null);
				});
			}, (err) => {
				let results = _.uniq(_.filter(checkedRules, (e) => {
					return e.isTrue;
				}));
				res(this.calculateRuleOutcome(this.outcomes, results));
			});
		});

	}

	/**
	 *  Creates an async map that loops through each rule and calls filterByGroup,
	 *  returns a promise of all the checked rules once they're all done
	 *
	 */


	checkRules(rules, memberGroup, member) {
		return new Promise((res, rej) => {
			// For Each Rule filter the group and then check each rule against a member
			async.map(rules, (rule, cb) => {
				// Filter the results by group
				this.filterByGroup(rule, member, memberGroup, cb)
			}, (err, results) => {
				res(_.compact(results));
			});
		});
	}

	/**
	 *
	 *  If the Rule has a rule.group array, then it will only check the rule for that
	 *  member type and the members of that type in the memberGroup, otherwise it will
	 *  check the rule against all members in the membergroup
	 *
	 */

	filterByGroup(rule, member, memberGroup, cb) {
		// If the Rule only applies to on group, filter them out by member types
		if (rule.group && _.includes(rule.group, member.type)) {
			// Filter out nonmembers of current membergroup for use in future rules
			memberGroup = _.filter(memberGroup, (e: any) => {
				if (_.includes(rule.group, e.type)) {
					return e;
				}
			});
			this.checkRuleAgainstMember(rule, member, memberGroup, cb)
		} else if (!rule.group) {
			this.checkRuleAgainstMember(rule, member, memberGroup, cb)
		} else {
			cb();
		}
	}

	/**
	 *  For each property of rule.when, it will call the RuleChecker function to get the correct
	 *  validation for each property, if any of these don't match the member, it will reject the whole rule
	 *  
	 */

	checkRuleAgainstMember(rule, member, memberGroup, cb) {
		// For each option in rule.when run an async call to the RuleChecker function for each member
		async.forEachOf(rule.when, (value, property, next) => {
			return this.ruleChecker[property].call(null, value, member, memberGroup).then((res) => {
				next(null);
			}).catch((err) => {
				next(err);
			})
		}, function (err) {
			// If any of the options are rejected - reject the whole rule
			if (err) {
				// rule.isReject = true;
				// console.log('rejected: ', rule);
				cb('Rejection');
			} else {
				// if any of the options apply, set the rule to valid
				rule.isTrue = true;
				// console.log('accepted: ', rule);
				cb(null, rule);
			}

		});
	}
}


export class RuleChecker {
	age(rule, member) {
		return checkAge(rule, member);
	}
	gender(rule, member) {
		return checkGender(rule, member);
	}
	min(rule, member, memberGroup) {
		return checkMin(rule, null, memberGroup);
	}
	max(rule, member, memberGroup) {
		return checkMax(rule, null, memberGroup);
	}
	county(rule, member, memberGroup) {
		return checkCounty(rule, member);
	}
	area(rule, member, memberGroup) {
		return checkArea(rule, member);
	}
}


function checkArea(rule, member) {
	return new Promise((res, rej) => {
		if (member.area.id === rule) {
			res(true);
		} else {
			rej(`Member is not in area ${rule}`);
		}
	})
}
function checkCounty(rule, member) {
	return new Promise((res, rej) => {
		if (member.county.id === rule) {
			res(true);
		} else {
			rej(`Member is not in county ${rule}`);
		}
	})
}

function checkAge(rule, member) {
	return new Promise((res, rej) => {
		member = member.dateOfBirth;
		let age: any = moment(member, "DD/MM/YYYY");
		age = moment().diff(age, 'years');
		rule = _.sortBy(rule);
		if (rule[0] <= age && age <= rule[1]) {
			// console.log(`member is the right age for this rule: ${age}`);
			res(true);
		} else {
			rej(`Member is outside the acceptable age range for this rule: ${age}`);
		}
	});
}


function checkMin(rule, member, memberGroup) {
	return new Promise((res, rej) => {
		if (memberGroup.length >= rule) {
			res(true)
		} else {
			rej(`There aren't enough members in this group for this rule`);
		}
	});
}

function checkMax(rule, member, memberGroup) {
	return new Promise((res, rej) => {
		if (memberGroup.length <= rule) {
			res(true);
		} else {
			rej(`There are too many members in this group for this rule`);
		}
	});
}

function checkGender(rule, member) {
	return new Promise((res, rej) => {
		let male = ['Mr'];
		let female = ['Mrs', 'Miss', 'Ms'];

		if (_.includes(male, member.title) && rule === 'male') {
			res(true);
		} else if (_.includes(female, member.title) && rule === 'female') {
			res(true);
		} else {
			rej('This Member or Members isnt gendered');
		}
	});
}
