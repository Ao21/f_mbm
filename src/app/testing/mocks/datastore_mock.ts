import { DataStore } from './../../stores/datastore.store';
import { Dispatcher } from './../../shared/common/dispatcher';
import { MockInitService } from './mock_init_service';
import { InitService } from './../../services/init.service';
import { ReferenceService } from './../../services/reference.service';
import { MockReferenceService } from './mock_reference_service';
import { Analytics } from './../../services/analytics.service';
export var MOCK_DATASTORE_PROVIDERS = [
	DataStore,
	Dispatcher,
	Analytics,
	{
		provide: InitService,
		useClass: MockInitService
	},
	{
		provide: ReferenceService,
		useClass: MockReferenceService
	},
]