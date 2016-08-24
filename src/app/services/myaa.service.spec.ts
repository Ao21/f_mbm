import { inject, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, HttpModule, ResponseOptions } from '@angular/http';
import { MyAAService } from './myaa.service';
import { MOCK_DATASTORE_PROVIDERS } from './../testing/mocks/datastore_mock';
import { MOCKCONSTS } from './../testing/mocks/mock_consts';
import { MOCK_HTTP_PROVIDERS } from './../testing/mocks/auth_http_mock';
import { MOCK_QUOTE_SERVICE_PROVIDERS } from './../testing/mocks/mock_quote_service';
import { MOCK_NOTIFICATION_SERVICE_PROVIDERS } from './../testing/mocks/mock_notification_service';
import { UIStore } from './../stores/uistore.store';

import { MockRouter } from './../testing/mocks/router_mock';
import { Router } from '@angular/router';
const mockRouter = new MockRouter();


describe('MyAA Service', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				...MOCK_NOTIFICATION_SERVICE_PROVIDERS,
				...MOCK_QUOTE_SERVICE_PROVIDERS,
				...MOCK_HTTP_PROVIDERS,
				{
					provide: Router,
					useValue: mockRouter
				},
				MyAAService,
				...MOCK_DATASTORE_PROVIDERS,
				UIStore

			],
			imports: [
				HttpModule
			]
		});
	});


	describe('Get User', () => {
		it('gets a user',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._GET_USER_URL);
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});
					myAA.getUser().subscribe((_response) => {
						res = _response;
					});
				}
			))
		);
	});


	describe('Save Quote', () => {
		it('should be able to call the url to save a quote',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._SAVE_QUOTE_URL);
						expect(c.request.getBody()).toEqual('{"saveMyAA":true}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});
					myAA.saveQuote().subscribe((_response) => {
						res = _response;
					});
					tick();

				}
			))
		);
	});

	describe('Registration', () => {
		it('should be able to register a user and succeed',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._REGISTER_URL);
						expect(c.request.getBody()).toEqual('{"email":"ro.brett@gmail.com","password":"password"}');
						let response = new ResponseOptions({ body: '', status: 200 });
						c.mockRespond(new Response(response));
					});
					myAA.register('ro.brett@gmail.com', 'password').subscribe((_response) => {
						res = _response;
					});
					tick();
					expect(res.status).toEqual(200);

				}
			))
		);
		it('should be able to register a user and fail',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._REGISTER_URL);
						expect(c.request.getBody()).toEqual('{"email":"ro.brett@gmail.com","password":"password"}');
						let response = new ResponseOptions({ body: '', status: 400 });
						c.mockRespond(new Response(response));
					});
					myAA.register('ro.brett@gmail.com', 'password').subscribe((_response) => {
						res = _response;
					});
					tick();
					expect(res.status).toEqual(400);
				}
			))
		);
	});


	describe('Login', () => {
		it('should be able to login',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					let t = 0;
					myAA.loginSubscription.subscribe((next) => {
						let obj: AccessToken = next;
						expect(obj.access_token).toEqual('20000000-0000-0000-0000-000000000000');
					});
					let user = 'ro.brett@gmail.com';
					let pass = 'password';
					be.connections.subscribe((c: MockConnection) => {
						if (t === 0) {
							expect(c.request.url).toEqual(`${myAA._LOGIN_URL}`);
							expect(c.request.getBody()).toEqual(`email=${user}&password=${pass}&grant_type=password`);
							let response = new ResponseOptions({ body: JSON.stringify(MOCKCONSTS.userLoginSuccess), status: 200 });
							c.mockRespond(new Response(response));
							t++;
						} else {
							expect(c.request.url).toEqual(`${myAA._GET_USER_URL}`);
						}

					});
					myAA.login(user, pass).subscribe((_response) => {
						res = _response;
					});
					tick();
				}
			))
		);
	});


	describe('Check if User Exists', () => {
		it('should call the user exists email url',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._USER_EXISTS_URL);
						expect(c.request.getBody()).toEqual('{"email":"ro.brett@gmail.com"}');
						let response = new ResponseOptions({ body: '' });
						c.mockRespond(new Response(response));
					});
					myAA.checkIfUserExists('ro.brett@gmail.com').subscribe((_response) => {
						res = _response;
					});
					tick();
				}
			))
		);

		it('should be able to map a user response from json',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					let res;
					be.connections.subscribe((c: MockConnection) => {
						expect(c.request.url).toEqual(myAA._USER_EXISTS_URL);
						expect(c.request.getBody()).toEqual('{"email":"ro.brett@gmail.com"}');
						let response = new ResponseOptions({ body: '{"login":"0"}' });
						c.mockRespond(new Response(response));
					});
					myAA.checkIfUserExists('ro.brett@gmail.com').subscribe((_response) => {
						res = _response;
					});
					tick();
					expect(myAA.mapUserResponse(res)).toEqual({ login: '0', res: 'Not Registered' });
				}
			))
		);


		it('should be able to map a not registered response',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					expect(myAA.checkIfUserExistsResponseMapping('0')).toEqual({ res: 'Not Registered' });
				}
			))
		);

		it('should be able to map a registered response',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					expect(myAA.checkIfUserExistsResponseMapping('1')).toEqual({ res: 'Registered' });
				}
			))
		);

		it('should be able to map a logged response',
			inject([MyAAService, MockBackend], fakeAsync(
				(myAA: MyAAService, be: MockBackend) => {
					expect(myAA.checkIfUserExistsResponseMapping('2')).toEqual({ res: 'Logged In' });
				}
			))
		);
	});

});
