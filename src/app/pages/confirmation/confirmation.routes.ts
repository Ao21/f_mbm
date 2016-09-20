import { Routes } from '@angular/router';
import { MembershipConfirmationPageComponent } from './confirmation.component';
import { CanActivateConfirmation } from './../../shared/directives/guards/canActivateConfirmation';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';
export const ConfirmationRoutes: Routes = [
	{
		path: 'confirmation',
		component: MembershipConfirmationPageComponent,
		resolve: { config: ConfigResolveGuard },
		canActivate: [CanActivateConfirmation]
	}
];
