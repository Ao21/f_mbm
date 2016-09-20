import { Routes } from '@angular/router';
import { MembershipTermsConditionsComponent } from './terms_conditions.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';

export const TermsConditionsRoutes: Routes = [
	{
		path: 'terms_and_conditions',
		component: MembershipTermsConditionsComponent,
		canActivate: [CanActivatePurchased],
		resolve: { config: ConfigResolveGuard }
	},
	{
		path: 'terms_and_conditions/:type',
		canActivate: [CanActivatePurchased],
		component: MembershipTermsConditionsComponent,
		resolve: { config: ConfigResolveGuard }
	},
];
