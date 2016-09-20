import { Routes } from '@angular/router';
import { MembershipFriendsAndFamilyPageComponent } from './friends_family.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivatePurchased } from './../../shared/directives/guards/purchaseGuard';

export const FriendsFamilyRoutes: Routes = [
	{
		path: 'friends_and_family',
		canActivate: [CanActivatePurchased],
		component: MembershipFriendsAndFamilyPageComponent,
		resolve: { config: ConfigResolveGuard }
	}
];
