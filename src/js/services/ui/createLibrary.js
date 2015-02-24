angular.module('VirtualBookshelf')
.factory('createLibrary', function (Data, environment) {
	var createLibrary = {};
	
	createLibrary.list = [];
	createLibrary.model = null;
	createLibrary.visible = false;

	createLibrary.isShow = function() {
		return this.visible;
	};

	createLibrary.show = function() {
		this.visible = true;
	};

	createLibrary.hide = function() {
		this.visible = false;
	};

	createLibrary.getImg = function() {
		return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : null;
	};

	createLibrary.create = function() {
		if(this.model) {
			Data.postLibrary(this.model).then(function (result) {
				environment.goToLibrary(result.id);
			}).catch(function () {
				//TODO: show an error
			});
		}
	};

	return createLibrary;
});