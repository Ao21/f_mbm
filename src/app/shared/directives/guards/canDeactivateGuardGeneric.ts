import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
	canDeactivate: () => boolean | Observable<boolean>;
}

export class CanDeactivateGuardGeneric implements CanDeactivate<CanComponentDeactivate> {
	canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
		return component.canDeactivate ? component.canDeactivate() : true;
	}
}

