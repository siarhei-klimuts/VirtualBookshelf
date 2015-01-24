angular
    .module('VirtualBookshelf', ['blockUI', 'angularUtils.directives.dirPagination'])
    	.config(function (blockUIConfig, paginationTemplateProvider) {
    		blockUIConfig.delay = 0;
    		blockUIConfig.autoBlock = false;
			blockUIConfig.autoInjectBodyBlock = false;
			paginationTemplateProvider.setPath('/js/angular/dirPagination/dirPagination.tpl.html');
    	})
    	.run(function (Main) {
			Main.start();
    	});
angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, UI) {
    $scope.menu = UI.menu;
});
angular.module('VirtualBookshelf')
.directive('vbSelect', function() {
	return {
		restrict: 'E',
    	transclude: true,
		templateUrl: '/ui/select.ejs',
		scope: {
			options: '=',
			selected: '=',
			value: '@',
			label: '@'
		},
		link: function(scope, element, attrs, controller, transclude) {
			scope.select = function(item) {
				scope.selected = item[scope.value];
			};

			scope.isSelected = function(item) {
				return scope.selected === item[scope.value];
			};
		}
	}
});

angular.module('VirtualBookshelf')
.factory('cache', function ($q, Data) {
	var cache = {};

	var library = null;
	var sections = {};
	var books = {};
	var images = {};

	cache.init = function(libraryModel, sectionModels, bookModels, imageUrls) {
		var libraryLoad = loadLibraryData(libraryModel);
		var sectionsLoad = [];
		var booksLoad = [];
		var imagesLoad = [];
		var model, url; // iterators

		for (model in sectionModels) {
			sectionsLoad.push(addSection(model));
		}

		for (model in bookModels) {
			booksLoad.push(addBook(model));
		}

		for (url in imageUrls) {
			imagesLoad.push(addImage(url));
		}

		var promise = $q.all({
			libraryCache: libraryLoad, 
			sectionsLoad: $q.all(sectionsLoad), 
			booksLoad: $q.all(booksLoad),
			imagesLoad: $q.all(imagesLoad)
		}).then(function (results) {
			library = results.libraryCache;
		});

		return promise;
	};

	cache.getLibrary = function() {
		return library;
	};

	cache.getSection = function(model) {
		return commonGetter(sections, model, addSection);
	};

	cache.getBook = function(model) {
		return commonGetter(books, model, addBook);
	};

	cache.getImage = function(url) {
		return commonGetter(images, url, addImage);
	};

	var commonGetter = function(from, key, addFunction) {
		var result = from[key];

		if(!result) {
			result = addFunction(key);
		}

		return $q.when(result);
	};

	var commonAdder = function(where, what, loader, key) {
		var promise = loader(what).then(function (loadedCache) {
			where[key || what] = loadedCache;
		});

		return promise;
	};

	var addSection = function(model) {
		return commonAdder(sections, model, loadSectionData);
	};

	var addBook = function(model) {
		return commonAdder(books, model, loadBookData);
	};

	var addImage = function(url) {
		return commonAdder(images, '/outside?link=' + url, Data.loadImage, url);
	};

	var loadLibraryData = function(model) {
		var path = '/obj/libraries/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.json';
        var mapUrl = path + 'map.jpg';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl), 
        	mapImage: Data.loadImage(mapUrl)
        });

        return promise;
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
		var path = '/obj/books/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl),
        	mapImage: Data.loadImage(mapUrl) 
        });

        return promise;
	};

	return cache;
});
angular.module('VirtualBookshelf')
.factory('Camera', function (CameraObject) {
	var Camera = {
		HEIGTH: 1.5,
		object: new CameraObject(),
		setParent: function(parent) {
			parent.add(this.object);
		},
		getPosition: function() {
			return this.object.position;
		}
	};

	Camera.init = function(width, height) {
		Camera.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
		this.object.position = new THREE.Vector3(0, Camera.HEIGTH, 0);
		this.object.rotation.order = 'YXZ';

		var candle = new THREE.PointLight(0x665555, 1.6, 10);
		candle.position.set(0, 0, 0);
		this.object.add(candle);

		this.object.add(Camera.camera);
	};

	Camera.rotate = function(x, y) {
		var newX = this.object.rotation.x + y * 0.0001 || 0;
		var newY = this.object.rotation.y + x * 0.0001 || 0;

		if(newX < 1.57 && newX > -1.57) {	
			this.object.rotation.x = newX;
		}

		this.object.rotation.y = newY;
	};

	Camera.go = function(speed) {
		var direction = this.getVector();
		var newPosition = this.object.position.clone();
		newPosition.add(direction.multiplyScalar(speed));

		this.object.move(newPosition);
	};

	Camera.getVector = function() {
		var vector = new THREE.Vector3(0, 0, -1);

		return vector.applyEuler(this.object.rotation);
	};

	return Camera;
});
angular.module('VirtualBookshelf')
/* 
 * controls.js is a service for processing not UI(menus) events 
 * like mouse, keyboard, touch or gestures.
 *
 * TODO: remove all busines logic from there and leave only
 * events functionality to make it more similar to usual controller
 */
.factory('Controls', function ($q, $log, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, Data, navigation, environment, mouse, selector) {
	var Controls = {};

	Controls.BUTTONS_ROTATE_SPEED = 100;
	Controls.BUTTONS_GO_SPEED = 0.02;

	Controls.Pocket = {
		_books: {},

		selectObject: function(target) {
			var 
				dataObject = this._books[target.value]

			Data.createBook(dataObject, function (book, dataObject) {
				Controls.Pocket.remove(dataObject.id);
				Controls.selected.select(book, null);
				// book.changed = true;
			});
		},
		remove: function(id) {
			this._books[id] = null;
			delete this._books[id];
		},
		put: function(dataObject) {
			this._books[dataObject.id] = dataObject;
		},
		getBooks: function() {
			return this._books;
		},
		isEmpty: function() {
			return this._books.length == 0;
		}
	};

	Controls.selected = {
		object: null,
		// parent: null,
		getted: null,
		// point: null,

		isBook: function() {
			return selector.isSelectedBook();
		},
		isSection: function() {
			return selector.isSelectedSection();
		},
		isShelf: function() {
			return selector.isSelectedShelf();
		},
		isMovable: function() {
			return Boolean(this.isBook() || this.isSection());
		},
		isRotatable: function() {
			return Boolean(this.isSection());
		},
		clear: function() {
			selector.unselect();
			this.object = null;
			this.getted = null;
		},
		select: function() {
			selector.selectFocused();

			// this.clear();
			this.object = selector.getSelectedObject();
			// this.point = point;

		},
		release: function() {
			var selectedObject = selector.getSelectedObject();
			//TODO: there is no selected object after remove frome scene
			if(this.isBook() && !selectedObject.parent) {
				Controls.Pocket.put(selectedObject.dataObject);
				this.clear();
			}

			this.save();
		},
		get: function() {
			if(this.isBook() && !this.isGetted()) {
				this.getted = true;
				this.parent = this.object.parent;
				this.object.position.set(0, 0, -this.object.geometry.boundingBox.max.z - 0.25);
				Camera.camera.add(this.object);			
			} else {
				this.put();
			}
		},
		put: function() {
			if(this.isGetted()) {
				this.parent.add(this.object);
				this.object.reload();//position
				this.clear();
			}
		},
		isGetted: function() {
			return this.isBook() && this.getted;
		},
		save: function() {
			var selectedObject = selector.getSelectedObject();
			if(this.isMovable() && selectedObject.changed) {
				selectedObject.save();
			}
		}
	};

	Controls.init = function() {
		Controls.clear();
		Controls.initListeners();
	};

	Controls.initListeners = function() {
		document.addEventListener('dblclick', Controls.onDblClick, false);
		document.addEventListener('mousedown', Controls.onMouseDown, false);
		document.addEventListener('mouseup', Controls.onMouseUp, false);
		document.addEventListener('mousemove', Controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;}
	};

	Controls.clear = function() {
		Controls.selected.clear();	
	};

	Controls.update = function() {
		if(!Controls.selected.isGetted()) {
			if(mouse[3]) {
				Camera.rotate(mouse.longX, mouse.longY);
			}

			if((mouse[1] && mouse[3]) || navigation.state.forward) {
				Camera.go(this.BUTTONS_GO_SPEED);
			} else if(navigation.state.backward) {
				Camera.go(-this.BUTTONS_GO_SPEED);
			} else if(navigation.state.left) {
				Camera.rotate(this.BUTTONS_ROTATE_SPEED, 0);
			} else if(navigation.state.right) {
				Camera.rotate(-this.BUTTONS_ROTATE_SPEED, 0);
			}
		}
	};

	// Events

	Controls.onDblClick = function(event) {
		if(mouse.isCanvas()) {
			switch(event.which) {
				case 1: Controls.selected.get(); break;
			}   	
		}
	};

	Controls.onMouseDown = function(event) {
		mouse.down(event); 

		if(mouse.isCanvas() || mouse.isPocketBook()) {
			// event.preventDefault();//TODO: research (enabled cannot set cursor to input)

			if(mouse[1] && !mouse[3] && !Controls.selected.isGetted()) {
				if(mouse.isCanvas()) {
					Controls.selectObject();
					Controls.selected.select();
				} else if(mouse.isPocketBook()) {
					Controls.Pocket.selectObject(mouse.target);
				}
			}
		}
	};

	Controls.onMouseUp = function(event) {
		mouse.up(event);
		
		switch(event.which) {
			 case 1: Controls.selected.release(); break;
		}
	};

	Controls.onMouseMove = function(event) {
		mouse.move(event);

		if(mouse.isCanvas()) {
			event.preventDefault();

		 	if(!Controls.selected.isGetted()) {
				if(mouse[1] && !mouse[3]) {		
					Controls.moveObject();
				} else {
					Controls.selectObject();
				}
			} else {
				// var obj = Controls.selected.object;

				// if(obj instanceof BookObject) {
				// 	if(mouse[1]) {
				// 		obj.moveElement(mouse.dX, mouse.dY, UI.menu.createBook.edited);
				// 	}
				// 	if(mouse[2] && UI.menu.createBook.edited == 'cover') {
				//  		obj.scaleElement(mouse.dX, mouse.dY);
				// 	}
				// 	if(mouse[3]) {
				//  		obj.rotate(mouse.dX, mouse.dY, true);
				// 	}
				// } 
			}
		}
	};

	//****

	Controls.selectObject = function() {
		var
			intersected,
			// point,
			object;

		if(mouse.isCanvas() && environment.library) {
			intersected = mouse.getIntersected(environment.library.children, true, [SectionObject, BookObject]);
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
			}

			if(intersected) {
				object = intersected.object;
				// point = intersected.point; 
			}

			// Controls.selected.select(object, point);
			selector.focus(new SelectorMeta(object));
		}
	};

	Controls.moveObject = function() {
		var 
			mouseVector,
			newPosition,
			intersected,
			parent,
			oldParent;
		var selectedObject;

		if(Controls.selected.isBook() || (Controls.selected.isSection()/* && UI.menu.sectionMenu.isMoveOption()*/)) {
			selectedObject = selector.getSelectedObject();
			mouseVector = Camera.getVector();	

			newPosition = selectedObject.position.clone();
			oldParent = selectedObject.parent;

			if(Controls.selected.isBook()) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
				selectedObject.setParent(intersected ? intersected.object : null);
			}

			parent = selectedObject.parent;
			if(parent) {
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				if(!selectedObject.move(newPosition) && Controls.selected.isBook()) {
					if(parent !== oldParent) {
						selectedObject.setParent(oldParent);
					}
				}
			}
		}/* else if(UI.menu.sectionMenu.isRotateOption() && Controls.selected.isSection()) {
			Controls.selected.object.rotate(Controls.mouse.dX);			
		}*/
	};

	return Controls;	
});
angular.module('VirtualBookshelf')
.factory('Data', function ($http, $q) {
	var Data = {};

	Data.TEXTURE_RESOLUTION = 512;
	Data.COVER_MAX_Y = 394;
	Data.COVER_FACE_X = 296;

    Data.loadImage = function(url) {
        var deffered = $q.defer();
        var img = new Image();
        
        img.crossOrigin = ''; 
        img.src = url;
        
        if(img.complete) {
            deffered.resolve(img);
        }

        img.onload = function () {
            deffered.resolve(img);
        };
        img.onerror = function (error) {
            deffered.reject(error);
        };

        return deffered.promise; 
    };

	Data.getUser = function() {
		return $http.get('/user');
	};

	Data.getUserBooks = function(userId) {
		return $http.get('/freeBooks/' + userId).then(function (res) {
			return res.data;
		});
	};

	Data.postBook = function(book) {
		return $http.post('/book', book);
	};

	Data.deleteBook = function(book) {
		return $http({
			method: 'DELETE',
			url: '/book',
			data: book,
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		});
	};

	Data.getUIData = function() {
		return $http.get('/obj/data.json');
	};

	Data.getLibraries = function() {
		return $http.get('/libraries');
	};

	Data.getLibrary = function(libraryId) {
		return $http.get('/library/' + libraryId).then(function (res) {
			return res.data;
		});
	};

	Data.postLibrary = function(libraryModel) {
        return $http.post('/library/' + libraryModel).then(function (res) {
            return res.data;
        });
	};

	Data.getSections = function(libraryId) {
        return $http.get('/sections/' + libraryId).then(function (res) {
            return res.data;
        });
	};

	Data.postSection = function(sectionData) {
        return $http.post('/section', sectionData);
	};

	Data.getBooks = function(sectionId) {
		//TODO: userId
        return $http.get('/books/' + sectionId).then(function (res) {
            return res.data;
        });
	};

	Data.loadGeometry = function(link) {
        var deffered = $q.defer();
		var jsonLoader = new THREE.JSONLoader();

        //TODO: found no way to reject
		jsonLoader.load(link, function (geometry) {
			deffered.resolve(geometry);
		});

        return deffered.promise;
	};

	Data.getData = function(url) {
        return $http.get(url).then(function (res) {
            return res.data
        });
	};

	Data.postFeedback = function(dto) {
        return $http.post('/feedback', dto);
	};

	return Data;
});
angular.module('VirtualBookshelf')
.factory('environment', function ($q, $log, LibraryObject, SectionObject, BookObject, Data, Camera, cache) {
	var environment = {};
	 
	var libraryDto = null;
	var sections = null;
	var books = null;

	environment.scene = null;
	environment.library = null;

	environment.loadLibrary = function(libraryId) {
		clearScene(); // inits some fields

		var promise = Data.getLibrary(libraryId).then(function (dto) {
			var dict = parseLibraryDto(dto);
			sections = dict.sections;
			books = dict.books;
			libraryDto = dto;

			return initCache(libraryDto, dict.sections, dict.books);
		}).then(function () {
			createLibrary(libraryDto); // sync
			return createSections(sections);
		}).then(function () {
			return createBooks(books);
		});

		return promise;
	};

	environment.getBook = function(bookId) {
		return getDictObject(books, bookId);
	};

	environment.getSection = function(sectionId) {
		return getDictObject(sections, sectionId);
	};

	environment.getShelf = function(sectionId, shelfId) {
		var section = environment.getSection(sectionId);
		var shelf = section && section.shelves[shelfId];

		return shelf;
	};

	var getDictObject = function(dict, objectId) {
		var dictItem = dict[objectId];
		var dictObject = dictItem && dictItem.obj;

		return dictObject;
	};

	environment.updateBook = function(dto) {
		var shelf = getBookShelf(dto);

		if(shelf) {
			removeObject(books, dto.id);
			createBook(dto);
		} else {
			removeObject(books, dto.id);
		}	
	};

	environment.removeBook = function(bookDto) {
		removeObject(books, bookDto.id);
	};

	var removeObject = function(dict, key) {
		var dictItem = dict[key];
		if(dictItem) {
			delete dict[key];
			
			if(dictItem.obj) {
				dictItem.obj.setParent(null);
			}
		}
	};

	var initCache = function(libraryDto, sectionsDict, booksDict) {
		var libraryModel = libraryDto.model;
		var sectionModels = {};
		var bookModels = {};
		var imageUrls = {};

		for (var sectionId in sectionsDict) {
			var sectionDto = sectionsDict[sectionId].dto;
			sectionModels[sectionDto.model] = true;
		}

		for (var bookId in booksDict) {
			var bookDto = booksDict[bookId].dto;
			bookModels[bookDto.model] = true;

			if(bookDto.cover) {
				imageUrls[bookDto.cover] = true;
			}
		}

		return cache.init(libraryModel, sectionModels, bookModels, imageUrls);
	};

	var clearScene = function() {
		// Controls.clear();
		environment.library = null;
		sections = {};
		books = {};

		while(environment.scene.children.length > 0) {
			if(environment.scene.children[0].dispose) {
				environment.scene.children[0].dispose();
			}
			environment.scene.remove(environment.scene.children[0]);
		}
	};

	var parseLibraryDto = function(libraryDto) {
		var result = {
			sections: {},
			books: {}
		};

		for(var sectionIndex = libraryDto.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
			var sectionDto = libraryDto.sections[sectionIndex];
			result.sections[sectionDto.id] = {dto: sectionDto};

			for(var bookIndex = sectionDto.books.length - 1; bookIndex >= 0; bookIndex--) {
				var bookDto = sectionDto.books[bookIndex];
				result.books[bookDto.id] = {dto: bookDto};
			}

			delete sectionDto.books;
		}

		delete libraryDto.sections;

		return result;
	};

	var createLibrary = function(libraryDto) {
		var library = null;
		var libraryCache = cache.getLibrary();
        var texture = new THREE.Texture(libraryCache.mapImage);
        var material = new THREE.MeshPhongMaterial({map: texture});

        texture.needsUpdate = true;
		library = new LibraryObject(libraryDto, libraryCache.geometry, material);
		Camera.setParent(library);

		environment.scene.add(library);
		environment.library = library;
	};

	var createSections = function(sectionsDict) {
		var results = [];
		var key;

		for(key in sectionsDict) {
			results.push(createSection(sectionsDict[key].dto));		
		}

		return $q.all(results);
	};

	var createSection = function(sectionDto) {
		var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
	        var texture = new THREE.Texture(sectionCache.mapImage);
	        var material = new THREE.MeshPhongMaterial({map: texture});
	        var section;

	        texture.needsUpdate = true;
	        sectionDto.data = sectionCache.data;

	        section = new SectionObject(sectionDto, sectionCache.geometry, material);

			environment.library.add(section);
			addToDict(sections, section);
		});

		return promise;
	};

	// TODO: merge with createSections
	var createBooks = function(booksDict) {
		var results = [];
		var key;

		for(key in booksDict) {
			results.push(createBook(booksDict[key].dto));
		}

		return $q.all(results);
	};

	var createBook = function(bookDto) {
		var promises = {};
		var promise;

		promises.bookCache = cache.getBook(bookDto.model);
		if(bookDto.cover) {
			promises.coverCache = cache.getImage(bookDto.cover);
		}

		promise = $q.all(promises).then(function (results) {
			var bookCache = results.bookCache;
			var coverImage = results.coverCache;
			var canvas = document.createElement('canvas');

			canvas.width = canvas.height = Data.TEXTURE_RESOLUTION;
			var texture = new THREE.Texture(canvas);
		    var material = new THREE.MeshPhongMaterial({map: texture});

			var book = new BookObject(bookDto, bookCache.geometry, material, bookCache.mapImage, coverImage);

			addToDict(books, book);
			placeBookOnShelf(book);
		});

		return promise;
	};

	var addToDict = function(dict, obj) {
		var dictItem = {
			dto: obj.dataObject,
			obj: obj
		};

		dict[obj.id] = dictItem;
	};

	var getBookShelf = function(bookDto) {
		return environment.getShelf(bookDto.sectionId, bookDto.shelfId);
	};

	var placeBookOnShelf = function(book) {
		var shelf = getBookShelf(book.dataObject);
		shelf.add(book);
	};

	return environment;
});
angular.module('VirtualBookshelf')
.factory('Main', function ($log, Data, Camera, LibraryObject, Controls, User, UI, environment) {
	var STATS_CONTAINER_ID = 'stats';
	var LIBRARY_CANVAS_ID = 'LIBRARY';
	
	var canvas;
	var renderer;
	var stats;
	
	var Main = {};

	Main.start = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;

		if(!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		init(width, height);
		Camera.init(width, height);
		Controls.init();

		startRenderLoop();

		User.load().then(function (res) {
			environment.loadLibrary(User.getLibrary() || 1);
			UI.init();
		}, function (error) {
			$log.error(error);
			//TODO: show error message  
		});		
	};

	var init = function(width, height) {
		var statsContainer = document.getElementById(STATS_CONTAINER_ID);

		stats = new Stats();
		statsContainer.appendChild(stats.domElement);

		canvas = document.getElementById(LIBRARY_CANVAS_ID);
		renderer = new THREE.WebGLRenderer({canvas: canvas});
		renderer.setSize(width, height);

		environment.scene = new THREE.Scene();
		environment.scene.fog = new THREE.Fog(0x000000, 4, 7);
	};

	var startRenderLoop = function() {
		requestAnimationFrame(startRenderLoop);
		Controls.update();
		renderer.render(environment.scene, Camera.camera);

		stats.update();
	};

	return Main;
});
angular.module('VirtualBookshelf')
.factory('mouse', function (Camera) {
	var mouse = {};

	var width = window.innerWidth;
	var height = window.innerHeight;

	var x = null;
	var y = null;
	
	mouse.target = null;
	mouse.dX = null;
	mouse.dY = null;
	mouse.longX = null;
	mouse.longY = null;

	mouse.getTarget = function() {
		return this.target;
	};

	mouse.down = function(event) {
		if(event) {
			this[event.which] = true;
			this.target = event.target;
			x = event.x;
			y = event.y;
			mouse.longX = width * 0.5 - x;
			mouse.longY = height * 0.5 - y;
		}
	};

	mouse.up = function(event) {
		if(event) {
			this[event.which] = false;
			this[1] = false; // linux chrome bug fix (when both keys release then both event.which equal 3)
		}
	};

	mouse.move = function(event) {
		if(event) {
			this.target = event.target;
			mouse.longX = width * 0.5 - x;
			mouse.longY = height * 0.5 - y;
			mouse.dX = event.x - x;
			mouse.dY = event.y - y;
			x = event.x;
			y = event.y;
		}
	};

	mouse.isCanvas = function() {
		return this.target && this.target.className.indexOf('ui') > -1;
	};

	mouse.isPocketBook = function() {
		return false; //TODO: stub
		// return !!(this.target && this.target.parentNode == UI.menu.inventory.books);
	};

	mouse.getIntersected = function(objects, recursive, searchFor) {
		var
			vector,
			raycaster,
			intersects,
			intersected,
			result,
			i, j;

		result = null;
		vector = getVector();
		raycaster = new THREE.Raycaster(Camera.getPosition(), vector);
		intersects = raycaster.intersectObjects(objects, recursive);

		if(searchFor) {
			if(intersects.length) {
				for(i = 0; i < intersects.length; i++) {
					intersected = intersects[i];
					
					for(j = searchFor.length - 1; j >= 0; j--) {
						if(intersected.object instanceof searchFor[j]) {
							result = intersected;
							break;
						}
					}

					if(result) {
						break;
					}
				}
			}		
		} else {
			result = intersects;
		}

		return result;
	};

	var getVector = function() {
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0.5);
		projector.unprojectVector(vector, Camera.camera);
	
		return vector.sub(Camera.getPosition()).normalize();
	};

	return mouse;
});
angular.module('VirtualBookshelf')
.factory('navigation', function () {
	var navigation = {
		state: {
			forward: false,
			backward: false,
			left: false,
			right: false			
		}
	};

	navigation.goStop = function() {
		this.state.forward = false;
		this.state.backward = false;
		this.state.left = false;
		this.state.right = false;
	};

	navigation.goForward = function() {
		this.state.forward = true;
	};

	navigation.goBackward = function() {
		this.state.backward = true;
	};

	navigation.goLeft = function() {
		this.state.left = true;
	};

	navigation.goRight = function() {
		this.state.right = true;
	};

	return navigation;
});
angular.module('VirtualBookshelf')
.factory('UI', function ($q, $log, SelectorMeta, User, Data, Controls, navigation, environment, locator, selector, blockUI) {
	var BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';
	var UI = {menu: {}};

	UI.menu.selectLibrary = {
		list: [],
		updateList: function() {
			var scope = this;

		    Data.getLibraries()
		    	.then(function (res) {
		            scope.list = res.data;
		    	});
		},
		go: function(id) {
			if(id) {
				environment.loadLibrary(id);
			}
		}
	};

	UI.menu.createLibrary = {
		list: [],
		model: null,

		getImg: function() {
			return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				Data.postLibrary(this.model).then(function (result) {
					environment.loadLibrary(result.id);
					UI.menu.show = null; // TODO: hide after go 
					UI.menu.selectLibrary.updateList();
					//TODO: add library without reload
				}).catch(function (res) {
					//TODO: show an error
				});
			}
		}		
	};

	UI.menu.createSection = {
		list: [],
		model: null,
		
		getImg: function() {
			return this.model ? '/obj/sections/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				var sectionData = {
					model: this.model,
					userId: User.getId()
				};

				Data.postSection(sectionData).then(function () {
					//TODO: refactor (don't see new section creation)
					// possibly add to inventory only
				}).catch(function () {
					//TODO: show an error
				});
			}
		}
	};

	UI.menu.feedback = {
		message: null,
		show: true,

		close: function() {
			this.show = false;
		},
		submit: function() {
			var dataObject;
			
			if(this.message) {
				dataObject = {
					message: this.message,
					userId: User.getId()
				};

				Data.postFeedback(dataObject);
			}

			this.close();
		}
	};

	UI.menu.navigation = {
		stop: function() {
			navigation.goStop();
		},
		forward: function() {
			navigation.goForward();
		},
		backward: function() {
			navigation.goBackward();
		},
		left: function() {
			navigation.goLeft();
		},
		right: function() {
			navigation.goRight();
		}
	};

	UI.menu.login = {
		// TODO: oauth.io
		isShow: function() {
			return !User.isAuthorized() && User.isLoaded();
		}
	};

	UI.menu.inventory = {
		search: null,
		list: null,
		blocker: 'inventory',
	
		expand: function(book) {
			UI.menu.createBook.setBook(book);
		},
		block: function() {
			blockUI.instances.get(this.blocker).start();
		},
		unblock: function() {
			blockUI.instances.get(this.blocker).stop();
		},
		isShow: function() {
			return User.isAuthorized();
		},
		isBookSelected: function(id) {
			return selector.isBookSelected(id);
		},
		select: function(dto) {
			var book = environment.getBook(dto.id);
			var meta = new SelectorMeta(book);
			selector.select(meta);
		},
		addBook: function() {
			var scope = this;

			scope.block();
			Data.postBook({userId: User.getId()}).then(function (res) {
				scope.expand(res.data);
				return scope.loadData();
			}).then(function (res) {
				//TODO: research, looks rigth
			}).catch(function (error) {
				$log.error(error);
				//TODO: show an error
			}).finally(function (res) {
				scope.unblock();
			});
		},
		remove: function(book) {
			var scope = this;

			scope.block();
			Data.deleteBook(book).then(function (res) {
				environment.removeBook(res.data);
				return scope.loadData();
			}).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			}).finally(function (res) {
				scope.unblock();
			});
		},
		place: function(book) {
			var scope = this;
			var promise;
			var isBookPlaced = !!book.sectionId;

			scope.block();
			promise = isBookPlaced ? locator.unplaceBook(book) : locator.placeBook(book);
			promise.then(function (res) {
				return scope.loadData();
			}).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			}).finally(function (res) {
				scope.unblock(); 
			});
		},
		loadData: function() {
			var scope = this;
			var promise;

			scope.block();
			promise = $q.when(this.isShow() ? Data.getUserBooks(User.getId()) : null).then(function (books) {
				scope.list = books;
			}).finally(function () {
				scope.unblock();		
			});

			return promise;
		}
	};

	UI.menu.createBook = {
		list: [],
		book: {},

		setBook: function(book) {
			this.book = {}; // create new object for unbind from scope
			if(book) {
				this.book.id = book.id;
				this.book.userId = book.userId;
				this.book.model = book.model;
				this.book.cover = book.cover;
				this.book.title = book.title;
				this.book.author = book.author;
			}
		},
		getImg: function() {
			return this.book.model ? BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
		},
		isShow: function() {
			return !!this.book.id;
		},
		save: function() {
			var scope = this;
			
			UI.menu.inventory.block();
			Data.postBook(this.book).then(function (res) {
				environment.updateBook(res.data);
				scope.cancel();
				return UI.menu.inventory.loadData()
			}).catch(function (res) {
				//TODO: show error
			}).finally(function (res) {
				UI.menu.inventory.unblock();
			});
		},
		cancel: function() {
			this.setBook();
		}
	};

	UI.init = function() {
		//TODO: move to menu models
		Data.getUIData()
		.then(function (res) {
			UI.menu.createLibrary.list = res.data.libraries;
			UI.menu.createSection.list = res.data.bookshelves;
			UI.menu.createBook.list = res.data.books;
		})
		.catch(function (res) {
			//TODO: show an error
		});

		UI.menu.selectLibrary.updateList();
		UI.menu.inventory.loadData();	
	};

	return UI;
});

// VirtualBookshelf.UI.initControlsEvents = function() {
	// VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	// VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	// VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	// VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'text');
	// VirtualBookshelf.UI.menu.createBook.authorSize.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'size');
	// VirtualBookshelf.UI.menu.createBook.authorColor.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'color');
	// VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'text');
	// VirtualBookshelf.UI.menu.createBook.titleSize.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'size');
	// VirtualBookshelf.UI.menu.createBook.titleColor.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'color');
	// VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	// VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;
// };

// create book

// VirtualBookshelf.UI.showCreateBook = function() {
// 	var menuNode = VirtualBookshelf.UI.menu.createBook;

// 	if(VirtualBookshelf.selected.isBook()) {
// 		menuNode.show();
// 		menuNode.setValues();
// 	} else if(VirtualBookshelf.selected.isSection()) {
// 		var section = VirtualBookshelf.selected.object;
// 		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
// 		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
// 		if(freePosition) {
// 			menuNode.show();

// 			var dataObject = {
// 				model: menuNode.model.value, 
// 				texture: menuNode.texture.value, 
// 				cover: menuNode.cover.value,
// 				pos_x: freePosition.x,
// 				pos_y: freePosition.y,
// 				pos_z: freePosition.z,
// 				sectionId: section.dataObject.id,
// 				shelfId: shelf.id,
// 				userId: VirtualBookshelf.user.id
// 			};

// 			VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 				book.parent = shelf;
// 				VirtualBookshelf.selected.object = book;
// 				VirtualBookshelf.selected.get();
// 			});
// 		} else {
// 			alert('There is no free space on selected shelf.');
// 		}
// 	}
// }

// VirtualBookshelf.UI.changeModel = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var oldBook = VirtualBookshelf.selected.object;
// 		var dataObject = {
// 			model: this.value,
// 			texture: oldBook.texture.toString(),
// 			cover: oldBook.cover.toString()
// 		};

// 		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 			book.copyState(oldBook);
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookTexture = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.texture.load(this.value, false, function () {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookCover = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.cover.load(this.value, true, function() {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeSpecificValue = function(field, property) {
// 	return function () {
// 		if(VirtualBookshelf.selected.isBook()) {
// 			VirtualBookshelf.selected.object[field][property] = this.value;
// 			VirtualBookshelf.selected.object.updateTexture();
// 		}
// 	};
// };

// VirtualBookshelf.UI.switchEdited = function() {
// 	var activeElemets = document.querySelectorAll('a.activeEdit');

// 	for(var i = activeElemets.length - 1; i >= 0; i--) {
// 		activeElemets[i].className = 'inactiveEdit';
// 	};

// 	var previousEdited = VirtualBookshelf.UI.menu.createBook.edited;
// 	var currentEdited = this.getAttribute('edit');

// 	if(previousEdited != currentEdited) {
// 		this.className = 'activeEdit';
// 		VirtualBookshelf.UI.menu.createBook.edited = currentEdited;
// 	} else {
// 		VirtualBookshelf.UI.menu.createBook.edited = null;
// 	}
// }

// VirtualBookshelf.UI.saveBook = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;

// 		VirtualBookshelf.selected.put();
// 		book.save();
// 	}
// }

// VirtualBookshelf.UI.cancelBookEdit = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
		
// 		VirtualBookshelf.selected.put();
// 		book.refresh();
// 	}
// }
angular.module('VirtualBookshelf')
.factory('User', function ($log, Data) {
	var loaded = false;

	var User = {
		_dataObject: null,
		_position: null,
		_library: null,

		load: function() {
			var scope = this;
			$log.log('user loading');

			return Data.getUser().then(function (res) {
				scope.setDataObject(res.data);
				scope.setLibrary();
				loaded = true;
			});
		},
		setDataObject: function(dataObject) {
			this._dataObject = dataObject;
		},
		getLibrary: function() {
			return this._library;
		},
		setLibrary: function(libraryId) {
			this._library = libraryId || window.location.pathname.substring(1);
		},
		getId: function() {
			return this._dataObject && this._dataObject.id;
		},
		isAuthorized: function() {
			return Boolean(this._dataObject);
		},
		isLoaded: function() {
			return loaded;
		}
	};

	return User;
});

angular.module('VirtualBookshelf')
.factory('BaseObject', function () {
	var BaseObject = function(dataObject, geometry, material) {
		THREE.Mesh.call(this, geometry, material);

		this.dataObject = dataObject || {};
		this.dataObject.rotation = this.dataObject.rotation || [0, 0, 0];
		
		this.id = this.dataObject.id;
		this.position = new THREE.Vector3(this.dataObject.pos_x, this.dataObject.pos_y, this.dataObject.pos_z);
		this.rotation.order = 'XYZ';
		this.rotation.fromArray(this.dataObject.rotation.map(Number));

		this.updateMatrix();

		//TODO: research, after caching geometry this can be run once
		this.geometry.computeBoundingBox();
		
		this.updateBoundingBox();		
	};
	
	BaseObject.prototype = new THREE.Mesh();
	BaseObject.prototype.constructor = BaseObject;

	BaseObject.prototype.getType = function() {
		return this.type;
	};

	BaseObject.prototype.isOutOfParrent = function() {
		return Math.abs(this.boundingBox.center.x - this.parent.boundingBox.center.x) > (this.parent.boundingBox.radius.x - this.boundingBox.radius.x)
			//|| Math.abs(this.boundingBox.center.y - this.parent.boundingBox.center.y) > (this.parent.boundingBox.radius.y - this.boundingBox.radius.y)
			|| Math.abs(this.boundingBox.center.z - this.parent.boundingBox.center.z) > (this.parent.boundingBox.radius.z - this.boundingBox.radius.z);
	};

	BaseObject.prototype.isCollided = function() {
		var
			result,
			targets,
			target,
			i;

		this.updateBoundingBox();

		result = this.isOutOfParrent();
		targets = this.parent.children;

		if(!result) {
			for(i = targets.length - 1; i >= 0; i--) {
				target = targets[i].boundingBox;

				if(targets[i] === this
				|| (Math.abs(this.boundingBox.center.x - target.center.x) > (this.boundingBox.radius.x + target.radius.x))
				|| (Math.abs(this.boundingBox.center.y - target.center.y) > (this.boundingBox.radius.y + target.radius.y))
				|| (Math.abs(this.boundingBox.center.z - target.center.z) > (this.boundingBox.radius.z + target.radius.z))) {	
					continue;
				}

		    	result = true;		
		    	break;
			}
		}

		return result;
	};

	BaseObject.prototype.move = function(newPosition) {
		var 
			currentPosition,
			result;

		result = false;
		currentPosition = this.position.clone();
		
		if(newPosition.x) {
			this.position.setX(newPosition.x);

			if(this.isCollided()) {
				this.position.setX(currentPosition.x);
			} else {
				result = true;
			}
		}

		if(newPosition.z) {
			this.position.setZ(newPosition.z);

			if(this.isCollided()) {
				this.position.setZ(currentPosition.z);
			} else {
				result = true;
			}
		}

		this.changed = this.changed || result;
		this.updateBoundingBox();

		return result;
	};

	BaseObject.prototype.rotate = function(dX, dY, isDemo) {
		var 
			currentRotation = this.rotation.clone(),
			result = false; 
		
		if(dX) {
			this.rotation.y += dX * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.y = currentRotation.y;
			} else {
				result = true;
			}
		}

		if(dY) {
			this.rotation.x += dY * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.x = currentRotation.x;
			} else {
				result = true;
			}
		}

		this.changed = this.changed || (!isDemo && result);
		this.updateBoundingBox();
	};

	BaseObject.prototype.updateBoundingBox = function() {
		var
			boundingBox,
			radius,
			center;

		this.updateMatrix();
		boundingBox = this.geometry.boundingBox.clone().applyMatrix4(this.matrix);
		
		radius = {
			x: (boundingBox.max.x - boundingBox.min.x) * 0.5,
			y: (boundingBox.max.y - boundingBox.min.y) * 0.5,
			z: (boundingBox.max.z - boundingBox.min.z) * 0.5
		};

		center = new THREE.Vector3(
			radius.x + boundingBox.min.x,
			radius.y + boundingBox.min.y,
			radius.z + boundingBox.min.z
		);

		this.boundingBox = {
			radius: radius,
			center: center
		};
	};

	BaseObject.prototype.reload = function() {
		this.position.setX(this.dataObject.pos_x);
		this.position.setY(this.dataObject.pos_y);
		this.position.setZ(this.dataObject.pos_z);
		this.rotation.set(0, 0, 0);
	};

	return BaseObject;	
});
angular.module('VirtualBookshelf')
.factory('BookObject', function (BaseObject, CanvasText, CanvasImage, Data) {	
	var BookObject = function(dataObject, geometry, material, mapImage, coverImage) {
		BaseObject.call(this, dataObject, geometry, material);
		
		this.model = this.dataObject.model;
		this.canvas = material.map.image;
		this.texture = new CanvasImage(null, null, mapImage);
		this.cover = new CanvasImage(this.dataObject.coverPos, this.dataObject.cover, coverImage);
		this.author = new CanvasText(this.dataObject.author, this.dataObject.authorFont);
		this.title = new CanvasText(this.dataObject.title, this.dataObject.titleFont);

		this.updateTexture();
	};

	BookObject.TYPE = 'BookObject';

	BookObject.prototype = new BaseObject();
	BookObject.prototype.constructor = BookObject;
	BookObject.prototype.textNodes = ['author', 'title'];
	BookObject.prototype.type = BookObject.TYPE;

	BookObject.prototype.updateTexture = function() {
		var context = this.canvas.getContext('2d');
		var cover = this.cover;

		if(this.texture.image) {
			context.drawImage(this.texture.image, 0, 0);
		}

		if(cover.image) {
			var diff = cover.y + cover.height - Data.COVER_MAX_Y;
		 	var limitedHeight = diff > 0 ? cover.height - diff : cover.height;
		 	var cropHeight = diff > 0 ? cover.image.naturalHeight - (cover.image.naturalHeight / cover.height * diff) : cover.image.naturalHeight;

			context.drawImage(cover.image, 0, 0, cover.image.naturalWidth, cropHeight, cover.x, cover.y, cover.width, limitedHeight);
		}

		for(var i = this.textNodes.length - 1; i >= 0; i--) {
			var textNode = this[this.textNodes[i]];

			if(textNode.isValid()) {

				context.font = textNode.getFont();
				context.fillStyle = textNode.color;
		    	context.fillText(textNode.text, textNode.x, textNode.y, textNode.width);
		    }
		}

		this.material.map.needsUpdate = true;
	};
	BookObject.prototype.moveElement = function(dX, dY, element) {
		var element = element && this[element];
		
		if(element) {
			if(element.move) {
				element.move(dX, dY);
			} else {
				element.x += dX;
				element.y += dY;
			}

			this.updateTexture();
		}
	};
	BookObject.prototype.scaleElement = function(dX, dY) {
		this.cover.width += dX;
		this.cover.height += dY;
		this.updateTexture();
	};
	BookObject.prototype.save = function() {
		var scope = this;

		this.dataObject.model = this.model;
		this.dataObject.texture = this.texture.toString();
		this.dataObject.cover = this.cover.toString();
		this.dataObject.coverPos = this.cover.serializeProperties();
		this.dataObject.author = this.author.toString();
		this.dataObject.authorFont = this.author.serializeFont();
		this.dataObject.title = this.title.toString();
		this.dataObject.titleFont = this.title.serializeFont();
		this.dataObject.pos_x = this.position.x;
		this.dataObject.pos_y = this.position.y;
		this.dataObject.pos_z = this.position.z;

		Data.postBook(this.dataObject, function(err, result) {
			if(!err && result) {
				scope.dataObject = result;
				scope.changed = false;
			} else {
				//TODO: hide edit, notify user
			}
		});
	};
	BookObject.prototype.refresh = function() {
		var scope = this;
		//TODO: use in constructor instead of separate images loading
		scope.texture.load(scope.dataObject.texture, false, function () {
			scope.cover.load(scope.dataObject.cover, true, function() {
				scope.model = scope.dataObject.model;
				scope.cover.parseProperties(scope.dataObject.coverPos);
				scope.author.setText(scope.dataObject.author);
				scope.author.parseProperties(scope.dataObject.authorFont);
				scope.title.setText(scope.dataObject.title);
				scope.title.parseProperties(scope.dataObject.titleFont);

				scope.updateTexture();
			});
		});
	};
	BookObject.prototype.copyState = function(book) {
		if(book instanceof BookObject) {
			var fields = ['dataObject', 'position', 'rotation', 'model', 'texture', 'cover', 'author', 'title'];
			for(var i = fields.length - 1; i >= 0; i--) {
				var field = fields[i];
				this[field] = book[field];
			};

			this.updateTexture();
			book.parent.add(this);
			book.parent.remove(book);
			VirtualBookshelf.selected.object = this;
		}
	};
	BookObject.prototype.setParent = function(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.shelfId = parent.id;
				this.dataObject.sectionId = parent.parent.id;
			} else {
				this.parent.remove(this);
				this.dataObject.shelfId = null;
				this.dataObject.sectionId = null;
			}
		}
	};

	return BookObject;
});
angular.module('VirtualBookshelf')
.factory('CameraObject', function (BaseObject) {
	var CameraObject = function() {
		BaseObject.call(this);
	};

	CameraObject.prototype = new BaseObject();
	
	CameraObject.prototype.constructor = CameraObject;
	
	CameraObject.prototype.updateBoundingBox = function() {
		var radius = {x: 0.1, y: 1, z: 0.1};
		var center = new THREE.Vector3(0, 0, 0);

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	};

	return CameraObject;
});
angular.module('VirtualBookshelf')
.factory('CanvasImage', function ($q, Data) {
	var CanvasImage = function(properties, link, image) {
		this.link = link || '';
		this.image = image;
		this.parseProperties(properties);
	};
	
	CanvasImage.prototype = {
		constructor: CanvasImage,

		toString: function() {
			return this.link;
		},
		parseProperties: function(properties) {
			var args = properties && properties.split(',') || [];

			this.x = Number(args[0]) || Data.COVER_FACE_X;
			this.y = Number(args[1]) || 0;
			this.width = Number(args[2]) || 216;
			this.height = Number(args[3]) || Data.COVER_MAX_Y;
		},
		serializeProperties: function() {
			return [this.x, this.y, this.width, this.height].join(',');
		}
	};

	return CanvasImage;
});
angular.module('VirtualBookshelf')
.factory('CanvasText', function (Data) {
	var CanvasText = function(text, properties) {
		this.text = text || '';
		this.parseProperties(properties);
	};

	CanvasText.prototype = {
		constructor: CanvasText,
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
			this.size = args[1] || 14;
			this.font = args[2] || 'Arial';
			this.x = Number(args[3]) || Data.COVER_FACE_X;
			this.y = Number(args[4]) || 10;
			this.color = args[5] || 'black';
			this.width = args[6] || 512;
		},
		move: function(dX, dY) {
			this.x += dX;
			this.y += dY;

			if(this.x <= 0) this.x = 1;
			if(this.y <= 0) this.y = 1;
			if(this.x >= Data.TEXTURE_RESOLUTION) this.x = Data.TEXTURE_RESOLUTION;
			if(this.y >= Data.COVER_MAX_Y) this.y = Data.COVER_MAX_Y;
		}
	};

	return CanvasText;
});
angular.module('VirtualBookshelf')
.factory('LibraryObject', function (BaseObject, Data) {
	var LibraryObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);
		this.libraryObject = params.libraryObject || {};//TODO: research
	};
	LibraryObject.prototype = new BaseObject();
	LibraryObject.prototype.constructor = LibraryObject;

	return LibraryObject;	
});
angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, Data) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(var key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
	};

	SectionObject.TYPE = 'SectionObject';

	SectionObject.prototype = new BaseObject();
	SectionObject.prototype.constructor = SectionObject;
	SectionObject.prototype.type = SectionObject.TYPE;

	SectionObject.prototype.save = function() {
		var scope = this;

		this.dataObject.pos_x = this.position.x;
		this.dataObject.pos_y = this.position.y;
		this.dataObject.pos_z = this.position.z;

		this.dataObject.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];

		Data.postSection(this.dataObject).then(function (dto) {
			scope.dataObject = dto;
			scope.changed = false;
		}).catch(function (res) {
			//TODO: hide edit, notify user
		});
	};

	return SectionObject;
});
angular.module('VirtualBookshelf')
.factory('SelectorMeta', function () {
	var SelectorMeta = function(selectedObject) {
		if(selectedObject) {
			this.id = selectedObject.id;
			this.parentId = selectedObject.parent.id;
			this.type = selectedObject.getType();
		}
	};

	SelectorMeta.prototype.isEmpty = function() {
		return !this.id;
	};

	SelectorMeta.prototype.equals = function(meta) {
		return !(!meta
				|| meta.id !== this.id
				|| meta.parentId !== this.parentId
				|| meta.type !== this.type);
	};
	
	return SelectorMeta;
});
angular.module('VirtualBookshelf')
.factory('ShelfObject', function (BaseObject) {
	var ShelfObject = function(params) {
		var size = params.size || [1,1,1];	
		var material = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
		BaseObject.call(this, params, new THREE.CubeGeometry(size[0], size[1], size[2]), material);

		this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		this.visible = false;
	};

	ShelfObject.TYPE = 'ShelfObject';

	ShelfObject.prototype = new BaseObject();
	ShelfObject.prototype.constructor = ShelfObject;
	ShelfObject.prototype.type = ShelfObject.TYPE;


	return ShelfObject;
});
angular.module('VirtualBookshelf')
.factory('locator', function ($q, Data, selector, environment, cache) {
	var locator = {};

	locator.placeBook = function(bookDto) {
		var promise;
		var shelf = selector.isSelectedShelf() && selector.getSelectedObject();

		if(shelf) {
			promise = cache.getBook(bookDto.model).then(function (bookCache) {
				var shelfBB = shelf.geometry.boundingBox;
				var bookBB = bookCache.geometry.boundingBox;
				var freePlace = getFreePlace(shelf.children, shelfBB, bookBB);

				if(freePlace) {
					bookDto.shelfId = shelf.id;
					bookDto.sectionId = shelf.parent.id;
					bookDto.pos_x = freePlace.x;
					bookDto.pos_y = freePlace.y;
					bookDto.pos_z = freePlace.z;

					return Data.postBook(bookDto);
				} else {
					return $q.reject('there is no free space');
				}
			}).then(function () {
				return environment.updateBook(bookDto);
			});
		} else {
			promise = $q.reject('shelf is not selected');
		}

		return promise;
	};

	locator.unplaceBook = function(bookDto) {
		var promise;
		bookDto.sectionId = null;

		promise = Data.postBook(bookDto).then(function () {
			return environment.updateBook(bookDto);
		});

		return promise;
	};

	var getFreePlace = function(objects, spaceBB, targetBB) {
		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x, 0, 0);
		var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
		var freeCells = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);
		var result;

		if(freeCells) {
			var freePosition = getPositionFromCells(freeCells, matrixPrecision);
			var bottomY = getBottomY(spaceBB, targetBB);

			result = new THREE.Vector3(freePosition, bottomY, 0);
		}

		return result
	};

	var getBottomY = function(spaceBB, targetBB) {
		return spaceBB.min.y - targetBB.min.y;
	};

	var getFreeMatrixCells = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var result = null;
		var targetCellsSize = 1;
		var freeCellsCount = 0;
		var freeCellsStart;
		var cellIndex;

		var minCell = Math.floor(spaceBB.min.x / matrixPrecision.x) + 1;
		var maxCell = Math.floor(spaceBB.max.x / matrixPrecision.x) - 1;

		for (cellIndex = minCell; cellIndex <= maxCell; cellIndex++) {
			if (!occupiedMatrix[cellIndex]) {
				if (!freeCellsCount) {
					freeCellsStart = cellIndex;
				}
				freeCellsCount++;

				if(freeCellsCount === targetCellsSize) {
					break;
				}
			} else {
				freeCellsCount = 0;
				freeCellsStart = null;
			}
		}

		if(freeCellsCount) {
			result = [];

			for (cellIndex = freeCellsStart; cellIndex < freeCellsStart + freeCellsCount; cellIndex++) {
				result.push(cellIndex);
			}
		}

		return result;
	};

	var getPositionFromCells = function(cells, matrixPrecision) {
		var size = cells.length * matrixPrecision.x;
		var result = cells[0] * matrixPrecision.x + size * 0.5;

		return result;
	};

	var getOccupiedMatrix = function(objects, matrixPrecision) {
		var result = {};

		for (var objectIndex = objects.length - 1; objectIndex >= 0; objectIndex--) {
			var objectBB = objects[objectIndex].geometry.boundingBox;
			var objPos = objects[objectIndex].position;
			var minKey = Math.floor((objPos.x + objectBB.min.x) / matrixPrecision.x);
			var maxKey = Math.floor((objPos.x + objectBB.max.x) / matrixPrecision.x);

			result[minKey] = true;
			result[maxKey] = true;
		}

		return result;
	};

	return locator;	
});
angular.module('VirtualBookshelf')
.factory('selector', function ($rootScope, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, environment) {
	var selector = {};
	
	var selected = new SelectorMeta();
	var focused = new SelectorMeta();

	selector.focus = function(meta) {
		if(!meta.equals(focused)) {
			if(!focused.equals(selected)) {
				unhighlight(focused);
			}

			focused = meta;

			if(!focused.isEmpty() && !focused.equals(selected)) {
				highlight(focused, 0x55ffff);
			}
		}
	};

	var highlight = function(meta, color) {
		var obj = getObject(meta);

		obj && obj.material.color.setHex(color);
		isShelf(meta) && (obj.visible = true);
	};

	var unhighlight = function(meta) {
		var obj = getObject(meta);

		obj && obj.material.color.setHex(0xffffff);
		isShelf(meta) && (obj.visible = false);
	};

	selector.selectFocused = function() {
		var meta = focused;

		selector.select(meta);
		$rootScope.$apply();
	};

	selector.select = function(meta) {
		if(!meta.equals(selected)) {
			selector.unselect();
			selected = meta;
			highlight(selected, 0x55ff55);
		}
	};

	selector.unselect = function() {
		if(!selected.isEmpty()) {
			unhighlight(selected);
			selected = new SelectorMeta();
		}
	};

	selector.getSelectedObject = function() {
		return getObject(selected);
	};

	var getObject = function(meta) {
		var object;

		if(!meta.isEmpty()) {
			object = isShelf(meta) ? environment.getShelf(meta.parentId, meta.id)
				: isBook(meta) ? environment.getBook(meta.id)
				: isSection(meta) ? environment.getSection(meta.id)
				: null;
		}

		return object;	
	};

	selector.isBookSelected = function(id) {
		return isBook(selected) && selected.id === id;
	};

	selector.isSelectedShelf = function() {
		return isShelf(selected);
	};

	selector.isSelectedBook = function() {
		return isBook(selected);
	};

	selector.isSelectedSection = function() {
		return isSection(selected);
	};

	var isShelf = function(meta) {
		return meta.type === ShelfObject.TYPE;
	};

	var isBook = function(meta) {
		return meta.type === BookObject.TYPE;
	};

	var isSection = function(meta) {
		return meta.type === SectionObject.TYPE;
	};

	return selector;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0LmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91aS5qcyIsInNlcnZpY2VzL3VzZXIuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQmFzZU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9Cb29rT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0NhbWVyYU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNJbWFnZS5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNUZXh0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2hlbGZPYmplY3QuanMiLCJzZXJ2aWNlcy9zY2VuZS9sb2NhdG9yLmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnLCBbJ2Jsb2NrVUknLCAnYW5ndWxhclV0aWxzLmRpcmVjdGl2ZXMuZGlyUGFnaW5hdGlvbiddKVxuICAgIFx0LmNvbmZpZyhmdW5jdGlvbiAoYmxvY2tVSUNvbmZpZywgcGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIpIHtcbiAgICBcdFx0YmxvY2tVSUNvbmZpZy5kZWxheSA9IDA7XG4gICAgXHRcdGJsb2NrVUlDb25maWcuYXV0b0Jsb2NrID0gZmFsc2U7XG5cdFx0XHRibG9ja1VJQ29uZmlnLmF1dG9JbmplY3RCb2R5QmxvY2sgPSBmYWxzZTtcblx0XHRcdHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyLnNldFBhdGgoJy9qcy9hbmd1bGFyL2RpclBhZ2luYXRpb24vZGlyUGFnaW5hdGlvbi50cGwuaHRtbCcpO1xuICAgIFx0fSlcbiAgICBcdC5ydW4oZnVuY3Rpb24gKE1haW4pIHtcblx0XHRcdE1haW4uc3RhcnQoKTtcbiAgICBcdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdVaUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBVSSkge1xuICAgICRzY29wZS5tZW51ID0gVUkubWVudTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5kaXJlY3RpdmUoJ3ZiU2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcbiAgICBcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmw6ICcvdWkvc2VsZWN0LmVqcycsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdHNlbGVjdGVkOiAnPScsXG5cdFx0XHR2YWx1ZTogJ0AnLFxuXHRcdFx0bGFiZWw6ICdAJ1xuXHRcdH0sXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlKSB7XG5cdFx0XHRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHNjb3BlLnNlbGVjdGVkID0gaXRlbVtzY29wZS52YWx1ZV07XG5cdFx0XHR9O1xuXG5cdFx0XHRzY29wZS5pc1NlbGVjdGVkID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gc2NvcGUuc2VsZWN0ZWQgPT09IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhY2hlJywgZnVuY3Rpb24gKCRxLCBEYXRhKSB7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0ge307XG5cdHZhciBib29rcyA9IHt9O1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0Y2FjaGUuaW5pdCA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKSB7XG5cdFx0dmFyIGxpYnJhcnlMb2FkID0gbG9hZExpYnJhcnlEYXRhKGxpYnJhcnlNb2RlbCk7XG5cdFx0dmFyIHNlY3Rpb25zTG9hZCA9IFtdO1xuXHRcdHZhciBib29rc0xvYWQgPSBbXTtcblx0XHR2YXIgaW1hZ2VzTG9hZCA9IFtdO1xuXHRcdHZhciBtb2RlbCwgdXJsOyAvLyBpdGVyYXRvcnNcblxuXHRcdGZvciAobW9kZWwgaW4gc2VjdGlvbk1vZGVscykge1xuXHRcdFx0c2VjdGlvbnNMb2FkLnB1c2goYWRkU2VjdGlvbihtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAobW9kZWwgaW4gYm9va01vZGVscykge1xuXHRcdFx0Ym9va3NMb2FkLnB1c2goYWRkQm9vayhtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAodXJsIGluIGltYWdlVXJscykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlKHVybCkpO1xuXHRcdH1cblxuXHRcdHZhciBwcm9taXNlID0gJHEuYWxsKHtcblx0XHRcdGxpYnJhcnlDYWNoZTogbGlicmFyeUxvYWQsIFxuXHRcdFx0c2VjdGlvbnNMb2FkOiAkcS5hbGwoc2VjdGlvbnNMb2FkKSwgXG5cdFx0XHRib29rc0xvYWQ6ICRxLmFsbChib29rc0xvYWQpLFxuXHRcdFx0aW1hZ2VzTG9hZDogJHEuYWxsKGltYWdlc0xvYWQpXG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0bGlicmFyeSA9IHJlc3VsdHMubGlicmFyeUNhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Y2FjaGUuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaWJyYXJ5O1xuXHR9O1xuXG5cdGNhY2hlLmdldFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoc2VjdGlvbnMsIG1vZGVsLCBhZGRTZWN0aW9uKTtcblx0fTtcblxuXHRjYWNoZS5nZXRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGJvb2tzLCBtb2RlbCwgYWRkQm9vayk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0SW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGltYWdlcywgdXJsLCBhZGRJbWFnZSk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkdldHRlciA9IGZ1bmN0aW9uKGZyb20sIGtleSwgYWRkRnVuY3Rpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0gZnJvbVtrZXldO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0cmVzdWx0ID0gYWRkRnVuY3Rpb24oa2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEud2hlbihyZXN1bHQpO1xuXHR9O1xuXG5cdHZhciBjb21tb25BZGRlciA9IGZ1bmN0aW9uKHdoZXJlLCB3aGF0LCBsb2FkZXIsIGtleSkge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVtrZXkgfHwgd2hhdF0gPSBsb2FkZWRDYWNoZTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBhZGRTZWN0aW9uID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoc2VjdGlvbnMsIG1vZGVsLCBsb2FkU2VjdGlvbkRhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoYm9va3MsIG1vZGVsLCBsb2FkQm9va0RhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZSA9IGZ1bmN0aW9uKHVybCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihpbWFnZXMsICcvb3V0c2lkZT9saW5rPScgKyB1cmwsIERhdGEubG9hZEltYWdlLCB1cmwpO1xuXHR9O1xuXG5cdHZhciBsb2FkTGlicmFyeURhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzb24nO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRTZWN0aW9uRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9zZWN0aW9ucy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCksIFxuICAgICAgICBcdGRhdGE6IERhdGEuZ2V0RGF0YShkYXRhVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZEJvb2tEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBEYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCkgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHJldHVybiBjYWNoZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmEnLCBmdW5jdGlvbiAoQ2FtZXJhT2JqZWN0KSB7XG5cdHZhciBDYW1lcmEgPSB7XG5cdFx0SEVJR1RIOiAxLjUsXG5cdFx0b2JqZWN0OiBuZXcgQ2FtZXJhT2JqZWN0KCksXG5cdFx0c2V0UGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdH0sXG5cdFx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHRcdH1cblx0fTtcblxuXHRDYW1lcmEuaW5pdCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRDYW1lcmEuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aWR0aCAvIGhlaWdodCwgMC4wMSwgNTApO1xuXHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgQ2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHR0aGlzLm9iamVjdC5hZGQoY2FuZGxlKTtcblxuXHRcdHRoaXMub2JqZWN0LmFkZChDYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRDYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Q2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdENhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLyogXG4gKiBjb250cm9scy5qcyBpcyBhIHNlcnZpY2UgZm9yIHByb2Nlc3Npbmcgbm90IFVJKG1lbnVzKSBldmVudHMgXG4gKiBsaWtlIG1vdXNlLCBrZXlib2FyZCwgdG91Y2ggb3IgZ2VzdHVyZXMuXG4gKlxuICogVE9ETzogcmVtb3ZlIGFsbCBidXNpbmVzIGxvZ2ljIGZyb20gdGhlcmUgYW5kIGxlYXZlIG9ubHlcbiAqIGV2ZW50cyBmdW5jdGlvbmFsaXR5IHRvIG1ha2UgaXQgbW9yZSBzaW1pbGFyIHRvIHVzdWFsIGNvbnRyb2xsZXJcbiAqL1xuLmZhY3RvcnkoJ0NvbnRyb2xzJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBTZWxlY3Rvck1ldGEsIEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBDYW1lcmEsIERhdGEsIG5hdmlnYXRpb24sIGVudmlyb25tZW50LCBtb3VzZSwgc2VsZWN0b3IpIHtcblx0dmFyIENvbnRyb2xzID0ge307XG5cblx0Q29udHJvbHMuQlVUVE9OU19ST1RBVEVfU1BFRUQgPSAxMDA7XG5cdENvbnRyb2xzLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5cdENvbnRyb2xzLlBvY2tldCA9IHtcblx0XHRfYm9va3M6IHt9LFxuXG5cdFx0c2VsZWN0T2JqZWN0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHZhciBcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHRoaXMuX2Jvb2tzW3RhcmdldC52YWx1ZV1cblxuXHRcdFx0RGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5yZW1vdmUoZGF0YU9iamVjdC5pZCk7XG5cdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdChib29rLCBudWxsKTtcblx0XHRcdFx0Ly8gYm9vay5jaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dGhpcy5fYm9va3NbaWRdID0gbnVsbDtcblx0XHRcdGRlbGV0ZSB0aGlzLl9ib29rc1tpZF07XG5cdFx0fSxcblx0XHRwdXQ6IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRcdHRoaXMuX2Jvb2tzW2RhdGFPYmplY3QuaWRdID0gZGF0YU9iamVjdDtcblx0XHR9LFxuXHRcdGdldEJvb2tzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9ib29rcztcblx0XHR9LFxuXHRcdGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Jvb2tzLmxlbmd0aCA9PSAwO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5zZWxlY3RlZCA9IHtcblx0XHRvYmplY3Q6IG51bGwsXG5cdFx0Ly8gcGFyZW50OiBudWxsLFxuXHRcdGdldHRlZDogbnVsbCxcblx0XHQvLyBwb2ludDogbnVsbCxcblxuXHRcdGlzQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKTtcblx0XHR9LFxuXHRcdGlzU2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcblx0XHR9LFxuXHRcdGlzU2hlbGY6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpO1xuXHRcdH0sXG5cdFx0aXNNb3ZhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMuaXNCb29rKCkgfHwgdGhpcy5pc1NlY3Rpb24oKSk7XG5cdFx0fSxcblx0XHRpc1JvdGF0YWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLmlzU2VjdGlvbigpKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IG51bGw7XG5cdFx0XHR0aGlzLmdldHRlZCA9IG51bGw7XG5cdFx0fSxcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCgpO1xuXG5cdFx0XHQvLyB0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHQvLyB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cblx0XHR9LFxuXHRcdHJlbGVhc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdC8vVE9ETzogdGhlcmUgaXMgbm8gc2VsZWN0ZWQgb2JqZWN0IGFmdGVyIHJlbW92ZSBmcm9tZSBzY2VuZVxuXHRcdFx0aWYodGhpcy5pc0Jvb2soKSAmJiAhc2VsZWN0ZWRPYmplY3QucGFyZW50KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5wdXQoc2VsZWN0ZWRPYmplY3QuZGF0YU9iamVjdCk7XG5cdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zYXZlKCk7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5pc0Jvb2soKSAmJiAhdGhpcy5pc0dldHRlZCgpKSB7XG5cdFx0XHRcdHRoaXMuZ2V0dGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5wYXJlbnQgPSB0aGlzLm9iamVjdC5wYXJlbnQ7XG5cdFx0XHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uLnNldCgwLCAwLCAtdGhpcy5vYmplY3QuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogLSAwLjI1KTtcblx0XHRcdFx0Q2FtZXJhLmNhbWVyYS5hZGQodGhpcy5vYmplY3QpO1x0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wdXQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHB1dDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHRcdFx0dGhpcy5vYmplY3QucmVsb2FkKCk7Ly9wb3NpdGlvblxuXHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0dldHRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0Jvb2soKSAmJiB0aGlzLmdldHRlZDtcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdGlmKHRoaXMuaXNNb3ZhYmxlKCkgJiYgc2VsZWN0ZWRPYmplY3QuY2hhbmdlZCkge1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zYXZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRDb250cm9scy5jbGVhcigpO1xuXHRcdENvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcblx0fTtcblxuXHRDb250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBDb250cm9scy5vbkRibENsaWNrLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgQ29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgQ29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgQ29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRcdGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZmFsc2U7fVxuXHR9O1xuXG5cdENvbnRyb2xzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdFx0Q29udHJvbHMuc2VsZWN0ZWQuY2xlYXIoKTtcdFxuXHR9O1xuXG5cdENvbnRyb2xzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFDb250cm9scy5zZWxlY3RlZC5pc0dldHRlZCgpKSB7XG5cdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKG1vdXNlLmxvbmdYLCBtb3VzZS5sb25nWSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKChtb3VzZVsxXSAmJiBtb3VzZVszXSkgfHwgbmF2aWdhdGlvbi5zdGF0ZS5mb3J3YXJkKSB7XG5cdFx0XHRcdENhbWVyYS5nbyh0aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUuYmFja3dhcmQpIHtcblx0XHRcdFx0Q2FtZXJhLmdvKC10aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUubGVmdCkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKHRoaXMuQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUucmlnaHQpIHtcblx0XHRcdFx0Q2FtZXJhLnJvdGF0ZSgtdGhpcy5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEV2ZW50c1xuXG5cdENvbnRyb2xzLm9uRGJsQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRcdHN3aXRjaChldmVudC53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE6IENvbnRyb2xzLnNlbGVjdGVkLmdldCgpOyBicmVhaztcblx0XHRcdH0gICBcdFxuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlRG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UuZG93bihldmVudCk7IFxuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSB8fCBtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTsvL1RPRE86IHJlc2VhcmNoIChlbmFibGVkIGNhbm5vdCBzZXQgY3Vyc29yIHRvIGlucHV0KVxuXG5cdFx0XHRpZihtb3VzZVsxXSAmJiAhbW91c2VbM10gJiYgIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYobW91c2UuaXNQb2NrZXRCb29rKCkpIHtcblx0XHRcdFx0XHRDb250cm9scy5Qb2NrZXQuc2VsZWN0T2JqZWN0KG1vdXNlLnRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS51cChldmVudCk7XG5cdFx0XG5cdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHQgY2FzZSAxOiBDb250cm9scy5zZWxlY3RlZC5yZWxlYXNlKCk7IGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UubW92ZShldmVudCk7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0IFx0aWYoIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdKSB7XHRcdFxuXHRcdFx0XHRcdENvbnRyb2xzLm1vdmVPYmplY3QoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRDb250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdmFyIG9iaiA9IENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdDtcblxuXHRcdFx0XHQvLyBpZihvYmogaW5zdGFuY2VvZiBCb29rT2JqZWN0KSB7XG5cdFx0XHRcdC8vIFx0aWYobW91c2VbMV0pIHtcblx0XHRcdFx0Ly8gXHRcdG9iai5tb3ZlRWxlbWVudChtb3VzZS5kWCwgbW91c2UuZFksIFVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gXHRpZihtb3VzZVsyXSAmJiBVSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID09ICdjb3ZlcicpIHtcblx0XHRcdFx0Ly8gIFx0XHRvYmouc2NhbGVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyBcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRcdC8vICBcdFx0b2JqLnJvdGF0ZShtb3VzZS5kWCwgbW91c2UuZFksIHRydWUpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfSBcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8qKioqXG5cblx0Q29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdC8vIHBvaW50LFxuXHRcdFx0b2JqZWN0O1xuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSAmJiBlbnZpcm9ubWVudC5saWJyYXJ5KSB7XG5cdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTZWN0aW9uT2JqZWN0LCBCb29rT2JqZWN0XSk7XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2hlbGZPYmplY3RdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0XHQvLyBwb2ludCA9IGludGVyc2VjdGVkLnBvaW50OyBcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udHJvbHMuc2VsZWN0ZWQuc2VsZWN0KG9iamVjdCwgcG9pbnQpO1xuXHRcdFx0c2VsZWN0b3IuZm9jdXMobmV3IFNlbGVjdG9yTWV0YShvYmplY3QpKTtcblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMubW92ZU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBcblx0XHRcdG1vdXNlVmVjdG9yLFxuXHRcdFx0bmV3UG9zaXRpb24sXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdHBhcmVudCxcblx0XHRcdG9sZFBhcmVudDtcblx0XHR2YXIgc2VsZWN0ZWRPYmplY3Q7XG5cblx0XHRpZihDb250cm9scy5zZWxlY3RlZC5pc0Jvb2soKSB8fCAoQ29udHJvbHMuc2VsZWN0ZWQuaXNTZWN0aW9uKCkvKiAmJiBVSS5tZW51LnNlY3Rpb25NZW51LmlzTW92ZU9wdGlvbigpKi8pKSB7XG5cdFx0XHRzZWxlY3RlZE9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHRtb3VzZVZlY3RvciA9IENhbWVyYS5nZXRWZWN0b3IoKTtcdFxuXG5cdFx0XHRuZXdQb3NpdGlvbiA9IHNlbGVjdGVkT2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRvbGRQYXJlbnQgPSBzZWxlY3RlZE9iamVjdC5wYXJlbnQ7XG5cblx0XHRcdGlmKENvbnRyb2xzLnNlbGVjdGVkLmlzQm9vaygpKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NoZWxmT2JqZWN0XSk7XG5cdFx0XHRcdHNlbGVjdGVkT2JqZWN0LnNldFBhcmVudChpbnRlcnNlY3RlZCA/IGludGVyc2VjdGVkLm9iamVjdCA6IG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRwYXJlbnQgPSBzZWxlY3RlZE9iamVjdC5wYXJlbnQ7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmxvY2FsVG9Xb3JsZChuZXdQb3NpdGlvbik7XG5cblx0XHRcdFx0bmV3UG9zaXRpb24ueCAtPSAobW91c2VWZWN0b3IueiAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueCAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXHRcdFx0XHRuZXdQb3NpdGlvbi56IC09ICgtbW91c2VWZWN0b3IueCAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueiAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXG5cdFx0XHRcdHBhcmVudC53b3JsZFRvTG9jYWwobmV3UG9zaXRpb24pO1xuXHRcdFx0XHRpZighc2VsZWN0ZWRPYmplY3QubW92ZShuZXdQb3NpdGlvbikgJiYgQ29udHJvbHMuc2VsZWN0ZWQuaXNCb29rKCkpIHtcblx0XHRcdFx0XHRpZihwYXJlbnQgIT09IG9sZFBhcmVudCkge1xuXHRcdFx0XHRcdFx0c2VsZWN0ZWRPYmplY3Quc2V0UGFyZW50KG9sZFBhcmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fS8qIGVsc2UgaWYoVUkubWVudS5zZWN0aW9uTWVudS5pc1JvdGF0ZU9wdGlvbigpICYmIENvbnRyb2xzLnNlbGVjdGVkLmlzU2VjdGlvbigpKSB7XG5cdFx0XHRDb250cm9scy5zZWxlY3RlZC5vYmplY3Qucm90YXRlKENvbnRyb2xzLm1vdXNlLmRYKTtcdFx0XHRcblx0XHR9Ki9cblx0fTtcblxuXHRyZXR1cm4gQ29udHJvbHM7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdEYXRhJywgZnVuY3Rpb24gKCRodHRwLCAkcSkge1xuXHR2YXIgRGF0YSA9IHt9O1xuXG5cdERhdGEuVEVYVFVSRV9SRVNPTFVUSU9OID0gNTEyO1xuXHREYXRhLkNPVkVSX01BWF9ZID0gMzk0O1xuXHREYXRhLkNPVkVSX0ZBQ0VfWCA9IDI5NjtcblxuICAgIERhdGEubG9hZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICcnOyBcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgXG4gICAgICAgIGlmKGltZy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7IFxuICAgIH07XG5cblx0RGF0YS5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL3VzZXInKTtcblx0fTtcblxuXHREYXRhLmdldFVzZXJCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9mcmVlQm9va3MvJyArIHVzZXJJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0RGF0YS5wb3N0Qm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2Jvb2snLCBib29rKTtcblx0fTtcblxuXHREYXRhLmRlbGV0ZUJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHR1cmw6ICcvYm9vaycsXG5cdFx0XHRkYXRhOiBib29rLFxuXHRcdFx0aGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04J31cblx0XHR9KTtcblx0fTtcblxuXHREYXRhLmdldFVJRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9vYmovZGF0YS5qc29uJyk7XG5cdH07XG5cblx0RGF0YS5nZXRMaWJyYXJpZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyaWVzJyk7XG5cdH07XG5cblx0RGF0YS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2xpYnJhcnkvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0RGF0YS5wb3N0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xpYnJhcnkvJyArIGxpYnJhcnlNb2RlbCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEuZ2V0U2VjdGlvbnMgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3NlY3Rpb25zLycgKyBsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLnBvc3RTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkRhdGEpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9zZWN0aW9uJywgc2VjdGlvbkRhdGEpO1xuXHR9O1xuXG5cdERhdGEuZ2V0Qm9va3MgPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHQvL1RPRE86IHVzZXJJZFxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYm9va3MvJyArIHNlY3Rpb25JZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEubG9hZEdlb21ldHJ5ID0gZnVuY3Rpb24obGluaykge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdHZhciBqc29uTG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcblxuICAgICAgICAvL1RPRE86IGZvdW5kIG5vIHdheSB0byByZWplY3Rcblx0XHRqc29uTG9hZGVyLmxvYWQobGluaywgZnVuY3Rpb24gKGdlb21ldHJ5KSB7XG5cdFx0XHRkZWZmZXJlZC5yZXNvbHZlKGdlb21ldHJ5KTtcblx0XHR9KTtcblxuICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTtcblx0fTtcblxuXHREYXRhLmdldERhdGEgPSBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhXG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdEZlZWRiYWNrID0gZnVuY3Rpb24oZHRvKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvZmVlZGJhY2snLCBkdG8pO1xuXHR9O1xuXG5cdHJldHVybiBEYXRhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Vudmlyb25tZW50JywgZnVuY3Rpb24gKCRxLCAkbG9nLCBMaWJyYXJ5T2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBCb29rT2JqZWN0LCBEYXRhLCBDYW1lcmEsIGNhY2hlKSB7XG5cdHZhciBlbnZpcm9ubWVudCA9IHt9O1xuXHQgXG5cdHZhciBsaWJyYXJ5RHRvID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0gbnVsbDtcblx0dmFyIGJvb2tzID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5zY2VuZSA9IG51bGw7XG5cdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXG5cdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0Y2xlYXJTY2VuZSgpOyAvLyBpbml0cyBzb21lIGZpZWxkc1xuXG5cdFx0dmFyIHByb21pc2UgPSBEYXRhLmdldExpYnJhcnkobGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdHZhciBkaWN0ID0gcGFyc2VMaWJyYXJ5RHRvKGR0byk7XG5cdFx0XHRzZWN0aW9ucyA9IGRpY3Quc2VjdGlvbnM7XG5cdFx0XHRib29rcyA9IGRpY3QuYm9va3M7XG5cdFx0XHRsaWJyYXJ5RHRvID0gZHRvO1xuXG5cdFx0XHRyZXR1cm4gaW5pdENhY2hlKGxpYnJhcnlEdG8sIGRpY3Quc2VjdGlvbnMsIGRpY3QuYm9va3MpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0Y3JlYXRlTGlicmFyeShsaWJyYXJ5RHRvKTsgLy8gc3luY1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVNlY3Rpb25zKHNlY3Rpb25zKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjcmVhdGVCb29rcyhib29rcyk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRCb29rID0gZnVuY3Rpb24oYm9va0lkKSB7XG5cdFx0cmV0dXJuIGdldERpY3RPYmplY3QoYm9va3MsIGJvb2tJZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0U2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KHNlY3Rpb25zLCBzZWN0aW9uSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNoZWxmID0gZnVuY3Rpb24oc2VjdGlvbklkLCBzaGVsZklkKSB7XG5cdFx0dmFyIHNlY3Rpb24gPSBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKHNlY3Rpb25JZCk7XG5cdFx0dmFyIHNoZWxmID0gc2VjdGlvbiAmJiBzZWN0aW9uLnNoZWx2ZXNbc2hlbGZJZF07XG5cblx0XHRyZXR1cm4gc2hlbGY7XG5cdH07XG5cblx0dmFyIGdldERpY3RPYmplY3QgPSBmdW5jdGlvbihkaWN0LCBvYmplY3RJZCkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rbb2JqZWN0SWRdO1xuXHRcdHZhciBkaWN0T2JqZWN0ID0gZGljdEl0ZW0gJiYgZGljdEl0ZW0ub2JqO1xuXG5cdFx0cmV0dXJuIGRpY3RPYmplY3Q7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQudXBkYXRlQm9vayA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHZhciBzaGVsZiA9IGdldEJvb2tTaGVsZihkdG8pO1xuXG5cdFx0aWYoc2hlbGYpIHtcblx0XHRcdHJlbW92ZU9iamVjdChib29rcywgZHRvLmlkKTtcblx0XHRcdGNyZWF0ZUJvb2soZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlT2JqZWN0KGJvb2tzLCBkdG8uaWQpO1xuXHRcdH1cdFxuXHR9O1xuXG5cdGVudmlyb25tZW50LnJlbW92ZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KGJvb2tzLCBib29rRHRvLmlkKTtcblx0fTtcblxuXHR2YXIgcmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24oZGljdCwga2V5KSB7XG5cdFx0dmFyIGRpY3RJdGVtID0gZGljdFtrZXldO1xuXHRcdGlmKGRpY3RJdGVtKSB7XG5cdFx0XHRkZWxldGUgZGljdFtrZXldO1xuXHRcdFx0XG5cdFx0XHRpZihkaWN0SXRlbS5vYmopIHtcblx0XHRcdFx0ZGljdEl0ZW0ub2JqLnNldFBhcmVudChudWxsKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXRDYWNoZSA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8sIHNlY3Rpb25zRGljdCwgYm9va3NEaWN0KSB7XG5cdFx0dmFyIGxpYnJhcnlNb2RlbCA9IGxpYnJhcnlEdG8ubW9kZWw7XG5cdFx0dmFyIHNlY3Rpb25Nb2RlbHMgPSB7fTtcblx0XHR2YXIgYm9va01vZGVscyA9IHt9O1xuXHRcdHZhciBpbWFnZVVybHMgPSB7fTtcblxuXHRcdGZvciAodmFyIHNlY3Rpb25JZCBpbiBzZWN0aW9uc0RpY3QpIHtcblx0XHRcdHZhciBzZWN0aW9uRHRvID0gc2VjdGlvbnNEaWN0W3NlY3Rpb25JZF0uZHRvO1xuXHRcdFx0c2VjdGlvbk1vZGVsc1tzZWN0aW9uRHRvLm1vZGVsXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgYm9va0lkIGluIGJvb2tzRGljdCkge1xuXHRcdFx0dmFyIGJvb2tEdG8gPSBib29rc0RpY3RbYm9va0lkXS5kdG87XG5cdFx0XHRib29rTW9kZWxzW2Jvb2tEdG8ubW9kZWxdID0gdHJ1ZTtcblxuXHRcdFx0aWYoYm9va0R0by5jb3Zlcikge1xuXHRcdFx0XHRpbWFnZVVybHNbYm9va0R0by5jb3Zlcl0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjYWNoZS5pbml0KGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKTtcblx0fTtcblxuXHR2YXIgY2xlYXJTY2VuZSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vIENvbnRyb2xzLmNsZWFyKCk7XG5cdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IG51bGw7XG5cdFx0c2VjdGlvbnMgPSB7fTtcblx0XHRib29rcyA9IHt9O1xuXG5cdFx0d2hpbGUoZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdFx0aWYoZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW5bMF0uZGlzcG9zZSkge1xuXHRcdFx0XHRlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHRlbnZpcm9ubWVudC5zY2VuZS5yZW1vdmUoZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW5bMF0pO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgcGFyc2VMaWJyYXJ5RHRvID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciByZXN1bHQgPSB7XG5cdFx0XHRzZWN0aW9uczoge30sXG5cdFx0XHRib29rczoge31cblx0XHR9O1xuXG5cdFx0Zm9yKHZhciBzZWN0aW9uSW5kZXggPSBsaWJyYXJ5RHRvLnNlY3Rpb25zLmxlbmd0aCAtIDE7IHNlY3Rpb25JbmRleCA+PSAwOyBzZWN0aW9uSW5kZXgtLSkge1xuXHRcdFx0dmFyIHNlY3Rpb25EdG8gPSBsaWJyYXJ5RHRvLnNlY3Rpb25zW3NlY3Rpb25JbmRleF07XG5cdFx0XHRyZXN1bHQuc2VjdGlvbnNbc2VjdGlvbkR0by5pZF0gPSB7ZHRvOiBzZWN0aW9uRHRvfTtcblxuXHRcdFx0Zm9yKHZhciBib29rSW5kZXggPSBzZWN0aW9uRHRvLmJvb2tzLmxlbmd0aCAtIDE7IGJvb2tJbmRleCA+PSAwOyBib29rSW5kZXgtLSkge1xuXHRcdFx0XHR2YXIgYm9va0R0byA9IHNlY3Rpb25EdG8uYm9va3NbYm9va0luZGV4XTtcblx0XHRcdFx0cmVzdWx0LmJvb2tzW2Jvb2tEdG8uaWRdID0ge2R0bzogYm9va0R0b307XG5cdFx0XHR9XG5cblx0XHRcdGRlbGV0ZSBzZWN0aW9uRHRvLmJvb2tzO1xuXHRcdH1cblxuXHRcdGRlbGV0ZSBsaWJyYXJ5RHRvLnNlY3Rpb25zO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgY3JlYXRlTGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8pIHtcblx0XHR2YXIgbGlicmFyeSA9IG51bGw7XG5cdFx0dmFyIGxpYnJhcnlDYWNoZSA9IGNhY2hlLmdldExpYnJhcnkoKTtcbiAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShsaWJyYXJ5Q2FjaGUubWFwSW1hZ2UpO1xuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXG4gICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdGxpYnJhcnkgPSBuZXcgTGlicmFyeU9iamVjdChsaWJyYXJ5RHRvLCBsaWJyYXJ5Q2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHRDYW1lcmEuc2V0UGFyZW50KGxpYnJhcnkpO1xuXG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuYWRkKGxpYnJhcnkpO1xuXHRcdGVudmlyb25tZW50LmxpYnJhcnkgPSBsaWJyYXJ5O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVTZWN0aW9ucyA9IGZ1bmN0aW9uKHNlY3Rpb25zRGljdCkge1xuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvcihrZXkgaW4gc2VjdGlvbnNEaWN0KSB7XG5cdFx0XHRyZXN1bHRzLnB1c2goY3JlYXRlU2VjdGlvbihzZWN0aW9uc0RpY3Rba2V5XS5kdG8pKTtcdFx0XG5cdFx0fVxuXG5cdFx0cmV0dXJuICRxLmFsbChyZXN1bHRzKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EdG8pIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldFNlY3Rpb24oc2VjdGlvbkR0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdCAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShzZWN0aW9uQ2FjaGUubWFwSW1hZ2UpO1xuXHQgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cdCAgICAgICAgdmFyIHNlY3Rpb247XG5cblx0ICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0ICAgICAgICBzZWN0aW9uRHRvLmRhdGEgPSBzZWN0aW9uQ2FjaGUuZGF0YTtcblxuXHQgICAgICAgIHNlY3Rpb24gPSBuZXcgU2VjdGlvbk9iamVjdChzZWN0aW9uRHRvLCBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdFx0ZW52aXJvbm1lbnQubGlicmFyeS5hZGQoc2VjdGlvbik7XG5cdFx0XHRhZGRUb0RpY3Qoc2VjdGlvbnMsIHNlY3Rpb24pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Ly8gVE9ETzogbWVyZ2Ugd2l0aCBjcmVhdGVTZWN0aW9uc1xuXHR2YXIgY3JlYXRlQm9va3MgPSBmdW5jdGlvbihib29rc0RpY3QpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuXHRcdHZhciBrZXk7XG5cblx0XHRmb3Ioa2V5IGluIGJvb2tzRGljdCkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKGNyZWF0ZUJvb2soYm9va3NEaWN0W2tleV0uZHRvKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICRxLmFsbChyZXN1bHRzKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlQm9vayA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHR2YXIgcHJvbWlzZXMgPSB7fTtcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdHByb21pc2VzLmJvb2tDYWNoZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCk7XG5cdFx0aWYoYm9va0R0by5jb3Zlcikge1xuXHRcdFx0cHJvbWlzZXMuY292ZXJDYWNoZSA9IGNhY2hlLmdldEltYWdlKGJvb2tEdG8uY292ZXIpO1xuXHRcdH1cblxuXHRcdHByb21pc2UgPSAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcblx0XHRcdHZhciBib29rQ2FjaGUgPSByZXN1bHRzLmJvb2tDYWNoZTtcblx0XHRcdHZhciBjb3ZlckltYWdlID0gcmVzdWx0cy5jb3ZlckNhY2hlO1xuXHRcdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG5cdFx0XHRjYW52YXMud2lkdGggPSBjYW52YXMuaGVpZ2h0ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdFx0XHR2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcyk7XG5cdFx0ICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cblx0XHRcdHZhciBib29rID0gbmV3IEJvb2tPYmplY3QoYm9va0R0bywgYm9va0NhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCwgYm9va0NhY2hlLm1hcEltYWdlLCBjb3ZlckltYWdlKTtcblxuXHRcdFx0YWRkVG9EaWN0KGJvb2tzLCBib29rKTtcblx0XHRcdHBsYWNlQm9va09uU2hlbGYoYm9vayk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgYWRkVG9EaWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqKSB7XG5cdFx0dmFyIGRpY3RJdGVtID0ge1xuXHRcdFx0ZHRvOiBvYmouZGF0YU9iamVjdCxcblx0XHRcdG9iajogb2JqXG5cdFx0fTtcblxuXHRcdGRpY3Rbb2JqLmlkXSA9IGRpY3RJdGVtO1xuXHR9O1xuXG5cdHZhciBnZXRCb29rU2hlbGYgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50LmdldFNoZWxmKGJvb2tEdG8uc2VjdGlvbklkLCBib29rRHRvLnNoZWxmSWQpO1xuXHR9O1xuXG5cdHZhciBwbGFjZUJvb2tPblNoZWxmID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHZhciBzaGVsZiA9IGdldEJvb2tTaGVsZihib29rLmRhdGFPYmplY3QpO1xuXHRcdHNoZWxmLmFkZChib29rKTtcblx0fTtcblxuXHRyZXR1cm4gZW52aXJvbm1lbnQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTWFpbicsIGZ1bmN0aW9uICgkbG9nLCBEYXRhLCBDYW1lcmEsIExpYnJhcnlPYmplY3QsIENvbnRyb2xzLCBVc2VyLCBVSSwgZW52aXJvbm1lbnQpIHtcblx0dmFyIFNUQVRTX0NPTlRBSU5FUl9JRCA9ICdzdGF0cyc7XG5cdHZhciBMSUJSQVJZX0NBTlZBU19JRCA9ICdMSUJSQVJZJztcblx0XG5cdHZhciBjYW52YXM7XG5cdHZhciByZW5kZXJlcjtcblx0dmFyIHN0YXRzO1xuXHRcblx0dmFyIE1haW4gPSB7fTtcblxuXHRNYWluLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHRcdGlmKCFEZXRlY3Rvci53ZWJnbCkge1xuXHRcdFx0RGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG5cdFx0fVxuXG5cdFx0aW5pdCh3aWR0aCwgaGVpZ2h0KTtcblx0XHRDYW1lcmEuaW5pdCh3aWR0aCwgaGVpZ2h0KTtcblx0XHRDb250cm9scy5pbml0KCk7XG5cblx0XHRzdGFydFJlbmRlckxvb3AoKTtcblxuXHRcdFVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0ZW52aXJvbm1lbnQubG9hZExpYnJhcnkoVXNlci5nZXRMaWJyYXJ5KCkgfHwgMSk7XG5cdFx0XHRVSS5pbml0KCk7XG5cdFx0fSwgZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHR9KTtcdFx0XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dmFyIHN0YXRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU1RBVFNfQ09OVEFJTkVSX0lEKTtcblxuXHRcdHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0c3RhdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tRWxlbWVudCk7XG5cblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChMSUJSQVJZX0NBTlZBU19JRCk7XG5cdFx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7Y2FudmFzOiBjYW52YXN9KTtcblx0XHRyZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblx0XHRlbnZpcm9ubWVudC5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKDB4MDAwMDAwLCA0LCA3KTtcblx0fTtcblxuXHR2YXIgc3RhcnRSZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0YXJ0UmVuZGVyTG9vcCk7XG5cdFx0Q29udHJvbHMudXBkYXRlKCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKGVudmlyb25tZW50LnNjZW5lLCBDYW1lcmEuY2FtZXJhKTtcblxuXHRcdHN0YXRzLnVwZGF0ZSgpO1xuXHR9O1xuXG5cdHJldHVybiBNYWluO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ21vdXNlJywgZnVuY3Rpb24gKENhbWVyYSkge1xuXHR2YXIgbW91c2UgPSB7fTtcblxuXHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0dmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuXHR2YXIgeCA9IG51bGw7XG5cdHZhciB5ID0gbnVsbDtcblx0XG5cdG1vdXNlLnRhcmdldCA9IG51bGw7XG5cdG1vdXNlLmRYID0gbnVsbDtcblx0bW91c2UuZFkgPSBudWxsO1xuXHRtb3VzZS5sb25nWCA9IG51bGw7XG5cdG1vdXNlLmxvbmdZID0gbnVsbDtcblxuXHRtb3VzZS5nZXRUYXJnZXQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQ7XG5cdH07XG5cblx0bW91c2UuZG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gdHJ1ZTtcblx0XHRcdHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0eCA9IGV2ZW50Lng7XG5cdFx0XHR5ID0gZXZlbnQueTtcblx0XHRcdG1vdXNlLmxvbmdYID0gd2lkdGggKiAwLjUgLSB4O1xuXHRcdFx0bW91c2UubG9uZ1kgPSBoZWlnaHQgKiAwLjUgLSB5O1xuXHRcdH1cblx0fTtcblxuXHRtb3VzZS51cCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gZmFsc2U7XG5cdFx0XHR0aGlzWzFdID0gZmFsc2U7IC8vIGxpbnV4IGNocm9tZSBidWcgZml4ICh3aGVuIGJvdGgga2V5cyByZWxlYXNlIHRoZW4gYm90aCBldmVudC53aGljaCBlcXVhbCAzKVxuXHRcdH1cblx0fTtcblxuXHRtb3VzZS5tb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRtb3VzZS5sb25nWCA9IHdpZHRoICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gaGVpZ2h0ICogMC41IC0geTtcblx0XHRcdG1vdXNlLmRYID0gZXZlbnQueCAtIHg7XG5cdFx0XHRtb3VzZS5kWSA9IGV2ZW50LnkgLSB5O1xuXHRcdFx0eCA9IGV2ZW50Lng7XG5cdFx0XHR5ID0gZXZlbnQueTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UuaXNDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3VpJykgPiAtMTtcblx0fTtcblxuXHRtb3VzZS5pc1BvY2tldEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vVE9ETzogc3R1YlxuXHRcdC8vIHJldHVybiAhISh0aGlzLnRhcmdldCAmJiB0aGlzLnRhcmdldC5wYXJlbnROb2RlID09IFVJLm1lbnUuaW52ZW50b3J5LmJvb2tzKTtcblx0fTtcblxuXHRtb3VzZS5nZXRJbnRlcnNlY3RlZCA9IGZ1bmN0aW9uKG9iamVjdHMsIHJlY3Vyc2l2ZSwgc2VhcmNoRm9yKSB7XG5cdFx0dmFyXG5cdFx0XHR2ZWN0b3IsXG5cdFx0XHRyYXljYXN0ZXIsXG5cdFx0XHRpbnRlcnNlY3RzLFxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHRpLCBqO1xuXG5cdFx0cmVzdWx0ID0gbnVsbDtcblx0XHR2ZWN0b3IgPSBnZXRWZWN0b3IoKTtcblx0XHRyYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKENhbWVyYS5nZXRQb3NpdGlvbigpLCB2ZWN0b3IpO1xuXHRcdGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyhvYmplY3RzLCByZWN1cnNpdmUpO1xuXG5cdFx0aWYoc2VhcmNoRm9yKSB7XG5cdFx0XHRpZihpbnRlcnNlY3RzLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBpbnRlcnNlY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBpbnRlcnNlY3RzW2ldO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvcihqID0gc2VhcmNoRm9yLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRcdFx0XHRpZihpbnRlcnNlY3RlZC5vYmplY3QgaW5zdGFuY2VvZiBzZWFyY2hGb3Jbal0pIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0ZWQ7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBpbnRlcnNlY3RzO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGdldFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwcm9qZWN0b3IgPSBuZXcgVEhSRUUuUHJvamVjdG9yKCk7XG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCh4IC8gd2lkdGgpICogMiAtIDEsIC0gKHkgLyBoZWlnaHQpICogMiArIDEsIDAuNSk7XG5cdFx0cHJvamVjdG9yLnVucHJvamVjdFZlY3Rvcih2ZWN0b3IsIENhbWVyYS5jYW1lcmEpO1xuXHRcblx0XHRyZXR1cm4gdmVjdG9yLnN1YihDYW1lcmEuZ2V0UG9zaXRpb24oKSkubm9ybWFsaXplKCk7XG5cdH07XG5cblx0cmV0dXJuIG1vdXNlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ25hdmlnYXRpb24nLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBuYXZpZ2F0aW9uID0ge1xuXHRcdHN0YXRlOiB7XG5cdFx0XHRmb3J3YXJkOiBmYWxzZSxcblx0XHRcdGJhY2t3YXJkOiBmYWxzZSxcblx0XHRcdGxlZnQ6IGZhbHNlLFxuXHRcdFx0cmlnaHQ6IGZhbHNlXHRcdFx0XG5cdFx0fVxuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29TdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5mb3J3YXJkID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5iYWNrd2FyZCA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUubGVmdCA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUucmlnaHQgPSBmYWxzZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuZm9yd2FyZCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0JhY2t3YXJkID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5iYWNrd2FyZCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0xlZnQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmxlZnQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29SaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUucmlnaHQgPSB0cnVlO1xuXHR9O1xuXG5cdHJldHVybiBuYXZpZ2F0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1VJJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBTZWxlY3Rvck1ldGEsIFVzZXIsIERhdGEsIENvbnRyb2xzLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCwgbG9jYXRvciwgc2VsZWN0b3IsIGJsb2NrVUkpIHtcblx0dmFyIEJPT0tfSU1BR0VfVVJMID0gJy9vYmovYm9va3Mve21vZGVsfS9pbWcuanBnJztcblx0dmFyIFVJID0ge21lbnU6IHt9fTtcblxuXHRVSS5tZW51LnNlbGVjdExpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0dXBkYXRlTGlzdDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0ICAgIERhdGEuZ2V0TGlicmFyaWVzKClcblx0XHQgICAgXHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0ICAgICAgICAgICAgc2NvcGUubGlzdCA9IHJlcy5kYXRhO1xuXHRcdCAgICBcdH0pO1xuXHRcdH0sXG5cdFx0Z286IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRpZihpZCkge1xuXHRcdFx0XHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeShpZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuY3JlYXRlTGlicmFyeSA9IHtcblx0XHRsaXN0OiBbXSxcblx0XHRtb2RlbDogbnVsbCxcblxuXHRcdGdldEltZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbCA/ICcvb2JqL2xpYnJhcmllcy97bW9kZWx9L2ltZy5qcGcnLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLm1vZGVsKSA6IG51bGw7XG5cdFx0fSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5tb2RlbCkge1xuXHRcdFx0XHREYXRhLnBvc3RMaWJyYXJ5KHRoaXMubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRcdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5KHJlc3VsdC5pZCk7XG5cdFx0XHRcdFx0VUkubWVudS5zaG93ID0gbnVsbDsgLy8gVE9ETzogaGlkZSBhZnRlciBnbyBcblx0XHRcdFx0XHRVSS5tZW51LnNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpO1xuXHRcdFx0XHRcdC8vVE9ETzogYWRkIGxpYnJhcnkgd2l0aG91dCByZWxvYWRcblx0XHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XHRcdFxuXHR9O1xuXG5cdFVJLm1lbnUuY3JlYXRlU2VjdGlvbiA9IHtcblx0XHRsaXN0OiBbXSxcblx0XHRtb2RlbDogbnVsbCxcblx0XHRcblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubW9kZWwgPyAnL29iai9zZWN0aW9ucy97bW9kZWx9L2ltZy5qcGcnLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLm1vZGVsKSA6IG51bGw7XG5cdFx0fSxcblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5tb2RlbCkge1xuXHRcdFx0XHR2YXIgc2VjdGlvbkRhdGEgPSB7XG5cdFx0XHRcdFx0bW9kZWw6IHRoaXMubW9kZWwsXG5cdFx0XHRcdFx0dXNlcklkOiBVc2VyLmdldElkKClcblx0XHRcdFx0fTtcblxuXHRcdFx0XHREYXRhLnBvc3RTZWN0aW9uKHNlY3Rpb25EYXRhKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL1RPRE86IHJlZmFjdG9yIChkb24ndCBzZWUgbmV3IHNlY3Rpb24gY3JlYXRpb24pXG5cdFx0XHRcdFx0Ly8gcG9zc2libHkgYWRkIHRvIGludmVudG9yeSBvbmx5XG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuZmVlZGJhY2sgPSB7XG5cdFx0bWVzc2FnZTogbnVsbCxcblx0XHRzaG93OiB0cnVlLFxuXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zaG93ID0gZmFsc2U7XG5cdFx0fSxcblx0XHRzdWJtaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRhdGFPYmplY3Q7XG5cdFx0XHRcblx0XHRcdGlmKHRoaXMubWVzc2FnZSkge1xuXHRcdFx0XHRkYXRhT2JqZWN0ID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcblx0XHRcdFx0XHR1c2VySWQ6IFVzZXIuZ2V0SWQoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdERhdGEucG9zdEZlZWRiYWNrKGRhdGFPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUubmF2aWdhdGlvbiA9IHtcblx0XHRzdG9wOiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29TdG9wKCk7XG5cdFx0fSxcblx0XHRmb3J3YXJkOiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29Gb3J3YXJkKCk7XG5cdFx0fSxcblx0XHRiYWNrd2FyZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvQmFja3dhcmQoKTtcblx0XHR9LFxuXHRcdGxlZnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvbi5nb0xlZnQoKTtcblx0XHR9LFxuXHRcdHJpZ2h0OiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29SaWdodCgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmxvZ2luID0ge1xuXHRcdC8vIFRPRE86IG9hdXRoLmlvXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhVXNlci5pc0F1dGhvcml6ZWQoKSAmJiBVc2VyLmlzTG9hZGVkKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuaW52ZW50b3J5ID0ge1xuXHRcdHNlYXJjaDogbnVsbCxcblx0XHRsaXN0OiBudWxsLFxuXHRcdGJsb2NrZXI6ICdpbnZlbnRvcnknLFxuXHRcblx0XHRleHBhbmQ6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdFVJLm1lbnUuY3JlYXRlQm9vay5zZXRCb29rKGJvb2spO1xuXHRcdH0sXG5cdFx0YmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0YmxvY2tVSS5pbnN0YW5jZXMuZ2V0KHRoaXMuYmxvY2tlcikuc3RhcnQoKTtcblx0XHR9LFxuXHRcdHVuYmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0YmxvY2tVSS5pbnN0YW5jZXMuZ2V0KHRoaXMuYmxvY2tlcikuc3RvcCgpO1xuXHRcdH0sXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBVc2VyLmlzQXV0aG9yaXplZCgpO1xuXHRcdH0sXG5cdFx0aXNCb29rU2VsZWN0ZWQ6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNCb29rU2VsZWN0ZWQoaWQpO1xuXHRcdH0sXG5cdFx0c2VsZWN0OiBmdW5jdGlvbihkdG8pIHtcblx0XHRcdHZhciBib29rID0gZW52aXJvbm1lbnQuZ2V0Qm9vayhkdG8uaWQpO1xuXHRcdFx0dmFyIG1ldGEgPSBuZXcgU2VsZWN0b3JNZXRhKGJvb2spO1xuXHRcdFx0c2VsZWN0b3Iuc2VsZWN0KG1ldGEpO1xuXHRcdH0sXG5cdFx0YWRkQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh7dXNlcklkOiBVc2VyLmdldElkKCl9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0c2NvcGUuZXhwYW5kKHJlcy5kYXRhKTtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0Ly9UT0RPOiByZXNlYXJjaCwgbG9va3MgcmlndGhcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0c2NvcGUudW5ibG9jaygpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRyZW1vdmU6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHREYXRhLmRlbGV0ZUJvb2soYm9vaykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnJlbW92ZUJvb2socmVzLmRhdGEpO1xuXHRcdFx0XHRyZXR1cm4gc2NvcGUubG9hZERhdGEoKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0c2NvcGUudW5ibG9jaygpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRwbGFjZTogZnVuY3Rpb24oYm9vaykge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcdHZhciBwcm9taXNlO1xuXHRcdFx0dmFyIGlzQm9va1BsYWNlZCA9ICEhYm9vay5zZWN0aW9uSWQ7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRwcm9taXNlID0gaXNCb29rUGxhY2VkID8gbG9jYXRvci51bnBsYWNlQm9vayhib29rKSA6IGxvY2F0b3IucGxhY2VCb29rKGJvb2spO1xuXHRcdFx0cHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTsgXG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGxvYWREYXRhOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdFx0c2NvcGUuYmxvY2soKTtcblx0XHRcdHByb21pc2UgPSAkcS53aGVuKHRoaXMuaXNTaG93KCkgPyBEYXRhLmdldFVzZXJCb29rcyhVc2VyLmdldElkKCkpIDogbnVsbCkudGhlbihmdW5jdGlvbiAoYm9va3MpIHtcblx0XHRcdFx0c2NvcGUubGlzdCA9IGJvb2tzO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcdFx0XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuY3JlYXRlQm9vayA9IHtcblx0XHRsaXN0OiBbXSxcblx0XHRib29rOiB7fSxcblxuXHRcdHNldEJvb2s6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHRoaXMuYm9vayA9IHt9OyAvLyBjcmVhdGUgbmV3IG9iamVjdCBmb3IgdW5iaW5kIGZyb20gc2NvcGVcblx0XHRcdGlmKGJvb2spIHtcblx0XHRcdFx0dGhpcy5ib29rLmlkID0gYm9vay5pZDtcblx0XHRcdFx0dGhpcy5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0XHR0aGlzLmJvb2subW9kZWwgPSBib29rLm1vZGVsO1xuXHRcdFx0XHR0aGlzLmJvb2suY292ZXIgPSBib29rLmNvdmVyO1xuXHRcdFx0XHR0aGlzLmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0XHR0aGlzLmJvb2suYXV0aG9yID0gYm9vay5hdXRob3I7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuYm9vay5tb2RlbCA/IEJPT0tfSU1BR0VfVVJMLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLmJvb2subW9kZWwpIDogbnVsbDtcblx0XHR9LFxuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gISF0aGlzLmJvb2suaWQ7XG5cdFx0fSxcblx0XHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHRcblx0XHRcdFVJLm1lbnUuaW52ZW50b3J5LmJsb2NrKCk7XG5cdFx0XHREYXRhLnBvc3RCb29rKHRoaXMuYm9vaykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnVwZGF0ZUJvb2socmVzLmRhdGEpO1xuXHRcdFx0XHRzY29wZS5jYW5jZWwoKTtcblx0XHRcdFx0cmV0dXJuIFVJLm1lbnUuaW52ZW50b3J5LmxvYWREYXRhKClcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGVycm9yXG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0VUkubWVudS5pbnZlbnRvcnkudW5ibG9jaygpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zZXRCb29rKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHQvL1RPRE86IG1vdmUgdG8gbWVudSBtb2RlbHNcblx0XHREYXRhLmdldFVJRGF0YSgpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0VUkubWVudS5jcmVhdGVMaWJyYXJ5Lmxpc3QgPSByZXMuZGF0YS5saWJyYXJpZXM7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZVNlY3Rpb24ubGlzdCA9IHJlcy5kYXRhLmJvb2tzaGVsdmVzO1xuXHRcdFx0VUkubWVudS5jcmVhdGVCb29rLmxpc3QgPSByZXMuZGF0YS5ib29rcztcblx0XHR9KVxuXHRcdC5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHR9KTtcblxuXHRcdFVJLm1lbnUuc2VsZWN0TGlicmFyeS51cGRhdGVMaXN0KCk7XG5cdFx0VUkubWVudS5pbnZlbnRvcnkubG9hZERhdGEoKTtcdFxuXHR9O1xuXG5cdHJldHVybiBVSTtcbn0pO1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmluaXRDb250cm9sc0V2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5tb2RlbC5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlTW9kZWw7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRleHR1cmUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tUZXh0dXJlO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5jb3Zlci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va0NvdmVyO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5hdXRob3Iub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ2F1dGhvcicsICd0ZXh0Jyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmF1dGhvclNpemUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ2F1dGhvcicsICdzaXplJyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmF1dGhvckNvbG9yLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCdhdXRob3InLCAnY29sb3InKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGl0bGUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ3RpdGxlJywgJ3RleHQnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGl0bGVTaXplLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCd0aXRsZScsICdzaXplJyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRpdGxlQ29sb3Iub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ3RpdGxlJywgJ2NvbG9yJyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRDb3Zlci5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRBdXRob3Iub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0VGl0bGUub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5vay5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zYXZlQm9vaztcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suY2FuY2VsLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNhbmNlbEJvb2tFZGl0O1xuLy8gfTtcblxuLy8gY3JlYXRlIGJvb2tcblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5zaG93Q3JlYXRlQm9vayA9IGZ1bmN0aW9uKCkge1xuLy8gXHR2YXIgbWVudU5vZGUgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vaztcblxuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0bWVudU5vZGUuc2hvdygpO1xuLy8gXHRcdG1lbnVOb2RlLnNldFZhbHVlcygpO1xuLy8gXHR9IGVsc2UgaWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc1NlY3Rpb24oKSkge1xuLy8gXHRcdHZhciBzZWN0aW9uID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG4vLyBcdFx0dmFyIHNoZWxmID0gc2VjdGlvbi5nZXRTaGVsZkJ5UG9pbnQoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5wb2ludCk7XG4vLyBcdFx0dmFyIGZyZWVQb3NpdGlvbiA9IHNlY3Rpb24uZ2V0R2V0RnJlZVNoZWxmUG9zaXRpb24oc2hlbGYsIHt4OiAwLjA1LCB5OiAwLjEyLCB6OiAwLjF9KTsgXG4vLyBcdFx0aWYoZnJlZVBvc2l0aW9uKSB7XG4vLyBcdFx0XHRtZW51Tm9kZS5zaG93KCk7XG5cbi8vIFx0XHRcdHZhciBkYXRhT2JqZWN0ID0ge1xuLy8gXHRcdFx0XHRtb2RlbDogbWVudU5vZGUubW9kZWwudmFsdWUsIFxuLy8gXHRcdFx0XHR0ZXh0dXJlOiBtZW51Tm9kZS50ZXh0dXJlLnZhbHVlLCBcbi8vIFx0XHRcdFx0Y292ZXI6IG1lbnVOb2RlLmNvdmVyLnZhbHVlLFxuLy8gXHRcdFx0XHRwb3NfeDogZnJlZVBvc2l0aW9uLngsXG4vLyBcdFx0XHRcdHBvc195OiBmcmVlUG9zaXRpb24ueSxcbi8vIFx0XHRcdFx0cG9zX3o6IGZyZWVQb3NpdGlvbi56LFxuLy8gXHRcdFx0XHRzZWN0aW9uSWQ6IHNlY3Rpb24uZGF0YU9iamVjdC5pZCxcbi8vIFx0XHRcdFx0c2hlbGZJZDogc2hlbGYuaWQsXG4vLyBcdFx0XHRcdHVzZXJJZDogVmlydHVhbEJvb2tzaGVsZi51c2VyLmlkXG4vLyBcdFx0XHR9O1xuXG4vLyBcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuY3JlYXRlQm9vayhkYXRhT2JqZWN0LCBmdW5jdGlvbiAoYm9vaywgZGF0YU9iamVjdCkge1xuLy8gXHRcdFx0XHRib29rLnBhcmVudCA9IHNoZWxmO1xuLy8gXHRcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdCA9IGJvb2s7XG4vLyBcdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuZ2V0KCk7XG4vLyBcdFx0XHR9KTtcbi8vIFx0XHR9IGVsc2Uge1xuLy8gXHRcdFx0YWxlcnQoJ1RoZXJlIGlzIG5vIGZyZWUgc3BhY2Ugb24gc2VsZWN0ZWQgc2hlbGYuJyk7XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlTW9kZWwgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBvbGRCb29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG4vLyBcdFx0dmFyIGRhdGFPYmplY3QgPSB7XG4vLyBcdFx0XHRtb2RlbDogdGhpcy52YWx1ZSxcbi8vIFx0XHRcdHRleHR1cmU6IG9sZEJvb2sudGV4dHVyZS50b1N0cmluZygpLFxuLy8gXHRcdFx0Y292ZXI6IG9sZEJvb2suY292ZXIudG9TdHJpbmcoKVxuLy8gXHRcdH07XG5cbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLkRhdGEuY3JlYXRlQm9vayhkYXRhT2JqZWN0LCBmdW5jdGlvbiAoYm9vaywgZGF0YU9iamVjdCkge1xuLy8gXHRcdFx0Ym9vay5jb3B5U3RhdGUob2xkQm9vayk7XG4vLyBcdFx0fSk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHRib29rLnRleHR1cmUubG9hZCh0aGlzLnZhbHVlLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuLy8gXHRcdFx0Ym9vay51cGRhdGVUZXh0dXJlKCk7XG4vLyBcdFx0fSk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rQ292ZXIgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBib29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG4vLyBcdFx0Ym9vay5jb3Zlci5sb2FkKHRoaXMudmFsdWUsIHRydWUsIGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0Ym9vay51cGRhdGVUZXh0dXJlKCk7XG4vLyBcdFx0fSk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlID0gZnVuY3Rpb24oZmllbGQsIHByb3BlcnR5KSB7XG4vLyBcdHJldHVybiBmdW5jdGlvbiAoKSB7XG4vLyBcdFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3RbZmllbGRdW3Byb3BlcnR5XSA9IHRoaXMudmFsdWU7XG4vLyBcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdC51cGRhdGVUZXh0dXJlKCk7XG4vLyBcdFx0fVxuLy8gXHR9O1xuLy8gfTtcblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQgPSBmdW5jdGlvbigpIHtcbi8vIFx0dmFyIGFjdGl2ZUVsZW1ldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmFjdGl2ZUVkaXQnKTtcblxuLy8gXHRmb3IodmFyIGkgPSBhY3RpdmVFbGVtZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4vLyBcdFx0YWN0aXZlRWxlbWV0c1tpXS5jbGFzc05hbWUgPSAnaW5hY3RpdmVFZGl0Jztcbi8vIFx0fTtcblxuLy8gXHR2YXIgcHJldmlvdXNFZGl0ZWQgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQ7XG4vLyBcdHZhciBjdXJyZW50RWRpdGVkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2VkaXQnKTtcblxuLy8gXHRpZihwcmV2aW91c0VkaXRlZCAhPSBjdXJyZW50RWRpdGVkKSB7XG4vLyBcdFx0dGhpcy5jbGFzc05hbWUgPSAnYWN0aXZlRWRpdCc7XG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID0gY3VycmVudEVkaXRlZDtcbi8vIFx0fSBlbHNlIHtcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPSBudWxsO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuc2F2ZUJvb2sgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBib29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG5cbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnB1dCgpO1xuLy8gXHRcdGJvb2suc2F2ZSgpO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2FuY2VsQm9va0VkaXQgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBib29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG5cdFx0XG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5wdXQoKTtcbi8vIFx0XHRib29rLnJlZnJlc2goKTtcbi8vIFx0fVxuLy8gfSIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdVc2VyJywgZnVuY3Rpb24gKCRsb2csIERhdGEpIHtcblx0dmFyIGxvYWRlZCA9IGZhbHNlO1xuXG5cdHZhciBVc2VyID0ge1xuXHRcdF9kYXRhT2JqZWN0OiBudWxsLFxuXHRcdF9wb3NpdGlvbjogbnVsbCxcblx0XHRfbGlicmFyeTogbnVsbCxcblxuXHRcdGxvYWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcdCRsb2cubG9nKCd1c2VyIGxvYWRpbmcnKTtcblxuXHRcdFx0cmV0dXJuIERhdGEuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRzY29wZS5zZXREYXRhT2JqZWN0KHJlcy5kYXRhKTtcblx0XHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0XHRsb2FkZWQgPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRzZXREYXRhT2JqZWN0OiBmdW5jdGlvbihkYXRhT2JqZWN0KSB7XG5cdFx0XHR0aGlzLl9kYXRhT2JqZWN0ID0gZGF0YU9iamVjdDtcblx0XHR9LFxuXHRcdGdldExpYnJhcnk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2xpYnJhcnk7XG5cdFx0fSxcblx0XHRzZXRMaWJyYXJ5OiBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRcdHRoaXMuX2xpYnJhcnkgPSBsaWJyYXJ5SWQgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnN1YnN0cmluZygxKTtcblx0XHR9LFxuXHRcdGdldElkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9kYXRhT2JqZWN0ICYmIHRoaXMuX2RhdGFPYmplY3QuaWQ7XG5cdFx0fSxcblx0XHRpc0F1dGhvcml6ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5fZGF0YU9iamVjdCk7XG5cdFx0fSxcblx0XHRpc0xvYWRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbG9hZGVkO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gVXNlcjtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jhc2VPYmplY3QnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBCYXNlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QgPSBkYXRhT2JqZWN0IHx8IHt9O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbiA9IHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbiB8fCBbMCwgMCwgMF07XG5cdFx0XG5cdFx0dGhpcy5pZCA9IHRoaXMuZGF0YU9iamVjdC5pZDtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGhpcy5kYXRhT2JqZWN0LnBvc194LCB0aGlzLmRhdGFPYmplY3QucG9zX3ksIHRoaXMuZGF0YU9iamVjdC5wb3Nfeik7XG5cdFx0dGhpcy5yb3RhdGlvbi5vcmRlciA9ICdYWVonO1xuXHRcdHRoaXMucm90YXRpb24uZnJvbUFycmF5KHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbi5tYXAoTnVtYmVyKSk7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXG5cdFx0Ly9UT0RPOiByZXNlYXJjaCwgYWZ0ZXIgY2FjaGluZyBnZW9tZXRyeSB0aGlzIGNhbiBiZSBydW4gb25jZVxuXHRcdHRoaXMuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG5cdFx0XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1x0XHRcblx0fTtcblx0XG5cdEJhc2VPYmplY3QucHJvdG90eXBlID0gbmV3IFRIUkVFLk1lc2goKTtcblx0QmFzZU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBCYXNlT2JqZWN0O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50eXBlO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmlzT3V0T2ZQYXJyZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueCkgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnggLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54KVxuXHRcdFx0Ly98fCBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLnkpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy55IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueSlcblx0XHRcdHx8IE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnogLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueikgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnogLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56KTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc0NvbGxpZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHR0YXJnZXRzLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0aTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRcdHJlc3VsdCA9IHRoaXMuaXNPdXRPZlBhcnJlbnQoKTtcblx0XHR0YXJnZXRzID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRmb3IoaSA9IHRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0c1tpXS5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRpZih0YXJnZXRzW2ldID09PSB0aGlzXG5cdFx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGFyZ2V0LmNlbnRlci54KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54ICsgdGFyZ2V0LnJhZGl1cy54KSlcblx0XHRcdFx0fHwgKE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnkgLSB0YXJnZXQuY2VudGVyLnkpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkgKyB0YXJnZXQucmFkaXVzLnkpKVxuXHRcdFx0XHR8fCAoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRhcmdldC5jZW50ZXIueikgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueiArIHRhcmdldC5yYWRpdXMueikpKSB7XHRcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIFx0cmVzdWx0ID0gdHJ1ZTtcdFx0XG5cdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24obmV3UG9zaXRpb24pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0XHRyZXN1bHQ7XG5cblx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XG5cdFx0aWYobmV3UG9zaXRpb24ueCkge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgoY3VycmVudFBvc2l0aW9uLngpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihuZXdQb3NpdGlvbi56KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFoobmV3UG9zaXRpb24ueik7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihjdXJyZW50UG9zaXRpb24ueik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihkWCwgZFksIGlzRGVtbykge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKSxcblx0XHRcdHJlc3VsdCA9IGZhbHNlOyBcblx0XHRcblx0XHRpZihkWCkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ICs9IGRYICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnkgPSBjdXJyZW50Um90YXRpb24ueTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZFkpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueCArPSBkWSAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCAoIWlzRGVtbyAmJiByZXN1bHQpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0Ym91bmRpbmdCb3gsXG5cdFx0XHRyYWRpdXMsXG5cdFx0XHRjZW50ZXI7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXHRcdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFx0XG5cdFx0cmFkaXVzID0ge1xuXHRcdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdFx0eTogKGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnkpICogMC41LFxuXHRcdFx0ejogKGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLnopICogMC41XG5cdFx0fTtcblxuXHRcdGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuXHRcdFx0cmFkaXVzLnggKyBib3VuZGluZ0JveC5taW4ueCxcblx0XHRcdHJhZGl1cy55ICsgYm91bmRpbmdCb3gubWluLnksXG5cdFx0XHRyYWRpdXMueiArIGJvdW5kaW5nQm94Lm1pbi56XG5cdFx0KTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogY2VudGVyXG5cdFx0fTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFgodGhpcy5kYXRhT2JqZWN0LnBvc194KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFkodGhpcy5kYXRhT2JqZWN0LnBvc195KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFoodGhpcy5kYXRhT2JqZWN0LnBvc196KTtcblx0XHR0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcblx0fTtcblxuXHRyZXR1cm4gQmFzZU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgQ2FudmFzVGV4dCwgQ2FudmFzSW1hZ2UsIERhdGEpIHtcdFxuXHR2YXIgQm9va09iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCwgbWFwSW1hZ2UsIGNvdmVySW1hZ2UpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHRcblx0XHR0aGlzLm1vZGVsID0gdGhpcy5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdHRoaXMuY2FudmFzID0gbWF0ZXJpYWwubWFwLmltYWdlO1xuXHRcdHRoaXMudGV4dHVyZSA9IG5ldyBDYW52YXNJbWFnZShudWxsLCBudWxsLCBtYXBJbWFnZSk7XG5cdFx0dGhpcy5jb3ZlciA9IG5ldyBDYW52YXNJbWFnZSh0aGlzLmRhdGFPYmplY3QuY292ZXJQb3MsIHRoaXMuZGF0YU9iamVjdC5jb3ZlciwgY292ZXJJbWFnZSk7XG5cdFx0dGhpcy5hdXRob3IgPSBuZXcgQ2FudmFzVGV4dCh0aGlzLmRhdGFPYmplY3QuYXV0aG9yLCB0aGlzLmRhdGFPYmplY3QuYXV0aG9yRm9udCk7XG5cdFx0dGhpcy50aXRsZSA9IG5ldyBDYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC50aXRsZSwgdGhpcy5kYXRhT2JqZWN0LnRpdGxlRm9udCk7XG5cblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fTtcblxuXHRCb29rT2JqZWN0LlRZUEUgPSAnQm9va09iamVjdCc7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvb2tPYmplY3Q7XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnRleHROb2RlcyA9IFsnYXV0aG9yJywgJ3RpdGxlJ107XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnR5cGUgPSBCb29rT2JqZWN0LlRZUEU7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUudXBkYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHR2YXIgY292ZXIgPSB0aGlzLmNvdmVyO1xuXG5cdFx0aWYodGhpcy50ZXh0dXJlLmltYWdlKSB7XG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUuaW1hZ2UsIDAsIDApO1xuXHRcdH1cblxuXHRcdGlmKGNvdmVyLmltYWdlKSB7XG5cdFx0XHR2YXIgZGlmZiA9IGNvdmVyLnkgKyBjb3Zlci5oZWlnaHQgLSBEYXRhLkNPVkVSX01BWF9ZO1xuXHRcdCBcdHZhciBsaW1pdGVkSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5oZWlnaHQgLSBkaWZmIDogY292ZXIuaGVpZ2h0O1xuXHRcdCBcdHZhciBjcm9wSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5pbWFnZS5uYXR1cmFsSGVpZ2h0IC0gKGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQgLyBjb3Zlci5oZWlnaHQgKiBkaWZmKSA6IGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQ7XG5cblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKGNvdmVyLmltYWdlLCAwLCAwLCBjb3Zlci5pbWFnZS5uYXR1cmFsV2lkdGgsIGNyb3BIZWlnaHQsIGNvdmVyLngsIGNvdmVyLnksIGNvdmVyLndpZHRoLCBsaW1pdGVkSGVpZ2h0KTtcblx0XHR9XG5cblx0XHRmb3IodmFyIGkgPSB0aGlzLnRleHROb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIHRleHROb2RlID0gdGhpc1t0aGlzLnRleHROb2Rlc1tpXV07XG5cblx0XHRcdGlmKHRleHROb2RlLmlzVmFsaWQoKSkge1xuXG5cdFx0XHRcdGNvbnRleHQuZm9udCA9IHRleHROb2RlLmdldEZvbnQoKTtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSB0ZXh0Tm9kZS5jb2xvcjtcblx0XHQgICAgXHRjb250ZXh0LmZpbGxUZXh0KHRleHROb2RlLnRleHQsIHRleHROb2RlLngsIHRleHROb2RlLnksIHRleHROb2RlLndpZHRoKTtcblx0XHQgICAgfVxuXHRcdH1cblxuXHRcdHRoaXMubWF0ZXJpYWwubWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUubW92ZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFksIGVsZW1lbnQpIHtcblx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnQgJiYgdGhpc1tlbGVtZW50XTtcblx0XHRcblx0XHRpZihlbGVtZW50KSB7XG5cdFx0XHRpZihlbGVtZW50Lm1vdmUpIHtcblx0XHRcdFx0ZWxlbWVudC5tb3ZlKGRYLCBkWSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnggKz0gZFg7XG5cdFx0XHRcdGVsZW1lbnQueSArPSBkWTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy51cGRhdGVUZXh0dXJlKCk7XG5cdFx0fVxuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zY2FsZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHR0aGlzLmNvdmVyLndpZHRoICs9IGRYO1xuXHRcdHRoaXMuY292ZXIuaGVpZ2h0ICs9IGRZO1xuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5tb2RlbCA9IHRoaXMubW9kZWw7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRleHR1cmUgPSB0aGlzLnRleHR1cmUudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuY292ZXIgPSB0aGlzLmNvdmVyLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmNvdmVyUG9zID0gdGhpcy5jb3Zlci5zZXJpYWxpemVQcm9wZXJ0aWVzKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvciA9IHRoaXMuYXV0aG9yLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvckZvbnQgPSB0aGlzLmF1dGhvci5zZXJpYWxpemVGb250KCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRpdGxlID0gdGhpcy50aXRsZS50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC50aXRsZUZvbnQgPSB0aGlzLnRpdGxlLnNlcmlhbGl6ZUZvbnQoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ggPSB0aGlzLnBvc2l0aW9uLng7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc195ID0gdGhpcy5wb3NpdGlvbi55O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeiA9IHRoaXMucG9zaXRpb24uejtcblxuXHRcdERhdGEucG9zdEJvb2sodGhpcy5kYXRhT2JqZWN0LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYoIWVyciAmJiByZXN1bHQpIHtcblx0XHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IHJlc3VsdDtcblx0XHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9UT0RPOiBoaWRlIGVkaXQsIG5vdGlmeSB1c2VyXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdC8vVE9ETzogdXNlIGluIGNvbnN0cnVjdG9yIGluc3RlYWQgb2Ygc2VwYXJhdGUgaW1hZ2VzIGxvYWRpbmdcblx0XHRzY29wZS50ZXh0dXJlLmxvYWQoc2NvcGUuZGF0YU9iamVjdC50ZXh0dXJlLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0c2NvcGUuY292ZXIubG9hZChzY29wZS5kYXRhT2JqZWN0LmNvdmVyLCB0cnVlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2NvcGUubW9kZWwgPSBzY29wZS5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdFx0XHRzY29wZS5jb3Zlci5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC5jb3ZlclBvcyk7XG5cdFx0XHRcdHNjb3BlLmF1dGhvci5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QuYXV0aG9yKTtcblx0XHRcdFx0c2NvcGUuYXV0aG9yLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LmF1dGhvckZvbnQpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QudGl0bGUpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC50aXRsZUZvbnQpO1xuXG5cdFx0XHRcdHNjb3BlLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb3B5U3RhdGUgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vayBpbnN0YW5jZW9mIEJvb2tPYmplY3QpIHtcblx0XHRcdHZhciBmaWVsZHMgPSBbJ2RhdGFPYmplY3QnLCAncG9zaXRpb24nLCAncm90YXRpb24nLCAnbW9kZWwnLCAndGV4dHVyZScsICdjb3ZlcicsICdhdXRob3InLCAndGl0bGUnXTtcblx0XHRcdGZvcih2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR2YXIgZmllbGQgPSBmaWVsZHNbaV07XG5cdFx0XHRcdHRoaXNbZmllbGRdID0gYm9va1tmaWVsZF07XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdGJvb2sucGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdGJvb2sucGFyZW50LnJlbW92ZShib29rKTtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gdGhpcztcblx0XHR9XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdGlmKHRoaXMucGFyZW50ICE9IHBhcmVudCkge1xuXHRcdFx0aWYocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gcGFyZW50LmlkO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gcGFyZW50LnBhcmVudC5pZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNoZWxmSWQgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIEJvb2tPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQ2FtZXJhT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QpIHtcblx0dmFyIENhbWVyYU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzKTtcblx0fTtcblxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0XG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDYW1lcmFPYmplY3Q7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhZGl1cyA9IHt4OiAwLjEsIHk6IDEsIHo6IDAuMX07XG5cdFx0dmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiB0aGlzLnBvc2l0aW9uIC8vVE9ETzogbmVlZHMgY2VudGVyIG9mIHNlY3Rpb24gaW4gcGFyZW50IG9yIHdvcmxkIGNvb3JkaW5hdGVzXG5cdFx0fTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbnZhc0ltYWdlJywgZnVuY3Rpb24gKCRxLCBEYXRhKSB7XG5cdHZhciBDYW52YXNJbWFnZSA9IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGxpbmssIGltYWdlKSB7XG5cdFx0dGhpcy5saW5rID0gbGluayB8fCAnJztcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMocHJvcGVydGllcyk7XG5cdH07XG5cdFxuXHRDYW52YXNJbWFnZS5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IENhbnZhc0ltYWdlLFxuXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubGluaztcblx0XHR9LFxuXHRcdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdFx0dGhpcy54ID0gTnVtYmVyKGFyZ3NbMF0pIHx8IERhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdFx0dGhpcy55ID0gTnVtYmVyKGFyZ3NbMV0pIHx8IDA7XG5cdFx0XHR0aGlzLndpZHRoID0gTnVtYmVyKGFyZ3NbMl0pIHx8IDIxNjtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gTnVtYmVyKGFyZ3NbM10pIHx8IERhdGEuQ09WRVJfTUFYX1k7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XS5qb2luKCcsJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBDYW52YXNJbWFnZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW52YXNUZXh0JywgZnVuY3Rpb24gKERhdGEpIHtcblx0dmFyIENhbnZhc1RleHQgPSBmdW5jdGlvbih0ZXh0LCBwcm9wZXJ0aWVzKSB7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dCB8fCAnJztcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblxuXHRDYW52YXNUZXh0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogQ2FudmFzVGV4dCxcblx0XHRnZXRGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplICsgJ3B4JywgdGhpcy5mb250XS5qb2luKCcgJyk7XG5cdFx0fSxcblx0XHRpc1ZhbGlkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy50ZXh0ICYmIHRoaXMueCAmJiB0aGlzLnkpO1xuXHRcdH0sXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudGV4dCB8fCAnJztcblx0XHR9LFxuXHRcdHNldFRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplLCB0aGlzLmZvbnQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmNvbG9yLCB0aGlzLndpZHRoXS5qb2luKCcsJyk7XG5cdFx0fSxcblx0XHRwYXJzZVByb3BlcnRpZXM6IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcblx0XHRcdHZhciBhcmdzID0gcHJvcGVydGllcyAmJiBwcm9wZXJ0aWVzLnNwbGl0KCcsJykgfHwgW107XG5cblx0XHRcdHRoaXMuc3R5bGUgPSBhcmdzWzBdO1xuXHRcdFx0dGhpcy5zaXplID0gYXJnc1sxXSB8fCAxNDtcblx0XHRcdHRoaXMuZm9udCA9IGFyZ3NbMl0gfHwgJ0FyaWFsJztcblx0XHRcdHRoaXMueCA9IE51bWJlcihhcmdzWzNdKSB8fCBEYXRhLkNPVkVSX0ZBQ0VfWDtcblx0XHRcdHRoaXMueSA9IE51bWJlcihhcmdzWzRdKSB8fCAxMDtcblx0XHRcdHRoaXMuY29sb3IgPSBhcmdzWzVdIHx8ICdibGFjayc7XG5cdFx0XHR0aGlzLndpZHRoID0gYXJnc1s2XSB8fCA1MTI7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHRcdHRoaXMueCArPSBkWDtcblx0XHRcdHRoaXMueSArPSBkWTtcblxuXHRcdFx0aWYodGhpcy54IDw9IDApIHRoaXMueCA9IDE7XG5cdFx0XHRpZih0aGlzLnkgPD0gMCkgdGhpcy55ID0gMTtcblx0XHRcdGlmKHRoaXMueCA+PSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTikgdGhpcy54ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdFx0XHRpZih0aGlzLnkgPj0gRGF0YS5DT1ZFUl9NQVhfWSkgdGhpcy55ID0gRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIENhbnZhc1RleHQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBMaWJyYXJ5T2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdHRoaXMubGlicmFyeU9iamVjdCA9IHBhcmFtcy5saWJyYXJ5T2JqZWN0IHx8IHt9Oy8vVE9ETzogcmVzZWFyY2hcblx0fTtcblx0TGlicmFyeU9iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRMaWJyYXJ5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpYnJhcnlPYmplY3Q7XG5cblx0cmV0dXJuIExpYnJhcnlPYmplY3Q7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWN0aW9uT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIFNoZWxmT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBTZWN0aW9uT2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5zaGVsdmVzID0ge307XG5cdFx0Zm9yKHZhciBrZXkgaW4gcGFyYW1zLmRhdGEuc2hlbHZlcykge1xuXHRcdFx0dGhpcy5zaGVsdmVzW2tleV0gPSBuZXcgU2hlbGZPYmplY3QocGFyYW1zLmRhdGEuc2hlbHZlc1trZXldKTsgXG5cdFx0XHR0aGlzLmFkZCh0aGlzLnNoZWx2ZXNba2V5XSk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlY3Rpb25PYmplY3QuVFlQRSA9ICdTZWN0aW9uT2JqZWN0JztcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VjdGlvbk9iamVjdDtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNlY3Rpb25PYmplY3QuVFlQRTtcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeCA9IHRoaXMucG9zaXRpb24ueDtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3kgPSB0aGlzLnBvc2l0aW9uLnk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc196ID0gdGhpcy5wb3NpdGlvbi56O1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uID0gW3RoaXMucm90YXRpb24ueCwgdGhpcy5yb3RhdGlvbi55LCB0aGlzLnJvdGF0aW9uLnpdO1xuXG5cdFx0RGF0YS5wb3N0U2VjdGlvbih0aGlzLmRhdGFPYmplY3QpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IGR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQvL1RPRE86IGhpZGUgZWRpdCwgbm90aWZ5IHVzZXJcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gU2VjdGlvbk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGEnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBTZWxlY3Rvck1ldGEgPSBmdW5jdGlvbihzZWxlY3RlZE9iamVjdCkge1xuXHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHR0aGlzLmlkID0gc2VsZWN0ZWRPYmplY3QuaWQ7XG5cdFx0XHR0aGlzLnBhcmVudElkID0gc2VsZWN0ZWRPYmplY3QucGFyZW50LmlkO1xuXHRcdFx0dGhpcy50eXBlID0gc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpO1xuXHRcdH1cblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaWQ7XG5cdH07XG5cblx0U2VsZWN0b3JNZXRhLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuICEoIW1ldGFcblx0XHRcdFx0fHwgbWV0YS5pZCAhPT0gdGhpcy5pZFxuXHRcdFx0XHR8fCBtZXRhLnBhcmVudElkICE9PSB0aGlzLnBhcmVudElkXG5cdFx0XHRcdHx8IG1ldGEudHlwZSAhPT0gdGhpcy50eXBlKTtcblx0fTtcblx0XG5cdHJldHVybiBTZWxlY3Rvck1ldGE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCkge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplIHx8IFsxLDEsMV07XHRcblx0XHR2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yfSk7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgbmV3IFRIUkVFLkN1YmVHZW9tZXRyeShzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHBhcmFtcy5wb3NpdGlvblswXSwgcGFyYW1zLnBvc2l0aW9uWzFdLCBwYXJhbXMucG9zaXRpb25bMl0pO1xuXHRcdHRoaXMuc2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHR9O1xuXG5cdFNoZWxmT2JqZWN0LlRZUEUgPSAnU2hlbGZPYmplY3QnO1xuXG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNoZWxmT2JqZWN0O1xuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNoZWxmT2JqZWN0LlRZUEU7XG5cblxuXHRyZXR1cm4gU2hlbGZPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbG9jYXRvcicsIGZ1bmN0aW9uICgkcSwgRGF0YSwgc2VsZWN0b3IsIGVudmlyb25tZW50LCBjYWNoZSkge1xuXHR2YXIgbG9jYXRvciA9IHt9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdHZhciBzaGVsZiA9IHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpICYmIHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0cHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHRcdHZhciBzaGVsZkJCID0gc2hlbGYuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBib29rQkIgPSBib29rQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdFx0aWYoZnJlZVBsYWNlKSB7XG5cdFx0XHRcdFx0Ym9va0R0by5zaGVsZklkID0gc2hlbGYuaWQ7XG5cdFx0XHRcdFx0Ym9va0R0by5zZWN0aW9uSWQgPSBzaGVsZi5wYXJlbnQuaWQ7XG5cdFx0XHRcdFx0Ym9va0R0by5wb3NfeCA9IGZyZWVQbGFjZS54O1xuXHRcdFx0XHRcdGJvb2tEdG8ucG9zX3kgPSBmcmVlUGxhY2UueTtcblx0XHRcdFx0XHRib29rRHRvLnBvc196ID0gZnJlZVBsYWNlLno7XG5cblx0XHRcdFx0XHRyZXR1cm4gRGF0YS5wb3N0Qm9vayhib29rRHRvKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhib29rRHRvKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwcm9taXNlID0gJHEucmVqZWN0KCdzaGVsZiBpcyBub3Qgc2VsZWN0ZWQnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRsb2NhdG9yLnVucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdGJvb2tEdG8uc2VjdGlvbklkID0gbnVsbDtcblxuXHRcdHByb21pc2UgPSBEYXRhLnBvc3RCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZVBsYWNlID0gZnVuY3Rpb24ob2JqZWN0cywgc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCwgMCwgMCk7XG5cdFx0dmFyIG9jY3VwaWVkTWF0cml4ID0gZ2V0T2NjdXBpZWRNYXRyaXgob2JqZWN0cywgbWF0cml4UHJlY2lzaW9uKTtcblx0XHR2YXIgZnJlZUNlbGxzID0gZ2V0RnJlZU1hdHJpeENlbGxzKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKTtcblx0XHR2YXIgcmVzdWx0O1xuXG5cdFx0aWYoZnJlZUNlbGxzKSB7XG5cdFx0XHR2YXIgZnJlZVBvc2l0aW9uID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoZnJlZUNlbGxzLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdFx0dmFyIGJvdHRvbVkgPSBnZXRCb3R0b21ZKHNwYWNlQkIsIHRhcmdldEJCKTtcblxuXHRcdFx0cmVzdWx0ID0gbmV3IFRIUkVFLlZlY3RvcjMoZnJlZVBvc2l0aW9uLCBib3R0b21ZLCAwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0XG5cdH07XG5cblx0dmFyIGdldEJvdHRvbVkgPSBmdW5jdGlvbihzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHJldHVybiBzcGFjZUJCLm1pbi55IC0gdGFyZ2V0QkIubWluLnk7XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXhDZWxscyA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cdFx0dmFyIHRhcmdldENlbGxzU2l6ZSA9IDE7XG5cdFx0dmFyIGZyZWVDZWxsc0NvdW50ID0gMDtcblx0XHR2YXIgZnJlZUNlbGxzU3RhcnQ7XG5cdFx0dmFyIGNlbGxJbmRleDtcblxuXHRcdHZhciBtaW5DZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi54IC8gbWF0cml4UHJlY2lzaW9uLngpICsgMTtcblx0XHR2YXIgbWF4Q2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5tYXgueCAvIG1hdHJpeFByZWNpc2lvbi54KSAtIDE7XG5cblx0XHRmb3IgKGNlbGxJbmRleCA9IG1pbkNlbGw7IGNlbGxJbmRleCA8PSBtYXhDZWxsOyBjZWxsSW5kZXgrKykge1xuXHRcdFx0aWYgKCFvY2N1cGllZE1hdHJpeFtjZWxsSW5kZXhdKSB7XG5cdFx0XHRcdGlmICghZnJlZUNlbGxzQ291bnQpIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNTdGFydCA9IGNlbGxJbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmcmVlQ2VsbHNDb3VudCsrO1xuXG5cdFx0XHRcdGlmKGZyZWVDZWxsc0NvdW50ID09PSB0YXJnZXRDZWxsc1NpemUpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdFx0XHRmcmVlQ2VsbHNTdGFydCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZnJlZUNlbGxzQ291bnQpIHtcblx0XHRcdHJlc3VsdCA9IFtdO1xuXG5cdFx0XHRmb3IgKGNlbGxJbmRleCA9IGZyZWVDZWxsc1N0YXJ0OyBjZWxsSW5kZXggPCBmcmVlQ2VsbHNTdGFydCArIGZyZWVDZWxsc0NvdW50OyBjZWxsSW5kZXgrKykge1xuXHRcdFx0XHRyZXN1bHQucHVzaChjZWxsSW5kZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGdldFBvc2l0aW9uRnJvbUNlbGxzID0gZnVuY3Rpb24oY2VsbHMsIG1hdHJpeFByZWNpc2lvbikge1xuXHRcdHZhciBzaXplID0gY2VsbHMubGVuZ3RoICogbWF0cml4UHJlY2lzaW9uLng7XG5cdFx0dmFyIHJlc3VsdCA9IGNlbGxzWzBdICogbWF0cml4UHJlY2lzaW9uLnggKyBzaXplICogMC41O1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRmb3IgKHZhciBvYmplY3RJbmRleCA9IG9iamVjdHMubGVuZ3RoIC0gMTsgb2JqZWN0SW5kZXggPj0gMDsgb2JqZWN0SW5kZXgtLSkge1xuXHRcdFx0dmFyIG9iamVjdEJCID0gb2JqZWN0c1tvYmplY3RJbmRleF0uZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgb2JqUG9zID0gb2JqZWN0c1tvYmplY3RJbmRleF0ucG9zaXRpb247XG5cdFx0XHR2YXIgbWluS2V5ID0gTWF0aC5mbG9vcigob2JqUG9zLnggKyBvYmplY3RCQi5taW4ueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0XHR2YXIgbWF4S2V5ID0gTWF0aC5mbG9vcigob2JqUG9zLnggKyBvYmplY3RCQi5tYXgueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cblx0XHRcdHJlc3VsdFttaW5LZXldID0gdHJ1ZTtcblx0XHRcdHJlc3VsdFttYXhLZXldID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgQ2FtZXJhLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XG5cdHZhciBzZWxlY3RlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblx0dmFyIGZvY3VzZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cblx0c2VsZWN0b3IuZm9jdXMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0aWYoIW1ldGEuZXF1YWxzKGZvY3VzZWQpKSB7XG5cdFx0XHRpZighZm9jdXNlZC5lcXVhbHMoc2VsZWN0ZWQpKSB7XG5cdFx0XHRcdHVuaGlnaGxpZ2h0KGZvY3VzZWQpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb2N1c2VkID0gbWV0YTtcblxuXHRcdFx0aWYoIWZvY3VzZWQuaXNFbXB0eSgpICYmICFmb2N1c2VkLmVxdWFscyhzZWxlY3RlZCkpIHtcblx0XHRcdFx0aGlnaGxpZ2h0KGZvY3VzZWQsIDB4NTVmZmZmKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIGhpZ2hsaWdodCA9IGZ1bmN0aW9uKG1ldGEsIGNvbG9yKSB7XG5cdFx0dmFyIG9iaiA9IGdldE9iamVjdChtZXRhKTtcblxuXHRcdG9iaiAmJiBvYmoubWF0ZXJpYWwuY29sb3Iuc2V0SGV4KGNvbG9yKTtcblx0XHRpc1NoZWxmKG1ldGEpICYmIChvYmoudmlzaWJsZSA9IHRydWUpO1xuXHR9O1xuXG5cdHZhciB1bmhpZ2hsaWdodCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqID0gZ2V0T2JqZWN0KG1ldGEpO1xuXG5cdFx0b2JqICYmIG9iai5tYXRlcmlhbC5jb2xvci5zZXRIZXgoMHhmZmZmZmYpO1xuXHRcdGlzU2hlbGYobWV0YSkgJiYgKG9iai52aXNpYmxlID0gZmFsc2UpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLnNlbGVjdEZvY3VzZWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWV0YSA9IGZvY3VzZWQ7XG5cblx0XHRzZWxlY3Rvci5zZWxlY3QobWV0YSk7XG5cdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0aWYoIW1ldGEuZXF1YWxzKHNlbGVjdGVkKSkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdHNlbGVjdGVkID0gbWV0YTtcblx0XHRcdGhpZ2hsaWdodChzZWxlY3RlZCwgMHg1NWZmNTUpO1xuXHRcdH1cblx0fTtcblxuXHRzZWxlY3Rvci51bnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFzZWxlY3RlZC5pc0VtcHR5KCkpIHtcblx0XHRcdHVuaGlnaGxpZ2h0KHNlbGVjdGVkKTtcblx0XHRcdHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHRcdH1cblx0fTtcblxuXHRzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3Qoc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBnZXRPYmplY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iamVjdDtcblxuXHRcdGlmKCFtZXRhLmlzRW1wdHkoKSkge1xuXHRcdFx0b2JqZWN0ID0gaXNTaGVsZihtZXRhKSA/IGVudmlyb25tZW50LmdldFNoZWxmKG1ldGEucGFyZW50SWQsIG1ldGEuaWQpXG5cdFx0XHRcdDogaXNCb29rKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0Qm9vayhtZXRhLmlkKVxuXHRcdFx0XHQ6IGlzU2VjdGlvbihtZXRhKSA/IGVudmlyb25tZW50LmdldFNlY3Rpb24obWV0YS5pZClcblx0XHRcdFx0OiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvYmplY3Q7XHRcblx0fTtcblxuXHRzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGlzQm9vayhzZWxlY3RlZCkgJiYgc2VsZWN0ZWQuaWQgPT09IGlkO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NoZWxmKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzU2VjdGlvbihzZWxlY3RlZCk7XG5cdH07XG5cblx0dmFyIGlzU2hlbGYgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gU2hlbGZPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNCb29rID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IEJvb2tPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNTZWN0aW9uID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNlY3Rpb25PYmplY3QuVFlQRTtcblx0fTtcblxuXHRyZXR1cm4gc2VsZWN0b3I7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=