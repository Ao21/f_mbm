import { inject, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, HttpModule, ResponseOptions } from '@angular/http';
import { PaymentService } from './payment.service';
import { MOCKCONSTS } from './../testing/mocks/mock_consts';
import { MOCK_HTTP_PROVIDERS } from './../testing/mocks/auth_http_mock';
import { Analytics } from './analytics.service';
import { MockRouter } from './../testing/mocks/router_mock';
import { Router } from '@angular/router';

const mockRouter = new MockRouter();

describe('Payment Service', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				Analytics,
				...MOCK_HTTP_PROVIDERS,
				{
					provide: Router,
					useValue: mockRouter
				},
				PaymentService,
			],
			imports: [
				HttpModule
			]
		});
	});

	describe('Update Payment Type', () => {
		it('updates the payment type',
			inject([PaymentService, MockBackend], fakeAsync(
				(ps: PaymentService, be: MockBackend) => {
					let res;
					let paymentType = 'Card';
					let frequency = 'monthly';
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(ps.UPDATE_PAYMENT_URL);
						expect(c.request.getBody()).toEqual('{"type":"Card","frequency":"monthly"}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});

					ps.updatePaymentType(paymentType, frequency).subscribe((_response) => {
						res = _response;
					});
				}
			)));
	});

	describe('Confirm Terms and Conditions', () => {
		it('confirms all terms and conditions',
			inject([PaymentService, MockBackend], fakeAsync(
				(ps: PaymentService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(ps.TOKEN_AGREEMENT);
						expect(c.request.getBody()).toEqual('{"all":true}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});
					ps.confirmTermsConditions(true).subscribe((_response) => {
						res = _response;
					});
				}))
		);
		it('confirms a single terms and conditions',
			inject([PaymentService, MockBackend], fakeAsync(
				(ps: PaymentService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(ps.TOKEN_AGREEMENT);
						expect(c.request.getBody()).toEqual('{"all":false}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});
					ps.confirmTermsConditions(false).subscribe((_response) => {
						res = _response;
					});
				}))
		);
	});


	describe('Validate Bank Details', () => {
		it('should be able to validate an account',
			inject([PaymentService, MockBackend], fakeAsync(
				(ps: PaymentService, be: MockBackend) => {
					let res: BankValidation;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(ps.BANK_URL);
						expect(c.request.getBody()).toEqual('{"accountName":"Sixto Cantolla","BIC":"BOFIIE2DXXX","IBAN":"IE38BOFI90003344938316"}');
						let response = new ResponseOptions({
							body: '{"sortCode":"90-00-33","accountNumber":"44938316","BIC":"BOFIIE2DXXX","IBAN":"IE38BOFI90003344938316","accountName":"Sixto Cantolla","bankName":"THE GOVERNOR AND COMPANY OF THE BANK OF IRELAND","bankAddress":"40 MESPIL ROAD, DUBLIN","valid": "true","accepted":"RklMUDYxMDAwMDAx"}'
						});
						c.mockRespond(new Response(response));
					});
					ps.validateBankDetails(MOCKCONSTS.validateBankDetailsAttempt).subscribe((_response) => {
						res = _response.json();
					});
					tick(1000);
					expect(res.sortCode).toEqual('90-00-33');
					expect(res.valid).toEqual('true');
					expect(res.bankAddress).toEqual('40 MESPIL ROAD, DUBLIN');
					expect(res.accountNumber).toEqual('44938316');
					expect(res.accountName).toEqual('Sixto Cantolla');
					expect(res.accepted).toEqual('RklMUDYxMDAwMDAx');
					expect(res.IBAN).toEqual('IE38BOFI90003344938316');
					expect(res.BIC).toEqual('BOFIIE2DXXX');
				}))
		);
	});

	describe('Covert a Quote', () => {
		it('should be able to convert a quote',
			inject([PaymentService, MockBackend], fakeAsync(
				(ps: PaymentService, be: MockBackend) => {
					let res: QuoteConverted;
					let qRef = 'RklMUDYxMDAwMDAx';
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(ps.CONVERT_QUOTE_URL + qRef);
						let response = new ResponseOptions({ body: `{"reference":"WWM1000100","dateStart":"15/08/2016","members":{"adults":{"0":{"title":"Mr","firstName":"Ronan","surname":"Brett","membershipNumber":"60606060606"},"1":{"firstName":"Kelan","surname":"O'Connor"}}}}` });
						c.mockRespond(new Response(response));
					});
					ps.convertQuote(qRef).subscribe((_response) => {
						res = _response.json();
					});
					tick();
					expect(res.dateStart).toEqual('15/08/2016');
					expect(res.members.adults['0'].firstName).toEqual('Ronan');
					expect(res.members.adults['0'].surname).toEqual('Brett');
					expect(res.members.adults['0'].title).toEqual('Mr');
					expect(res.members.adults['0'].membershipNumber).toEqual('60606060606');
					expect(res.reference).toEqual('WWM1000100');
				}))
		);
	})



});
