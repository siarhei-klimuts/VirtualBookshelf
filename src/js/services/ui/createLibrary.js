angular.module('VirtualBookshelf')
.factory('createLibrary', function (data, environment, dialog, block, ngDialog) {
	var createLibrary = {};
	var createLibraryDialog;
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	
	createLibrary.list = null;
	createLibrary.model = null;

	createLibrary.show = function() {
		createLibraryDialog = ngDialog.open({
			template: '/ui/createLibrary'
		});
	};

	createLibrary.getImg = function() {
		return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : EMPTY_IMAGE_URL;
	};

	createLibrary.create = function() {
		if(this.model) {
			block.global.start();
			data.postLibrary(this.model).then(function (result) {
				environment.goToLibrary(result.id);
			}).catch(function () {
				dialog.openError('Can not create library because of an error.');
			}).finally(function () {
				block.global.stop();
			});

			createLibraryDialog.close();
		} else {
			dialog.openWarning('Select library, please.');
		}

	};

	data.common.then(function (commonData) {
		createLibrary.list = commonData.libraries;
	});

	return createLibrary;
});