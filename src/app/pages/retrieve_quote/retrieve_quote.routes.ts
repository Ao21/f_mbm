import { Routes } from '@angular/router';
import { MembershipRetrieveQuoteComponent } from './retrieve_quote.component';

export const RetrieveQuoteRoutes: Routes = [
	{ path: 'retrieve_quote/myaa/:myaa', component: MembershipRetrieveQuoteComponent},
	{ path: 'retrieve_quote/:ref', component: MembershipRetrieveQuoteComponent},
	{ path: 'retrieve_quote/:ref/:dob', component: MembershipRetrieveQuoteComponent},
	{ path: 'retrieve_quote', component: MembershipRetrieveQuoteComponent},
];
