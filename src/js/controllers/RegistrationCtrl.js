angular.module('VirtualBookshelf')
.controller('RegistrationCtrl', function (registration) {
	this.user = registration.user;

	this.showValidationError = function() {
		registration.showValidationError();
	};
});