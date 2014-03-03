VirtualBookshelf.Data = VirtualBookshelf.Data || {};

VirtualBookshelf.Data.TEXTURE_RESOLUTION = 512;
VirtualBookshelf.Data.COVER_MAX_Y = 394;
VirtualBookshelf.Data.COVER_FACE_X = 296;

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

VirtualBookshelf.Data.loadGeometry = function(link, done) {
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load(link, function (geometry) {
		geometry.computeBoundingBox();
		done(geometry);
	});
}

VirtualBookshelf.Data.loadObject = function(modelUrl, mapUrl, done) {
	VirtualBookshelf.Data.loadGeometry(modelUrl, function (geometry) {
		VirtualBookshelf.Data.getImage(mapUrl, function (err, mapImage) {
	    	done(geometry, mapImage);
	    });
	});
}

VirtualBookshelf.Data.createBook = function(dataObject, done) {
	var modelPath = '/obj/books/{model}/model.js'.replace('{model}', dataObject.model);
	// var mapPath = '/obj/bookTextures/{model}.jpg'.replace('{model}', textureName);

	VirtualBookshelf.Data.loadGeometry(modelPath, function (geometry) {
		var canvas = document.createElement('canvas');
		var texture = new THREE.Texture(canvas);
	    var material = new THREE.MeshPhongMaterial({map: texture});
		var book = new VirtualBookshelf.Book(dataObject, geometry, material);

		canvas.width = canvas.height = VirtualBookshelf.Data.TEXTURE_RESOLUTION;
		book.texture.load(dataObject.texture, false, function () {
			book.cover.load(dataObject.cover, true, function () {
				book.updateTexture();
				done(book, dataObject);
			});
		});
	});
}

// VirtualBookshelf.Data.loadBookData = function(dataObject, done) {
// 	VirtualBookshelf.Data.createBook(dataObject.model, dataObject.texture, dataObject.cover, function (book) {

// 	});
	// var modelPath = '/obj/books/{model}/model.js'.replace('{model}', dataObject.model);
	// var mapPath = '/obj/bookTextures/{model}.jpg'.replace('{model}', dataObject.texture || 'default');

	// VirtualBookshelf.Data.loadObject(modelPath, mapPath, function (geometry, mapImage) {
	// 	var canvas = document.createElement('canvas');
	// 	var texture = new THREE.Texture(canvas);
	//     var material = new THREE.MeshPhongMaterial({map: texture});
	//     var properties = {
	//     	textureImage: mapImage,
	//     	coverImage: null
	//     };

	// 	canvas.width = canvas.height = VirtualBookshelf.Data.TEXTURE_RESOLUTION;

	// 	if(dataObject.cover) {
	// 		VirtualBookshelf.Data.getCover(dataObject.cover, function (err, coverImage) {
	// 			if(!err && coverImage) {
	// 				properties.coverImage = coverImage;
	// 			}
				
	// 			done(dataObject, geometry, material, properties);
	// 		});
	// 	} else {
	// 		done(dataObject, geometry, material, properties);
	// 	}
	// });
// }

VirtualBookshelf.Data.loadSection = function(dataObject, done) {
	var path = '/obj/sections/{model}/'.replace('{model}', dataObject.model);
	VirtualBookshelf.Data.loadObject(path + 'model.js', path + 'map.jpg', function (geometry, mapImage) {
		var texture = new THREE.Texture(mapImage);
		texture.needsUpdate = true;

		VirtualBookshelf.Data.getData(path + 'data.json', function (err, data) {
			dataObject.data = data;
			done(dataObject, geometry, new THREE.MeshPhongMaterial({map: texture}));
		});   
	});
}

VirtualBookshelf.Data.loadLibrary = function(dataObject, done) {
	var path = '/obj/libraries/{model}/'.replace('{model}', dataObject.model);
	VirtualBookshelf.Data.loadObject(path + 'model.js', path + 'map.jpg', function (geometry, mapImage) {
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

VirtualBookshelf.Data.getImage = function(url, done) {
	var img = new Image();
    img.crossOrigin = ''; 
	img.src = url;

	img.onload = function () {
		console.log('Data.getImage:', url, 'Ok');
		done(null, this);
	};
	img.onerror = function (error) {
		console.error('Data.getImage:', url, error);
		done(error, null);
	}
	// var imgLoader = new THREE.ImageLoader();
	// imgLoader.load(url,
	// 	function (image) {
	// 		console.log('Data.getImage:', url, 'Ok');
	// 		done(null, image);
	// 	}, 
	// 	function () {}, 
	// 	function (error) {
	// 		console.error('Data.getImage:', url, error);
	// 		done(error, null);
	// 	}
	// );
}

// VirtualBookshelf.Data.getCover = function(url, done) {
// 	VirtualBookshelf.Data.getImage('/outside?link=' + url, done);
// }

// VirtualBookshelf.Data.getBookTexture = function(texture, done) {
// 	var path = '/obj/bookTextures/{image}.jpg'.replace('{image}', texture);
// 	VirtualBookshelf.Data.getImage(path, done);
// }

VirtualBookshelf.Data.CanvasText = function(text, properties) {

	this.text = text || '';
	this.parseProperties(properties);
}
VirtualBookshelf.Data.CanvasText.prototype = {
	constructor: VirtualBookshelf.CanvasText,
	getFont: function() {
		return [this.style, this.size + 'px', this.font].join(' ');
	},
	isValid: function() {
		return (this.text && this.x && this.y);
	},
	toString: function() {
		return this.text || '';
	},
	setText: function(text) {
		this.text = text;
	},
	serializeFont: function() {
		return [this.style, this.size, this.font, this.x, this.y, this.color, this.width].join(',');
	},
	parseProperties: function(properties) {
		var args = properties && properties.split(',') || [];

		this.style = args[0];
		this.size = args[1];
		this.font = args[2];
		this.x = Number(args[3]) || VirtualBookshelf.Data.COVER_FACE_X;
		this.y = Number(args[4]) || 10;
		this.color = args[5];
		this.width = args[6] || 512;
	},
	move: function(dX, dY) {
		this.x += dX;
		this.y += dY;

		if(this.x <= 0) this.x = 1;
		if(this.y <= 0) this.y = 1;
		if(this.x >= VirtualBookshelf.Data.TEXTURE_RESOLUTION) this.x = VirtualBookshelf.Data.TEXTURE_RESOLUTION;
		if(this.y >= VirtualBookshelf.Data.COVER_MAX_Y) this.y = VirtualBookshelf.Data.COVER_MAX_Y;
	}
}

VirtualBookshelf.Data.CanvasImage = function(properties) {
	this.link = '';
	this.image = null;
	this.parseProperties(properties);
}
VirtualBookshelf.Data.CanvasImage.prototype = {
	constructor: VirtualBookshelf.Data.CanvasImage,
	load: function(link, proxy, done) {
		var scope = this;
		function sync(link, image) {
			scope.link = link;
			scope.image = image;
			done();
		}

		if(scope.link != link && link) {
			var path = (proxy ? '{link}' : '/obj/bookTextures/{link}.jpg').replace('{link}', link);
			VirtualBookshelf.Data.getImage(path, function (err, image) {
				sync(link, image);				
			});
		} else if(!link) {
			sync(link);
		} else {
			done();
		}
	},
	toString: function() {
		return this.link;
	},
	parseProperties: function(properties) {
		var args = properties && properties.split(',') || [];

		this.x = Number(args[0]) || VirtualBookshelf.Data.COVER_FACE_X;
		this.y = Number(args[1]) || 0;
		this.width = Number(args[2]) || 216;
		this.height = Number(args[3]) || VirtualBookshelf.Data.COVER_MAX_Y;
	},
	serializeProperties: function() {
		return [this.x, this.y, this.width, this.height].join(',');
	}
}