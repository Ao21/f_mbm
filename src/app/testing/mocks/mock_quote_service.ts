import { Observable, Subject } from 'rxjs/Rx';
import { QuoteService } from './../../services/quote.service';


const deferedSubject: Subject<any> = new Subject();

export class MockQuoteService {
	retrieveQuoteList = jasmine.createSpy('retrieveQuoteList').and.returnValue(new Subject());

	resolveSubject() {
		deferedSubject.next('hello');
	}

}

export var MOCK_QUOTE_SERVICE_PROVIDERS = [
	{
		provide: QuoteService,
		useClass: MockQuoteService
	},
]