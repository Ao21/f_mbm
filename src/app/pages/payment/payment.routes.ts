import { Routes } from '@angular/router';
import { MembershipPaymentPageComponent } from './payment.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanDeactivateGuardGeneric } from './../../shared/directives/guards/canDeactivateGuardGeneric';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';

export const PaymentRoutes: Routes = [
	{
		path: 'payment',
		component: MembershipPaymentPageComponent,
		canActivate: [CanActivatePurchased],
		canDeactivate: [CanDeactivateGuardGeneric],
		resolve: { config: ConfigResolveGuard }
	}
];
