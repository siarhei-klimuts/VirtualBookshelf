angular.module('VirtualBookshelf')
.factory('Main', function ($log, Data, Camera, LibraryObject, Controls, User, UI, environment) {
	var STATS_CONTAINER_ID = 'stats';
	var LIBRARY_CANVAS_ID = 'LIBRARY';
	
	var canvas;
	var renderer;
	var stats;
	
	var Main = {};

	Main.start = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		if(!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		init(width, height);
		Camera.init(width, height);
		Controls.init();

		startRenderLoop();

		User.load().then(function (res) {
			environment.loadLibrary(User.getLibrary() || 1);
			UI.init();
		}, function (error) {
			$log.error(error);
			//TODO: show error message  
		});		
	};

	var init = function(width, height) {
		var statsContainer = document.getElementById(STATS_CONTAINER_ID);

		stats = new Stats();
		statsContainer.appendChild(stats.domElement);

		canvas = document.getElementById(LIBRARY_CANVAS_ID);
		renderer = new THREE.WebGLRenderer({canvas: canvas});
		renderer.setSize(width, height);

		environment.scene = new THREE.Scene();
		environment.scene.fog = new THREE.Fog(0x000000, 4, 7);
	};

	var startRenderLoop = function() {
		requestAnimationFrame(startRenderLoop);
		Controls.update();
		renderer.render(environment.scene, Camera.camera);

		stats.update();
	};

	return Main;
});