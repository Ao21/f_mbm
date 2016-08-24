import { Observable, Subject } from 'rxjs/Rx';
import { NotificationService } from './../../services/notifications.service';


const deferedSubject: Subject<any> = new Subject();

export class MockNotificationService {
	createTimedError = jasmine.createSpy('createTimedError');

	resolveSubject() {
		deferedSubject.next('hello');
	}

}

export var MOCK_NOTIFICATION_SERVICE_PROVIDERS = [
	{
		provide: NotificationService,
		useClass: MockNotificationService
	},
];
