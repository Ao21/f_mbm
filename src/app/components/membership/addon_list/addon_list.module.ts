import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonListComponent } from './addon_list';
import { SharedModule } from './../../../shared/shared.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	providers: [],
	declarations: [
		AddonListComponent,
	],
	exports: [
		AddonListComponent
	]
})
export class AddonListModule { };
