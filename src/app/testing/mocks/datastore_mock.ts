import { Analytics } from './../../services/analytics.service';
import { Dispatcher } from './../../shared/common/dispatcher';
import { DataStore } from './../../stores/datastore.store';
import { InitService } from './../../services/init.service';
import { ReferenceService } from './../../services/reference.service';
import { MockInitService } from './mock_init_service';
import { MockReferenceService } from './mock_reference_service';

export var MOCK_DATASTORE_PROVIDERS = [
	Analytics,
	Dispatcher,
	DataStore,
	{
		provide: ReferenceService,
		useClass: MockReferenceService
	},
	{
		provide: InitService,
		useClass: MockInitService
	},
];
