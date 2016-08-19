import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipErrorPageComponent } from './error.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
	declarations: [
		MembershipErrorPageComponent,
	],
	exports: [
		MembershipErrorPageComponent
	]
})
export class ErrorPageModule { };
