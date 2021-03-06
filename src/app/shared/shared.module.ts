import {
	NgModule,
	ModuleWithProviders,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule, BrowserXhr } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {CORSBrowserXHR } from './common/cookieRequest';

import {
	Analytics,
	Config,
	ErrorService,
	InitService,
	MyAAService,
	NotificationService,
	PaymentService,
	QuoteService,
	ReferenceService,
	RulesEngineService
} from './../services/index';

import { AUTH_PROVIDERS } from './common/authHttp';
import { DataStore, UIStore } from './../stores/stores.modules';
import { FixedNavComponent } from './../components/membership/fixed_nav/fixed_nav';
import { FormComponentModule } from './../components/membership/form_component/form_component.module';
import { FullscreenPopupComponent } from './../components/generic/fullscreen_popup/fullscreen_popup';
import { HeaderComponent } from './../components/membership/header_component/header_component';
import { NotificationsModule } from './../components/membership/notifications/notifications.module';
import { OverViewComponent } from './../components/membership/overview/overview';
// import { QuotesListComponent } from './../components/membership/quotes_list/quotes_list';
import { SHARED_DIRECTIVES } from './directives/directives.module';
import { SHARED_PIPES } from './pipes/pipe_modules';
import { TestimonialPopupModule } from './../components/membership/testimonials_popup/p-testimonials.module';
import { QuoteListModule } from './../components/membership/quotes_list/quotes_list.module';
@NgModule({
	imports: [
		CommonModule,
		FormComponentModule,
		RouterModule,
		NotificationsModule,
		QuoteListModule,
		TestimonialPopupModule
	],
	declarations: [
		...SHARED_PIPES,
		...SHARED_DIRECTIVES,
		FixedNavComponent,
		OverViewComponent,
		HeaderComponent,
		FullscreenPopupComponent,
	],
	exports: [
		...SHARED_DIRECTIVES,
		...SHARED_PIPES,
		CommonModule,
		FixedNavComponent,
		FormComponentModule,
		FullscreenPopupComponent,
		HeaderComponent,
		HttpModule,
		NotificationsModule,
		OverViewComponent,
		ReactiveFormsModule,
		QuoteListModule,
		TestimonialPopupModule

	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				Analytics,
				AUTH_PROVIDERS,
				Config,
				ErrorService,
				InitService,
				MyAAService,
				NotificationService,
				PaymentService,
				RulesEngineService,
				QuoteService,
				ReferenceService,
				// Adds Cookie to Allow Http Requests - Maybe Remove this?
				{provide: BrowserXhr, useClass: CORSBrowserXHR}
			]
		};
	}
}
