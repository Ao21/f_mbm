import { inject, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Response, HttpModule, ResponseOptions } from '@angular/http';
import { ReferenceService } from './reference.service';
import { MOCKCONSTS } from './../testing/mocks/mock_consts';
import { defaultConfig } from './../testing/mocks/mock_init_service';
import { MOCK_DATASTORE_PROVIDERS } from './../testing/mocks/datastore_mock';
import { MOCK_HTTP_PROVIDERS } from './../testing/mocks/auth_http_mock';
import { MockRouter } from './../testing/mocks/router_mock';
import { MOCK_NOTIFICATION_SERVICE_PROVIDERS } from './../testing/mocks/mock_notification_service';

import { Router } from '@angular/router';

const mockRouter = new MockRouter();

describe('Reference Service', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				...MOCK_NOTIFICATION_SERVICE_PROVIDERS,
				...MOCK_HTTP_PROVIDERS,
				...MOCK_DATASTORE_PROVIDERS,
				{
					provide: Router,
					useValue: mockRouter
				},
				ReferenceService,
			],
			imports: [
				HttpModule
			]
		});
	});

	describe('getTitles', () => {
		it('should be able to get a list of titles',
			inject([ReferenceService, MockBackend], fakeAsync(
				(rs: ReferenceService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(rs['_TITLE_URL']);
						let response = new ResponseOptions({
							body: '[{"id":"Unknown","value":"Unknown"},{"id":"Br","value":"Br."},{"id":"Dr","value":"Dr."},{"id":"Fr","value":"Fr."},{"id":"Miss","value":"Miss."},{"id":"Mr","value":"Mr."},{"id":"Mrs","value":"Mrs."},{"id":"Ms","value":"Ms."},{"id":"Prof","value":"Prof."},{"id":"Rev","value":"Rev."},{"id":"Sr","value":"Sr."},{"id":"Dean","value":"Dean"},{"id":"Sister","value":"Sister"},{"id":"Bishop","value":"Bishop"},{"id":"Other","value":"Other"}]',
							status: 200
						});
						c.mockRespond(new Response(response));
					});
					rs.getTitles().subscribe((_response) => {
						res = _response.json();
					});
					tick();
					expect(res[0].id).toEqual('Unknown');
					expect(res[0].value).toEqual('Unknown');
					expect(res[1].id).toEqual('Br');
					expect(res[1].value).toEqual('Br.');
					expect(res[2].id).toEqual('Dr');
					expect(res[2].value).toEqual('Dr.');
					expect(res[3].id).toEqual('Fr');
					expect(res[3].value).toEqual('Fr.');
					expect(res[4].id).toEqual('Miss');
					expect(res[4].value).toEqual('Miss.');
					expect(res[5].id).toEqual('Mr');
					expect(res[5].value).toEqual('Mr.');
					expect(res[6].id).toEqual('Mrs');
					expect(res[6].value).toEqual('Mrs.');
					expect(res[7].id).toEqual('Ms');
					expect(res[7].value).toEqual('Ms.');
					expect(res[8].id).toEqual('Prof');
					expect(res[8].value).toEqual('Prof.');
					expect(res[9].id).toEqual('Rev');
					expect(res[9].value).toEqual('Rev.');
					expect(res[10].id).toEqual('Sr');
					expect(res[10].value).toEqual('Sr.');
					expect(res[11].id).toEqual('Dean');
					expect(res[11].value).toEqual('Dean');
					expect(res[12].id).toEqual('Sister');
					expect(res[12].value).toEqual('Sister');
					expect(res[13].id).toEqual('Bishop');
					expect(res[13].value).toEqual('Bishop');
					expect(res[14].id).toEqual('Other');
					expect(res[14].value).toEqual('Other');
				}))
		);
	});


	describe('Address Services', () => {
		it('should be able to select an address', inject([ReferenceService, MockBackend], fakeAsync(
			(rs: ReferenceService, be: MockBackend) => {
				let res;
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(rs['_SELECT_ADDRESS_URL']);
					expect(c.request.getBody()).toBe('{"id":0}');
					let response = new ResponseOptions({ body: `{"addressLine1":"12 Harcourt Street","addressLine2":"","county":"Dublin 2","area":"Harcourt Street","lookups":[{"id":0,"address":"12 Harcourt Street,Dublin 2"},{"id":1,"address":"12 Harcourt Street,Dublin 2"}],"selected":{"id":0,"address":"12 Harcourt Street,Dublin 2"}}` });
					c.mockRespond(new Response(response));
				});
				rs.selectAddress(0).subscribe((_response) => {
					res = _response.json();
				});
				tick();
				expect(res.addressLine1).toEqual('12 Harcourt Street');
				expect(res.area).toEqual('Harcourt Street');
				expect(res.county).toEqual('Dublin 2');
				expect(res.selected.id).toEqual(0);
				expect(res.selected.address).toEqual('12 Harcourt Street,Dublin 2');

			})
		));

		it('should be able to check an address',
			inject([ReferenceService, MockBackend], fakeAsync(
				(rs: ReferenceService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(rs['_SELECT_ADDRESS_URL']);
					expect(c.request.getBody()).toBe('{"id":0}');
					let response = new ResponseOptions({ body: `{"addressLine1":"12 Harcourt Street","addressLine2":"","county":"Dublin 2","area":"Harcourt Street","lookups":[{"id":0,"address":"12 Harcourt Street,Dublin 2"},{"id":1,"address":"12 Harcourt Street,Dublin 2"}],"selected":{"id":0,"address":"12 Harcourt Street,Dublin 2"}}` });
					c.mockRespond(new Response(response));
				});
				})
			)
		);
	});


});
