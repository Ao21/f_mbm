import { Injectable } from '@angular/core';
import { NotificationService } from './notifications.service';
import { Router } from '@angular/router';
import { Analytics } from './analytics.service';
import { Http } from '@angular/http';
import { CONSTS } from './../constants';

@Injectable()
export class ErrorService {
	baseUrl: string = CONSTS.getBaseUrlWithContext() + CONSTS.CONFIG;

	constructor(
		private router: Router,
		private http: Http,
		private notificationService: NotificationService,
		private analytics: Analytics
	) { }

	clearErrorNotifications() {
		this.notificationService.clearNotifications();
	}

	errorHandler(error: ErrorObject) {
		this.analytics.triggerErrorEvent(
			{
				service: error.service,
				err: error.err
			});
	}

	errorHandlerWithNotification(err, errorObject: ErrorObject) {
		if (err.status === 409) {
			return this.resetSession(err);
		}
		this.notificationService.createError(errorObject.notification);
		this.analytics.triggerErrorEvent(
			{
				service: errorObject.service,
				err: errorObject.err
			});
	}

	errorHandlerWithTimedNotification(error: ErrorObject, time) {
		this.notificationService.createTimedError(error.notification, time);
		this.analytics.triggerErrorEvent(
			{
				service: error.service,
				err: error.err
			});
	}

	errorHandlerWithConfirmationNotification(error: ErrorObject, text, btnText, link) {
		this.notificationService.createConfirmationNotification(text, btnText, link);
	}

	resetSession(err) {
		if (err.status === 409) {
			this.http.get(this.baseUrl, { withCredentials: true }).map(res => res.json()).subscribe((next) => {
				this.router.navigateByUrl('error/sessionExpired');
			});
		}
	}

	/**
	 * 	The Error messages available for the Error Page
	 * 	If there is no error messaging code it will return the default error message
	 * 	@param string code - Error Code
	 * 	@return ErrorMessage
	 */
	retrieveServiceError(code?: string): ErrorMessage {
		let message = {
			'default': {
				message: 'Sorry, an error has occured, please click below to restart your journey',
				link: '/',
				linkText: 'Restart Journey.'
			},
			'quoteRejection': {
				message: `Unfortunately based on the information that you've provided, 
				we are unable to provide you with a quote for AA Membership at this time<br><br>
				If you would like to ring us to discuss this further please call <strong>0818 227 228</strong>`
			},
			'sessionExpired': {
				message: `Sorry your session has expired, please click below to restart your journey`,
				link: '/',
				linkText: 'Restart Journey',
				resetJourney: true
			}
		};


		if (message[code]) {
			this.analytics.triggerErrorEvent({
				service: 'error-page',
				err: code
			});
			return message[code];
		} else {
			return message['default'];
		}
	}

	/**
	 * 	The Error messages available for the Error Button
	 * 	If there is no error messaging code it will return the default error message
	 * 	@param string code - Error Code
	 * 	@param string label - Form Field Label
	 * 	@return ErrorMessage
	 */
	retrieveButtonError(code?: string, label?: string): ErrorMessage {
		let message = {
			'required': { message: 'You must complete all fields', image: '' },
			'underage': { message: 'This user is too young', image: '' },
			'overage': { message: `This user is too old`, image: '' },
			'invalidDOB': { message: 'Please enter a valid date', image: '' },
			'invalidPassword': { message: 'Sorry, these details were incorrect, please try again.', image: '' },
			'invalidEmail': { message: 'Please enter a valid email address', image: '' }
		};
		if (message[code]) {
			return message[code];
		} else {
			return null;
		}
	}

	/**
	 * 	The Error messages available for the Form Input Fields
	 * 	@param string code - Error Code
	 * 	@param string label - Form Field Label
	 * 	@return ErrorMessage
	 */
	retrieveFieldError(code: string, label?: string): ErrorMessage {
		let message = {
			'invalidPasswordConf': { message: 'Please check your password to make sure it matches' },
			'invalidSpecial': { message: 'This field does not accept special characters' },
			'invalidOnlyMonths': { message: 'Please enter a valid month' },
			'invalidBIC': { message: 'Please enter a valid BIC' },
			'invalidIBAN': { message: 'Please enter a valid IBAN' },
			'invalidCCV': { message: 'Please enter a valid CCV' },
			'invalidSortCode': { message: 'Please enter a valid Sort Code' },
			'invalidOnlyNumber': { message: 'You can only enter numbers here' },
			'invalidEmail': { message: `Please enter a valid email address`, image: '' },
			'invalidPhoneNumber': { message: `Please enter a valid phone number `, image: '' },
			'invalidPassword': { message: 'Sorry, these details were incorrect, please try again.', image: '' },
			'required': { message: `${label} is required`, image: '' },
			'underage': { message: 'This user is too young', image: '' },
			'overage': { message: 'This user is too old', image: '' },
			'invalidChoice': { message: 'Is not a valid choice', image: '' },
			'invalidDOB': { message: `Please enter a valid date`, image: '' },
			'invalidAccount': { message: 'Please enter a valid account number' },
			'invalidCreditCard': { message: 'Please enter a valid credit card number', image: '' }
		};
		return message[code];
	}
}
