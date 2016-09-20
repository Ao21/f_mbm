import { Routes } from '@angular/router';
import { MembershipYourDetailsPageComponent } from './your_details.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanDeactivateGuardGeneric } from './../../shared/directives/guards/canDeactivateGuardGeneric';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';
export const YourDetailsRoutes: Routes = [
	{
		path: 'your_details',
		component: MembershipYourDetailsPageComponent,
		canActivate: [CanActivatePurchased],
		resolve: { config: ConfigResolveGuard },
		canDeactivate: [CanDeactivateGuardGeneric]
	}
];
