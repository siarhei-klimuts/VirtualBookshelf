angular.module('VirtualBookshelf')
.factory('createLibrary', function (data, dialog, block, ngDialog) {
	var createLibrary = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	var TEMPLATE_ID = 'createLibraryDialog';
	
	var createLibraryDialog;

	createLibrary.show = function() {
		createLibraryDialog = ngDialog.open({
			template: TEMPLATE_ID
		});
	};

	createLibrary.getImg = function(model) {
		return model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', model) : EMPTY_IMAGE_URL;
	};

	createLibrary.create = function(model) {
		if(model) {
			block.global.start();
			data.postLibrary(model).then(function (result) {
				data.goToLibrary(result.id);
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

	return createLibrary;
});