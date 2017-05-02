import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressSearchComponent } from './address-search.component';
import { SharedModule } from './../../../shared/shared.module';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	declarations: [
		AddressSearchComponent
	],
	exports: [
		AddressSearchComponent
	]
})
export class AddressSearchModule { }
