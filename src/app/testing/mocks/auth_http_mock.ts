import { MockBackend } from '@angular/http/testing';
import {
	Http,
	BaseRequestOptions,
} from '@angular/http';
import { AuthHttp, AuthConfig } from './../../shared/common/authHttp';

export var MOCK_HTTP_PROVIDERS = [
	MockBackend,
	BaseRequestOptions,
	{
		provide: Http,
		useFactory: (backend, options) => new Http(backend, options),
		deps: [MockBackend, BaseRequestOptions]
	},
	{
		provide: AuthHttp,
		useFactory: (http) => {
			return new AuthHttp(new AuthConfig(), http);
		},
		deps: [Http]
	}
];
