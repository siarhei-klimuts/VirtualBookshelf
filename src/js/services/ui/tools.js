angular.module('VirtualBookshelf')
.factory('tools', function (selector) {
	var tools = {};

	var ROTATION_SCALE = 1;

	var states = {
		rotateLeft: false,
		rotateRight: false
	};

	tools.isShow = function() {
		return selector.isSelectedSection();
	};

	tools.isRotatable = function() {
		return selector.isSelectedSection();
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
		var obj = selector.getSelectedObject();
		obj.rotate(scale);
	};

	return tools;
});