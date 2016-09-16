import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipIncludedPageComponent } from './included.component';
import { CheckboxCardComponent } from './../../components/membership/checkbox_card/checkbox_card';
import { AddonListModule } from './../../components/membership/addon_list/addon_list.module';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { ConfirmationToggleButtonDirective } from './../../shared/directives/buttons/confirmation_toggle.button';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AddonListModule,
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipIncludedPageComponent,
		CheckboxCardComponent,
		ConfirmationToggleButtonDirective,
	],
	exports: [
		MembershipIncludedPageComponent
	]
})
export class IncludedModule { };
