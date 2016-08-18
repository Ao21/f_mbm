import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSelectorComponent } from './title_selector';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';
import { SelectorGroupModule } from './../../generic/selector/selector_group.module';
@NgModule({
	imports: [
		CommonModule,
		AtomicComponentsModule
	],
	providers: [
	],
	declarations: [
		TitleSelectorComponent
	],
	exports: [
		TitleSelectorComponent
	]
})
export class TitleSelectorModule { };
