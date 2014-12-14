angular.module('VirtualBookshelf')
.factory('environment', function ($q, LibraryObject, Data, Camera) {
	var environment = {};

	environment.clearScene = function() {
		// Controls.clear();
		environment.library = null;

		while(environment.scene.children.length > 0) {
			if(environment.scene.children[0].dispose) {
				environment.scene.children[0].dispose();
			}
			environment.scene.remove(environment.scene.children[0]);
		}
	};

	environment.loadLibrary = function(libraryId) {
		environment.clearScene();

		Data.getLibrary(libraryId).then(function (libraryDto) {
			var path = '/obj/libraries/{model}/'.replace('{model}', libraryDto.model);
	        var modelUrl = path + 'model.json';
	        var mapUrl = path + 'map.jpg';

	        return $q.all([Data.loadGeometry(modelUrl), Data.loadImage(mapUrl), libraryDto]);
		}).then(function (results) {
            var geometry = results[0];
            var mapImage = results[1];
            var libraryDto = results[2];
            var texture = new THREE.Texture(mapImage);
            var material = new THREE.MeshPhongMaterial({map: texture});

            texture.needsUpdate = true;
			environment.library = new LibraryObject(libraryDto, geometry, material);
			Camera.setParent(environment.library);
			environment.scene.add(environment.library);
			environment.library.loadSections();
		});
	};

	return environment;
});