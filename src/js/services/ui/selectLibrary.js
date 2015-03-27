angular.module('VirtualBookshelf')
.factory('selectLibrary', function (data, environment, user, ngDialog) {
	var selectLibrary = {};

	selectLibrary.list = [];

	selectLibrary.show = function() {
		ngDialog.openConfirm({
			template: '/ui/selectLibrary'
		});
	};

	selectLibrary.isAvailable = function() {
		return selectLibrary.list.length > 0;
	};

	selectLibrary.isUserLibrary = function() {
		return environment.library && environment.library.dataObject.userId === user.getId();
	};

	selectLibrary.updateList = function() {
		var scope = this;

	    var promise = data.getLibraries().then(function (res) {
            scope.list = res.data;
    	});

    	return promise;
	};

	selectLibrary.go = environment.goToLibrary;

	return selectLibrary;
});