import THREEx from 'THREEx.WindowResize';
import Detector from 'Detector';
import * as lib3d from './scene';

import '../app';

import './data';
import './controls';
import './user';
import './ui/tools';
import './ui/userData';
import './ui/block';

angular.module('VirtualBookshelf')
.factory('main', function ($log, $q, controls, user, tools, userData, block, data) {	
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
				user.setLibraryLoaded(true);
				block.global.stop();
			});		
		} else {
			// Detector.addGetWebGLMessage();
		}
	};

	var loadLibrary = function(libraryId) {
		return data.getLibrary(libraryId).then(function (dto) {
			return $q.all([
				lib3d.load(dto), 
				userData.load()
			]);
		});
	};

	var init = function() {
		var winResize;
		var width = window.innerWidth;
		var height = window.innerHeight;
		var canvas = data.getCanvas();

		lib3d.init(width, height, canvas);
		lib3d.addLoop(controls.update);
		lib3d.addLoop(tools.update);
		lib3d.addLoop(lib3d.navigation.update);

		winResize = new THREEx.WindowResize(lib3d.renderer, lib3d.camera.camera);
	};

	return main;
});