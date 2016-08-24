import { Routes } from '@angular/router';
import { MembershipPaymentPageComponent } from './payment.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanDeactivateGuardGeneric } from './../../shared/directives/guards/canDeactivateGuardGeneric';

export const PaymentRoutes: Routes = [
	{ path: 'payment', component: MembershipPaymentPageComponent, canDeactivate: [CanDeactivateGuardGeneric], resolve: { config: ConfigResolveGuard} }
];
