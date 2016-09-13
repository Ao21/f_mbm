import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialPopupComponent } from './p-testimonials';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';

@NgModule({
	imports: [
		CommonModule,
		AtomicComponentsModule
	],
	providers: [

	],
	declarations: [
		TestimonialPopupComponent,

	],
	exports: [
		TestimonialPopupComponent
	]
})
export class TestimonialPopupModule { }
