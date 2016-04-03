import * as lib3d from 'lib3d';
import * as lib3dObjects from 'lib3d-objects';

angular.module('VirtualBookshelf')
.factory('createSection', function ($q, $log, user, dialog, block, ngDialog, data) {
	var createSection = {};
	
	var TEMPLATE = 'createSectionDialog';

	var createSectionDialog;

	createSection.show = function() {
		createSectionDialog = ngDialog.open({template: TEMPLATE});
	};

	createSection.getImg = function(model) {
		return model ? 
			`${data.OBJECTS_PATH}/${lib3dObjects[model].img}` : 
			data.EMPTY_IMAGE_URL;
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

	function place(dto) {
		var position = lib3d.locator.placeSection(lib3d.getLibrary(), dto);

		if (!position) {
			dialog.openError('There is no free space.');
			return;
		}
		
		block.global.start();
		saveSection(dto, position).then(function (newDto) {
			return updateSection(newDto);
		}).catch(function (error) {
			dialog.openError('Can not create section because of an error.');
			$log.error(error);
		}).finally(function () {
			block.global.stop();
		});

		createSectionDialog.close();
	}

	function saveSection(dto, position) {
		dto.libraryId = lib3d.getLibrary().getId();
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postSection(dto);
	}

	function updateSection(dto) {
		var library = lib3d.getLibrary();

        library.removeSection(dto.id);
	    if(dto.libraryId == library.getId()) {
	    	let section = lib3d.factory.createSection(dto);
			library.addSection(section);
	    }
	}

	return createSection;
});