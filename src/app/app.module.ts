import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { IncludedModule } from './pages/included/index';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { appRoutingProviders, routing } from './app.routes';
import { FriendsFamilyModule } from './pages/friends_and_family/';
import { YourDetailsModule } from './pages/your_details/your_details.module';
import { BreakdownModule } from './pages/breakdown/';
import { PaymentModule } from './pages/payment/';
import { TermsConditionsModule } from './pages/terms_conditions/';
import { RetrieveQuoteModule } from './pages/retrieve_quote/';
import { InitService } from './services/init.service';
import { SharedModule } from './shared/shared.module';
import { ConfirmationModule } from './pages/confirmation/';
import { ErrorPageModule } from './pages/error/';
import { Dispatcher } from './shared/common/index';
import { UIStore, DataStore } from './stores/stores.modules';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		CommonModule,
		SharedModule.forRoot(),
		IncludedModule,
		FriendsFamilyModule,
		YourDetailsModule,
		BreakdownModule,
		TermsConditionsModule,
		PaymentModule,
		ErrorPageModule,
		RetrieveQuoteModule,
		ConfirmationModule,
		routing
	],
	providers: [
		Dispatcher,
		InitService,
		DataStore,
		UIStore,
		appRoutingProviders,
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {

}
