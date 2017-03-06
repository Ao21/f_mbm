import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { platformBrowser } from '@angular/platform-browser';
// import { AppModuleNgFactory } from './app/app.module.ngfactory';

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
	enableProdMode();
	// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
} 
platformBrowserDynamic().bootstrapModule(AppModule);

