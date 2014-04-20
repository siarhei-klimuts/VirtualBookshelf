var VirtualBookshelf = VirtualBookshelf || {};

VirtualBookshelf.canvas;
VirtualBookshelf.renderer;
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
	VirtualBookshelf.UI.init();
	VirtualBookshelf.Controls.init();

	VirtualBookshelf.startRenderLoop();
}

VirtualBookshelf.init = function(width, height) {
	VirtualBookshelf.canvas = document.getElementById('LIBRARY');
	VirtualBookshelf.renderer = new THREE.WebGLRenderer({canvas: VirtualBookshelf.canvas});
	VirtualBookshelf.renderer.setSize(width, height);

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
			VirtualBookshelf.scene.children[0].dispose();
		}
		VirtualBookshelf.scene.remove(VirtualBookshelf.scene.children[0]);
	}
}

VirtualBookshelf.loadLibrary = function(libraryId) {
	VirtualBookshelf.clearScene();
	VirtualBookshelf.Data.getLibrary(libraryId, function(err, library) {
		VirtualBookshelf.Data.loadLibrary(library, function (params, geometry, material) {
			VirtualBookshelf.library = new VirtualBookshelf.Library(params, geometry, material);
			VirtualBookshelf.Camera.setParent(VirtualBookshelf.library);
			VirtualBookshelf.scene.add(VirtualBookshelf.library);
			VirtualBookshelf.library.loadSections();
			VirtualBookshelf.UI.refresh();
		});				
	});
}

document.addEventListener('DOMContentLoaded', function () {
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
