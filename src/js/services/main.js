import THREE from 'three';
import THREEx from 'THREEx.WindowResize';
import Detector from 'Detector';

import camera from './camera';
import navigation from './navigation';

import '../app';

import './data';
import './controls';
import './user';
import './environment';
import './ui/tools';
import './ui/userData';
import './ui/block';
import './scene/locator';

angular.module('VirtualBookshelf')
.factory('main', function ($log, $q, controls, user, environment, tools, userData, block, locator, data) {	
	var canvas;
	var renderer;
	
	var main = {};

	main.start = function() {
		if(Detector.webgl) {
			init();
			controls.init();

			block.global.start();
			user.load().then(function () {
				return loadLibrary(user.getLibrary() || 1);
			}).catch(function (error) {
				$log.error(error);
				//TODO: show error message  
			}).finally(function () {
				locator.centerObject(camera.object);
				environment.setLoaded(true);
				startRenderLoop();
				block.global.stop();
			});		
		} else {
			// Detector.addGetWebGLMessage();
		}
	};

	var loadLibrary = function(libraryId) {
		return data.getLibrary(libraryId).then(function (dto) {
			return $q.all([
				environment.loadLibrary(dto), 
				userData.load()
			]);
		});
	};

	var init = function() {
		var winResize;
		var width = window.innerWidth;
		var height = window.innerHeight;

		canvas = document.getElementById(environment.LIBRARY_CANVAS_ID);
		renderer = new THREE.WebGLRenderer({canvas: canvas ? canvas : undefined, antialias: true});
		renderer.setSize(width, height);
		winResize = new THREEx.WindowResize(renderer, camera.camera);

		environment.scene = new THREE.Scene();
		environment.scene.fog = new THREE.Fog(0x000000, 4, 7);
	};

	var startRenderLoop = function() {
		requestAnimationFrame(startRenderLoop);

		controls.update();
		navigation.update();
		tools.update();
		
		renderer.render(environment.scene, camera.camera);
	};

	return main;
});