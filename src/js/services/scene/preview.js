import THREE from 'three';

import camera from './camera';
import highlight from '../scene/highlight';

export var preview = {};

var active = false;
var container;

function init() {
	container = new THREE.Object3D();
	container.position.set(0, 0, -0.5);
	container.rotation.y = -2;
	camera.camera.add(container);
}

function activate(value) {
	active = value;
	highlight.enable(!active);
}

preview.isActive = function() {
	return active;
};

preview.enable = function(obj) {
	var objClone;

	if(obj) {
		activate(true);

		objClone = obj.clone();
		objClone.position.set(0, 0, 0);
		container.add(objClone);
	}
};

preview.disable = function () {
	clearContainer();
	activate(false);
};

function clearContainer() {
	container.children.forEach(function (child) {
		container.remove(child);
	});
}

preview.rotate = function(dX) {
	container.rotation.y += dX ? dX * 0.05 : 0;
};

init();