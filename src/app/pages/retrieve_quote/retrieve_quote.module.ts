import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipRetrieveQuoteComponent } from './retrieve_quote.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
	declarations: [
		MembershipRetrieveQuoteComponent,
	],
	exports: [
		MembershipRetrieveQuoteComponent
	]
})
export class RetrieveQuoteModule { };
