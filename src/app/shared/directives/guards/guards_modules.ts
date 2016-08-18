import { CanActivateQuote } from './canActivateQuote';
import { ConfigResolveGuard } from './resolve_config_guard';
import { CanActivateConfirmation } from './canActivateConfirmation';
import { CanComponentDeactivate, CanDeactivateGuard} from './canDeactivateYourDetails';
export var GUARD_MODULES = [
	CanActivateQuote,
	ConfigResolveGuard,
	CanDeactivateGuard,
	CanActivateConfirmation
];
