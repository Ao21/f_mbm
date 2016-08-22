import { Subject } from 'rxjs/Rx';
export class MockReferenceService {
	getTitles() {
		return new Subject();
	}
}