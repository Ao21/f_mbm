import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { MembershipPriceBreakdownPageComponent } from './breakdown.component';
import { BreakdownDrawerItemDirective } from './../../directives/breakdown/breakdown_height_drawer.directive';
import { MyAASaveQuoteSignInComponent } from './../../components/membership/myAA_signin/myAA_signin.component';
import { AtomicComponentsModule } from './../../components/generic/atomic_components.module';
import { SaveQuoteButtonComponent } from './../../components/membership/save_quote_button/save_quote_button';
import { DeleteConfirmationComponent } from './../../components/generic/delete_confirmation/delete_confirmation';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipPriceBreakdownPageComponent,
		BreakdownDrawerItemDirective,
		MyAASaveQuoteSignInComponent,
		SaveQuoteButtonComponent,
		DeleteConfirmationComponent

	],
	exports: [
		MembershipPriceBreakdownPageComponent
	]
})
export class BreakdownModule { };
