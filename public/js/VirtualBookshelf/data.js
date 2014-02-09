VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(urlArray, type, done, data) {
	var url = urlArray.join('/');
	$.ajax({url: url, type: type, data: data,
    	success: function(data) {
			console.log('Data result: ', type, url, data);
    		done(null, data);
    	},
    	error: function(error) {
			console.warn('Data error: ', type, url, error);
    		done(error, null);
    	}
    });
}

VirtualBookshelf.Data.getLibrary = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryId], 'GET', done);
}

VirtualBookshelf.Data.getLibraries = function(done) {
	VirtualBookshelf.Data.ajax(['/libraries'], 'GET', done);
}

VirtualBookshelf.Data.getLibraryObjects = function(done) {
	VirtualBookshelf.Data.ajax(['/libraryObjects'], 'GET', done);
}

VirtualBookshelf.Data.postLibrary = function(libraryObjectId, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryObjectId], 'POST', done);
}

VirtualBookshelf.Data.getSectionObjects = function(done) {
	VirtualBookshelf.Data.ajax(['/sectionObjects'], 'GET', done);
}

VirtualBookshelf.Data.postSection = function(sectionObjectId, libraryId, done) {
	VirtualBookshelf.Data.ajax(['/section', sectionObjectId, libraryId] , 'POST', done);
}

VirtualBookshelf.Data.getBookObjects = function(done) {
	VirtualBookshelf.Data.ajax(['/bookObjects'], 'GET', done);
}

VirtualBookshelf.Data.postBook = function(book, done) {
	VirtualBookshelf.Data.ajax(['/book'], 'POST', done, book);
}

VirtualBookshelf.Data.getBooks = function(sectionId, done) {
	VirtualBookshelf.Data.ajax(['/books', sectionId], 'GET', done);
}

VirtualBookshelf.Data.loadBookData = function(params, done) {
	var path = '/obj/books/{model}/'.replace('{model}', params.bookObject.model);
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(path + 'model.js', function (geometry) {
		var imgLoader = new THREE.ImageLoader();
	    imgLoader.load(path + 'map.jpg', function (image) {
			var map = VirtualBookshelf.Editor.getUpdatedTexture(params, image);
		    var material = new THREE.MeshPhongMaterial({map: map});
    		geometry.computeBoundingBox();
    		
			done(params, geometry, material);
	    });
	});
}

VirtualBookshelf.Data.loadSection = function(params, done) {
	var path = '/obj/sections/{model}/'.replace('{model}', params.sectionObject.model);
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(path + 'model.js', function (geometry) {
		var imgLoader = new THREE.ImageLoader();
	    imgLoader.load(path + 'texture.jpg', function (image) {
			var texture = new THREE.Texture(image);
			texture.needsUpdate = true;
		    var material = new THREE.MeshLambertMaterial({map: texture});
			VirtualBookshelf.Data.getData(path + 'data.json', function (err, data) {
				params.data = data;
				done(params, geometry, material);
			});   
	    });
	});
}

VirtualBookshelf.Data.getData = function(url, done) {
	VirtualBookshelf.Data.ajax([url], 'GET', done);
}