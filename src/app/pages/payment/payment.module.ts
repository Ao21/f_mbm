import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipPaymentPageComponent } from './payment.component';
import { DirectDebitModule } from './../../components/membership/dd_form/dd_form.module';
import { CreditCardFormModule } from './../../components/membership/cc_form/cc_form.module';
import { PaymentAgreementComponent } from './../../components/membership/payment_agreement/payment_agreement';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		DirectDebitModule,
		CreditCardFormModule
	],
	providers: [],
	declarations: [
		MembershipPaymentPageComponent,
		PaymentAgreementComponent
	],
	exports: [
		MembershipPaymentPageComponent
	]
})
export class PaymentModule { };
