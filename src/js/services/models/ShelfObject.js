import THREE from 'three';
import BaseObject from './BaseObject';

angular.module('VirtualBookshelf')
.factory('ShelfObject', function (subclassOf) {
	var ShelfObject = function(params) {
		var size = params.size;	
		var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

		geometry.computeBoundingBox();
		BaseObject.call(this, params, geometry);

		this.position.set(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		
		this.material.transparent = true;
		this.material.opacity = 0;
	};

	ShelfObject.TYPE = 'ShelfObject';

	ShelfObject.prototype = subclassOf(BaseObject);
	ShelfObject.prototype.vbType = ShelfObject.TYPE;

	return ShelfObject;
});