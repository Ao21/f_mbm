import { inject, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NotificationService } from './notifications.service';

describe('Notification Service', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				NotificationService
			],
			imports: [
			]
		});
	});

	describe('Creating Notifications', () => {

		it('should be able to create a default notification',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					ns['newNotifications'].subscribe((notification: AANotification) => {
						expect(notification.id).toBe('nID1');
						expect(notification.text).toBe('Test Notification');
						expect(notification.options.display).toBe('default');
					});
					ns.createNotification('Test Notification');
					tick();
				}))
		);

		it('should be able to create an error notification',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					ns['newNotifications'].subscribe((notification: AANotification) => {
						expect(notification.id).toBe('nID1');
						expect(notification.type).toEqual('error');
						expect(notification.text).toBe('Test Error Notification');
						expect(notification.options.display).toBe('instant');
					});
					ns.createError('Test Error Notification');
					tick();
				}))
		);

		it('should be able to create a timed error notification',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					ns['newNotifications'].subscribe((notification: AANotification) => {
						expect(notification.id).toBe('nID1');
						expect(notification.type).toEqual('error');
						expect(notification.text).toBe('Test Timed Error Notification');
						expect(notification.options.display).toBe('instant');
						expect(notification.options.timer).toBe(50);
					});
					ns.createTimedError('Test Timed Error Notification', 50);
					tick();
				}))
		);

		it('should be able to create a login notification',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					let email = 'ro.brett@gmail.com';
					ns['newNotifications'].subscribe((notification: AANotification) => {
						expect(notification.id).toBe('nID1');
						expect(notification.type).toEqual('login');
						expect(notification.text).toBe(email);
						expect(notification.options.display).toBe('instant');
						expect(notification.options.myAAStatus).toBe(false);
					});
					ns.createLogin(email);
					tick();
				}))
		);

		it('should be able to create a confirmation notification',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					ns['newNotifications'].subscribe((notification: AANotification) => {
						expect(notification.id).toBe('nID1');
						expect(notification.type).toEqual('confirmation');
						expect(notification.text).toBe('Test Confirmation Notification');
						expect(notification.options.display).toBe('instant');
						expect(notification.options.btnText).toBe('Button Text');
						expect(notification.options.link).toBe('http://www.google.com');
						expect(notification.options.promise).toEqual(ns['confirmationNotification']);
					});
					ns.createConfirmationNotification(
						'Test Confirmation Notification',
						'Button Text',
						'http://www.google.com');
					tick();
				}))
		);


	});

	describe('Getting Notification', () => {
		it('should be able to get the next notification', inject([NotificationService], fakeAsync(
			(ns: NotificationService) => {
				ns.createNotification('Test 1');
				ns.createNotification('Test 2');
				expect(ns.getNextNotification().text).toEqual('Test 1');
				expect(ns.getNextNotification().text).toEqual('Test 2');
			})
		));
	});

	describe('Clearing Notifications', () => {
		it('should be able to trigger a clear notifications event',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					ns['clearNotificationsObs'].subscribe((next) => {
						expect(next).toBeDefined();
					});
					ns.clearNotifications();
				})
			)
		);

		it('should be able to clear the last error message',
			inject([NotificationService], fakeAsync(
				(ns: NotificationService) => {
					expect(ns['lastErrMsg']).toBeNull();
					ns.createError('Test Error');
					expect(ns['lastErrMsg']).toEqual('Test Error');
					ns.clearLastErrorMsg();
					expect(ns['lastErrMsg']).toBeNull();
				})
			)
		);
	})
});
