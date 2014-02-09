var VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.loader = new THREE.OBJMTLLoader();
VirtualBookshelf.library;
VirtualBookshelf.user;
VirtualBookshelf.scene;
VirtualBookshelf.width;
VirtualBookshelf.height;

VirtualBookshelf.start = function() {
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var camera;
	var renderer;
	var projector;

	VirtualBookshelf.init();
	VirtualBookshelf.initControls(document);
	VirtualBookshelf.UI.init();

	VirtualBookshelf.startRenderLoop();
}

VirtualBookshelf.init = function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	VirtualBookshelf.width = width;
	VirtualBookshelf.height = height;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	VirtualBookshelf.container = document.getElementById('LIBRARY');
	VirtualBookshelf.container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
	camera.position = new THREE.Vector3(0,3,2);

	VirtualBookshelf.controls = VirtualBookshelf.initControl(camera);

	projector = new THREE.Projector();

	VirtualBookshelf.scene = new THREE.Scene();

}

VirtualBookshelf.initControl = function(camera) {
	var controls = new THREE.OrbitControls(camera);
	controls.addEventListener('change', VirtualBookshelf.render);

	return controls;	
}

VirtualBookshelf.startRenderLoop = function() {
	requestAnimationFrame(VirtualBookshelf.startRenderLoop);
	VirtualBookshelf.controls.update();
	VirtualBookshelf.render();
}

VirtualBookshelf.render = function() {
	renderer.render(VirtualBookshelf.scene, camera);
}

VirtualBookshelf.saveUser = function(user) {
	VirtualBookshelf.user = user;
}

VirtualBookshelf.clearScene = function() {
	VirtualBookshelf.clearControls();
	VirtualBookshelf.library = null;

	while(VirtualBookshelf.scene.children.length > 0) {
		VirtualBookshelf.scene.remove(VirtualBookshelf.scene.children[0]);
	}

	var directionalLight1 = new THREE.PointLight( 0x999999, 1, 15);
	var directionalLight2 = new THREE.PointLight( 0x999999, 1, 15);
	directionalLight1.position.set(4, 4, 4);
	directionalLight2.position.set(-4, 4, -4);
	VirtualBookshelf.scene.add(directionalLight1);
	VirtualBookshelf.scene.add(directionalLight2);
}

VirtualBookshelf.loadLibrary = function(libraryId) {
	VirtualBookshelf.clearScene();
	VirtualBookshelf.Data.getLibrary(libraryId, function(err, result) {
		VirtualBookshelf.library = new VirtualBookshelf.Library(result);
		VirtualBookshelf.scene.add(VirtualBookshelf.library);
		VirtualBookshelf.UI.refresh();
	});
}

$(document).ready(function() {
	VirtualBookshelf.start();

	VirtualBookshelf.Data.getLibraries(function(err, result) {
		if(err) return;

		if(result && result.length > 0) {
			if(result.length == 1) {
				VirtualBookshelf.loadLibrary(result[0].id);
			} else {
				VirtualBookshelf.UI.showLibrarySelect(result);
			}
		} else {
			VirtualBookshelf.UI.showLibraryCreate();
		}
	});
});
