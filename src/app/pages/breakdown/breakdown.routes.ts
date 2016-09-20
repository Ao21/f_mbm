import { Routes, CanActivate } from '@angular/router';
import { MembershipPriceBreakdownPageComponent } from './breakdown.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivateQuote } from './../../shared/directives/guards/canActivateQuote';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';

export const BreakdownRoutes: Routes = [
	{
		path: 'breakdown',
		component: MembershipPriceBreakdownPageComponent,
		canActivate: [CanActivatePurchased, CanActivateQuote ]
	}
];
