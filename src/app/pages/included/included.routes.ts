import { Routes } from '@angular/router';
import { MembershipIncludedPageComponent } from './included.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivatePurchased} from './../../shared/directives/guards/purchaseGuard';


export const IncludedRoutes: Routes = [
	{
		path: '',
		component: MembershipIncludedPageComponent,
		resolve: { config: ConfigResolveGuard },
		canActivate: [CanActivatePurchased],
	}
];
