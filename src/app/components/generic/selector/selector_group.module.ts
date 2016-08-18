import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectorGroupComponent, SG_VALUE_ACCESSOR } from './selector_group';
import { SelectorComponent } from './selector';
import { SelectorDispatcher } from './selector_dispatcher';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
	],
	providers: [
		SelectorDispatcher,
		SG_VALUE_ACCESSOR
	],
	declarations: [
		SelectorGroupComponent,
		SelectorComponent
	],
	exports: [
		SelectorGroupComponent,
		SelectorComponent
	]
})
export class SelectorGroupModule { }
