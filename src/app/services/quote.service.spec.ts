import { inject, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Response, HttpModule, ResponseOptions } from '@angular/http';
import { QuoteService } from './quote.service';
import { MOCKCONSTS } from './../testing/mocks/mock_consts';
import { defaultConfig } from './../testing/mocks/mock_init_service';
import { MOCK_DATASTORE_PROVIDERS } from './../testing/mocks/datastore_mock';
import { MOCK_HTTP_PROVIDERS } from './../testing/mocks/auth_http_mock';
import { MockRouter } from './../testing/mocks/router_mock';
import { UIStore } from './../stores/uistore.store';
import { DataStore } from './../stores/datastore.store';
import { Router } from '@angular/router';

const mockRouter = new MockRouter();

describe('QuoteService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				...MOCK_HTTP_PROVIDERS,
				...MOCK_DATASTORE_PROVIDERS,
				{
					provide: Router,
					useValue: mockRouter
				},
				UIStore,
				QuoteService,
			],
			imports: [
				HttpModule
			]
		});
	});


	describe('updateProposal', () => {

		it('updates the proposal',
			inject([QuoteService, MockBackend], fakeAsync(
				(qs: QuoteService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(qs.UPDATE_PROPOSAL_URL);
						expect(c.request.getBody()).toEqual('{"email":"ro.brett@gmail.com","firstName":"Ronan","surname":"Brett"}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});

					qs.updateProposal(MOCKCONSTS.proposalItem).subscribe((_response) => {
						res = _response;
					});

					tick();
				}))
		);
	});

	describe('updateCover', () => {

		it('updates the cover with a cover level to true',
			inject([QuoteService, MockBackend], fakeAsync(
				(qs: QuoteService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.getBody()).toEqual('{"active":true}');
						expect(c.request.url).toEqual(qs.UPDATE_COVER_URL + MOCKCONSTS.coverLevel.name);
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});

					qs.updateCover(MOCKCONSTS.coverLevel, true).subscribe((_response) => {
						res = _response;
					});

					tick();
				}))
		);

		it('updates the cover with a breakdown item to be true',
			inject([QuoteService, MockBackend], fakeAsync(
				(qs: QuoteService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(qs.UPDATE_COVER_URL + MOCKCONSTS.breakdownItem.name);
						expect(c.request.getBody()).toEqual('{"active":true}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});

					qs.updateCover(MOCKCONSTS.breakdownItem, true).subscribe((_response) => {
						res = _response;
					});

					tick();
				}))
		);
	});


	describe('Member Methods', () => {
		it('should be able to add a member', inject([QuoteService, MockBackend], fakeAsync(
			(qs: QuoteService, be: MockBackend) => {
				let res;
				let mbIndex = 0;
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(qs.UPDATE_MEMBER_URL + mbIndex);
					expect(c.request.getBody()).toEqual('{"dateOfBirth":"29/12/1987","firstName":"Ronan","surname":"Brett"}');
					let response = new ResponseOptions({ body: '' });
					c.mockRespond(new Response(response));
				});
				qs.addMember(mbIndex, MOCKCONSTS.additionalMember).subscribe((_response) => {
					res = _response;
				});
				tick();
			})
		));

		it('should be able to remove a member', inject([QuoteService, MockBackend], fakeAsync(
			(qs: QuoteService, be: MockBackend) => {
				let res;
				let mbIndex = 0;
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(qs.UPDATE_MEMBER_URL + mbIndex);
					let response = new ResponseOptions({ body: '' });
					c.mockRespond(new Response(response));
				});
				qs.removeMember(mbIndex).subscribe((_response) => {
					res = _response;
				});
				tick();
			})
		));
	});

	describe('Get Quote', () => {
		it('should be able to get a quote',
			inject([QuoteService, MockBackend, UIStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, uiStore: UIStore) => {
				let res;
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(qs.GET_QUOTE_URL);
					let response = new ResponseOptions({ body: '' });
					c.mockRespond(new Response(response));
				});

				qs.getQuote().subscribe((_response) => {
					res = _response;
					expect(uiStore.get(['UIOptions', 'isSaveQuoteVisible'])).toEqual('visible');
				});
			}))
		);
	});




	describe('Remove Breakdown Item', () => {

		beforeEach(inject([DataStore], (ds: DataStore) => {
			ds.update(['config', 'members', MOCKCONSTS.defaultMember.type, MOCKCONSTS.defaultMember.index], MOCKCONSTS.defaultMember);
			ds.toggleCoverLevel(2, true);
		}));

		it('should be able to remove a member', inject([QuoteService, MockBackend, DataStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, ds: DataStore) => {
				let mbIdx = 2;
				let t = 0;
				expect(ds.get(['config', 'members', MOCKCONSTS.defaultMember.type, MOCKCONSTS.defaultMember.index])).toBeDefined();
				be.connections.subscribe((c: MockConnection) => {
					if (t === 0) {
						expect(c.request.url).toEqual(qs.UPDATE_MEMBER_URL + mbIdx);
						t++;
					} else {
						expect(c.request.url).toEqual(qs.GET_QUOTE_URL);
						expect(ds.get(['config', 'members', MOCKCONSTS.defaultMember.type, MOCKCONSTS.defaultMember.index])).toBeUndefined();
					}
				});
				qs.removeBreakdownItem(MOCKCONSTS.breakdownItemMember);
			})
		));

		it('should be able to remove a cover level', inject([QuoteService, MockBackend, DataStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, ds: DataStore) => {
				let t = 0;
				expect(ds.get(['config', 'coverLevel', 2])).toBeTruthy();
				be.connections.subscribe((c: MockConnection) => {
					if (t === 0) {
						expect(c.request.url).toEqual(qs.UPDATE_COVER_URL + MOCKCONSTS.breakdownItem.name);
						t++;
					} else {
						expect(c.request.url).toEqual(qs.GET_QUOTE_URL);
						expect(ds.get(['config', 'coverLevel', 2])).toBeFalsy();
					}
				});
				qs.removeBreakdownItem(MOCKCONSTS.breakdownItem);
			})
		));
	});

	describe('Set Quote', () => {
		it('should be able to set an expired quote and navigate', inject([QuoteService, MockBackend, UIStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, uiStore: UIStore) => {
				qs.setQuote(defaultConfig, true, false);
				tick(1000);
				expect(mockRouter.navigate.calls.mostRecent().args).toEqual([['/']]);
			}))
		);

		it('should be able to set an unexpired quote and navigate', inject([QuoteService, MockBackend, UIStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, uiStore: UIStore) => {
				qs.setQuote(defaultConfig, false, false);
				tick(1000);
				expect(uiStore.get(['UIOptions', 'isSaveQuoteVisible'])).toEqual('hidden');
				expect(mockRouter.navigate.calls.mostRecent().args).toEqual([['breakdown']]);
			}))
		);
	});

	describe('Retrieve Quote', () => {
		it('should be able to retrieve a quote', inject([QuoteService, MockBackend, UIStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, uiStore: UIStore) => {
				let res;
				let qRef = 'WM10001010';
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(qs.RETRIEVE_QUOTE_URL + qRef);
					let response = new ResponseOptions({ body: '' });
					c.mockRespond(new Response(response));
				});

				qs.retrieveQuote(qRef).subscribe((_response) => {
					res = _response;
				});
			}))
		);
		it('should be able to retrieve a web reference quote', inject([QuoteService, MockBackend, UIStore], fakeAsync(
			(qs: QuoteService, be: MockBackend, uiStore: UIStore) => {
				let res;
				let qRef = 'WM10001010';
				let DOB = '29/12/1987';
				be.connections.subscribe((c: MockConnection) => {
					expect(c.request.url).toEqual(qs.RETRIEVE_QUOTE_URL + qRef + '&dateOfBirth=' + DOB);
					let response = new ResponseOptions({ body: '' });
					c.mockRespond(new Response(response));
				});

				qs.retrieveQuoteWeb(qRef, DOB).subscribe((_response) => {
					res = _response;
				});
			}))
		);
	});

});
