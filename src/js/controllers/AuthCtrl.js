angular.module('VirtualBookshelf')
.controller('AuthCtrl', function (authorization) {
	this.loginGoogle = function() {
		authorization.google();
	};

	this.loginTwitter = function() {
		authorization.twitter();
	};

	this.loginFacebook = function() {
		authorization.facebook();
	};
});