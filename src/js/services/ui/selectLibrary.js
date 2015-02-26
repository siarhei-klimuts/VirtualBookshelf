angular.module('VirtualBookshelf')
.factory('selectLibrary', function (data, environment) {
	var selectLibrary = {};

	selectLibrary.list = [];
	selectLibrary.visible = false;

	selectLibrary.isShow = function() {
		return this.visible;
	};

	selectLibrary.show = function() {
		this.visible = true;
	};

	selectLibrary.hide = function() {
		this.visible = false;
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