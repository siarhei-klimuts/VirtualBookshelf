var VirtualBookshelf = VirtualBookshelf || {};

var STATS_CONTAINER_ID = 'stats';

VirtualBookshelf.canvas;
VirtualBookshelf.renderer;
VirtualBookshelf.library;
VirtualBookshelf.scene;
VirtualBookshelf.stats;

VirtualBookshelf.start = function() {
	if(!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	var width = window.innerWidth;
	var height = window.innerHeight;

	VirtualBookshelf.init(width, height);
	VirtualBookshelf.Camera.init(width, height);
	VirtualBookshelf.UI.initControlsData();
	VirtualBookshelf.Controls.init();

	VirtualBookshelf.startRenderLoop();
}

VirtualBookshelf.init = function(width, height) {
	var statsContainer = document.getElementById(STATS_CONTAINER_ID);
	VirtualBookshelf.stats = new Stats();
	statsContainer.appendChild(VirtualBookshelf.stats.domElement);


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

	VirtualBookshelf.stats.update();
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
	VirtualBookshelf.Data.getLibrary(libraryId, function (err, library) {
		VirtualBookshelf.Data.loadLibrary(library, function (params, geometry, material) {
			VirtualBookshelf.library = new VirtualBookshelf.Library(params, geometry, material);
			VirtualBookshelf.Camera.setParent(VirtualBookshelf.library);
			VirtualBookshelf.scene.add(VirtualBookshelf.library);
			VirtualBookshelf.library.loadSections();
		});				
	});
};

VirtualBookshelf.run = function(data, user) {
	user.load().then(function (res) {
		VirtualBookshelf.start();
		VirtualBookshelf.loadLibrary(user.getLibrary() || 1);
	}, function (res) {
		//TODO: show error message
	});
};
