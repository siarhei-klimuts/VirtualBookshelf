import Detector from 'Detector';
import * as lib3d from 'lib3d';
import * as lib3dObjects from 'lib3d-objects';

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

	function loadLibrary(libraryId) {
		return data.getLibrary(libraryId).then(function (dto) {
			return $q.all([
				lib3d.loadLibrary(dto), 
				userData.load()
			]);
		})
		.then(results => lib3d.setLibrary(results[0]));
	}

	function init() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var canvas = data.getCanvas();

		lib3d.init(canvas, width, height);
		lib3d.addLoop(tools.update);
		lib3d.addLoop(lib3d.navigation.update);
		registerObjects();

		window.addEventListener('resize', function () {
			lib3d.setSize(window.innerWidth, window.innerHeight);
		}, false);
	}

	function registerObjects() {
        lib3d.registerLibrary(lib3dObjects.library_0001);
        lib3d.registerLibrary(lib3dObjects.library_0002);
        lib3d.registerSection(lib3dObjects.bookshelf_0001);
        lib3d.registerBook(lib3dObjects.book_0001);
        lib3d.registerBook(lib3dObjects.book_0002);
        lib3d.registerBook(lib3dObjects.book_0003);
	}

	return main;
});