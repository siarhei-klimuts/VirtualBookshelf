angular.module('VirtualBookshelf')
.factory('environment', function ($q, $log, LibraryObject, SectionObject, Data, Camera, User) {
	var environment = {};

	environment.scene = null;
	environment.library = null;
	environment.sections = {};
	environment.books = {};

	var sectionsCache = null;

	environment.loadLibrary = function(libraryId) {
		clearScene();

		Data.getLibrary(libraryId).then(function (libraryDto) {
			var path = '/obj/libraries/{model}/'.replace('{model}', libraryDto.model);
	        var modelUrl = path + 'model.json';
	        var mapUrl = path + 'map.jpg';

	        return $q.all([Data.loadGeometry(modelUrl), Data.loadImage(mapUrl), libraryDto, parseLibraryDto(libraryDto)]);
		}).then(function (results) {
            var geometry = results[0];
            var mapImage = results[1];
            var libraryDto = results[2];
            var parseResult = results[3];

            var texture = new THREE.Texture(mapImage);
            var material = new THREE.MeshPhongMaterial({map: texture});

            texture.needsUpdate = true;
			environment.library = new LibraryObject(libraryDto, geometry, material);
			Camera.setParent(environment.library);
			environment.scene.add(environment.library);
			// environment.library.loadSections();

			sectionsCache = parseResult;
			createSections(environment.sections, sectionsCache, environment.library);
		});
	};

	var clearScene = function() {
		// Controls.clear();
		environment.library = null;

		while(environment.scene.children.length > 0) {
			if(environment.scene.children[0].dispose) {
				environment.scene.children[0].dispose();
			}
			environment.scene.remove(environment.scene.children[0]);
		}
	};

	var parseLibraryDto = function(libraryDto) {
		var sectionModels = {};
		var bookModels = {};

		for(var sectionIndex = libraryDto.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
			var sectionDto = libraryDto.sections[sectionIndex];

			environment.sections[sectionDto.id] = sectionDto;
			if(!sectionModels[sectionDto.model]) {
				sectionModels[sectionDto.model] = loadSectionData(sectionDto.model);
			}

			for(var bookIndex = sectionDto.books.length - 1; bookIndex >= 0; bookIndex--) {
				var bookDto = sectionDto.books[bookIndex];

				environment.books[bookDto.id] = bookDto;
				// if(!bookModels[bookDto.model]) {
				// 	bookModels[bookDto.model] = loadBookData(bookDto.model);
				// }
			}
		}

		return $q.all(sectionModels);
	};

	var loadSectionData = function(model) {
		var path = '/obj/sections/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';
        var dataUrl = path + 'data.json';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl), 
        	mapImage: Data.loadImage(mapUrl), 
        	data: Data.getData(dataUrl)
        });

        return promise;
	};

	var loadBookData = function(model) {
		var path = '/obj/sections/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';
        var dataUrl = path + 'data.json';

        return $q.all([Data.loadGeometry(modelUrl), Data.loadImage(mapUrl), Data.getData(dataUrl)]);
	};

	var createSections = function(sections, sectionsCache, library) {
		for(key in sections) {
			var sectionDto = sections[key];
			var cache = sectionsCache[sectionDto.model];
            var texture = new THREE.Texture(cache.mapImage);
            var material = new THREE.MeshPhongMaterial({map: texture});

            texture.needsUpdate = true;
            sectionDto.data = cache.data;
			library.add(new SectionObject(sectionDto, cache.geometry, material));			
		}
	};

	return environment;
});