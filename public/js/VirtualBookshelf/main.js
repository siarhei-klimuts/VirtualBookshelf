var VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.loader = new THREE.OBJMTLLoader();
VirtualBookshelf.library;
VirtualBookshelf.user;
VirtualBookshelf.scene;

VirtualBookshelf.start = function() {
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var width = window.innerWidth;
	var height = window.innerHeight;

	VirtualBookshelf.init(width, height);
	VirtualBookshelf.Camera.init(width, height);
	VirtualBookshelf.Controls.init(VirtualBookshelf.container);
	VirtualBookshelf.UI.init();

	VirtualBookshelf.startRenderLoop();
}

VirtualBookshelf.init = function(width, height) {
	VirtualBookshelf.renderer = new THREE.WebGLRenderer();
	VirtualBookshelf.renderer.setSize(width, height);

	VirtualBookshelf.container = document.getElementById('LIBRARY');
	VirtualBookshelf.container.appendChild(VirtualBookshelf.renderer.domElement);

	VirtualBookshelf.scene = new THREE.Scene();
	VirtualBookshelf.scene.fog = new THREE.Fog(0x000000, 4, 7);
}

VirtualBookshelf.startRenderLoop = function() {
	requestAnimationFrame(VirtualBookshelf.startRenderLoop);
	VirtualBookshelf.Controls.update();
	VirtualBookshelf.renderer.render(VirtualBookshelf.scene, VirtualBookshelf.camera);
}

VirtualBookshelf.saveUser = function(user) {
	VirtualBookshelf.user = user;
}

VirtualBookshelf.clearScene = function() {
	VirtualBookshelf.Controls.clear();
	VirtualBookshelf.library = null;

	while(VirtualBookshelf.scene.children.length > 0) {
		if(VirtualBookshelf.scene.children[0].dispose) {
			console.log('dis');
			VirtualBookshelf.scene.children[0].dispose();
		}
		VirtualBookshelf.scene.remove(VirtualBookshelf.scene.children[0]);

	}

	VirtualBookshelf.scene.add(VirtualBookshelf.camera);
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
