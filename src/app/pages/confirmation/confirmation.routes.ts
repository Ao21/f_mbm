import { Routes } from '@angular/router';
import { MembershipConfirmationPageComponent } from './confirmation.component';
import { CanActivateConfirmation } from './../../shared/directives/guards/canActivateConfirmation';
export const ConfirmationRoutes: Routes = [
	{ path: 'confirmation', component: MembershipConfirmationPageComponent, canActivate: [CanActivateConfirmation] }
];
