import { Routes, RouterModule } from '@angular/router';
import { IncludedRoutes } from './pages/included/';
import { FriendsFamilyRoutes } from './pages/friends_and_family/';
import { YourDetailsRoutes } from './pages/your_details/your_details.routes';
import { BreakdownRoutes } from './pages/breakdown/index';
import { TermsConditionsRoutes } from './pages/terms_conditions/terms_conditions.routes';
import { PaymentRoutes } from './pages/payment/';
import { ConfirmationRoutes } from './pages/confirmation/';
import { RetrieveQuoteRoutes } from './pages/retrieve_quote/retrieve_quote.routes';
import { ErrorRoutes } from './pages/error/error.routes';
import { GUARD_MODULES } from './shared/directives/guards/guards_modules';


const appRoutes: Routes = [
	...IncludedRoutes,
	...FriendsFamilyRoutes,
	...YourDetailsRoutes,
	...BreakdownRoutes,
	...PaymentRoutes,
	...ConfirmationRoutes,
	...RetrieveQuoteRoutes,
	...TermsConditionsRoutes,
	...ErrorRoutes,
	{path: '**', redirectTo: '/'}
];

export const appRoutingProviders: any[] = [
	...GUARD_MODULES
];

export const routing = RouterModule.forRoot(appRoutes);
