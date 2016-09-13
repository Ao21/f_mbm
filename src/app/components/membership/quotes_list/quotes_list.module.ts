import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesListComponent } from './quotes_list';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';

@NgModule({
	imports: [
		CommonModule,
		AtomicComponentsModule
	],
	providers: [

	],
	declarations: [
		QuotesListComponent,

	],
	exports: [
		QuotesListComponent
	]
})
export class QuoteListModule { }
