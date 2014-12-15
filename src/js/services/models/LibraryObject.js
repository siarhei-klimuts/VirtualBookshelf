angular.module('VirtualBookshelf')
.factory('LibraryObject', function ($q, BaseObject, SectionObject, Data) {
	var LibraryObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);
		this.libraryObject = params.libraryObject || {};
	};

	LibraryObject.prototype = new BaseObject();
	LibraryObject.prototype.constructor = LibraryObject;
	
	// LibraryObject.prototype.loadSections = function() {
	// 	var library = this;

	// 	Data.getSections(library.id).then(function (sections) {
	// 		for(key in sections) {
	// 			loadSection(sections[key], library);
	// 		}
	// 	}).catch(function (res) {
	// 		//TODO: show an error
	// 	});
	// };

	// var loadSection = function(dataObject, library) {
	// 	var path = '/obj/sections/{model}/'.replace('{model}', dataObject.model);
 //        var modelUrl = path + 'model.js';
 //        var mapUrl = path + 'map.jpg';
 //        var dataUrl = path + 'data.json';

 //        $q.all([Data.loadGeometry(modelUrl), Data.loadImage(mapUrl), Data.getData(dataUrl)]).then(function (results) {
 //            var geometry = results[0];
 //            var mapImage = results[1];
 //            var data = results[2];
 //            var texture = new THREE.Texture(mapImage);
 //            var material = new THREE.MeshPhongMaterial({map: texture});

 //            texture.needsUpdate = true;
 //            dataObject.data = results[2];
	// 		library.add(new SectionObject(dataObject, geometry, material));
 //        }).catch(function (res) {
 //        	//TODO: show an error
 //        });
	// };

	return LibraryObject;	
});