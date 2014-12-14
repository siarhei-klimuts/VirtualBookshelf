angular.module('VirtualBookshelf')
.factory('User', function (Data) {
	var User = {
		_dataObject: null,
		_position: null,
		_library: null,

		load: function() {
			var scope = this;

			return Data.getUser()
				.then(function (res) {
					scope.setDataObject(res.data);
					scope.setLibrary();
				});
		},
		setDataObject: function(dataObject) {
			this._dataObject = dataObject;
		},
		getLibrary: function() {
			return this._library;
		},
		setLibrary: function(libraryId) {
			this._library = libraryId || window.location.pathname.substring(1);
		},
		getId: function() {
			return this._dataObject && this._dataObject.id;
		},
		isAuthorized: function() {
			return Boolean(this._dataObject);
		}
	};

	return User;
});
