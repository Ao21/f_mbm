import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakdownItemComponent } from './breakdown_item';
import { SharedModule } from './../../../shared/shared.module';
import { DeleteConfirmationComponent } from './../../generic/delete_confirmation/delete_confirmation';

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	providers: [],
	declarations: [
		BreakdownItemComponent,
		DeleteConfirmationComponent
	],
	exports: [
		BreakdownItemComponent,
		DeleteConfirmationComponent
	]
})
export class BreakdownItemModule { };
