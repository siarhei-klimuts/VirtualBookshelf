VirtualBookshelf.Camera = VirtualBookshelf.Camera || {
	HEIGTH: 1.5,
	object: new VirtualBookshelf.CameraObject(),
	setParent: function(parent) {
		parent.add(this.object);
	},
	getPosition: function() {
		return this.object.position;
	}
};

VirtualBookshelf.Camera.init = function(width, height) {
	VirtualBookshelf.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
	this.object.position = new THREE.Vector3(0, VirtualBookshelf.Camera.HEIGTH, 0);
	this.object.rotation.order = 'YXZ';

	var candle = new THREE.PointLight(0x665555, 1.6, 10);
	candle.position.set(0, 0, 0);
	this.object.add(candle);

	this.object.add(VirtualBookshelf.camera);
}

VirtualBookshelf.Camera.rotate = function(x, y) {
	var newX = this.object.rotation.x + y * 0.0001 || 0;
	var newY = this.object.rotation.y + x * 0.0001 || 0;

	if(newX < 1.57 && newX > -1.57) {	
		this.object.rotation.x = newX;
	}

	this.object.rotation.y = newY;
}

VirtualBookshelf.Camera.go = function(speed) {
	var direction = this.getVector();
	var newPosition = this.object.position.clone();
	newPosition.add(direction.multiplyScalar(speed));

	this.object.move(newPosition);
}

VirtualBookshelf.Camera.getVector = function() {
	var vector = new THREE.Vector3(0, 0, -1);

	return vector.applyEuler(this.object.rotation);
}