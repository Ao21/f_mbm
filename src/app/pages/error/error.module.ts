import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { MembershipErrorPageComponent } from './error.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		RouterModule
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
