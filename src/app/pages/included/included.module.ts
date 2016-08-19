import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipIncludedPageComponent } from './included.component';
import { CheckboxCardComponent } from './../../components/membership/checkbox_card/checkbox_card';
import { AddonListComponent } from './../../components/membership/addon_list/addon_list';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { ConfirmationToggleButtonDirective } from './../../shared/directives/buttons/confirmation_toggle.button';

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipIncludedPageComponent,
		CheckboxCardComponent,
		AddonListComponent,
		ConfirmationToggleButtonDirective,
	],
	exports: [
		MembershipIncludedPageComponent
	]
})
export class IncludedModule { };
