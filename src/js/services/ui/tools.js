angular.module('VirtualBookshelf')
.factory('tools', function ($q, BookObject, SectionObject, data, selector, dialog, block, catalog, environment, preview, user) {
	var tools = {};

	var ROTATION_SCALE = 1;

	var states = {
		rotateLeft: false,
		rotateRight: false
	};

	tools.delete = function() {
		var obj = selector.getSelectedObject();

		if(obj && selector.isSelectedEditable()) {
			dialog.openConfirm('Delete selected object?').then(function () {
				block.global.start();

				deleteObject(obj).then(function () {
					selector.unselect();
					return catalog.loadBooks(user.getId());
				}).catch(function () {
					dialog.openError('Error deleting object.');
				}).finally(function () {
					block.global.stop();
				});
			});			
		}
	};

	var deleteObject = function(obj) {
		return $q.when(
			obj instanceof BookObject ? 
				deleteBook(obj.id) :
				obj instanceof SectionObject ?
					deleteSection(obj.id) :
					$q.reject('Can not delete selected object.')//TODO: test
		);
	};

	var deleteBook = function(id) {
		return data.deleteBook(id).then(function () {
			environment.removeBook(id);
		});
	};

	var deleteSection = function(id) {
		return data.deleteSection(id).then(function () {
			environment.removeSection(id);
		});
	};

	tools.rotateLeft = function() {
		states.rotateLeft = true;
	};

	tools.rotateRight = function() {
		states.rotateRight = true;
	};

	tools.stop = function() {
		states.rotateLeft = false;
		states.rotateRight = false;
	};

	tools.update = function() {
		if(states.rotateLeft) {
			rotate(ROTATION_SCALE);
		} else if(states.rotateRight) {
			rotate(-ROTATION_SCALE);
		}
	};

	var rotate = function(scale) {
		if(preview.isActive()) {
			preview.rotate(scale);
		} else {
			var obj = selector.getSelectedObject();
			obj.rotate(scale);
		}
	};

	return tools;
});