import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardFormComponent } from './cc_form';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		AtomicComponentsModule
	],
	providers: [],
	declarations: [
		CreditCardFormComponent,
	],
	exports: [
		CreditCardFormComponent
	]
})
export class CreditCardFormModule { };
