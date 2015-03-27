angular.module('VirtualBookshelf')
.factory('createLibrary', function (data, environment, ngDialog) {
	var createLibrary = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	
	createLibrary.list = [];
	createLibrary.model = null;

	createLibrary.show = function() {
		ngDialog.openConfirm({
			template: '/ui/createLibrary'
		});
	};

	createLibrary.getImg = function() {
		return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : EMPTY_IMAGE_URL;
	};

	createLibrary.create = function() {
		if(this.model) {
			data.postLibrary(this.model).then(function (result) {
				environment.goToLibrary(result.id);
			}).catch(function () {
				//TODO: show an error
			});
		}
	};

	return createLibrary;
});