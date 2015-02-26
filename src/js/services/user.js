angular.module('VirtualBookshelf')
.factory('user', function ($log, data) {
	var user = {};

	var loaded = false;
	var _dataObject = null;
	var _library = null;

	user.load = function() {
		var scope = this;

		return data.getUser().then(function (res) {
			scope.setDataObject(res.data);
			scope.setLibrary();
			loaded = true;

			$log.log('user loaded');
		});
	};

	user.logout = function() {
		return data.logout().then(function () {
			return user.load();
		});
	};

	user.setDataObject = function(dataObject) {
		_dataObject = dataObject;
	};

	user.getLibrary = function() {
		return _library;
	};

	user.setLibrary = function(libraryId) {
		_library = libraryId || window.location.pathname.substring(1);
	};

	user.getId = function() {
		return _dataObject && _dataObject.id;
	};

	user.isAuthorized = function() {
		return Boolean(_dataObject);
	};

	user.isLoaded = function() {
		return loaded;
	};

	return user;
});
