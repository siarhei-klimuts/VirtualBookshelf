angular.module('VirtualBookshelf')
.factory('ShelfObject', function (BaseObject) {
	var ShelfObject = function(params) {
		var size = params.size || [1,1,1];	
		BaseObject.call(this, params, new THREE.CubeGeometry(size[0], size[1], size[2]));

		this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		this.visible = false;
	};

	ShelfObject.prototype = new BaseObject();
	ShelfObject.prototype.constructor = ShelfObject;

	return ShelfObject;
});