VirtualBookshelf.Camera = VirtualBookshelf.Camera || {};
VirtualBookshelf.Camera.HEIGTH = 1.5;

VirtualBookshelf.Camera.init = function(width, height) {
	VirtualBookshelf.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
	VirtualBookshelf.camera.position = new THREE.Vector3(0, VirtualBookshelf.Camera.HEIGTH, 0);
	VirtualBookshelf.camera.rotation.order = 'YXZ';

	var candle = new THREE.PointLight(0x665555, 1.5, 6);
	candle.position.set(0, 0, 0);
	VirtualBookshelf.camera.add(candle);
}

VirtualBookshelf.Camera.rotate = function(x, y) {
	var newX = VirtualBookshelf.camera.rotation.x + y * 0.0001 || 0;
	var newY = VirtualBookshelf.camera.rotation.y + x * 0.0001 || 0;

	if(newX < 1.57 && newX > -1.57) {	
		VirtualBookshelf.camera.rotation.x = newX;
	}

	VirtualBookshelf.camera.rotation.y = newY;
}

VirtualBookshelf.Camera.goForward = function() {
	VirtualBookshelf.camera.translateZ(-0.02);
	VirtualBookshelf.camera.position.y = VirtualBookshelf.Camera.HEIGTH;
}