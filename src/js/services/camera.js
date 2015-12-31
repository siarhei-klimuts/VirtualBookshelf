import THREE from 'three';
import CameraObject from './models/CameraObject';

var camera = {
	HEIGTH: 1.5,
	object: new CameraObject(),
	setParent: function(parent) {
		parent.add(this.object);
	},
	getPosition: function() {
		return this.object.position;
	}
};

var init = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	camera.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
	camera.object.position.set(0, camera.HEIGTH, 0);
	camera.object.rotation.order = 'YXZ';

	var candle = new THREE.PointLight(0x665555, 1.6, 10);
	candle.position.set(0, 0, 0);

	camera.object.add(candle);
	camera.object.add(camera.camera);
};

camera.rotate = function(x, y) {
	var newX = this.object.rotation.x + y * 0.0001 || 0;
	var newY = this.object.rotation.y + x * 0.0001 || 0;

	if(newX < 1.57 && newX > -1.57) {	
		this.object.rotation.x = newX;
	}

	this.object.rotation.y = newY;
};

camera.go = function(speed) {
	var direction = this.getVector();
	var newPosition = this.object.position.clone();
	newPosition.add(direction.multiplyScalar(speed));

	this.object.move(newPosition);
};

camera.getVector = function() {
	var vector = new THREE.Vector3(0, 0, -1);

	return vector.applyEuler(this.object.rotation);
};

init();

export default camera;