import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form_component.component';
import { AutoCompleteModule } from './../../generic/auto_complete/auto_complete.module';
import { DynamicFormQuestionDateComponent } from './../../generic/date-of-birth-form/dynamic-form-question-date.component';
import { TitleSelectorModule } from './../title_selector/title_selector.module';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';
import { InputMaskDirective } from './../../../shared/directives/format/mask';
import { MyAALoginDetectionDirective } from './../../../directives/myaa/myaa_login_detection.directive';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AtomicComponentsModule,
		AutoCompleteModule,
		TitleSelectorModule
	],
	providers: [],
	declarations: [
		FormComponent,
		DynamicFormQuestionDateComponent,
		InputMaskDirective,
		MyAALoginDetectionDirective
	],
	exports: [
		FormComponent,
		DynamicFormQuestionDateComponent
	]
})
export class FormComponentModule { }
