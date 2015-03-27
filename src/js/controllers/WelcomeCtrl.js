angular.module('VirtualBookshelf')
.controller('WelcomeCtrl', function (authorization, selectLibrary, createLibrary, environment) {
	var closed = false;

	this.isShowAuthorization = function() {
		return authorization.isShow();
	};
	
	this.isShowSelectLibrary = function() {
		return selectLibrary.isAvailable() && !selectLibrary.isUserLibrary();
	};

	this.isShowCreateLibrary = function() {
		return !this.isShowAuthorization() && !selectLibrary.isAvailable();
	};

	this.isShow = function() {
		return !closed && (this.isShowAuthorization() || this.isShowCreateLibrary() || this.isShowSelectLibrary());
	};

	this.isLoaded = function() {
		return environment.getLoaded();
	};

	this.showLoginDialog = function() {
		authorization.show();
	};

	this.showSelectLibraryDialog = function() {
		selectLibrary.show();
	};

	this.showCreateLibraryDialog = function() {
		createLibrary.show();
	};

	this.close = function() {
		closed = true;
	};
});