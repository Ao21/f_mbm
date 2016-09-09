import {
	NgModule,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ShowErrorComponent } from './show_error/show_error';
import { ErrorButtonComponent } from './error_button/error_button';
import { TabGroupModule } from './tab/tab_group.module';
import { SelectorGroupModule } from './selector/selector_group.module';
import { AccordianModule } from './accordian/accordian.module';
import { LoadingSpinnerComponent } from './loading_spinner/loading_spinner';
@NgModule({
	imports: [
		CommonModule,
		TabGroupModule,
		SelectorGroupModule,
		AccordianModule
	],
	declarations: [
		ErrorButtonComponent,
		ShowErrorComponent,
		LoadingSpinnerComponent
	],
	exports: [
		ErrorButtonComponent,
		TabGroupModule,
		SelectorGroupModule,
		AccordianModule,
		ShowErrorComponent,
		LoadingSpinnerComponent
	]
})
export class AtomicComponentsModule {}
