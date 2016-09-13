import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipYourDetailsPageComponent } from './your_details.component';
import { SharedModule } from './../../shared/shared.module';
import { AddressListComponent } from './../../components/membership/address_list/address_list';
import { AtomicComponentsModule } from './../../components/generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	providers: [
	],
	declarations: [
		MembershipYourDetailsPageComponent,
		AddressListComponent
	],
	exports: [
		MembershipYourDetailsPageComponent
	]
})
export class YourDetailsModule { };
