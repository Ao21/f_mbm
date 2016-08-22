import { Router } from '@angular/router';
export class MockRouter {
	navigate = jasmine.createSpy('navigate');
}

export var MOCK_ROUTER_PROVIDERS = [
	{
		provide: Router,
		useClass: MockRouter
	},
];
