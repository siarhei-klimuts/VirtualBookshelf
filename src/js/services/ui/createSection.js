import * as lib3d from 'lib3d';

angular.module('VirtualBookshelf')
.factory('createSection', function ($q, $log, user, dialog, block, ngDialog, data) {
	var createSection = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	var TEMPLATE = 'createSectionDialog';

	var createSectionDialog;

	createSection.show = function() {
		createSectionDialog = ngDialog.open({template: TEMPLATE});
	};

	createSection.getImg = function(model) {
		return model ? '/obj/sections/{model}/img.jpg'.replace('{model}', model) : EMPTY_IMAGE_URL;
	};

	createSection.create = function(model) {
		if(model) {
			var sectionData = {
				model: model,
				libraryId: lib3d.getLibrary().getId(),
				userId: user.getId()
			};

			place(sectionData);
		} else {
			dialog.openWarning('Select model, please.');
		}	
	};

	var place = function(dto) {
		block.global.start();

		$q.when(lib3d.locator.placeSection(dto)).then(function (position) {
			return saveSection(dto, position);
		}).then(function (newDto) {
			return environment.updateSection(newDto);
		}).catch(function (error) {
			dialog.openError('Can not create section because of an error.');
			$log.error(error);
		}).finally(function () {
			block.global.stop();
		});

		createSectionDialog.close();
	};

	var saveSection = function(dto, position) {
		dto.libraryId = lib3d.getLibrary().getId();
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postSection(dto);
	};

	return createSection;
});