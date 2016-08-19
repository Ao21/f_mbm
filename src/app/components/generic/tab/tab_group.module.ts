import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TabGroupComponent } from './tab_group';
import { TabComponent } from './tab';
import { TabsDispatcher } from './tab_dispatcher';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
	],
	providers: [
		TabsDispatcher
	],
	declarations: [
		TabComponent,
		TabGroupComponent
	],
	exports: [
		TabGroupComponent,
		TabComponent
	]
})
export class TabGroupModule { }
