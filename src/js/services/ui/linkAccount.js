angular.module('VirtualBookshelf')
.factory('linkAccount', function (user, ngDialog) {
	var linkAccount = {};

	var PAGE_PATH = '/ui/linkAccount';

	linkAccount.show = function() {
		ngDialog.open({template: PAGE_PATH});
	};

	linkAccount.isTwitterShow = function() {
		return !user.isTwitter();
	};

	linkAccount.isGoogleShow = function() {
		return !user.isGoogle();
	};

	linkAccount.isAvailable = function() {
		return this.isGoogleShow() || this.isTwitterShow();
	};

	return linkAccount;
});