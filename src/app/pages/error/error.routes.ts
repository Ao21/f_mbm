import { Routes } from '@angular/router';
import { MembershipErrorPageComponent } from './error.component';

export const ErrorRoutes: Routes = [
	{ path: 'error', component: MembershipErrorPageComponent },
	{ path: 'error/:errCode', component: MembershipErrorPageComponent },
];
