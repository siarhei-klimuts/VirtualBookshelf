angular.module('VirtualBookshelf')
.factory('uiTools', function (selector) {
	var uiTools = {};

	var ROTATION_SCALE = 1;

	var states = {
		rotateLeft: false,
		rotateRight: false
	};

	uiTools.isShow = function() {
		return selector.isSelectedSection();
	};

	uiTools.isRotatable = function() {
		return selector.isSelectedSection();
	};

	uiTools.rotateLeft = function() {
		states.rotateLeft = true;
	};

	uiTools.rotateRight = function() {
		states.rotateRight = true;
	};

	uiTools.stop = function() {
		states.rotateLeft = false;
		states.rotateRight = false;
	};

	uiTools.update = function() {
		if(states.rotateLeft) {
			rotate(ROTATION_SCALE);
		} else if(states.rotateRight) {
			rotate(-ROTATION_SCALE);
		}
	};

	var rotate = function(scale) {
		var obj = selector.getSelectedObject();
		obj.rotate(scale);
	};

	return uiTools;
});