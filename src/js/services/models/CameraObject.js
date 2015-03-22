angular.module('VirtualBookshelf')
.factory('CameraObject', function (BaseObject, subclassOf) {
	var CameraObject = function() {
		BaseObject.call(this);
	};

	CameraObject.prototype = subclassOf(BaseObject);
	
	CameraObject.prototype.updateBoundingBox = function() {
		var radius = {x: 0.1, y: 1, z: 0.1};

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	};

	return CameraObject;
});