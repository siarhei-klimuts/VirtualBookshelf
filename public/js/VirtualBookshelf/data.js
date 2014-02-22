VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.ajax = function(urlArray, type, done, data, content) {
	var url = urlArray.join('/');
	var content = content || 'application/json';
	var request = new XMLHttpRequest;
	request.open(type, url, true);
	request.setRequestHeader('Content-Type', content);

	request.onload = function() {
	  	if(this.status >= 200 && this.status < 400) {
    		var data = content == 'application/json' ? JSON.parse(request.responseText) : request.responseText;
			console.log('Data result: ', type, url);
			done(null, data);
		} else {
			console.error('Data error: ', type, url, data);
			done(data, null);
		}
	};

	request.send(JSON.stringify(data));
}

VirtualBookshelf.Data.getUIData = function(done) {
	VirtualBookshelf.Data.getData('/obj/data.json', done);
}

VirtualBookshelf.Data.getLibrary = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryId], 'GET', done);
}

VirtualBookshelf.Data.getLibraries = function(done) {
	VirtualBookshelf.Data.ajax(['/libraries'], 'GET', done);
}

VirtualBookshelf.Data.postLibrary = function(libraryModel, done) {
	VirtualBookshelf.Data.ajax(['/library', libraryModel], 'POST', done);
}

VirtualBookshelf.Data.getSections = function(libraryId, done) {
	VirtualBookshelf.Data.ajax(['/sections', libraryId], 'GET', done);
}

VirtualBookshelf.Data.postSection = function(sectionData, done) {
	VirtualBookshelf.Data.ajax(['/section'] , 'POST', done, sectionData);
}

VirtualBookshelf.Data.postBook = function(book, done) {
	VirtualBookshelf.Data.ajax(['/book'], 'POST', done, book);
}

VirtualBookshelf.Data.getBooks = function(sectionId, done) {
	VirtualBookshelf.Data.ajax(['/books', sectionId], 'GET', done);
}

VirtualBookshelf.Data.loadObject = function(root, model, done) {
	var path = '/obj/{root}/{model}/'.replace('{root}', root).replace('{model}', model);
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(path + 'model.js', function (geometry) {
		var imgLoader = new THREE.ImageLoader();
	    imgLoader.load(path + 'map.jpg', function (mapImage) {
    		geometry.computeBoundingBox();
	    	done(geometry, mapImage);
	    });
	});
}

VirtualBookshelf.Data.loadBookData = function(dataObject, done) {
	VirtualBookshelf.Data.loadObject('books', dataObject.model, function (geometry, mapImage) {
		var imgLoader = new THREE.ImageLoader();
    	if(dataObject.cover) {
	    	imgLoader.load('/outside?link=' + dataObject.cover, function (coverImage) {
				done(dataObject, geometry, VirtualBookshelf.Editor.getBookMaterial(dataObject, mapImage, coverImage));
	    	}, function () {}, function (event) {
				console.error('Cover load error:', event);
				done(dataObject, geometry, VirtualBookshelf.Editor.getBookMaterial(dataObject, mapImage));
	    	});
    	} else {
			done(dataObject, geometry, VirtualBookshelf.Editor.getBookMaterial(dataObject, mapImage));
		}
	});
}

VirtualBookshelf.Data.loadSection = function(dataObject, done) {
	VirtualBookshelf.Data.loadObject('sections', dataObject.model, function (geometry, mapImage) {
		var path = '/obj/sections/{model}/'.replace('{model}', dataObject.model);
		var texture = new THREE.Texture(mapImage);
		texture.needsUpdate = true;

		VirtualBookshelf.Data.getData(path + 'data.json', function (err, data) {
			dataObject.data = data;
			done(dataObject, geometry, new THREE.MeshPhongMaterial({map: texture}));
		});   
	});
}

VirtualBookshelf.Data.loadLibrary = function(dataObject, done) {
	VirtualBookshelf.Data.loadObject('libraries', dataObject.model, function (geometry, mapImage) {
		var texture = new THREE.Texture(mapImage);
		texture.needsUpdate = true;

		done(dataObject, geometry, new THREE.MeshPhongMaterial({map: texture}));
	});
}

VirtualBookshelf.Data.getData = function(url, done) {
	VirtualBookshelf.Data.ajax([url], 'GET', done);
}

VirtualBookshelf.Data.putBooks = function(books, done) {
	VirtualBookshelf.Data.ajax(['/books'], 'PUT', done, books);
}

VirtualBookshelf.Data.putBook = function(book, done) {
	VirtualBookshelf.Data.ajax(['/books'], 'PUT', done, [book]);
}

VirtualBookshelf.Data.putSections = function(sections, done) {
	VirtualBookshelf.Data.ajax(['/sections'], 'PUT', done, sections);
}