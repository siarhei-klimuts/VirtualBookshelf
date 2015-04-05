angular.module('VirtualBookshelf')
.factory('linkAccount', function (user, ngDialog) {
	var linkAccount = {};

	var PAGE_PATH = '/ui/linkAccount';

	linkAccount.show = function() {
		ngDialog.open({template: PAGE_PATH});
	};

	linkAccount.isGoogleShow = function() {
		return !user.isGoogle();
	};

	linkAccount.isTwitterShow = function() {
		return !user.isTwitter();
	};

	linkAccount.isFacebookShow = function() {
		return !user.isFacebook();
	};

	linkAccount.isAvailable = function() {
		return this.isGoogleShow() || this.isTwitterShow() || this.isFacebookShow();
	};

	return linkAccount;
});