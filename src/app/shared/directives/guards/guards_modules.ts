import { CanActivateQuote } from './canActivateQuote';
import { ConfigResolveGuard } from './resolve_config_guard';
import { CanActivateConfirmation } from './canActivateConfirmation';
import { CanDeactivateGuardGeneric } from './canDeactivateGuardGeneric';
import { CanActivatePurchased } from './purchaseGuard';

export var GUARD_MODULES = [
	CanActivateQuote,
	ConfigResolveGuard,
	CanActivateConfirmation,
	CanDeactivateGuardGeneric,
	CanActivatePurchased
];
