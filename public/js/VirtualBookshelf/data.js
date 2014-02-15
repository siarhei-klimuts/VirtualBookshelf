VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(urlArray, type, done, data) {
	var url = urlArray.join('/');
	var request = new XMLHttpRequest;
	request.open(type, url, true);
	request.setRequestHeader('Content-Type', 'application/json');

	request.onload = function() {
	  	if(this.status >= 200 && this.status < 400) {
	    	data = JSON.parse(request.responseText);
			console.log('Data result: ', type, url, data);
			done(null, data);
		} else {
			console.error('Data error: ', type, url, data);
			done(data, null);
		}
	};

	request.send(JSON.stringify(data));
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

VirtualBookshelf.Data.getSections = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/sections', libraryId], 'GET', done);
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
		    var material = new THREE.MeshPhongMaterial({map: texture});
			VirtualBookshelf.Data.getData(path + 'data.json', function (err, data) {
				params.data = data;
				done(params, geometry, material);
			});   
	    });
	});
}

VirtualBookshelf.Data.loadLibrary = function(params, done) {
	var path = '/obj/libraries/{model}/'.replace('{model}', params.libraryObject.model);
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(path + 'model.js', function (geometry) {
		var imgLoader = new THREE.ImageLoader();
	    imgLoader.load(path + 'map.jpg', function (image) {
			var texture = new THREE.Texture(image);
			texture.needsUpdate = true;
			done(params, geometry, new THREE.MeshPhongMaterial({map: texture}));
	    });
	});
}

VirtualBookshelf.Data.getData = function(url, done) {
	VirtualBookshelf.Data.ajax([url], 'GET', done);
}

VirtualBookshelf.Data.putBooks = function(books, done) {
	VirtualBookshelf.Data.ajax(['/books'] , 'PUT', done, books);
}

VirtualBookshelf.Data.putSections = function(sections, done) {
	VirtualBookshelf.Data.ajax(['/sections'] , 'PUT', done, sections);
}