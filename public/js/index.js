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

			return loadedCache;
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
			object;

		if(mouse.isCanvas() && environment.library) {
			//TODO: optimize
			intersected = mouse.getIntersected(environment.library.children, true, [BookObject]);
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
			}
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [SectionObject]);
			}
			if(intersected) {
				object = intersected.object;
			}

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

	environment.CLEARANCE = 0.001;
	 
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
				|| !target // children without BB
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
.factory('highlight', function (environment) {
	var highlight = {};

	var PLANE_ROTATION = Math.PI * 0.5;
	var PLANE_MULTIPLIER = 3.5;
	var COLOR_SELECT = 0x005533;
	var COLOR_FOCUS = 0x003355;

	var select;
	var focus;

	var init = function() {
		var materialProperties = {
			map: new THREE.ImageUtils.loadTexture( 'img/glow.png' ),
			transparent: true, 
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending
		};

		materialProperties.color = COLOR_SELECT;
		var materialSelect = new THREE.MeshBasicMaterial(materialProperties);

		materialProperties.color = COLOR_FOCUS;
		var materialFocus = new THREE.MeshBasicMaterial(materialProperties);

		var geometry = new THREE.PlaneGeometry(1, 1, 1);

		select = new THREE.Mesh(geometry, materialSelect);
		select.rotation.x = PLANE_ROTATION;

		focus = new THREE.Mesh(geometry, materialFocus);
		focus.rotation.x = PLANE_ROTATION;
	};

	var commonHighlight = function(which, obj) {
		if(obj) {
			var width = obj.geometry.boundingBox.max.x * PLANE_MULTIPLIER;
			var height = obj.geometry.boundingBox.max.z * PLANE_MULTIPLIER;
			var bottom = obj.geometry.boundingBox.min.y + environment.CLEARANCE;
			
			which.position.y = bottom;
			which.scale.set(width, height, 1);
			obj.add(which);

			which.visible = true;
		} else {
			which.visible = false;
		}
	}

	highlight.focus = function(obj) {
		commonHighlight(focus, obj);
	};

	highlight.select = function(obj) {
		commonHighlight(select, obj);
	};

	init();

	return highlight;
});
angular.module('VirtualBookshelf')
.factory('locator', function ($q, BaseObject, Data, selector, environment, cache) {
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
		var objectBB;
		var objPos;
		var minKey;
		var maxKey;

		objects.forEach(function (obj) {
			if (obj instanceof BaseObject) {
				objectBB = obj.geometry.boundingBox;
				objPos = obj.position;
				minKey = Math.floor((objPos.x + objectBB.min.x) / matrixPrecision.x);
				maxKey = Math.floor((objPos.x + objectBB.max.x) / matrixPrecision.x);

				result[minKey] = true;
				result[maxKey] = true;
			};
		});

		return result;
	};

	return locator;	
});
angular.module('VirtualBookshelf')
.factory('selector', function ($rootScope, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, environment, highlight) {
	var selector = {};
	
	var selected = new SelectorMeta();
	var focused = new SelectorMeta();

	selector.focus = function(meta) {
		if(!meta.equals(focused)) {
			if(!focused.equals(selected)) {
				highlight.focus(null);
			}

			focused = meta;

			if(!focused.isEmpty() && !focused.equals(selected)) {
				var obj = getObject(focused);
				highlight.focus(obj);
			}
		}
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

			var obj = getObject(selected);
			highlight.select(obj);
			highlight.focus(null);
		}
	};

	selector.unselect = function() {
		if(!selected.isEmpty()) {
			highlight.select(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0LmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91aS5qcyIsInNlcnZpY2VzL3VzZXIuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQmFzZU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9Cb29rT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0NhbWVyYU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNJbWFnZS5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNUZXh0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2hlbGZPYmplY3QuanMiLCJzZXJ2aWNlcy9zY2VuZS9oaWdobGlnaHQuanMiLCJzZXJ2aWNlcy9zY2VuZS9sb2NhdG9yLmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnLCBbJ2Jsb2NrVUknLCAnYW5ndWxhclV0aWxzLmRpcmVjdGl2ZXMuZGlyUGFnaW5hdGlvbiddKVxuICAgIFx0LmNvbmZpZyhmdW5jdGlvbiAoYmxvY2tVSUNvbmZpZywgcGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIpIHtcbiAgICBcdFx0YmxvY2tVSUNvbmZpZy5kZWxheSA9IDA7XG4gICAgXHRcdGJsb2NrVUlDb25maWcuYXV0b0Jsb2NrID0gZmFsc2U7XG5cdFx0XHRibG9ja1VJQ29uZmlnLmF1dG9JbmplY3RCb2R5QmxvY2sgPSBmYWxzZTtcblx0XHRcdHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyLnNldFBhdGgoJy9qcy9hbmd1bGFyL2RpclBhZ2luYXRpb24vZGlyUGFnaW5hdGlvbi50cGwuaHRtbCcpO1xuICAgIFx0fSlcbiAgICBcdC5ydW4oZnVuY3Rpb24gKE1haW4pIHtcblx0XHRcdE1haW4uc3RhcnQoKTtcbiAgICBcdH0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdVaUN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBVSSkge1xuICAgICRzY29wZS5tZW51ID0gVUkubWVudTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5kaXJlY3RpdmUoJ3ZiU2VsZWN0JywgZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6ICdFJyxcbiAgICBcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmw6ICcvdWkvc2VsZWN0LmVqcycsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdHNlbGVjdGVkOiAnPScsXG5cdFx0XHR2YWx1ZTogJ0AnLFxuXHRcdFx0bGFiZWw6ICdAJ1xuXHRcdH0sXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyLCB0cmFuc2NsdWRlKSB7XG5cdFx0XHRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHNjb3BlLnNlbGVjdGVkID0gaXRlbVtzY29wZS52YWx1ZV07XG5cdFx0XHR9O1xuXG5cdFx0XHRzY29wZS5pc1NlbGVjdGVkID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gc2NvcGUuc2VsZWN0ZWQgPT09IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhY2hlJywgZnVuY3Rpb24gKCRxLCBEYXRhKSB7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0ge307XG5cdHZhciBib29rcyA9IHt9O1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0Y2FjaGUuaW5pdCA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKSB7XG5cdFx0dmFyIGxpYnJhcnlMb2FkID0gbG9hZExpYnJhcnlEYXRhKGxpYnJhcnlNb2RlbCk7XG5cdFx0dmFyIHNlY3Rpb25zTG9hZCA9IFtdO1xuXHRcdHZhciBib29rc0xvYWQgPSBbXTtcblx0XHR2YXIgaW1hZ2VzTG9hZCA9IFtdO1xuXHRcdHZhciBtb2RlbCwgdXJsOyAvLyBpdGVyYXRvcnNcblxuXHRcdGZvciAobW9kZWwgaW4gc2VjdGlvbk1vZGVscykge1xuXHRcdFx0c2VjdGlvbnNMb2FkLnB1c2goYWRkU2VjdGlvbihtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAobW9kZWwgaW4gYm9va01vZGVscykge1xuXHRcdFx0Ym9va3NMb2FkLnB1c2goYWRkQm9vayhtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAodXJsIGluIGltYWdlVXJscykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlKHVybCkpO1xuXHRcdH1cblxuXHRcdHZhciBwcm9taXNlID0gJHEuYWxsKHtcblx0XHRcdGxpYnJhcnlDYWNoZTogbGlicmFyeUxvYWQsIFxuXHRcdFx0c2VjdGlvbnNMb2FkOiAkcS5hbGwoc2VjdGlvbnNMb2FkKSwgXG5cdFx0XHRib29rc0xvYWQ6ICRxLmFsbChib29rc0xvYWQpLFxuXHRcdFx0aW1hZ2VzTG9hZDogJHEuYWxsKGltYWdlc0xvYWQpXG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0bGlicmFyeSA9IHJlc3VsdHMubGlicmFyeUNhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Y2FjaGUuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaWJyYXJ5O1xuXHR9O1xuXG5cdGNhY2hlLmdldFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoc2VjdGlvbnMsIG1vZGVsLCBhZGRTZWN0aW9uKTtcblx0fTtcblxuXHRjYWNoZS5nZXRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGJvb2tzLCBtb2RlbCwgYWRkQm9vayk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0SW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGltYWdlcywgdXJsLCBhZGRJbWFnZSk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkdldHRlciA9IGZ1bmN0aW9uKGZyb20sIGtleSwgYWRkRnVuY3Rpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0gZnJvbVtrZXldO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0cmVzdWx0ID0gYWRkRnVuY3Rpb24oa2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEud2hlbihyZXN1bHQpO1xuXHR9O1xuXG5cdHZhciBjb21tb25BZGRlciA9IGZ1bmN0aW9uKHdoZXJlLCB3aGF0LCBsb2FkZXIsIGtleSkge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVtrZXkgfHwgd2hhdF0gPSBsb2FkZWRDYWNoZTtcblxuXHRcdFx0cmV0dXJuIGxvYWRlZENhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGFkZFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihzZWN0aW9ucywgbW9kZWwsIGxvYWRTZWN0aW9uRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihib29rcywgbW9kZWwsIGxvYWRCb29rRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkFkZGVyKGltYWdlcywgJy9vdXRzaWRlP2xpbms9JyArIHVybCwgRGF0YS5sb2FkSW1hZ2UsIHVybCk7XG5cdH07XG5cblx0dmFyIGxvYWRMaWJyYXJ5RGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9saWJyYXJpZXMve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBtb2RlbCk7XG4gICAgICAgIHZhciBtb2RlbFVybCA9IHBhdGggKyAnbW9kZWwuanNvbic7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gJHEuYWxsKHtcbiAgICAgICAgXHRnZW9tZXRyeTogRGF0YS5sb2FkR2VvbWV0cnkobW9kZWxVcmwpLCBcbiAgICAgICAgXHRtYXBJbWFnZTogRGF0YS5sb2FkSW1hZ2UobWFwVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZFNlY3Rpb25EYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG4gICAgICAgIHZhciBkYXRhVXJsID0gcGF0aCArICdkYXRhLmpzb24nO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gJHEuYWxsKHtcbiAgICAgICAgXHRnZW9tZXRyeTogRGF0YS5sb2FkR2VvbWV0cnkobW9kZWxVcmwpLCBcbiAgICAgICAgXHRtYXBJbWFnZTogRGF0YS5sb2FkSW1hZ2UobWFwVXJsKSwgXG4gICAgICAgIFx0ZGF0YTogRGF0YS5nZXREYXRhKGRhdGFVcmwpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBsb2FkQm9va0RhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovYm9va3Mve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBtb2RlbCk7XG4gICAgICAgIHZhciBtb2RlbFVybCA9IHBhdGggKyAnbW9kZWwuanMnO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSxcbiAgICAgICAgXHRtYXBJbWFnZTogRGF0YS5sb2FkSW1hZ2UobWFwVXJsKSBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0cmV0dXJuIGNhY2hlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbWVyYScsIGZ1bmN0aW9uIChDYW1lcmFPYmplY3QpIHtcblx0dmFyIENhbWVyYSA9IHtcblx0XHRIRUlHVEg6IDEuNSxcblx0XHRvYmplY3Q6IG5ldyBDYW1lcmFPYmplY3QoKSxcblx0XHRzZXRQYXJlbnQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdFx0cGFyZW50LmFkZCh0aGlzLm9iamVjdCk7XG5cdFx0fSxcblx0XHRnZXRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5vYmplY3QucG9zaXRpb247XG5cdFx0fVxuXHR9O1xuXG5cdENhbWVyYS5pbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRcdENhbWVyYS5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIHdpZHRoIC8gaGVpZ2h0LCAwLjAxLCA1MCk7XG5cdFx0dGhpcy5vYmplY3QucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygwLCBDYW1lcmEuSEVJR1RILCAwKTtcblx0XHR0aGlzLm9iamVjdC5yb3RhdGlvbi5vcmRlciA9ICdZWFonO1xuXG5cdFx0dmFyIGNhbmRsZSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4NjY1NTU1LCAxLjYsIDEwKTtcblx0XHRjYW5kbGUucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuXHRcdHRoaXMub2JqZWN0LmFkZChjYW5kbGUpO1xuXG5cdFx0dGhpcy5vYmplY3QuYWRkKENhbWVyYS5jYW1lcmEpO1xuXHR9O1xuXG5cdENhbWVyYS5yb3RhdGUgPSBmdW5jdGlvbih4LCB5KSB7XG5cdFx0dmFyIG5ld1ggPSB0aGlzLm9iamVjdC5yb3RhdGlvbi54ICsgeSAqIDAuMDAwMSB8fCAwO1xuXHRcdHZhciBuZXdZID0gdGhpcy5vYmplY3Qucm90YXRpb24ueSArIHggKiAwLjAwMDEgfHwgMDtcblxuXHRcdGlmKG5ld1ggPCAxLjU3ICYmIG5ld1ggPiAtMS41Nykge1x0XG5cdFx0XHR0aGlzLm9iamVjdC5yb3RhdGlvbi54ID0gbmV3WDtcblx0XHR9XG5cblx0XHR0aGlzLm9iamVjdC5yb3RhdGlvbi55ID0gbmV3WTtcblx0fTtcblxuXHRDYW1lcmEuZ28gPSBmdW5jdGlvbihzcGVlZCkge1xuXHRcdHZhciBkaXJlY3Rpb24gPSB0aGlzLmdldFZlY3RvcigpO1xuXHRcdHZhciBuZXdQb3NpdGlvbiA9IHRoaXMub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0bmV3UG9zaXRpb24uYWRkKGRpcmVjdGlvbi5tdWx0aXBseVNjYWxhcihzcGVlZCkpO1xuXG5cdFx0dGhpcy5vYmplY3QubW92ZShuZXdQb3NpdGlvbik7XG5cdH07XG5cblx0Q2FtZXJhLmdldFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAtMSk7XG5cblx0XHRyZXR1cm4gdmVjdG9yLmFwcGx5RXVsZXIodGhpcy5vYmplY3Qucm90YXRpb24pO1xuXHR9O1xuXG5cdHJldHVybiBDYW1lcmE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4vKiBcbiAqIGNvbnRyb2xzLmpzIGlzIGEgc2VydmljZSBmb3IgcHJvY2Vzc2luZyBub3QgVUkobWVudXMpIGV2ZW50cyBcbiAqIGxpa2UgbW91c2UsIGtleWJvYXJkLCB0b3VjaCBvciBnZXN0dXJlcy5cbiAqXG4gKiBUT0RPOiByZW1vdmUgYWxsIGJ1c2luZXMgbG9naWMgZnJvbSB0aGVyZSBhbmQgbGVhdmUgb25seVxuICogZXZlbnRzIGZ1bmN0aW9uYWxpdHkgdG8gbWFrZSBpdCBtb3JlIHNpbWlsYXIgdG8gdXN1YWwgY29udHJvbGxlclxuICovXG4uZmFjdG9yeSgnQ29udHJvbHMnLCBmdW5jdGlvbiAoJHEsICRsb2csIFNlbGVjdG9yTWV0YSwgQm9va09iamVjdCwgU2hlbGZPYmplY3QsIFNlY3Rpb25PYmplY3QsIENhbWVyYSwgRGF0YSwgbmF2aWdhdGlvbiwgZW52aXJvbm1lbnQsIG1vdXNlLCBzZWxlY3Rvcikge1xuXHR2YXIgQ29udHJvbHMgPSB7fTtcblxuXHRDb250cm9scy5CVVRUT05TX1JPVEFURV9TUEVFRCA9IDEwMDtcblx0Q29udHJvbHMuQlVUVE9OU19HT19TUEVFRCA9IDAuMDI7XG5cblx0Q29udHJvbHMuUG9ja2V0ID0ge1xuXHRcdF9ib29rczoge30sXG5cblx0XHRzZWxlY3RPYmplY3Q6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0dmFyIFxuXHRcdFx0XHRkYXRhT2JqZWN0ID0gdGhpcy5fYm9va3NbdGFyZ2V0LnZhbHVlXVxuXG5cdFx0XHREYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcblx0XHRcdFx0Q29udHJvbHMuUG9ja2V0LnJlbW92ZShkYXRhT2JqZWN0LmlkKTtcblx0XHRcdFx0Q29udHJvbHMuc2VsZWN0ZWQuc2VsZWN0KGJvb2ssIG51bGwpO1xuXHRcdFx0XHQvLyBib29rLmNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRyZW1vdmU6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR0aGlzLl9ib29rc1tpZF0gPSBudWxsO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX2Jvb2tzW2lkXTtcblx0XHR9LFxuXHRcdHB1dDogZnVuY3Rpb24oZGF0YU9iamVjdCkge1xuXHRcdFx0dGhpcy5fYm9va3NbZGF0YU9iamVjdC5pZF0gPSBkYXRhT2JqZWN0O1xuXHRcdH0sXG5cdFx0Z2V0Qm9va3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Jvb2tzO1xuXHRcdH0sXG5cdFx0aXNFbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYm9va3MubGVuZ3RoID09IDA7XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLnNlbGVjdGVkID0ge1xuXHRcdG9iamVjdDogbnVsbCxcblx0XHQvLyBwYXJlbnQ6IG51bGwsXG5cdFx0Z2V0dGVkOiBudWxsLFxuXHRcdC8vIHBvaW50OiBudWxsLFxuXG5cdFx0aXNCb29rOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpO1xuXHRcdH0sXG5cdFx0aXNTZWN0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpO1xuXHRcdH0sXG5cdFx0aXNTaGVsZjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNoZWxmKCk7XG5cdFx0fSxcblx0XHRpc01vdmFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5pc0Jvb2soKSB8fCB0aGlzLmlzU2VjdGlvbigpKTtcblx0XHR9LFxuXHRcdGlzUm90YXRhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMuaXNTZWN0aW9uKCkpO1xuXHRcdH0sXG5cdFx0Y2xlYXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdHRoaXMub2JqZWN0ID0gbnVsbDtcblx0XHRcdHRoaXMuZ2V0dGVkID0gbnVsbDtcblx0XHR9LFxuXHRcdHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRzZWxlY3Rvci5zZWxlY3RGb2N1c2VkKCk7XG5cblx0XHRcdC8vIHRoaXMuY2xlYXIoKTtcblx0XHRcdHRoaXMub2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdC8vIHRoaXMucG9pbnQgPSBwb2ludDtcblxuXHRcdH0sXG5cdFx0cmVsZWFzZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXHRcdFx0Ly9UT0RPOiB0aGVyZSBpcyBubyBzZWxlY3RlZCBvYmplY3QgYWZ0ZXIgcmVtb3ZlIGZyb21lIHNjZW5lXG5cdFx0XHRpZih0aGlzLmlzQm9vaygpICYmICFzZWxlY3RlZE9iamVjdC5wYXJlbnQpIHtcblx0XHRcdFx0Q29udHJvbHMuUG9ja2V0LnB1dChzZWxlY3RlZE9iamVjdC5kYXRhT2JqZWN0KTtcblx0XHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNhdmUoKTtcblx0XHR9LFxuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLmlzQm9vaygpICYmICF0aGlzLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0dGhpcy5nZXR0ZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLnBhcmVudCA9IHRoaXMub2JqZWN0LnBhcmVudDtcblx0XHRcdFx0dGhpcy5vYmplY3QucG9zaXRpb24uc2V0KDAsIDAsIC10aGlzLm9iamVjdC5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueiAtIDAuMjUpO1xuXHRcdFx0XHRDYW1lcmEuY2FtZXJhLmFkZCh0aGlzLm9iamVjdCk7XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnB1dCgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cHV0OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMuaXNHZXR0ZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdFx0XHR0aGlzLm9iamVjdC5yZWxvYWQoKTsvL3Bvc2l0aW9uXG5cdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGlzR2V0dGVkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmlzQm9vaygpICYmIHRoaXMuZ2V0dGVkO1xuXHRcdH0sXG5cdFx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXHRcdFx0aWYodGhpcy5pc01vdmFibGUoKSAmJiBzZWxlY3RlZE9iamVjdC5jaGFuZ2VkKSB7XG5cdFx0XHRcdHNlbGVjdGVkT2JqZWN0LnNhdmUoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdENvbnRyb2xzLmNsZWFyKCk7XG5cdFx0Q29udHJvbHMuaW5pdExpc3RlbmVycygpO1xuXHR9O1xuXG5cdENvbnRyb2xzLmluaXRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIENvbnRyb2xzLm9uRGJsQ2xpY2ssIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBDb250cm9scy5vbk1vdXNlRG93biwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBDb250cm9scy5vbk1vdXNlVXAsIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBDb250cm9scy5vbk1vdXNlTW92ZSwgZmFsc2UpO1x0XG5cdFx0ZG9jdW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uKCkge3JldHVybiBmYWxzZTt9XG5cdH07XG5cblx0Q29udHJvbHMuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0XHRDb250cm9scy5zZWxlY3RlZC5jbGVhcigpO1x0XG5cdH07XG5cblx0Q29udHJvbHMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRcdENhbWVyYS5yb3RhdGUobW91c2UubG9uZ1gsIG1vdXNlLmxvbmdZKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoKG1vdXNlWzFdICYmIG1vdXNlWzNdKSB8fCBuYXZpZ2F0aW9uLnN0YXRlLmZvcndhcmQpIHtcblx0XHRcdFx0Q2FtZXJhLmdvKHRoaXMuQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5iYWNrd2FyZCkge1xuXHRcdFx0XHRDYW1lcmEuZ28oLXRoaXMuQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5sZWZ0KSB7XG5cdFx0XHRcdENhbWVyYS5yb3RhdGUodGhpcy5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5yaWdodCkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKC10aGlzLkJVVFRPTlNfUk9UQVRFX1NQRUVELCAwKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gRXZlbnRzXG5cblx0Q29udHJvbHMub25EYmxDbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTogQ29udHJvbHMuc2VsZWN0ZWQuZ2V0KCk7IGJyZWFrO1xuXHRcdFx0fSAgIFx0XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLm9uTW91c2VEb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5kb3duKGV2ZW50KTsgXG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpIHx8IG1vdXNlLmlzUG9ja2V0Qm9vaygpKSB7XG5cdFx0XHQvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOy8vVE9ETzogcmVzZWFyY2ggKGVuYWJsZWQgY2Fubm90IHNldCBjdXJzb3IgdG8gaW5wdXQpXG5cblx0XHRcdGlmKG1vdXNlWzFdICYmICFtb3VzZVszXSAmJiAhQ29udHJvbHMuc2VsZWN0ZWQuaXNHZXR0ZWQoKSkge1xuXHRcdFx0XHRpZihtb3VzZS5pc0NhbnZhcygpKSB7XG5cdFx0XHRcdFx0Q29udHJvbHMuc2VsZWN0T2JqZWN0KCk7XG5cdFx0XHRcdFx0Q29udHJvbHMuc2VsZWN0ZWQuc2VsZWN0KCk7XG5cdFx0XHRcdH0gZWxzZSBpZihtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0XHRcdENvbnRyb2xzLlBvY2tldC5zZWxlY3RPYmplY3QobW91c2UudGFyZ2V0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlVXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdG1vdXNlLnVwKGV2ZW50KTtcblx0XHRcblx0XHRzd2l0Y2goZXZlbnQud2hpY2gpIHtcblx0XHRcdCBjYXNlIDE6IENvbnRyb2xzLnNlbGVjdGVkLnJlbGVhc2UoKTsgYnJlYWs7XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5tb3ZlKGV2ZW50KTtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQgXHRpZighQ29udHJvbHMuc2VsZWN0ZWQuaXNHZXR0ZWQoKSkge1xuXHRcdFx0XHRpZihtb3VzZVsxXSAmJiAhbW91c2VbM10pIHtcdFx0XG5cdFx0XHRcdFx0Q29udHJvbHMubW92ZU9iamVjdCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyB2YXIgb2JqID0gQ29udHJvbHMuc2VsZWN0ZWQub2JqZWN0O1xuXG5cdFx0XHRcdC8vIGlmKG9iaiBpbnN0YW5jZW9mIEJvb2tPYmplY3QpIHtcblx0XHRcdFx0Ly8gXHRpZihtb3VzZVsxXSkge1xuXHRcdFx0XHQvLyBcdFx0b2JqLm1vdmVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSwgVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyBcdGlmKG1vdXNlWzJdICYmIFVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPT0gJ2NvdmVyJykge1xuXHRcdFx0XHQvLyAgXHRcdG9iai5zY2FsZUVsZW1lbnQobW91c2UuZFgsIG1vdXNlLmRZKTtcblx0XHRcdFx0Ly8gXHR9XG5cdFx0XHRcdC8vIFx0aWYobW91c2VbM10pIHtcblx0XHRcdFx0Ly8gIFx0XHRvYmoucm90YXRlKG1vdXNlLmRYLCBtb3VzZS5kWSwgdHJ1ZSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyB9IFxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvLyoqKipcblxuXHRDb250cm9scy5zZWxlY3RPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHR2YXJcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0b2JqZWN0O1xuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSAmJiBlbnZpcm9ubWVudC5saWJyYXJ5KSB7XG5cdFx0XHQvL1RPRE86IG9wdGltaXplXG5cdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtCb29rT2JqZWN0XSk7XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2hlbGZPYmplY3RdKTtcblx0XHRcdH1cblx0XHRcdGlmKCFpbnRlcnNlY3RlZCkge1xuXHRcdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTZWN0aW9uT2JqZWN0XSk7XG5cdFx0XHR9XG5cdFx0XHRpZihpbnRlcnNlY3RlZCkge1xuXHRcdFx0XHRvYmplY3QgPSBpbnRlcnNlY3RlZC5vYmplY3Q7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yLmZvY3VzKG5ldyBTZWxlY3Rvck1ldGEob2JqZWN0KSk7XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLm1vdmVPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgXG5cdFx0XHRtb3VzZVZlY3Rvcixcblx0XHRcdG5ld1Bvc2l0aW9uLFxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRwYXJlbnQsXG5cdFx0XHRvbGRQYXJlbnQ7XG5cdFx0dmFyIHNlbGVjdGVkT2JqZWN0O1xuXG5cdFx0aWYoQ29udHJvbHMuc2VsZWN0ZWQuaXNCb29rKCkgfHwgKENvbnRyb2xzLnNlbGVjdGVkLmlzU2VjdGlvbigpLyogJiYgVUkubWVudS5zZWN0aW9uTWVudS5pc01vdmVPcHRpb24oKSovKSkge1xuXHRcdFx0c2VsZWN0ZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXHRcdFx0bW91c2VWZWN0b3IgPSBDYW1lcmEuZ2V0VmVjdG9yKCk7XHRcblxuXHRcdFx0bmV3UG9zaXRpb24gPSBzZWxlY3RlZE9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFx0b2xkUGFyZW50ID0gc2VsZWN0ZWRPYmplY3QucGFyZW50O1xuXG5cdFx0XHRpZihDb250cm9scy5zZWxlY3RlZC5pc0Jvb2soKSkge1xuXHRcdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTaGVsZk9iamVjdF0pO1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zZXRQYXJlbnQoaW50ZXJzZWN0ZWQgPyBpbnRlcnNlY3RlZC5vYmplY3QgOiBudWxsKTtcblx0XHRcdH1cblxuXHRcdFx0cGFyZW50ID0gc2VsZWN0ZWRPYmplY3QucGFyZW50O1xuXHRcdFx0aWYocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC5sb2NhbFRvV29ybGQobmV3UG9zaXRpb24pO1xuXG5cdFx0XHRcdG5ld1Bvc2l0aW9uLnggLT0gKG1vdXNlVmVjdG9yLnogKiBtb3VzZS5kWCArIG1vdXNlVmVjdG9yLnggKiBtb3VzZS5kWSkgKiAwLjAwMztcblx0XHRcdFx0bmV3UG9zaXRpb24ueiAtPSAoLW1vdXNlVmVjdG9yLnggKiBtb3VzZS5kWCArIG1vdXNlVmVjdG9yLnogKiBtb3VzZS5kWSkgKiAwLjAwMztcblxuXHRcdFx0XHRwYXJlbnQud29ybGRUb0xvY2FsKG5ld1Bvc2l0aW9uKTtcblx0XHRcdFx0aWYoIXNlbGVjdGVkT2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pICYmIENvbnRyb2xzLnNlbGVjdGVkLmlzQm9vaygpKSB7XG5cdFx0XHRcdFx0aWYocGFyZW50ICE9PSBvbGRQYXJlbnQpIHtcblx0XHRcdFx0XHRcdHNlbGVjdGVkT2JqZWN0LnNldFBhcmVudChvbGRQYXJlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0vKiBlbHNlIGlmKFVJLm1lbnUuc2VjdGlvbk1lbnUuaXNSb3RhdGVPcHRpb24oKSAmJiBDb250cm9scy5zZWxlY3RlZC5pc1NlY3Rpb24oKSkge1xuXHRcdFx0Q29udHJvbHMuc2VsZWN0ZWQub2JqZWN0LnJvdGF0ZShDb250cm9scy5tb3VzZS5kWCk7XHRcdFx0XG5cdFx0fSovXG5cdH07XG5cblx0cmV0dXJuIENvbnRyb2xzO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnRGF0YScsIGZ1bmN0aW9uICgkaHR0cCwgJHEpIHtcblx0dmFyIERhdGEgPSB7fTtcblxuXHREYXRhLlRFWFRVUkVfUkVTT0xVVElPTiA9IDUxMjtcblx0RGF0YS5DT1ZFUl9NQVhfWSA9IDM5NDtcblx0RGF0YS5DT1ZFUl9GQUNFX1ggPSAyOTY7XG5cbiAgICBEYXRhLmxvYWRJbWFnZSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIFxuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnJzsgXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XG4gICAgICAgIFxuICAgICAgICBpZihpbWcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlOyBcbiAgICB9O1xuXG5cdERhdGEuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy91c2VyJyk7XG5cdH07XG5cblx0RGF0YS5nZXRVc2VyQm9va3MgPSBmdW5jdGlvbih1c2VySWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvZnJlZUJvb2tzLycgKyB1c2VySWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9ib29rJywgYm9vayk7XG5cdH07XG5cblx0RGF0YS5kZWxldGVCb29rID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0dXJsOiAnL2Jvb2snLFxuXHRcdFx0ZGF0YTogYm9vayxcblx0XHRcdGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCd9XG5cdFx0fSk7XG5cdH07XG5cblx0RGF0YS5nZXRVSURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvb2JqL2RhdGEuanNvbicpO1xuXHR9O1xuXG5cdERhdGEuZ2V0TGlicmFyaWVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2xpYnJhcmllcycpO1xuXHR9O1xuXG5cdERhdGEuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJ5LycgKyBsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9saWJyYXJ5LycgKyBsaWJyYXJ5TW9kZWwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLmdldFNlY3Rpb25zID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZWN0aW9ucy8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5wb3N0U2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EYXRhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2VjdGlvbicsIHNlY3Rpb25EYXRhKTtcblx0fTtcblxuXHREYXRhLmdldEJvb2tzID0gZnVuY3Rpb24oc2VjdGlvbklkKSB7XG5cdFx0Ly9UT0RPOiB1c2VySWRcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2Jvb2tzLycgKyBzZWN0aW9uSWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLmxvYWRHZW9tZXRyeSA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHR2YXIganNvbkxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG5cbiAgICAgICAgLy9UT0RPOiBmb3VuZCBubyB3YXkgdG8gcmVqZWN0XG5cdFx0anNvbkxvYWRlci5sb2FkKGxpbmssIGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuXHRcdFx0ZGVmZmVyZWQucmVzb2x2ZShnZW9tZXRyeSk7XG5cdFx0fSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XG5cdH07XG5cblx0RGF0YS5nZXREYXRhID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YVxuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLnBvc3RGZWVkYmFjayA9IGZ1bmN0aW9uKGR0bykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2ZlZWRiYWNrJywgZHRvKTtcblx0fTtcblxuXHRyZXR1cm4gRGF0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdlbnZpcm9ubWVudCcsIGZ1bmN0aW9uICgkcSwgJGxvZywgTGlicmFyeU9iamVjdCwgU2VjdGlvbk9iamVjdCwgQm9va09iamVjdCwgRGF0YSwgQ2FtZXJhLCBjYWNoZSkge1xuXHR2YXIgZW52aXJvbm1lbnQgPSB7fTtcblxuXHRlbnZpcm9ubWVudC5DTEVBUkFOQ0UgPSAwLjAwMTtcblx0IFxuXHR2YXIgbGlicmFyeUR0byA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IG51bGw7XG5cdHZhciBib29rcyA9IG51bGw7XG5cblx0ZW52aXJvbm1lbnQuc2NlbmUgPSBudWxsO1xuXHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdGNsZWFyU2NlbmUoKTsgLy8gaW5pdHMgc29tZSBmaWVsZHNcblxuXHRcdHZhciBwcm9taXNlID0gRGF0YS5nZXRMaWJyYXJ5KGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHR2YXIgZGljdCA9IHBhcnNlTGlicmFyeUR0byhkdG8pO1xuXHRcdFx0c2VjdGlvbnMgPSBkaWN0LnNlY3Rpb25zO1xuXHRcdFx0Ym9va3MgPSBkaWN0LmJvb2tzO1xuXHRcdFx0bGlicmFyeUR0byA9IGR0bztcblxuXHRcdFx0cmV0dXJuIGluaXRDYWNoZShsaWJyYXJ5RHRvLCBkaWN0LnNlY3Rpb25zLCBkaWN0LmJvb2tzKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNyZWF0ZUxpYnJhcnkobGlicmFyeUR0byk7IC8vIHN5bmNcblx0XHRcdHJldHVybiBjcmVhdGVTZWN0aW9ucyhzZWN0aW9ucyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY3JlYXRlQm9va3MoYm9va3MpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KGJvb2tzLCBib29rSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChzZWN0aW9ucywgc2VjdGlvbklkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTaGVsZiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgc2hlbGZJZCkge1xuXHRcdHZhciBzZWN0aW9uID0gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihzZWN0aW9uSWQpO1xuXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24gJiYgc2VjdGlvbi5zaGVsdmVzW3NoZWxmSWRdO1xuXG5cdFx0cmV0dXJuIHNoZWxmO1xuXHR9O1xuXG5cdHZhciBnZXREaWN0T2JqZWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqZWN0SWQpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W29iamVjdElkXTtcblx0XHR2YXIgZGljdE9iamVjdCA9IGRpY3RJdGVtICYmIGRpY3RJdGVtLm9iajtcblxuXHRcdHJldHVybiBkaWN0T2JqZWN0O1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZUJvb2sgPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgc2hlbGYgPSBnZXRCb29rU2hlbGYoZHRvKTtcblxuXHRcdGlmKHNoZWxmKSB7XG5cdFx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGR0by5pZCk7XG5cdFx0XHRjcmVhdGVCb29rKGR0byk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZU9iamVjdChib29rcywgZHRvLmlkKTtcblx0XHR9XHRcblx0fTtcblxuXHRlbnZpcm9ubWVudC5yZW1vdmVCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHJlbW92ZU9iamVjdChib29rcywgYm9va0R0by5pZCk7XG5cdH07XG5cblx0dmFyIHJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKGRpY3QsIGtleSkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rba2V5XTtcblx0XHRpZihkaWN0SXRlbSkge1xuXHRcdFx0ZGVsZXRlIGRpY3Rba2V5XTtcblx0XHRcdFxuXHRcdFx0aWYoZGljdEl0ZW0ub2JqKSB7XG5cdFx0XHRcdGRpY3RJdGVtLm9iai5zZXRQYXJlbnQobnVsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0Q2FjaGUgPSBmdW5jdGlvbihsaWJyYXJ5RHRvLCBzZWN0aW9uc0RpY3QsIGJvb2tzRGljdCkge1xuXHRcdHZhciBsaWJyYXJ5TW9kZWwgPSBsaWJyYXJ5RHRvLm1vZGVsO1xuXHRcdHZhciBzZWN0aW9uTW9kZWxzID0ge307XG5cdFx0dmFyIGJvb2tNb2RlbHMgPSB7fTtcblx0XHR2YXIgaW1hZ2VVcmxzID0ge307XG5cblx0XHRmb3IgKHZhciBzZWN0aW9uSWQgaW4gc2VjdGlvbnNEaWN0KSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IHNlY3Rpb25zRGljdFtzZWN0aW9uSWRdLmR0bztcblx0XHRcdHNlY3Rpb25Nb2RlbHNbc2VjdGlvbkR0by5tb2RlbF0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGJvb2tJZCBpbiBib29rc0RpY3QpIHtcblx0XHRcdHZhciBib29rRHRvID0gYm9va3NEaWN0W2Jvb2tJZF0uZHRvO1xuXHRcdFx0Ym9va01vZGVsc1tib29rRHRvLm1vZGVsXSA9IHRydWU7XG5cblx0XHRcdGlmKGJvb2tEdG8uY292ZXIpIHtcblx0XHRcdFx0aW1hZ2VVcmxzW2Jvb2tEdG8uY292ZXJdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGUuaW5pdChsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGltYWdlVXJscyk7XG5cdH07XG5cblx0dmFyIGNsZWFyU2NlbmUgPSBmdW5jdGlvbigpIHtcblx0XHQvLyBDb250cm9scy5jbGVhcigpO1xuXHRcdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXHRcdHNlY3Rpb25zID0ge307XG5cdFx0Ym9va3MgPSB7fTtcblxuXHRcdHdoaWxlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdGlmKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW5bMF0uZGlzcG9zZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUucmVtb3ZlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHBhcnNlTGlicmFyeUR0byA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8pIHtcblx0XHR2YXIgcmVzdWx0ID0ge1xuXHRcdFx0c2VjdGlvbnM6IHt9LFxuXHRcdFx0Ym9va3M6IHt9XG5cdFx0fTtcblxuXHRcdGZvcih2YXIgc2VjdGlvbkluZGV4ID0gbGlicmFyeUR0by5zZWN0aW9ucy5sZW5ndGggLSAxOyBzZWN0aW9uSW5kZXggPj0gMDsgc2VjdGlvbkluZGV4LS0pIHtcblx0XHRcdHZhciBzZWN0aW9uRHRvID0gbGlicmFyeUR0by5zZWN0aW9uc1tzZWN0aW9uSW5kZXhdO1xuXHRcdFx0cmVzdWx0LnNlY3Rpb25zW3NlY3Rpb25EdG8uaWRdID0ge2R0bzogc2VjdGlvbkR0b307XG5cblx0XHRcdGZvcih2YXIgYm9va0luZGV4ID0gc2VjdGlvbkR0by5ib29rcy5sZW5ndGggLSAxOyBib29rSW5kZXggPj0gMDsgYm9va0luZGV4LS0pIHtcblx0XHRcdFx0dmFyIGJvb2tEdG8gPSBzZWN0aW9uRHRvLmJvb2tzW2Jvb2tJbmRleF07XG5cdFx0XHRcdHJlc3VsdC5ib29rc1tib29rRHRvLmlkXSA9IHtkdG86IGJvb2tEdG99O1xuXHRcdFx0fVxuXG5cdFx0XHRkZWxldGUgc2VjdGlvbkR0by5ib29rcztcblx0XHR9XG5cblx0XHRkZWxldGUgbGlicmFyeUR0by5zZWN0aW9ucztcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGNyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIGxpYnJhcnkgPSBudWxsO1xuXHRcdHZhciBsaWJyYXJ5Q2FjaGUgPSBjYWNoZS5nZXRMaWJyYXJ5KCk7XG4gICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUobGlicmFyeUNhY2hlLm1hcEltYWdlKTtcbiAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblxuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRsaWJyYXJ5ID0gbmV3IExpYnJhcnlPYmplY3QobGlicmFyeUR0bywgbGlicmFyeUNhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdFx0Q2FtZXJhLnNldFBhcmVudChsaWJyYXJ5KTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lLmFkZChsaWJyYXJ5KTtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbGlicmFyeTtcblx0fTtcblxuXHR2YXIgY3JlYXRlU2VjdGlvbnMgPSBmdW5jdGlvbihzZWN0aW9uc0RpY3QpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuXHRcdHZhciBrZXk7XG5cblx0XHRmb3Ioa2V5IGluIHNlY3Rpb25zRGljdCkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKGNyZWF0ZVNlY3Rpb24oc2VjdGlvbnNEaWN0W2tleV0uZHRvKSk7XHRcdFxuXHRcdH1cblxuXHRcdHJldHVybiAkcS5hbGwocmVzdWx0cyk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRHRvKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRTZWN0aW9uKHNlY3Rpb25EdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHQgICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoc2VjdGlvbkNhY2hlLm1hcEltYWdlKTtcblx0ICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXHQgICAgICAgIHZhciBzZWN0aW9uO1xuXG5cdCAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdCAgICAgICAgc2VjdGlvbkR0by5kYXRhID0gc2VjdGlvbkNhY2hlLmRhdGE7XG5cblx0ICAgICAgICBzZWN0aW9uID0gbmV3IFNlY3Rpb25PYmplY3Qoc2VjdGlvbkR0bywgc2VjdGlvbkNhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHRcdGVudmlyb25tZW50LmxpYnJhcnkuYWRkKHNlY3Rpb24pO1xuXHRcdFx0YWRkVG9EaWN0KHNlY3Rpb25zLCBzZWN0aW9uKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdC8vIFRPRE86IG1lcmdlIHdpdGggY3JlYXRlU2VjdGlvbnNcblx0dmFyIGNyZWF0ZUJvb2tzID0gZnVuY3Rpb24oYm9va3NEaWN0KSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Zm9yKGtleSBpbiBib29rc0RpY3QpIHtcblx0XHRcdHJlc3VsdHMucHVzaChjcmVhdGVCb29rKGJvb2tzRGljdFtrZXldLmR0bykpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS5hbGwocmVzdWx0cyk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2VzID0ge307XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRwcm9taXNlcy5ib29rQ2FjaGUgPSBjYWNoZS5nZXRCb29rKGJvb2tEdG8ubW9kZWwpO1xuXHRcdGlmKGJvb2tEdG8uY292ZXIpIHtcblx0XHRcdHByb21pc2VzLmNvdmVyQ2FjaGUgPSBjYWNoZS5nZXRJbWFnZShib29rRHRvLmNvdmVyKTtcblx0XHR9XG5cblx0XHRwcm9taXNlID0gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cdFx0XHR2YXIgYm9va0NhY2hlID0gcmVzdWx0cy5ib29rQ2FjaGU7XG5cdFx0XHR2YXIgY292ZXJJbWFnZSA9IHJlc3VsdHMuY292ZXJDYWNoZTtcblx0XHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuXHRcdFx0Y2FudmFzLndpZHRoID0gY2FudmFzLmhlaWdodCA9IERhdGEuVEVYVFVSRV9SRVNPTFVUSU9OO1xuXHRcdFx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuXHRcdCAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXG5cdFx0XHR2YXIgYm9vayA9IG5ldyBCb29rT2JqZWN0KGJvb2tEdG8sIGJvb2tDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwsIGJvb2tDYWNoZS5tYXBJbWFnZSwgY292ZXJJbWFnZSk7XG5cblx0XHRcdGFkZFRvRGljdChib29rcywgYm9vayk7XG5cdFx0XHRwbGFjZUJvb2tPblNoZWxmKGJvb2spO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGFkZFRvRGljdCA9IGZ1bmN0aW9uKGRpY3QsIG9iaikge1xuXHRcdHZhciBkaWN0SXRlbSA9IHtcblx0XHRcdGR0bzogb2JqLmRhdGFPYmplY3QsXG5cdFx0XHRvYmo6IG9ialxuXHRcdH07XG5cblx0XHRkaWN0W29iai5pZF0gPSBkaWN0SXRlbTtcblx0fTtcblxuXHR2YXIgZ2V0Qm9va1NoZWxmID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHJldHVybiBlbnZpcm9ubWVudC5nZXRTaGVsZihib29rRHRvLnNlY3Rpb25JZCwgYm9va0R0by5zaGVsZklkKTtcblx0fTtcblxuXHR2YXIgcGxhY2VCb29rT25TaGVsZiA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHR2YXIgc2hlbGYgPSBnZXRCb29rU2hlbGYoYm9vay5kYXRhT2JqZWN0KTtcblx0XHRzaGVsZi5hZGQoYm9vayk7XG5cdH07XG5cblx0cmV0dXJuIGVudmlyb25tZW50O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ01haW4nLCBmdW5jdGlvbiAoJGxvZywgRGF0YSwgQ2FtZXJhLCBMaWJyYXJ5T2JqZWN0LCBDb250cm9scywgVXNlciwgVUksIGVudmlyb25tZW50KSB7XG5cdHZhciBTVEFUU19DT05UQUlORVJfSUQgPSAnc3RhdHMnO1xuXHR2YXIgTElCUkFSWV9DQU5WQVNfSUQgPSAnTElCUkFSWSc7XG5cdFxuXHR2YXIgY2FudmFzO1xuXHR2YXIgcmVuZGVyZXI7XG5cdHZhciBzdGF0cztcblx0XG5cdHZhciBNYWluID0ge307XG5cblx0TWFpbi5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRpZighRGV0ZWN0b3Iud2ViZ2wpIHtcblx0XHRcdERldGVjdG9yLmFkZEdldFdlYkdMTWVzc2FnZSgpO1xuXHRcdH1cblxuXHRcdGluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q2FtZXJhLmluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q29udHJvbHMuaW5pdCgpO1xuXG5cdFx0c3RhcnRSZW5kZXJMb29wKCk7XG5cblx0XHRVc2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5KFVzZXIuZ2V0TGlicmFyeSgpIHx8IDEpO1xuXHRcdFx0VUkuaW5pdCgpO1xuXHRcdH0sIGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHQvL1RPRE86IHNob3cgZXJyb3IgbWVzc2FnZSAgXG5cdFx0fSk7XHRcdFxuXHR9O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRcdHZhciBzdGF0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNUQVRTX0NPTlRBSU5FUl9JRCk7XG5cblx0XHRzdGF0cyA9IG5ldyBTdGF0cygpO1xuXHRcdHN0YXRzQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbUVsZW1lbnQpO1xuXG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoTElCUkFSWV9DQU5WQVNfSUQpO1xuXHRcdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2NhbnZhczogY2FudmFzfSk7XG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZygweDAwMDAwMCwgNCwgNyk7XG5cdH07XG5cblx0dmFyIHN0YXJ0UmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGFydFJlbmRlckxvb3ApO1xuXHRcdENvbnRyb2xzLnVwZGF0ZSgpO1xuXHRcdHJlbmRlcmVyLnJlbmRlcihlbnZpcm9ubWVudC5zY2VuZSwgQ2FtZXJhLmNhbWVyYSk7XG5cblx0XHRzdGF0cy51cGRhdGUoKTtcblx0fTtcblxuXHRyZXR1cm4gTWFpbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtb3VzZScsIGZ1bmN0aW9uIChDYW1lcmEpIHtcblx0dmFyIG1vdXNlID0ge307XG5cblx0dmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0dmFyIHggPSBudWxsO1xuXHR2YXIgeSA9IG51bGw7XG5cdFxuXHRtb3VzZS50YXJnZXQgPSBudWxsO1xuXHRtb3VzZS5kWCA9IG51bGw7XG5cdG1vdXNlLmRZID0gbnVsbDtcblx0bW91c2UubG9uZ1ggPSBudWxsO1xuXHRtb3VzZS5sb25nWSA9IG51bGw7XG5cblx0bW91c2UuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHR9O1xuXG5cdG1vdXNlLmRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHggPSBldmVudC54O1xuXHRcdFx0eSA9IGV2ZW50Lnk7XG5cdFx0XHRtb3VzZS5sb25nWCA9IHdpZHRoICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gaGVpZ2h0ICogMC41IC0geTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UudXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IGZhbHNlO1xuXHRcdFx0dGhpc1sxXSA9IGZhbHNlOyAvLyBsaW51eCBjaHJvbWUgYnVnIGZpeCAod2hlbiBib3RoIGtleXMgcmVsZWFzZSB0aGVuIGJvdGggZXZlbnQud2hpY2ggZXF1YWwgMylcblx0XHR9XG5cdH07XG5cblx0bW91c2UubW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0bW91c2UubG9uZ1ggPSB3aWR0aCAqIDAuNSAtIHg7XG5cdFx0XHRtb3VzZS5sb25nWSA9IGhlaWdodCAqIDAuNSAtIHk7XG5cdFx0XHRtb3VzZS5kWCA9IGV2ZW50LnggLSB4O1xuXHRcdFx0bW91c2UuZFkgPSBldmVudC55IC0geTtcblx0XHRcdHggPSBldmVudC54O1xuXHRcdFx0eSA9IGV2ZW50Lnk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLmlzQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0ICYmIHRoaXMudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCd1aScpID4gLTE7XG5cdH07XG5cblx0bW91c2UuaXNQb2NrZXRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvL1RPRE86IHN0dWJcblx0XHQvLyByZXR1cm4gISEodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQucGFyZW50Tm9kZSA9PSBVSS5tZW51LmludmVudG9yeS5ib29rcyk7XG5cdH07XG5cblx0bW91c2UuZ2V0SW50ZXJzZWN0ZWQgPSBmdW5jdGlvbihvYmplY3RzLCByZWN1cnNpdmUsIHNlYXJjaEZvcikge1xuXHRcdHZhclxuXHRcdFx0dmVjdG9yLFxuXHRcdFx0cmF5Y2FzdGVyLFxuXHRcdFx0aW50ZXJzZWN0cyxcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0aSwgajtcblxuXHRcdHJlc3VsdCA9IG51bGw7XG5cdFx0dmVjdG9yID0gZ2V0VmVjdG9yKCk7XG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcihDYW1lcmEuZ2V0UG9zaXRpb24oKSwgdmVjdG9yKTtcblx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdGlmKHNlYXJjaEZvcikge1xuXHRcdFx0aWYoaW50ZXJzZWN0cy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkID0gaW50ZXJzZWN0c1tpXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0aWYoaW50ZXJzZWN0ZWQub2JqZWN0IGluc3RhbmNlb2Ygc2VhcmNoRm9yW2pdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IGludGVyc2VjdGVkO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBnZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygoeCAvIHdpZHRoKSAqIDIgLSAxLCAtICh5IC8gaGVpZ2h0KSAqIDIgKyAxLCAwLjUpO1xuXHRcdHByb2plY3Rvci51bnByb2plY3RWZWN0b3IodmVjdG9yLCBDYW1lcmEuY2FtZXJhKTtcblx0XG5cdFx0cmV0dXJuIHZlY3Rvci5zdWIoQ2FtZXJhLmdldFBvc2l0aW9uKCkpLm5vcm1hbGl6ZSgpO1xuXHR9O1xuXG5cdHJldHVybiBtb3VzZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgbmF2aWdhdGlvbiA9IHtcblx0XHRzdGF0ZToge1xuXHRcdFx0Zm9yd2FyZDogZmFsc2UsXG5cdFx0XHRiYWNrd2FyZDogZmFsc2UsXG5cdFx0XHRsZWZ0OiBmYWxzZSxcblx0XHRcdHJpZ2h0OiBmYWxzZVx0XHRcdFxuXHRcdH1cblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvU3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuZm9yd2FyZCA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLmxlZnQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gZmFsc2U7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmZvcndhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29CYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5sZWZ0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdVSScsIGZ1bmN0aW9uICgkcSwgJGxvZywgU2VsZWN0b3JNZXRhLCBVc2VyLCBEYXRhLCBDb250cm9scywgbmF2aWdhdGlvbiwgZW52aXJvbm1lbnQsIGxvY2F0b3IsIHNlbGVjdG9yLCBibG9ja1VJKSB7XG5cdHZhciBCT09LX0lNQUdFX1VSTCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vaW1nLmpwZyc7XG5cdHZhciBVSSA9IHttZW51OiB7fX07XG5cblx0VUkubWVudS5zZWxlY3RMaWJyYXJ5ID0ge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdHVwZGF0ZUxpc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdCAgICBEYXRhLmdldExpYnJhcmllcygpXG5cdFx0ICAgIFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdCAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXMuZGF0YTtcblx0XHQgICAgXHR9KTtcblx0XHR9LFxuXHRcdGdvOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0aWYoaWQpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQubG9hZExpYnJhcnkoaWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUxpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubW9kZWwgPyAnL29iai9saWJyYXJpZXMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0RGF0YS5wb3N0TGlicmFyeSh0aGlzLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeShyZXN1bHQuaWQpO1xuXHRcdFx0XHRcdFVJLm1lbnUuc2hvdyA9IG51bGw7IC8vIFRPRE86IGhpZGUgYWZ0ZXIgZ28gXG5cdFx0XHRcdFx0VUkubWVudS5zZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKTtcblx0XHRcdFx0XHQvL1RPRE86IGFkZCBsaWJyYXJ5IHdpdGhvdXQgcmVsb2FkXG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZVNlY3Rpb24gPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cdFx0XG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGVsID8gJy9vYmovc2VjdGlvbnMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0dmFyIHNlY3Rpb25EYXRhID0ge1xuXHRcdFx0XHRcdG1vZGVsOiB0aGlzLm1vZGVsLFxuXHRcdFx0XHRcdHVzZXJJZDogVXNlci5nZXRJZCgpXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0RGF0YS5wb3N0U2VjdGlvbihzZWN0aW9uRGF0YSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiByZWZhY3RvciAoZG9uJ3Qgc2VlIG5ldyBzZWN0aW9uIGNyZWF0aW9uKVxuXHRcdFx0XHRcdC8vIHBvc3NpYmx5IGFkZCB0byBpbnZlbnRvcnkgb25seVxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmZlZWRiYWNrID0ge1xuXHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0c2hvdzogdHJ1ZSxcblxuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2hvdyA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0c3VibWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkYXRhT2JqZWN0O1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLm1lc3NhZ2UpIHtcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dXNlcklkOiBVc2VyLmdldElkKClcblx0XHRcdFx0fTtcblxuXHRcdFx0XHREYXRhLnBvc3RGZWVkYmFjayhkYXRhT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51Lm5hdmlnYXRpb24gPSB7XG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvU3RvcCgpO1xuXHRcdH0sXG5cdFx0Zm9yd2FyZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCgpO1xuXHRcdH0sXG5cdFx0YmFja3dhcmQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvbi5nb0JhY2t3YXJkKCk7XG5cdFx0fSxcblx0XHRsZWZ0OiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29MZWZ0KCk7XG5cdFx0fSxcblx0XHRyaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvUmlnaHQoKTtcblx0XHR9XG5cdH07XG5cblx0VUkubWVudS5sb2dpbiA9IHtcblx0XHQvLyBUT0RPOiBvYXV0aC5pb1xuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gIVVzZXIuaXNBdXRob3JpemVkKCkgJiYgVXNlci5pc0xvYWRlZCgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmludmVudG9yeSA9IHtcblx0XHRzZWFyY2g6IG51bGwsXG5cdFx0bGlzdDogbnVsbCxcblx0XHRibG9ja2VyOiAnaW52ZW50b3J5Jyxcblx0XG5cdFx0ZXhwYW5kOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZUJvb2suc2V0Qm9vayhib29rKTtcblx0XHR9LFxuXHRcdGJsb2NrOiBmdW5jdGlvbigpIHtcblx0XHRcdGJsb2NrVUkuaW5zdGFuY2VzLmdldCh0aGlzLmJsb2NrZXIpLnN0YXJ0KCk7XG5cdFx0fSxcblx0XHR1bmJsb2NrOiBmdW5jdGlvbigpIHtcblx0XHRcdGJsb2NrVUkuaW5zdGFuY2VzLmdldCh0aGlzLmJsb2NrZXIpLnN0b3AoKTtcblx0XHR9LFxuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gVXNlci5pc0F1dGhvcml6ZWQoKTtcblx0XHR9LFxuXHRcdGlzQm9va1NlbGVjdGVkOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkKGlkKTtcblx0XHR9LFxuXHRcdHNlbGVjdDogZnVuY3Rpb24oZHRvKSB7XG5cdFx0XHR2YXIgYm9vayA9IGVudmlyb25tZW50LmdldEJvb2soZHRvLmlkKTtcblx0XHRcdHZhciBtZXRhID0gbmV3IFNlbGVjdG9yTWV0YShib29rKTtcblx0XHRcdHNlbGVjdG9yLnNlbGVjdChtZXRhKTtcblx0XHR9LFxuXHRcdGFkZEJvb2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdFx0c2NvcGUuYmxvY2soKTtcblx0XHRcdERhdGEucG9zdEJvb2soe3VzZXJJZDogVXNlci5nZXRJZCgpfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLmV4cGFuZChyZXMuZGF0YSk7XG5cdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdC8vVE9ETzogcmVzZWFyY2gsIGxvb2tzIHJpZ3RoXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5kZWxldGVCb29rKGJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cGxhY2U6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHR2YXIgcHJvbWlzZTtcblx0XHRcdHZhciBpc0Jvb2tQbGFjZWQgPSAhIWJvb2suc2VjdGlvbklkO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0cHJvbWlzZSA9IGlzQm9va1BsYWNlZCA/IGxvY2F0b3IudW5wbGFjZUJvb2soYm9vaykgOiBsb2NhdG9yLnBsYWNlQm9vayhib29rKTtcblx0XHRcdHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7IFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0dmFyIHByb21pc2U7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih0aGlzLmlzU2hvdygpID8gRGF0YS5nZXRVc2VyQm9va3MoVXNlci5nZXRJZCgpKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKGJvb2tzKSB7XG5cdFx0XHRcdHNjb3BlLmxpc3QgPSBib29rcztcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7XHRcdFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUJvb2sgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0Ym9vazoge30sXG5cblx0XHRzZXRCb29rOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR0aGlzLmJvb2sgPSB7fTsgLy8gY3JlYXRlIG5ldyBvYmplY3QgZm9yIHVuYmluZCBmcm9tIHNjb3BlXG5cdFx0XHRpZihib29rKSB7XG5cdFx0XHRcdHRoaXMuYm9vay5pZCA9IGJvb2suaWQ7XG5cdFx0XHRcdHRoaXMuYm9vay51c2VySWQgPSBib29rLnVzZXJJZDtcblx0XHRcdFx0dGhpcy5ib29rLm1vZGVsID0gYm9vay5tb2RlbDtcblx0XHRcdFx0dGhpcy5ib29rLmNvdmVyID0gYm9vay5jb3Zlcjtcblx0XHRcdFx0dGhpcy5ib29rLnRpdGxlID0gYm9vay50aXRsZTtcblx0XHRcdFx0dGhpcy5ib29rLmF1dGhvciA9IGJvb2suYXV0aG9yO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmJvb2subW9kZWwgPyBCT09LX0lNQUdFX1VSTC5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5ib29rLm1vZGVsKSA6IG51bGw7XG5cdFx0fSxcblx0XHRpc1Nob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICEhdGhpcy5ib29rLmlkO1xuXHRcdH0sXG5cdFx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHRVSS5tZW51LmludmVudG9yeS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh0aGlzLmJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC51cGRhdGVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0c2NvcGUuY2FuY2VsKCk7XG5cdFx0XHRcdHJldHVybiBVSS5tZW51LmludmVudG9yeS5sb2FkRGF0YSgpXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvclxuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFVJLm1lbnUuaW52ZW50b3J5LnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Y2FuY2VsOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2V0Qm9vaygpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly9UT0RPOiBtb3ZlIHRvIG1lbnUgbW9kZWxzXG5cdFx0RGF0YS5nZXRVSURhdGEoKVxuXHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFVJLm1lbnUuY3JlYXRlTGlicmFyeS5saXN0ID0gcmVzLmRhdGEubGlicmFyaWVzO1xuXHRcdFx0VUkubWVudS5jcmVhdGVTZWN0aW9uLmxpc3QgPSByZXMuZGF0YS5ib29rc2hlbHZlcztcblx0XHRcdFVJLm1lbnUuY3JlYXRlQm9vay5saXN0ID0gcmVzLmRhdGEuYm9va3M7XG5cdFx0fSlcblx0XHQuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0fSk7XG5cblx0XHRVSS5tZW51LnNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpO1xuXHRcdFVJLm1lbnUuaW52ZW50b3J5LmxvYWREYXRhKCk7XHRcblx0fTtcblxuXHRyZXR1cm4gVUk7XG59KTtcblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5pbml0Q29udHJvbHNFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2subW9kZWwub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZU1vZGVsO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50ZXh0dXJlLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rVGV4dHVyZTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suY292ZXIub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tDb3Zlcjtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCdhdXRob3InLCAndGV4dCcpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5hdXRob3JTaXplLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCdhdXRob3InLCAnc2l6ZScpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5hdXRob3JDb2xvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ2NvbG9yJyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRpdGxlLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCd0aXRsZScsICd0ZXh0Jyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRpdGxlU2l6ZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAnc2l6ZScpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZUNvbG9yLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCd0aXRsZScsICdjb2xvcicpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0Q292ZXIub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0QXV0aG9yLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdFRpdGxlLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sub2sub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc2F2ZUJvb2s7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmNhbmNlbC5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jYW5jZWxCb29rRWRpdDtcbi8vIH07XG5cbi8vIGNyZWF0ZSBib29rXG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuc2hvd0NyZWF0ZUJvb2sgPSBmdW5jdGlvbigpIHtcbi8vIFx0dmFyIG1lbnVOb2RlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2s7XG5cbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdG1lbnVOb2RlLnNob3coKTtcbi8vIFx0XHRtZW51Tm9kZS5zZXRWYWx1ZXMoKTtcbi8vIFx0fSBlbHNlIGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNTZWN0aW9uKCkpIHtcbi8vIFx0XHR2YXIgc2VjdGlvbiA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24uZ2V0U2hlbGZCeVBvaW50KFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucG9pbnQpO1xuLy8gXHRcdHZhciBmcmVlUG9zaXRpb24gPSBzZWN0aW9uLmdldEdldEZyZWVTaGVsZlBvc2l0aW9uKHNoZWxmLCB7eDogMC4wNSwgeTogMC4xMiwgejogMC4xfSk7IFxuLy8gXHRcdGlmKGZyZWVQb3NpdGlvbikge1xuLy8gXHRcdFx0bWVudU5vZGUuc2hvdygpO1xuXG4vLyBcdFx0XHR2YXIgZGF0YU9iamVjdCA9IHtcbi8vIFx0XHRcdFx0bW9kZWw6IG1lbnVOb2RlLm1vZGVsLnZhbHVlLCBcbi8vIFx0XHRcdFx0dGV4dHVyZTogbWVudU5vZGUudGV4dHVyZS52YWx1ZSwgXG4vLyBcdFx0XHRcdGNvdmVyOiBtZW51Tm9kZS5jb3Zlci52YWx1ZSxcbi8vIFx0XHRcdFx0cG9zX3g6IGZyZWVQb3NpdGlvbi54LFxuLy8gXHRcdFx0XHRwb3NfeTogZnJlZVBvc2l0aW9uLnksXG4vLyBcdFx0XHRcdHBvc196OiBmcmVlUG9zaXRpb24ueixcbi8vIFx0XHRcdFx0c2VjdGlvbklkOiBzZWN0aW9uLmRhdGFPYmplY3QuaWQsXG4vLyBcdFx0XHRcdHNoZWxmSWQ6IHNoZWxmLmlkLFxuLy8gXHRcdFx0XHR1c2VySWQ6IFZpcnR1YWxCb29rc2hlbGYudXNlci5pZFxuLy8gXHRcdFx0fTtcblxuLy8gXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcbi8vIFx0XHRcdFx0Ym9vay5wYXJlbnQgPSBzaGVsZjtcbi8vIFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QgPSBib29rO1xuLy8gXHRcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmdldCgpO1xuLy8gXHRcdFx0fSk7XG4vLyBcdFx0fSBlbHNlIHtcbi8vIFx0XHRcdGFsZXJ0KCdUaGVyZSBpcyBubyBmcmVlIHNwYWNlIG9uIHNlbGVjdGVkIHNoZWxmLicpO1xuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZU1vZGVsID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgb2xkQm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdHZhciBkYXRhT2JqZWN0ID0ge1xuLy8gXHRcdFx0bW9kZWw6IHRoaXMudmFsdWUsXG4vLyBcdFx0XHR0ZXh0dXJlOiBvbGRCb29rLnRleHR1cmUudG9TdHJpbmcoKSxcbi8vIFx0XHRcdGNvdmVyOiBvbGRCb29rLmNvdmVyLnRvU3RyaW5nKClcbi8vIFx0XHR9O1xuXG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcbi8vIFx0XHRcdGJvb2suY29weVN0YXRlKG9sZEJvb2spO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va1RleHR1cmUgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBib29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG4vLyBcdFx0Ym9vay50ZXh0dXJlLmxvYWQodGhpcy52YWx1ZSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcbi8vIFx0XHRcdGJvb2sudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va0NvdmVyID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdGJvb2suY292ZXIubG9hZCh0aGlzLnZhbHVlLCB0cnVlLCBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdGJvb2sudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSA9IGZ1bmN0aW9uKGZpZWxkLCBwcm9wZXJ0eSkge1xuLy8gXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuLy8gXHRcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0W2ZpZWxkXVtwcm9wZXJ0eV0gPSB0aGlzLnZhbHVlO1xuLy8gXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH1cbi8vIFx0fTtcbi8vIH07XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkID0gZnVuY3Rpb24oKSB7XG4vLyBcdHZhciBhY3RpdmVFbGVtZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5hY3RpdmVFZGl0Jyk7XG5cbi8vIFx0Zm9yKHZhciBpID0gYWN0aXZlRWxlbWV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuLy8gXHRcdGFjdGl2ZUVsZW1ldHNbaV0uY2xhc3NOYW1lID0gJ2luYWN0aXZlRWRpdCc7XG4vLyBcdH07XG5cbi8vIFx0dmFyIHByZXZpb3VzRWRpdGVkID0gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkO1xuLy8gXHR2YXIgY3VycmVudEVkaXRlZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdlZGl0Jyk7XG5cbi8vIFx0aWYocHJldmlvdXNFZGl0ZWQgIT0gY3VycmVudEVkaXRlZCkge1xuLy8gXHRcdHRoaXMuY2xhc3NOYW1lID0gJ2FjdGl2ZUVkaXQnO1xuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9IGN1cnJlbnRFZGl0ZWQ7XG4vLyBcdH0gZWxzZSB7XG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID0gbnVsbDtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnNhdmVCb29rID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuXG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5wdXQoKTtcbi8vIFx0XHRib29rLnNhdmUoKTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNhbmNlbEJvb2tFZGl0ID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuXHRcdFxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucHV0KCk7XG4vLyBcdFx0Ym9vay5yZWZyZXNoKCk7XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uICgkbG9nLCBEYXRhKSB7XG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblxuXHR2YXIgVXNlciA9IHtcblx0XHRfZGF0YU9iamVjdDogbnVsbCxcblx0XHRfcG9zaXRpb246IG51bGwsXG5cdFx0X2xpYnJhcnk6IG51bGwsXG5cblx0XHRsb2FkOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHQkbG9nLmxvZygndXNlciBsb2FkaW5nJyk7XG5cblx0XHRcdHJldHVybiBEYXRhLmdldFVzZXIoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChyZXMuZGF0YSk7XG5cdFx0XHRcdHNjb3BlLnNldExpYnJhcnkoKTtcblx0XHRcdFx0bG9hZGVkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0c2V0RGF0YU9iamVjdDogZnVuY3Rpb24oZGF0YU9iamVjdCkge1xuXHRcdFx0dGhpcy5fZGF0YU9iamVjdCA9IGRhdGFPYmplY3Q7XG5cdFx0fSxcblx0XHRnZXRMaWJyYXJ5OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9saWJyYXJ5O1xuXHRcdH0sXG5cdFx0c2V0TGlicmFyeTogZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0XHR0aGlzLl9saWJyYXJ5ID0gbGlicmFyeUlkIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoMSk7XG5cdFx0fSxcblx0XHRnZXRJZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZGF0YU9iamVjdCAmJiB0aGlzLl9kYXRhT2JqZWN0LmlkO1xuXHRcdH0sXG5cdFx0aXNBdXRob3JpemVkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMuX2RhdGFPYmplY3QpO1xuXHRcdH0sXG5cdFx0aXNMb2FkZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxvYWRlZDtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIFVzZXI7XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCYXNlT2JqZWN0JywgZnVuY3Rpb24gKCkge1xuXHR2YXIgQmFzZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdFRIUkVFLk1lc2guY2FsbCh0aGlzLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0ID0gZGF0YU9iamVjdCB8fCB7fTtcblx0XHR0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gPSB0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gfHwgWzAsIDAsIDBdO1xuXHRcdFxuXHRcdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMuZGF0YU9iamVjdC5wb3NfeCwgdGhpcy5kYXRhT2JqZWN0LnBvc195LCB0aGlzLmRhdGFPYmplY3QucG9zX3opO1xuXHRcdHRoaXMucm90YXRpb24ub3JkZXIgPSAnWFlaJztcblx0XHR0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdFx0dGhpcy51cGRhdGVNYXRyaXgoKTtcblxuXHRcdC8vVE9ETzogcmVzZWFyY2gsIGFmdGVyIGNhY2hpbmcgZ2VvbWV0cnkgdGhpcyBjYW4gYmUgcnVuIG9uY2Vcblx0XHR0aGlzLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdFxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG5cdH07XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBUSFJFRS5NZXNoKCk7XG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQmFzZU9iamVjdDtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudHlwZTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc091dE9mUGFycmVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLngpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy54IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueClcblx0XHRcdC8vfHwgTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueSAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci55KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueSAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkpXG5cdFx0XHR8fCBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLnopID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy56IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueik7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuaXNDb2xsaWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0dGFyZ2V0cyxcblx0XHRcdHRhcmdldCxcblx0XHRcdGk7XG5cblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXN1bHQgPSB0aGlzLmlzT3V0T2ZQYXJyZW50KCk7XG5cdFx0dGFyZ2V0cyA9IHRoaXMucGFyZW50LmNoaWxkcmVuO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0Zm9yKGkgPSB0YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldHNbaV0uYm91bmRpbmdCb3g7XG5cblx0XHRcdFx0aWYodGFyZ2V0c1tpXSA9PT0gdGhpcyBcblx0XHRcdFx0fHwgIXRhcmdldCAvLyBjaGlsZHJlbiB3aXRob3V0IEJCXG5cdFx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGFyZ2V0LmNlbnRlci54KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54ICsgdGFyZ2V0LnJhZGl1cy54KSlcblx0XHRcdFx0fHwgKE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnkgLSB0YXJnZXQuY2VudGVyLnkpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkgKyB0YXJnZXQucmFkaXVzLnkpKVxuXHRcdFx0XHR8fCAoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRhcmdldC5jZW50ZXIueikgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueiArIHRhcmdldC5yYWRpdXMueikpKSB7XHRcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIFx0cmVzdWx0ID0gdHJ1ZTtcdFx0XG5cdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24obmV3UG9zaXRpb24pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0XHRyZXN1bHQ7XG5cblx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XG5cdFx0aWYobmV3UG9zaXRpb24ueCkge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgoY3VycmVudFBvc2l0aW9uLngpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihuZXdQb3NpdGlvbi56KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFoobmV3UG9zaXRpb24ueik7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihjdXJyZW50UG9zaXRpb24ueik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihkWCwgZFksIGlzRGVtbykge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKSxcblx0XHRcdHJlc3VsdCA9IGZhbHNlOyBcblx0XHRcblx0XHRpZihkWCkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ICs9IGRYICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnkgPSBjdXJyZW50Um90YXRpb24ueTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZFkpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueCArPSBkWSAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCAoIWlzRGVtbyAmJiByZXN1bHQpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0Ym91bmRpbmdCb3gsXG5cdFx0XHRyYWRpdXMsXG5cdFx0XHRjZW50ZXI7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXHRcdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFx0XG5cdFx0cmFkaXVzID0ge1xuXHRcdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdFx0eTogKGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnkpICogMC41LFxuXHRcdFx0ejogKGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLnopICogMC41XG5cdFx0fTtcblxuXHRcdGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuXHRcdFx0cmFkaXVzLnggKyBib3VuZGluZ0JveC5taW4ueCxcblx0XHRcdHJhZGl1cy55ICsgYm91bmRpbmdCb3gubWluLnksXG5cdFx0XHRyYWRpdXMueiArIGJvdW5kaW5nQm94Lm1pbi56XG5cdFx0KTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogY2VudGVyXG5cdFx0fTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFgodGhpcy5kYXRhT2JqZWN0LnBvc194KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFkodGhpcy5kYXRhT2JqZWN0LnBvc195KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFoodGhpcy5kYXRhT2JqZWN0LnBvc196KTtcblx0XHR0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcblx0fTtcblxuXHRyZXR1cm4gQmFzZU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgQ2FudmFzVGV4dCwgQ2FudmFzSW1hZ2UsIERhdGEpIHtcdFxuXHR2YXIgQm9va09iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCwgbWFwSW1hZ2UsIGNvdmVySW1hZ2UpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHRcblx0XHR0aGlzLm1vZGVsID0gdGhpcy5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdHRoaXMuY2FudmFzID0gbWF0ZXJpYWwubWFwLmltYWdlO1xuXHRcdHRoaXMudGV4dHVyZSA9IG5ldyBDYW52YXNJbWFnZShudWxsLCBudWxsLCBtYXBJbWFnZSk7XG5cdFx0dGhpcy5jb3ZlciA9IG5ldyBDYW52YXNJbWFnZSh0aGlzLmRhdGFPYmplY3QuY292ZXJQb3MsIHRoaXMuZGF0YU9iamVjdC5jb3ZlciwgY292ZXJJbWFnZSk7XG5cdFx0dGhpcy5hdXRob3IgPSBuZXcgQ2FudmFzVGV4dCh0aGlzLmRhdGFPYmplY3QuYXV0aG9yLCB0aGlzLmRhdGFPYmplY3QuYXV0aG9yRm9udCk7XG5cdFx0dGhpcy50aXRsZSA9IG5ldyBDYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC50aXRsZSwgdGhpcy5kYXRhT2JqZWN0LnRpdGxlRm9udCk7XG5cblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fTtcblxuXHRCb29rT2JqZWN0LlRZUEUgPSAnQm9va09iamVjdCc7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvb2tPYmplY3Q7XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnRleHROb2RlcyA9IFsnYXV0aG9yJywgJ3RpdGxlJ107XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnR5cGUgPSBCb29rT2JqZWN0LlRZUEU7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUudXBkYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHR2YXIgY292ZXIgPSB0aGlzLmNvdmVyO1xuXG5cdFx0aWYodGhpcy50ZXh0dXJlLmltYWdlKSB7XG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUuaW1hZ2UsIDAsIDApO1xuXHRcdH1cblxuXHRcdGlmKGNvdmVyLmltYWdlKSB7XG5cdFx0XHR2YXIgZGlmZiA9IGNvdmVyLnkgKyBjb3Zlci5oZWlnaHQgLSBEYXRhLkNPVkVSX01BWF9ZO1xuXHRcdCBcdHZhciBsaW1pdGVkSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5oZWlnaHQgLSBkaWZmIDogY292ZXIuaGVpZ2h0O1xuXHRcdCBcdHZhciBjcm9wSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5pbWFnZS5uYXR1cmFsSGVpZ2h0IC0gKGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQgLyBjb3Zlci5oZWlnaHQgKiBkaWZmKSA6IGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQ7XG5cblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKGNvdmVyLmltYWdlLCAwLCAwLCBjb3Zlci5pbWFnZS5uYXR1cmFsV2lkdGgsIGNyb3BIZWlnaHQsIGNvdmVyLngsIGNvdmVyLnksIGNvdmVyLndpZHRoLCBsaW1pdGVkSGVpZ2h0KTtcblx0XHR9XG5cblx0XHRmb3IodmFyIGkgPSB0aGlzLnRleHROb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIHRleHROb2RlID0gdGhpc1t0aGlzLnRleHROb2Rlc1tpXV07XG5cblx0XHRcdGlmKHRleHROb2RlLmlzVmFsaWQoKSkge1xuXG5cdFx0XHRcdGNvbnRleHQuZm9udCA9IHRleHROb2RlLmdldEZvbnQoKTtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSB0ZXh0Tm9kZS5jb2xvcjtcblx0XHQgICAgXHRjb250ZXh0LmZpbGxUZXh0KHRleHROb2RlLnRleHQsIHRleHROb2RlLngsIHRleHROb2RlLnksIHRleHROb2RlLndpZHRoKTtcblx0XHQgICAgfVxuXHRcdH1cblxuXHRcdHRoaXMubWF0ZXJpYWwubWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUubW92ZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFksIGVsZW1lbnQpIHtcblx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnQgJiYgdGhpc1tlbGVtZW50XTtcblx0XHRcblx0XHRpZihlbGVtZW50KSB7XG5cdFx0XHRpZihlbGVtZW50Lm1vdmUpIHtcblx0XHRcdFx0ZWxlbWVudC5tb3ZlKGRYLCBkWSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnggKz0gZFg7XG5cdFx0XHRcdGVsZW1lbnQueSArPSBkWTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy51cGRhdGVUZXh0dXJlKCk7XG5cdFx0fVxuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zY2FsZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHR0aGlzLmNvdmVyLndpZHRoICs9IGRYO1xuXHRcdHRoaXMuY292ZXIuaGVpZ2h0ICs9IGRZO1xuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5tb2RlbCA9IHRoaXMubW9kZWw7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRleHR1cmUgPSB0aGlzLnRleHR1cmUudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuY292ZXIgPSB0aGlzLmNvdmVyLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmNvdmVyUG9zID0gdGhpcy5jb3Zlci5zZXJpYWxpemVQcm9wZXJ0aWVzKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvciA9IHRoaXMuYXV0aG9yLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvckZvbnQgPSB0aGlzLmF1dGhvci5zZXJpYWxpemVGb250KCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRpdGxlID0gdGhpcy50aXRsZS50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC50aXRsZUZvbnQgPSB0aGlzLnRpdGxlLnNlcmlhbGl6ZUZvbnQoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ggPSB0aGlzLnBvc2l0aW9uLng7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc195ID0gdGhpcy5wb3NpdGlvbi55O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeiA9IHRoaXMucG9zaXRpb24uejtcblxuXHRcdERhdGEucG9zdEJvb2sodGhpcy5kYXRhT2JqZWN0LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYoIWVyciAmJiByZXN1bHQpIHtcblx0XHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IHJlc3VsdDtcblx0XHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9UT0RPOiBoaWRlIGVkaXQsIG5vdGlmeSB1c2VyXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdC8vVE9ETzogdXNlIGluIGNvbnN0cnVjdG9yIGluc3RlYWQgb2Ygc2VwYXJhdGUgaW1hZ2VzIGxvYWRpbmdcblx0XHRzY29wZS50ZXh0dXJlLmxvYWQoc2NvcGUuZGF0YU9iamVjdC50ZXh0dXJlLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0c2NvcGUuY292ZXIubG9hZChzY29wZS5kYXRhT2JqZWN0LmNvdmVyLCB0cnVlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2NvcGUubW9kZWwgPSBzY29wZS5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdFx0XHRzY29wZS5jb3Zlci5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC5jb3ZlclBvcyk7XG5cdFx0XHRcdHNjb3BlLmF1dGhvci5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QuYXV0aG9yKTtcblx0XHRcdFx0c2NvcGUuYXV0aG9yLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LmF1dGhvckZvbnQpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QudGl0bGUpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC50aXRsZUZvbnQpO1xuXG5cdFx0XHRcdHNjb3BlLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb3B5U3RhdGUgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vayBpbnN0YW5jZW9mIEJvb2tPYmplY3QpIHtcblx0XHRcdHZhciBmaWVsZHMgPSBbJ2RhdGFPYmplY3QnLCAncG9zaXRpb24nLCAncm90YXRpb24nLCAnbW9kZWwnLCAndGV4dHVyZScsICdjb3ZlcicsICdhdXRob3InLCAndGl0bGUnXTtcblx0XHRcdGZvcih2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR2YXIgZmllbGQgPSBmaWVsZHNbaV07XG5cdFx0XHRcdHRoaXNbZmllbGRdID0gYm9va1tmaWVsZF07XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdGJvb2sucGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdGJvb2sucGFyZW50LnJlbW92ZShib29rKTtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gdGhpcztcblx0XHR9XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdGlmKHRoaXMucGFyZW50ICE9IHBhcmVudCkge1xuXHRcdFx0aWYocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gcGFyZW50LmlkO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gcGFyZW50LnBhcmVudC5pZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNoZWxmSWQgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIEJvb2tPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQ2FtZXJhT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QpIHtcblx0dmFyIENhbWVyYU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzKTtcblx0fTtcblxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0XG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDYW1lcmFPYmplY3Q7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhZGl1cyA9IHt4OiAwLjEsIHk6IDEsIHo6IDAuMX07XG5cdFx0dmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiB0aGlzLnBvc2l0aW9uIC8vVE9ETzogbmVlZHMgY2VudGVyIG9mIHNlY3Rpb24gaW4gcGFyZW50IG9yIHdvcmxkIGNvb3JkaW5hdGVzXG5cdFx0fTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbnZhc0ltYWdlJywgZnVuY3Rpb24gKCRxLCBEYXRhKSB7XG5cdHZhciBDYW52YXNJbWFnZSA9IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGxpbmssIGltYWdlKSB7XG5cdFx0dGhpcy5saW5rID0gbGluayB8fCAnJztcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMocHJvcGVydGllcyk7XG5cdH07XG5cdFxuXHRDYW52YXNJbWFnZS5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IENhbnZhc0ltYWdlLFxuXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubGluaztcblx0XHR9LFxuXHRcdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdFx0dGhpcy54ID0gTnVtYmVyKGFyZ3NbMF0pIHx8IERhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdFx0dGhpcy55ID0gTnVtYmVyKGFyZ3NbMV0pIHx8IDA7XG5cdFx0XHR0aGlzLndpZHRoID0gTnVtYmVyKGFyZ3NbMl0pIHx8IDIxNjtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gTnVtYmVyKGFyZ3NbM10pIHx8IERhdGEuQ09WRVJfTUFYX1k7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XS5qb2luKCcsJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBDYW52YXNJbWFnZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW52YXNUZXh0JywgZnVuY3Rpb24gKERhdGEpIHtcblx0dmFyIENhbnZhc1RleHQgPSBmdW5jdGlvbih0ZXh0LCBwcm9wZXJ0aWVzKSB7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dCB8fCAnJztcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblxuXHRDYW52YXNUZXh0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogQ2FudmFzVGV4dCxcblx0XHRnZXRGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplICsgJ3B4JywgdGhpcy5mb250XS5qb2luKCcgJyk7XG5cdFx0fSxcblx0XHRpc1ZhbGlkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy50ZXh0ICYmIHRoaXMueCAmJiB0aGlzLnkpO1xuXHRcdH0sXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudGV4dCB8fCAnJztcblx0XHR9LFxuXHRcdHNldFRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplLCB0aGlzLmZvbnQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmNvbG9yLCB0aGlzLndpZHRoXS5qb2luKCcsJyk7XG5cdFx0fSxcblx0XHRwYXJzZVByb3BlcnRpZXM6IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcblx0XHRcdHZhciBhcmdzID0gcHJvcGVydGllcyAmJiBwcm9wZXJ0aWVzLnNwbGl0KCcsJykgfHwgW107XG5cblx0XHRcdHRoaXMuc3R5bGUgPSBhcmdzWzBdO1xuXHRcdFx0dGhpcy5zaXplID0gYXJnc1sxXSB8fCAxNDtcblx0XHRcdHRoaXMuZm9udCA9IGFyZ3NbMl0gfHwgJ0FyaWFsJztcblx0XHRcdHRoaXMueCA9IE51bWJlcihhcmdzWzNdKSB8fCBEYXRhLkNPVkVSX0ZBQ0VfWDtcblx0XHRcdHRoaXMueSA9IE51bWJlcihhcmdzWzRdKSB8fCAxMDtcblx0XHRcdHRoaXMuY29sb3IgPSBhcmdzWzVdIHx8ICdibGFjayc7XG5cdFx0XHR0aGlzLndpZHRoID0gYXJnc1s2XSB8fCA1MTI7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHRcdHRoaXMueCArPSBkWDtcblx0XHRcdHRoaXMueSArPSBkWTtcblxuXHRcdFx0aWYodGhpcy54IDw9IDApIHRoaXMueCA9IDE7XG5cdFx0XHRpZih0aGlzLnkgPD0gMCkgdGhpcy55ID0gMTtcblx0XHRcdGlmKHRoaXMueCA+PSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTikgdGhpcy54ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdFx0XHRpZih0aGlzLnkgPj0gRGF0YS5DT1ZFUl9NQVhfWSkgdGhpcy55ID0gRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIENhbnZhc1RleHQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBMaWJyYXJ5T2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdHRoaXMubGlicmFyeU9iamVjdCA9IHBhcmFtcy5saWJyYXJ5T2JqZWN0IHx8IHt9Oy8vVE9ETzogcmVzZWFyY2hcblx0fTtcblx0TGlicmFyeU9iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRMaWJyYXJ5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpYnJhcnlPYmplY3Q7XG5cblx0cmV0dXJuIExpYnJhcnlPYmplY3Q7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWN0aW9uT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIFNoZWxmT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBTZWN0aW9uT2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5zaGVsdmVzID0ge307XG5cdFx0Zm9yKHZhciBrZXkgaW4gcGFyYW1zLmRhdGEuc2hlbHZlcykge1xuXHRcdFx0dGhpcy5zaGVsdmVzW2tleV0gPSBuZXcgU2hlbGZPYmplY3QocGFyYW1zLmRhdGEuc2hlbHZlc1trZXldKTsgXG5cdFx0XHR0aGlzLmFkZCh0aGlzLnNoZWx2ZXNba2V5XSk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlY3Rpb25PYmplY3QuVFlQRSA9ICdTZWN0aW9uT2JqZWN0JztcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VjdGlvbk9iamVjdDtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNlY3Rpb25PYmplY3QuVFlQRTtcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeCA9IHRoaXMucG9zaXRpb24ueDtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3kgPSB0aGlzLnBvc2l0aW9uLnk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc196ID0gdGhpcy5wb3NpdGlvbi56O1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uID0gW3RoaXMucm90YXRpb24ueCwgdGhpcy5yb3RhdGlvbi55LCB0aGlzLnJvdGF0aW9uLnpdO1xuXG5cdFx0RGF0YS5wb3N0U2VjdGlvbih0aGlzLmRhdGFPYmplY3QpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IGR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQvL1RPRE86IGhpZGUgZWRpdCwgbm90aWZ5IHVzZXJcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gU2VjdGlvbk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGEnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBTZWxlY3Rvck1ldGEgPSBmdW5jdGlvbihzZWxlY3RlZE9iamVjdCkge1xuXHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHR0aGlzLmlkID0gc2VsZWN0ZWRPYmplY3QuaWQ7XG5cdFx0XHR0aGlzLnBhcmVudElkID0gc2VsZWN0ZWRPYmplY3QucGFyZW50LmlkO1xuXHRcdFx0dGhpcy50eXBlID0gc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpO1xuXHRcdH1cblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaWQ7XG5cdH07XG5cblx0U2VsZWN0b3JNZXRhLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuICEoIW1ldGFcblx0XHRcdFx0fHwgbWV0YS5pZCAhPT0gdGhpcy5pZFxuXHRcdFx0XHR8fCBtZXRhLnBhcmVudElkICE9PSB0aGlzLnBhcmVudElkXG5cdFx0XHRcdHx8IG1ldGEudHlwZSAhPT0gdGhpcy50eXBlKTtcblx0fTtcblx0XG5cdHJldHVybiBTZWxlY3Rvck1ldGE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCkge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplIHx8IFsxLDEsMV07XHRcblx0XHR2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yfSk7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgbmV3IFRIUkVFLkN1YmVHZW9tZXRyeShzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHBhcmFtcy5wb3NpdGlvblswXSwgcGFyYW1zLnBvc2l0aW9uWzFdLCBwYXJhbXMucG9zaXRpb25bMl0pO1xuXHRcdHRoaXMuc2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHR9O1xuXG5cdFNoZWxmT2JqZWN0LlRZUEUgPSAnU2hlbGZPYmplY3QnO1xuXG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNoZWxmT2JqZWN0O1xuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNoZWxmT2JqZWN0LlRZUEU7XG5cblxuXHRyZXR1cm4gU2hlbGZPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG5cdHZhciBoaWdobGlnaHQgPSB7fTtcblxuXHR2YXIgUExBTkVfUk9UQVRJT04gPSBNYXRoLlBJICogMC41O1xuXHR2YXIgUExBTkVfTVVMVElQTElFUiA9IDMuNTtcblx0dmFyIENPTE9SX1NFTEVDVCA9IDB4MDA1NTMzO1xuXHR2YXIgQ09MT1JfRk9DVVMgPSAweDAwMzM1NTtcblxuXHR2YXIgc2VsZWN0O1xuXHR2YXIgZm9jdXM7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWF0ZXJpYWxQcm9wZXJ0aWVzID0ge1xuXHRcdFx0bWFwOiBuZXcgVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSggJ2ltZy9nbG93LnBuZycgKSxcblx0XHRcdHRyYW5zcGFyZW50OiB0cnVlLCBcblx0XHRcdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG5cdFx0XHRibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZ1xuXHRcdH07XG5cblx0XHRtYXRlcmlhbFByb3BlcnRpZXMuY29sb3IgPSBDT0xPUl9TRUxFQ1Q7XG5cdFx0dmFyIG1hdGVyaWFsU2VsZWN0ID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKG1hdGVyaWFsUHJvcGVydGllcyk7XG5cblx0XHRtYXRlcmlhbFByb3BlcnRpZXMuY29sb3IgPSBDT0xPUl9GT0NVUztcblx0XHR2YXIgbWF0ZXJpYWxGb2N1cyA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbChtYXRlcmlhbFByb3BlcnRpZXMpO1xuXG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMSwgMSwgMSk7XG5cblx0XHRzZWxlY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxTZWxlY3QpO1xuXHRcdHNlbGVjdC5yb3RhdGlvbi54ID0gUExBTkVfUk9UQVRJT047XG5cblx0XHRmb2N1cyA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbEZvY3VzKTtcblx0XHRmb2N1cy5yb3RhdGlvbi54ID0gUExBTkVfUk9UQVRJT047XG5cdH07XG5cblx0dmFyIGNvbW1vbkhpZ2hsaWdodCA9IGZ1bmN0aW9uKHdoaWNoLCBvYmopIHtcblx0XHRpZihvYmopIHtcblx0XHRcdHZhciB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAqIFBMQU5FX01VTFRJUExJRVI7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC56ICogUExBTkVfTVVMVElQTElFUjtcblx0XHRcdHZhciBib3R0b20gPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWluLnkgKyBlbnZpcm9ubWVudC5DTEVBUkFOQ0U7XG5cdFx0XHRcblx0XHRcdHdoaWNoLnBvc2l0aW9uLnkgPSBib3R0b207XG5cdFx0XHR3aGljaC5zY2FsZS5zZXQod2lkdGgsIGhlaWdodCwgMSk7XG5cdFx0XHRvYmouYWRkKHdoaWNoKTtcblxuXHRcdFx0d2hpY2gudmlzaWJsZSA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdoaWNoLnZpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRoaWdobGlnaHQuZm9jdXMgPSBmdW5jdGlvbihvYmopIHtcblx0XHRjb21tb25IaWdobGlnaHQoZm9jdXMsIG9iaik7XG5cdH07XG5cblx0aGlnaGxpZ2h0LnNlbGVjdCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGNvbW1vbkhpZ2hsaWdodChzZWxlY3QsIG9iaik7XG5cdH07XG5cblx0aW5pdCgpO1xuXG5cdHJldHVybiBoaWdobGlnaHQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbG9jYXRvcicsIGZ1bmN0aW9uICgkcSwgQmFzZU9iamVjdCwgRGF0YSwgc2VsZWN0b3IsIGVudmlyb25tZW50LCBjYWNoZSkge1xuXHR2YXIgbG9jYXRvciA9IHt9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdHZhciBzaGVsZiA9IHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpICYmIHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0cHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHRcdHZhciBzaGVsZkJCID0gc2hlbGYuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBib29rQkIgPSBib29rQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdFx0aWYoZnJlZVBsYWNlKSB7XG5cdFx0XHRcdFx0Ym9va0R0by5zaGVsZklkID0gc2hlbGYuaWQ7XG5cdFx0XHRcdFx0Ym9va0R0by5zZWN0aW9uSWQgPSBzaGVsZi5wYXJlbnQuaWQ7XG5cdFx0XHRcdFx0Ym9va0R0by5wb3NfeCA9IGZyZWVQbGFjZS54O1xuXHRcdFx0XHRcdGJvb2tEdG8ucG9zX3kgPSBmcmVlUGxhY2UueTtcblx0XHRcdFx0XHRib29rRHRvLnBvc196ID0gZnJlZVBsYWNlLno7XG5cblx0XHRcdFx0XHRyZXR1cm4gRGF0YS5wb3N0Qm9vayhib29rRHRvKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gJHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhib29rRHRvKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRwcm9taXNlID0gJHEucmVqZWN0KCdzaGVsZiBpcyBub3Qgc2VsZWN0ZWQnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRsb2NhdG9yLnVucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdGJvb2tEdG8uc2VjdGlvbklkID0gbnVsbDtcblxuXHRcdHByb21pc2UgPSBEYXRhLnBvc3RCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZVBsYWNlID0gZnVuY3Rpb24ob2JqZWN0cywgc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCwgMCwgMCk7XG5cdFx0dmFyIG9jY3VwaWVkTWF0cml4ID0gZ2V0T2NjdXBpZWRNYXRyaXgob2JqZWN0cywgbWF0cml4UHJlY2lzaW9uKTtcblx0XHR2YXIgZnJlZUNlbGxzID0gZ2V0RnJlZU1hdHJpeENlbGxzKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKTtcblx0XHR2YXIgcmVzdWx0O1xuXG5cdFx0aWYoZnJlZUNlbGxzKSB7XG5cdFx0XHR2YXIgZnJlZVBvc2l0aW9uID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoZnJlZUNlbGxzLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdFx0dmFyIGJvdHRvbVkgPSBnZXRCb3R0b21ZKHNwYWNlQkIsIHRhcmdldEJCKTtcblxuXHRcdFx0cmVzdWx0ID0gbmV3IFRIUkVFLlZlY3RvcjMoZnJlZVBvc2l0aW9uLCBib3R0b21ZLCAwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0XG5cdH07XG5cblx0dmFyIGdldEJvdHRvbVkgPSBmdW5jdGlvbihzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHJldHVybiBzcGFjZUJCLm1pbi55IC0gdGFyZ2V0QkIubWluLnk7XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXhDZWxscyA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cdFx0dmFyIHRhcmdldENlbGxzU2l6ZSA9IDE7XG5cdFx0dmFyIGZyZWVDZWxsc0NvdW50ID0gMDtcblx0XHR2YXIgZnJlZUNlbGxzU3RhcnQ7XG5cdFx0dmFyIGNlbGxJbmRleDtcblxuXHRcdHZhciBtaW5DZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi54IC8gbWF0cml4UHJlY2lzaW9uLngpICsgMTtcblx0XHR2YXIgbWF4Q2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5tYXgueCAvIG1hdHJpeFByZWNpc2lvbi54KSAtIDE7XG5cblx0XHRmb3IgKGNlbGxJbmRleCA9IG1pbkNlbGw7IGNlbGxJbmRleCA8PSBtYXhDZWxsOyBjZWxsSW5kZXgrKykge1xuXHRcdFx0aWYgKCFvY2N1cGllZE1hdHJpeFtjZWxsSW5kZXhdKSB7XG5cdFx0XHRcdGlmICghZnJlZUNlbGxzQ291bnQpIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNTdGFydCA9IGNlbGxJbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmcmVlQ2VsbHNDb3VudCsrO1xuXG5cdFx0XHRcdGlmKGZyZWVDZWxsc0NvdW50ID09PSB0YXJnZXRDZWxsc1NpemUpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdFx0XHRmcmVlQ2VsbHNTdGFydCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZnJlZUNlbGxzQ291bnQpIHtcblx0XHRcdHJlc3VsdCA9IFtdO1xuXG5cdFx0XHRmb3IgKGNlbGxJbmRleCA9IGZyZWVDZWxsc1N0YXJ0OyBjZWxsSW5kZXggPCBmcmVlQ2VsbHNTdGFydCArIGZyZWVDZWxsc0NvdW50OyBjZWxsSW5kZXgrKykge1xuXHRcdFx0XHRyZXN1bHQucHVzaChjZWxsSW5kZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGdldFBvc2l0aW9uRnJvbUNlbGxzID0gZnVuY3Rpb24oY2VsbHMsIG1hdHJpeFByZWNpc2lvbikge1xuXHRcdHZhciBzaXplID0gY2VsbHMubGVuZ3RoICogbWF0cml4UHJlY2lzaW9uLng7XG5cdFx0dmFyIHJlc3VsdCA9IGNlbGxzWzBdICogbWF0cml4UHJlY2lzaW9uLnggKyBzaXplICogMC41O1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0dmFyIG9iamVjdEJCO1xuXHRcdHZhciBvYmpQb3M7XG5cdFx0dmFyIG1pbktleTtcblx0XHR2YXIgbWF4S2V5O1xuXG5cdFx0b2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmIChvYmogaW5zdGFuY2VvZiBCYXNlT2JqZWN0KSB7XG5cdFx0XHRcdG9iamVjdEJCID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0XHRvYmpQb3MgPSBvYmoucG9zaXRpb247XG5cdFx0XHRcdG1pbktleSA9IE1hdGguZmxvb3IoKG9ialBvcy54ICsgb2JqZWN0QkIubWluLngpIC8gbWF0cml4UHJlY2lzaW9uLngpO1xuXHRcdFx0XHRtYXhLZXkgPSBNYXRoLmZsb29yKChvYmpQb3MueCArIG9iamVjdEJCLm1heC54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblxuXHRcdFx0XHRyZXN1bHRbbWluS2V5XSA9IHRydWU7XG5cdFx0XHRcdHJlc3VsdFttYXhLZXldID0gdHJ1ZTtcblx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgQ2FtZXJhLCBlbnZpcm9ubWVudCwgaGlnaGxpZ2h0KSB7XG5cdHZhciBzZWxlY3RvciA9IHt9O1xuXHRcblx0dmFyIHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHR2YXIgZm9jdXNlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblxuXHRzZWxlY3Rvci5mb2N1cyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRpZighbWV0YS5lcXVhbHMoZm9jdXNlZCkpIHtcblx0XHRcdGlmKCFmb2N1c2VkLmVxdWFscyhzZWxlY3RlZCkpIHtcblx0XHRcdFx0aGlnaGxpZ2h0LmZvY3VzKG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb2N1c2VkID0gbWV0YTtcblxuXHRcdFx0aWYoIWZvY3VzZWQuaXNFbXB0eSgpICYmICFmb2N1c2VkLmVxdWFscyhzZWxlY3RlZCkpIHtcblx0XHRcdFx0dmFyIG9iaiA9IGdldE9iamVjdChmb2N1c2VkKTtcblx0XHRcdFx0aGlnaGxpZ2h0LmZvY3VzKG9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHNlbGVjdG9yLnNlbGVjdEZvY3VzZWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWV0YSA9IGZvY3VzZWQ7XG5cblx0XHRzZWxlY3Rvci5zZWxlY3QobWV0YSk7XG5cdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0aWYoIW1ldGEuZXF1YWxzKHNlbGVjdGVkKSkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdHNlbGVjdGVkID0gbWV0YTtcblxuXHRcdFx0dmFyIG9iaiA9IGdldE9iamVjdChzZWxlY3RlZCk7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG9iaik7XG5cdFx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cdFx0fVxuXHR9O1xuXG5cdHNlbGVjdG9yLnVuc2VsZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIXNlbGVjdGVkLmlzRW1wdHkoKSkge1xuXHRcdFx0aGlnaGxpZ2h0LnNlbGVjdChudWxsKTtcblx0XHRcdHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHRcdH1cblx0fTtcblxuXHRzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3Qoc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBnZXRPYmplY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iamVjdDtcblxuXHRcdGlmKCFtZXRhLmlzRW1wdHkoKSkge1xuXHRcdFx0b2JqZWN0ID0gaXNTaGVsZihtZXRhKSA/IGVudmlyb25tZW50LmdldFNoZWxmKG1ldGEucGFyZW50SWQsIG1ldGEuaWQpXG5cdFx0XHRcdDogaXNCb29rKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0Qm9vayhtZXRhLmlkKVxuXHRcdFx0XHQ6IGlzU2VjdGlvbihtZXRhKSA/IGVudmlyb25tZW50LmdldFNlY3Rpb24obWV0YS5pZClcblx0XHRcdFx0OiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvYmplY3Q7XHRcblx0fTtcblxuXHRzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGlzQm9vayhzZWxlY3RlZCkgJiYgc2VsZWN0ZWQuaWQgPT09IGlkO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NoZWxmKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzU2VjdGlvbihzZWxlY3RlZCk7XG5cdH07XG5cblx0dmFyIGlzU2hlbGYgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gU2hlbGZPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNCb29rID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IEJvb2tPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNTZWN0aW9uID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNlY3Rpb25PYmplY3QuVFlQRTtcblx0fTtcblxuXHRyZXR1cm4gc2VsZWN0b3I7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=