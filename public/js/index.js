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
.factory('Controls', function (BookObject, ShelfObject, SectionObject, Camera, UI, navigation, environment) {
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
		parent: null,
		getted: null,
		point: null,

		isBook: function() {
			return this.object instanceof BookObject;
		},
		isSection: function() {
			return this.object instanceof SectionObject;
		},
		isMovable: function() {
			return Boolean(this.isBook() || this.isSection());
		},
		isRotatable: function() {
			return Boolean(this.isSection());
		},
		clear: function() {
			this.object = null;
			this.getted = null;
		},
		select: function(object, point) {
			this.clear();

			this.object = object;
			this.point = point;
		},
		release: function() {
			if(this.isBook() && !this.object.parent) {
				Controls.Pocket.put(this.object.dataObject);
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
			if(this.isMovable() && this.object.changed) {
				this.object.save();
			}
		}
	};

	Controls.mouse = {
		width: window.innerWidth,
		height: window.innerHeight,
		target: null,
		x: null,
		y: null,
		dX: null,
		dY: null,
		longX: null,
		longY: null,

		down: function(event) {
			if(event) {
				this[event.which] = true;
				this.target = event.target;
				this.x = event.x;
				this.y = event.y;
				this.longX = this.width * 0.5 - this.x;
				this.longY = this.height * 0.5 - this.y;
			}
		},
		up: function(event) {
			if(event) {
				this[event.which] = false;
				this[1] = false; // linux chrome bug fix (when both keys release then both event.which equal 3)
			}
		},
		move: function(event) {
			if(event) {
				this.target = event.target;
				this.longX = this.width * 0.5 - this.x;
				this.longY = this.height * 0.5 - this.y;
				this.dX = event.x - this.x;
				this.dY = event.y - this.y;
				this.x = event.x;
				this.y = event.y;
			}
		},
		getVector: function() {
			var projector = new THREE.Projector();
			var vector = new THREE.Vector3((this.x / this.width) * 2 - 1, - (this.y / this.height) * 2 + 1, 0.5);
			projector.unprojectVector(vector, Camera.camera);
		
			return vector.sub(Camera.getPosition()).normalize();
		},
		isCanvas: function() {
			return true; //TODO: stub
			// return this.target == VirtualBookshelf.canvas || (this.target && this.target.className == 'ui');
		},
		isPocketBook: function() {
			return !!(this.target && this.target.parentNode == UI.menu.inventory.books);
		},
		getIntersected: function(objects, recursive, searchFor) {
			var
				vector,
				raycaster,
				intersects,
				intersected,
				result,
				i, j;

			result = null;
			vector = this.getVector();
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
		var mouse = Controls.mouse; 

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
		if(Controls.mouse.isCanvas()) {
			switch(event.which) {
				case 1: Controls.selected.get(); break;
			}   	
		}
	};

	Controls.onMouseDown = function(event) {
		var mouse = Controls.mouse; 
		mouse.down(event); 

		if(mouse.isCanvas() || mouse.isPocketBook()) {
			// event.preventDefault();//TODO: research (enabled cannot set cursor to input)

			if(mouse[1] && !mouse[3] && !Controls.selected.isGetted()) {
				if(mouse.isCanvas()) {
					Controls.selectObject();
				} else if(mouse.isPocketBook()) {
					Controls.Pocket.selectObject(mouse.target);
				}
			}
		}
	};

	Controls.onMouseUp = function(event) {
		Controls.mouse.up(event);
		
		switch(event.which) {
			 case 1: Controls.selected.release(); break;
		}
	};

	Controls.onMouseMove = function(event) {
		var mouse = Controls.mouse; 
		mouse.move(event);

		if(mouse.isCanvas()) {
			event.preventDefault();

		 	if(!Controls.selected.isGetted()) {
				if(mouse[1] && !mouse[3]) {		
					Controls.moveObject();
				}
			} else {
				var obj = Controls.selected.object;

				if(obj instanceof BookObject) {
					if(mouse[1]) {
						obj.moveElement(mouse.dX, mouse.dY, UI.menu.createBook.edited);
					}
					if(mouse[2] && UI.menu.createBook.edited == 'cover') {
				 		obj.scaleElement(mouse.dX, mouse.dY);
					}
					if(mouse[3]) {
				 		obj.rotate(mouse.dX, mouse.dY, true);
					}
				} 
			}
		}
	};

	//****

	Controls.selectObject = function() {
		var
			intersected,
			object,
			point;

		if(Controls.mouse.isCanvas() && environment.library) {
			intersected = Controls.mouse.getIntersected(environment.library.children, true, [SectionObject, BookObject]);
			if(intersected) {
				object = intersected.object;
				point = intersected.point; 
			}

			Controls.selected.select(object, point);
		}
	};

	Controls.moveObject = function() {
		var 
			mouseVector,
			newPosition,
			intersected,
			parent,
			oldParent;

		if(Controls.selected.isBook() || (Controls.selected.isSection()/* && UI.menu.sectionMenu.isMoveOption()*/)) {
			mouseVector = Camera.getVector();	
			newPosition = Controls.selected.object.position.clone();
			oldParent = Controls.selected.object.parent;

			if(Controls.selected.isBook()) {
				intersected = Controls.mouse.getIntersected(environment.library.children, true, [ShelfObject]);
				Controls.selected.object.setParent(intersected ? intersected.object : null);
			}

			parent = Controls.selected.object.parent;
			if(parent) {
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * Controls.mouse.dX + mouseVector.x * Controls.mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * Controls.mouse.dX + mouseVector.z * Controls.mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				if(!Controls.selected.object.move(newPosition) && Controls.selected.isBook()) {
					if(parent !== oldParent) {
						Controls.selected.object.setParent(oldParent);
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
angular.module('VirtualBookshelf')
.factory('Main', function (Data, Camera, LibraryObject, Controls, User, UI, environment) {
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
		}, function (res) {
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
.factory('UI', function ($q, User, Data, navigation, environment, blockUI) {
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
			return !User.isAuthorized();
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
		addBook: function() {
			var scope = this;

			scope.block();
			Data.postBook({userId: User.getId()})
				.then(function (res) {
					scope.expand(res.data);
					return scope.loadData();
				})
				.then(function (res) {
					//TODO: research, looks rigth
				})
				.finally(function (res) {
					scope.unblock();
				})
				.catch(function (res) {
					//TODO: show an error
				});
		},
		remove: function(book) {
			var scope = this;

			scope.block();
			Data.deleteBook(book)
				.then(function (res) {
					return scope.loadData();
				})
				.catch(function (res) {
					//TODO: show an error
				})
				.finally(function (res) {
					scope.unblock();
				});
		},
		loadData: function() {
			var scope = this;
			var promise;

			scope.block();
			promise = $q.when(this.isShow() ? Data.getUserBooks(User.getId()) : null)
				.then(function (books) {
					scope.list = books;
				})
				.finally(function () {
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
			Data.postBook(this.book)
				.then(function (res) {
					scope.cancel();
					return UI.menu.inventory.loadData()
				})
				.catch(function (res) {
					//TODO: show error
				})
				.finally(function (res) {
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
.factory('User', function (Data) {
	var User = {
		_dataObject: null,
		_position: null,
		_library: null,

		load: function() {
			var scope = this;

			return Data.getUser()
				.then(function (res) {
					scope.setDataObject(res.data);
					scope.setLibrary();
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
		this.geometry.computeBoundingBox();
		this.updateBoundingBox();		
	};
	
	BaseObject.prototype = new THREE.Mesh();
	
	BaseObject.prototype.constructor = BaseObject;
	
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
	var BookObject = function(dataObject, geometry, material) {
		BaseObject.call(this, dataObject, geometry, material);
		
		this.model = this.dataObject.model;
		this.canvas = material.map.image;
		this.texture = new CanvasImage();
		this.cover = new CanvasImage(this.dataObject.coverPos);
		this.author = new CanvasText(this.dataObject.author, this.dataObject.authorFont);
		this.title = new CanvasText(this.dataObject.title, this.dataObject.titleFont);
	};
	BookObject.prototype = new BaseObject();
	BookObject.prototype.constructor = BookObject;
	BookObject.prototype.textNodes = ['author', 'title'];
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
.factory('CanvasImage', function (Data) {
	var CanvasImage = function(properties) {
		this.link = '';
		this.image = null;
		this.parseProperties(properties);
	};
	CanvasImage.prototype = {
		constructor: CanvasImage,
		load: function(link, proxy, done) {
			var scope = this;
			function sync(link, image) {
				scope.link = link;
				scope.image = image;
				done();
			}

			if(scope.link != link && link) {
				var path = (proxy ? '/outside?link={link}' : '/obj/bookTextures/{link}.jpg').replace('{link}', link);
				Data.loadImage(path).then(function (image) {
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
angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, BookObject, Data) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
		
		// this.loadBooks();
	};
	SectionObject.prototype = new BaseObject();
	SectionObject.prototype.constructor = SectionObject;
	
	// SectionObject.prototype.loadBooks = function() {	
	// 	var section = this;

	// 	Data.getBooks(section.id).then(function (books) {
	// 		books.forEach(function (dataObject) {
	// 			createBook(dataObject, function (book, dataObject) {
	// 				var shelf = section.shelves[dataObject.shelfId];
	// 				shelf && shelf.add(book);
	// 			});
	// 		});
	// 	}).catch(function (res) {
	// 		//TODO: show an error
	// 	});
	// };

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

	SectionObject.prototype.getShelfByPoint = function(point) {
		if(!point || !this.shelves) return null;
		this.worldToLocal(point);
		
		var minDistance;
		var closest;
		for(key in this.shelves) {
			var shelf = this.shelves[key];
			var distance = point.distanceTo(new THREE.Vector3(shelf.position.x, shelf.position.y, shelf.position.z));
			if(!minDistance || distance < minDistance) {
				minDistance = distance;
				closest = shelf;
			}
		}

		return closest;
	};
	SectionObject.prototype.getGetFreeShelfPosition = function(shelf, bookSize) {
		if(!shelf) return null;
		var sortedBooks = [];
		var result;

		sortedBooks.push({
			left: -shelf.size.x,
			right: -shelf.size.x * 0.5
		});
		sortedBooks.push({
			left: shelf.size.x * 0.5,
			right: shelf.size.x
		});

		shelf.children.forEach(function (book) {
			if(book instanceof Book) {
				var inserted = false;
				var space = {
					left: book.position.x + book.geometry.boundingBox.min.x,
					right: book.position.x + book.geometry.boundingBox.max.x
				};

				for (var i = 0; i < sortedBooks.length; i++) {
					var sortedBook = sortedBooks[i];
					if(book.position.x < sortedBook.left) {
						sortedBooks.splice(i, 0, space);
						inserted = true;
						break;
					}
				}

				if(!inserted) {
					sortedBooks.push(space);
				}
			}
		});

		for (var i = 0; i < (sortedBooks.length - 1); i++) {
			var left = sortedBooks[i].right;
			var right = sortedBooks[i + 1].left;
			var distance = right - left;
			
			if(distance > bookSize.x) {
				result = new THREE.Vector3(left + bookSize.x * 0.5, bookSize.y * -0.5, 0);		
				break;
			}
		};

		return result;
	};

	// var createBook = function(dataObject, done) {
	// 	var modelPath = '/obj/books/{model}/model.js'.replace('{model}', dataObject.model);

	// 	Data.loadGeometry(modelPath).then(function (geometry) {
	// 		var canvas = document.createElement('canvas');
	// 		var texture = new THREE.Texture(canvas);
	// 	    var material = new THREE.MeshPhongMaterial({map: texture});
	// 		var book = new BookObject(dataObject, geometry, material);

	// 		canvas.width = canvas.height = Data.TEXTURE_RESOLUTION;
	// 		book.texture.load(dataObject.texture, false, function () {
	// 			book.cover.load(dataObject.cover, true, function () {
	// 				book.updateTexture();
	// 				done(book, dataObject);
	// 			});
	// 		});
	// 	});
	// };	

	return SectionObject;
});
angular.module('VirtualBookshelf')
.factory('ShelfObject', function (BaseObject) {
	var ShelfObject = function(params) {
		var size = params.size || [1,1,1];	
		BaseObject.call(this, params, new THREE.CubeGeometry(size[0], size[1], size[2]));

		this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		this.visible = false;
	};

	ShelfObject.prototype = new BaseObject();
	ShelfObject.prototype.constructor = ShelfObject;

	return ShelfObject;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0LmpzIiwic2VydmljZXMvY2FtZXJhLmpzIiwic2VydmljZXMvY29udHJvbHMuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZW52aXJvbm1lbnQuanMiLCJzZXJ2aWNlcy9tYWluLmpzIiwic2VydmljZXMvbmF2aWdhdGlvbi5qcyIsInNlcnZpY2VzL3VpLmpzIiwic2VydmljZXMvdXNlci5qcyIsInNlcnZpY2VzL21vZGVscy9CYXNlT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0Jvb2tPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FtZXJhT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0NhbnZhc0ltYWdlLmpzIiwic2VydmljZXMvbW9kZWxzL0NhbnZhc1RleHQuanMiLCJzZXJ2aWNlcy9tb2RlbHMvTGlicmFyeU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWN0aW9uT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgICAubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJywgWydibG9ja1VJJywgJ2FuZ3VsYXJVdGlscy5kaXJlY3RpdmVzLmRpclBhZ2luYXRpb24nXSlcbiAgICBcdC5jb25maWcoZnVuY3Rpb24gKGJsb2NrVUlDb25maWcsIHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyKSB7XG4gICAgXHRcdGJsb2NrVUlDb25maWcuZGVsYXkgPSAwO1xuICAgIFx0XHRibG9ja1VJQ29uZmlnLmF1dG9CbG9jayA9IGZhbHNlO1xuXHRcdFx0YmxvY2tVSUNvbmZpZy5hdXRvSW5qZWN0Qm9keUJsb2NrID0gZmFsc2U7XG5cdFx0XHRwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlci5zZXRQYXRoKCcvanMvYW5ndWxhci9kaXJQYWdpbmF0aW9uL2RpclBhZ2luYXRpb24udHBsLmh0bWwnKTtcbiAgICBcdH0pXG4gICAgXHQucnVuKGZ1bmN0aW9uIChNYWluKSB7XG5cdFx0XHRNYWluLnN0YXJ0KCk7XG4gICAgXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignVWlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgVUkpIHtcbiAgICAkc2NvcGUubWVudSA9IFVJLm1lbnU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZGlyZWN0aXZlKCd2YlNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG4gICAgXHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOiAnL3VpL3NlbGVjdC5lanMnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRzZWxlY3RlZDogJz0nLFxuXHRcdFx0dmFsdWU6ICdAJyxcblx0XHRcdGxhYmVsOiAnQCdcblx0XHR9LFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZSkge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRzY29wZS5zZWxlY3RlZCA9IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLnNlbGVjdGVkID09PSBpdGVtW3Njb3BlLnZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmEnLCBmdW5jdGlvbiAoQ2FtZXJhT2JqZWN0KSB7XG5cdHZhciBDYW1lcmEgPSB7XG5cdFx0SEVJR1RIOiAxLjUsXG5cdFx0b2JqZWN0OiBuZXcgQ2FtZXJhT2JqZWN0KCksXG5cdFx0c2V0UGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdH0sXG5cdFx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHRcdH1cblx0fTtcblxuXHRDYW1lcmEuaW5pdCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRDYW1lcmEuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aWR0aCAvIGhlaWdodCwgMC4wMSwgNTApO1xuXHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgQ2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHR0aGlzLm9iamVjdC5hZGQoY2FuZGxlKTtcblxuXHRcdHRoaXMub2JqZWN0LmFkZChDYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRDYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Q2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdENhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NvbnRyb2xzJywgZnVuY3Rpb24gKEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBDYW1lcmEsIFVJLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgQ29udHJvbHMgPSB7fTtcblxuXHRDb250cm9scy5CVVRUT05TX1JPVEFURV9TUEVFRCA9IDEwMDtcblx0Q29udHJvbHMuQlVUVE9OU19HT19TUEVFRCA9IDAuMDI7XG5cblx0Q29udHJvbHMuUG9ja2V0ID0ge1xuXHRcdF9ib29rczoge30sXG5cblx0XHRzZWxlY3RPYmplY3Q6IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0dmFyIFxuXHRcdFx0XHRkYXRhT2JqZWN0ID0gdGhpcy5fYm9va3NbdGFyZ2V0LnZhbHVlXVxuXG5cdFx0XHREYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcblx0XHRcdFx0Q29udHJvbHMuUG9ja2V0LnJlbW92ZShkYXRhT2JqZWN0LmlkKTtcblx0XHRcdFx0Q29udHJvbHMuc2VsZWN0ZWQuc2VsZWN0KGJvb2ssIG51bGwpO1xuXHRcdFx0XHQvLyBib29rLmNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRyZW1vdmU6IGZ1bmN0aW9uKGlkKSB7XG5cdFx0XHR0aGlzLl9ib29rc1tpZF0gPSBudWxsO1xuXHRcdFx0ZGVsZXRlIHRoaXMuX2Jvb2tzW2lkXTtcblx0XHR9LFxuXHRcdHB1dDogZnVuY3Rpb24oZGF0YU9iamVjdCkge1xuXHRcdFx0dGhpcy5fYm9va3NbZGF0YU9iamVjdC5pZF0gPSBkYXRhT2JqZWN0O1xuXHRcdH0sXG5cdFx0Z2V0Qm9va3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Jvb2tzO1xuXHRcdH0sXG5cdFx0aXNFbXB0eTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYm9va3MubGVuZ3RoID09IDA7XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLnNlbGVjdGVkID0ge1xuXHRcdG9iamVjdDogbnVsbCxcblx0XHRwYXJlbnQ6IG51bGwsXG5cdFx0Z2V0dGVkOiBudWxsLFxuXHRcdHBvaW50OiBudWxsLFxuXG5cdFx0aXNCb29rOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm9iamVjdCBpbnN0YW5jZW9mIEJvb2tPYmplY3Q7XG5cdFx0fSxcblx0XHRpc1NlY3Rpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0IGluc3RhbmNlb2YgU2VjdGlvbk9iamVjdDtcblx0XHR9LFxuXHRcdGlzTW92YWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLmlzQm9vaygpIHx8IHRoaXMuaXNTZWN0aW9uKCkpO1xuXHRcdH0sXG5cdFx0aXNSb3RhdGFibGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5pc1NlY3Rpb24oKSk7XG5cdFx0fSxcblx0XHRjbGVhcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLm9iamVjdCA9IG51bGw7XG5cdFx0XHR0aGlzLmdldHRlZCA9IG51bGw7XG5cdFx0fSxcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKG9iamVjdCwgcG9pbnQpIHtcblx0XHRcdHRoaXMuY2xlYXIoKTtcblxuXHRcdFx0dGhpcy5vYmplY3QgPSBvYmplY3Q7XG5cdFx0XHR0aGlzLnBvaW50ID0gcG9pbnQ7XG5cdFx0fSxcblx0XHRyZWxlYXNlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMuaXNCb29rKCkgJiYgIXRoaXMub2JqZWN0LnBhcmVudCkge1xuXHRcdFx0XHRDb250cm9scy5Qb2NrZXQucHV0KHRoaXMub2JqZWN0LmRhdGFPYmplY3QpO1xuXHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuc2F2ZSgpO1xuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMuaXNCb29rKCkgJiYgIXRoaXMuaXNHZXR0ZWQoKSkge1xuXHRcdFx0XHR0aGlzLmdldHRlZCA9IHRydWU7XG5cdFx0XHRcdHRoaXMucGFyZW50ID0gdGhpcy5vYmplY3QucGFyZW50O1xuXHRcdFx0XHR0aGlzLm9iamVjdC5wb3NpdGlvbi5zZXQoMCwgMCwgLXRoaXMub2JqZWN0Lmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC56IC0gMC4yNSk7XG5cdFx0XHRcdENhbWVyYS5jYW1lcmEuYWRkKHRoaXMub2JqZWN0KTtcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucHV0KCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwdXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5pc0dldHRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LmFkZCh0aGlzLm9iamVjdCk7XG5cdFx0XHRcdHRoaXMub2JqZWN0LnJlbG9hZCgpOy8vcG9zaXRpb25cblx0XHRcdFx0dGhpcy5jbGVhcigpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aXNHZXR0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaXNCb29rKCkgJiYgdGhpcy5nZXR0ZWQ7XG5cdFx0fSxcblx0XHRzYXZlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMuaXNNb3ZhYmxlKCkgJiYgdGhpcy5vYmplY3QuY2hhbmdlZCkge1xuXHRcdFx0XHR0aGlzLm9iamVjdC5zYXZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLm1vdXNlID0ge1xuXHRcdHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcblx0XHRoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcblx0XHR0YXJnZXQ6IG51bGwsXG5cdFx0eDogbnVsbCxcblx0XHR5OiBudWxsLFxuXHRcdGRYOiBudWxsLFxuXHRcdGRZOiBudWxsLFxuXHRcdGxvbmdYOiBudWxsLFxuXHRcdGxvbmdZOiBudWxsLFxuXG5cdFx0ZG93bjogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGlmKGV2ZW50KSB7XG5cdFx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdHRoaXMueCA9IGV2ZW50Lng7XG5cdFx0XHRcdHRoaXMueSA9IGV2ZW50Lnk7XG5cdFx0XHRcdHRoaXMubG9uZ1ggPSB0aGlzLndpZHRoICogMC41IC0gdGhpcy54O1xuXHRcdFx0XHR0aGlzLmxvbmdZID0gdGhpcy5oZWlnaHQgKiAwLjUgLSB0aGlzLnk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR1cDogZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGlmKGV2ZW50KSB7XG5cdFx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gZmFsc2U7XG5cdFx0XHRcdHRoaXNbMV0gPSBmYWxzZTsgLy8gbGludXggY2hyb21lIGJ1ZyBmaXggKHdoZW4gYm90aCBrZXlzIHJlbGVhc2UgdGhlbiBib3RoIGV2ZW50LndoaWNoIGVxdWFsIDMpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0aWYoZXZlbnQpIHtcblx0XHRcdFx0dGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHRcdHRoaXMubG9uZ1ggPSB0aGlzLndpZHRoICogMC41IC0gdGhpcy54O1xuXHRcdFx0XHR0aGlzLmxvbmdZID0gdGhpcy5oZWlnaHQgKiAwLjUgLSB0aGlzLnk7XG5cdFx0XHRcdHRoaXMuZFggPSBldmVudC54IC0gdGhpcy54O1xuXHRcdFx0XHR0aGlzLmRZID0gZXZlbnQueSAtIHRoaXMueTtcblx0XHRcdFx0dGhpcy54ID0gZXZlbnQueDtcblx0XHRcdFx0dGhpcy55ID0gZXZlbnQueTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGdldFZlY3RvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCh0aGlzLnggLyB0aGlzLndpZHRoKSAqIDIgLSAxLCAtICh0aGlzLnkgLyB0aGlzLmhlaWdodCkgKiAyICsgMSwgMC41KTtcblx0XHRcdHByb2plY3Rvci51bnByb2plY3RWZWN0b3IodmVjdG9yLCBDYW1lcmEuY2FtZXJhKTtcblx0XHRcblx0XHRcdHJldHVybiB2ZWN0b3Iuc3ViKENhbWVyYS5nZXRQb3NpdGlvbigpKS5ub3JtYWxpemUoKTtcblx0XHR9LFxuXHRcdGlzQ2FudmFzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0cnVlOyAvL1RPRE86IHN0dWJcblx0XHRcdC8vIHJldHVybiB0aGlzLnRhcmdldCA9PSBWaXJ0dWFsQm9va3NoZWxmLmNhbnZhcyB8fCAodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQuY2xhc3NOYW1lID09ICd1aScpO1xuXHRcdH0sXG5cdFx0aXNQb2NrZXRCb29rOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhISh0aGlzLnRhcmdldCAmJiB0aGlzLnRhcmdldC5wYXJlbnROb2RlID09IFVJLm1lbnUuaW52ZW50b3J5LmJvb2tzKTtcblx0XHR9LFxuXHRcdGdldEludGVyc2VjdGVkOiBmdW5jdGlvbihvYmplY3RzLCByZWN1cnNpdmUsIHNlYXJjaEZvcikge1xuXHRcdFx0dmFyXG5cdFx0XHRcdHZlY3Rvcixcblx0XHRcdFx0cmF5Y2FzdGVyLFxuXHRcdFx0XHRpbnRlcnNlY3RzLFxuXHRcdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdFx0cmVzdWx0LFxuXHRcdFx0XHRpLCBqO1xuXG5cdFx0XHRyZXN1bHQgPSBudWxsO1xuXHRcdFx0dmVjdG9yID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHRcdHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoQ2FtZXJhLmdldFBvc2l0aW9uKCksIHZlY3Rvcik7XG5cdFx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdFx0aWYoc2VhcmNoRm9yKSB7XG5cdFx0XHRcdGlmKGludGVyc2VjdHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBpbnRlcnNlY3RzW2ldO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0XHRpZihpbnRlcnNlY3RlZC5vYmplY3QgaW5zdGFuY2VvZiBzZWFyY2hGb3Jbal0pIHtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBpbnRlcnNlY3RlZDtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdENvbnRyb2xzLmNsZWFyKCk7XG5cdFx0Q29udHJvbHMuaW5pdExpc3RlbmVycygpO1xuXHR9O1xuXG5cdENvbnRyb2xzLmluaXRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIENvbnRyb2xzLm9uRGJsQ2xpY2ssIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBDb250cm9scy5vbk1vdXNlRG93biwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBDb250cm9scy5vbk1vdXNlVXAsIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBDb250cm9scy5vbk1vdXNlTW92ZSwgZmFsc2UpO1x0XG5cdFx0ZG9jdW1lbnQub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uKCkge3JldHVybiBmYWxzZTt9XG5cdH07XG5cblx0Q29udHJvbHMuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0XHRDb250cm9scy5zZWxlY3RlZC5jbGVhcigpO1x0XG5cdH07XG5cblx0Q29udHJvbHMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1vdXNlID0gQ29udHJvbHMubW91c2U7IFxuXG5cdFx0aWYoIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRcdENhbWVyYS5yb3RhdGUobW91c2UubG9uZ1gsIG1vdXNlLmxvbmdZKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoKG1vdXNlWzFdICYmIG1vdXNlWzNdKSB8fCBuYXZpZ2F0aW9uLnN0YXRlLmZvcndhcmQpIHtcblx0XHRcdFx0Q2FtZXJhLmdvKHRoaXMuQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5iYWNrd2FyZCkge1xuXHRcdFx0XHRDYW1lcmEuZ28oLXRoaXMuQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5sZWZ0KSB7XG5cdFx0XHRcdENhbWVyYS5yb3RhdGUodGhpcy5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0XHR9IGVsc2UgaWYobmF2aWdhdGlvbi5zdGF0ZS5yaWdodCkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKC10aGlzLkJVVFRPTlNfUk9UQVRFX1NQRUVELCAwKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gRXZlbnRzXG5cblx0Q29udHJvbHMub25EYmxDbGljayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoQ29udHJvbHMubW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHRcdGNhc2UgMTogQ29udHJvbHMuc2VsZWN0ZWQuZ2V0KCk7IGJyZWFrO1xuXHRcdFx0fSAgIFx0XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLm9uTW91c2VEb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgbW91c2UgPSBDb250cm9scy5tb3VzZTsgXG5cdFx0bW91c2UuZG93bihldmVudCk7IFxuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSB8fCBtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTsvL1RPRE86IHJlc2VhcmNoIChlbmFibGVkIGNhbm5vdCBzZXQgY3Vyc29yIHRvIGlucHV0KVxuXG5cdFx0XHRpZihtb3VzZVsxXSAmJiAhbW91c2VbM10gJiYgIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYobW91c2UuaXNQb2NrZXRCb29rKCkpIHtcblx0XHRcdFx0XHRDb250cm9scy5Qb2NrZXQuc2VsZWN0T2JqZWN0KG1vdXNlLnRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRDb250cm9scy5tb3VzZS51cChldmVudCk7XG5cdFx0XG5cdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHQgY2FzZSAxOiBDb250cm9scy5zZWxlY3RlZC5yZWxlYXNlKCk7IGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIG1vdXNlID0gQ29udHJvbHMubW91c2U7IFxuXHRcdG1vdXNlLm1vdmUoZXZlbnQpO1xuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCBcdGlmKCFDb250cm9scy5zZWxlY3RlZC5pc0dldHRlZCgpKSB7XG5cdFx0XHRcdGlmKG1vdXNlWzFdICYmICFtb3VzZVszXSkge1x0XHRcblx0XHRcdFx0XHRDb250cm9scy5tb3ZlT2JqZWN0KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBvYmogPSBDb250cm9scy5zZWxlY3RlZC5vYmplY3Q7XG5cblx0XHRcdFx0aWYob2JqIGluc3RhbmNlb2YgQm9va09iamVjdCkge1xuXHRcdFx0XHRcdGlmKG1vdXNlWzFdKSB7XG5cdFx0XHRcdFx0XHRvYmoubW92ZUVsZW1lbnQobW91c2UuZFgsIG1vdXNlLmRZLCBVSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYobW91c2VbMl0gJiYgVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9PSAnY292ZXInKSB7XG5cdFx0XHRcdCBcdFx0b2JqLnNjYWxlRWxlbWVudChtb3VzZS5kWCwgbW91c2UuZFkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHQgXHRcdG9iai5yb3RhdGUobW91c2UuZFgsIG1vdXNlLmRZLCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vKioqKlxuXG5cdENvbnRyb2xzLnNlbGVjdE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRvYmplY3QsXG5cdFx0XHRwb2ludDtcblxuXHRcdGlmKENvbnRyb2xzLm1vdXNlLmlzQ2FudmFzKCkgJiYgZW52aXJvbm1lbnQubGlicmFyeSkge1xuXHRcdFx0aW50ZXJzZWN0ZWQgPSBDb250cm9scy5tb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2VjdGlvbk9iamVjdCwgQm9va09iamVjdF0pO1xuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0XHRwb2ludCA9IGludGVyc2VjdGVkLnBvaW50OyBcblx0XHRcdH1cblxuXHRcdFx0Q29udHJvbHMuc2VsZWN0ZWQuc2VsZWN0KG9iamVjdCwgcG9pbnQpO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5tb3ZlT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFxuXHRcdFx0bW91c2VWZWN0b3IsXG5cdFx0XHRuZXdQb3NpdGlvbixcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cGFyZW50LFxuXHRcdFx0b2xkUGFyZW50O1xuXG5cdFx0aWYoQ29udHJvbHMuc2VsZWN0ZWQuaXNCb29rKCkgfHwgKENvbnRyb2xzLnNlbGVjdGVkLmlzU2VjdGlvbigpLyogJiYgVUkubWVudS5zZWN0aW9uTWVudS5pc01vdmVPcHRpb24oKSovKSkge1xuXHRcdFx0bW91c2VWZWN0b3IgPSBDYW1lcmEuZ2V0VmVjdG9yKCk7XHRcblx0XHRcdG5ld1Bvc2l0aW9uID0gQ29udHJvbHMuc2VsZWN0ZWQub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRvbGRQYXJlbnQgPSBDb250cm9scy5zZWxlY3RlZC5vYmplY3QucGFyZW50O1xuXG5cdFx0XHRpZihDb250cm9scy5zZWxlY3RlZC5pc0Jvb2soKSkge1xuXHRcdFx0XHRpbnRlcnNlY3RlZCA9IENvbnRyb2xzLm1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTaGVsZk9iamVjdF0pO1xuXHRcdFx0XHRDb250cm9scy5zZWxlY3RlZC5vYmplY3Quc2V0UGFyZW50KGludGVyc2VjdGVkID8gaW50ZXJzZWN0ZWQub2JqZWN0IDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudCA9IENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdC5wYXJlbnQ7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmxvY2FsVG9Xb3JsZChuZXdQb3NpdGlvbik7XG5cblx0XHRcdFx0bmV3UG9zaXRpb24ueCAtPSAobW91c2VWZWN0b3IueiAqIENvbnRyb2xzLm1vdXNlLmRYICsgbW91c2VWZWN0b3IueCAqIENvbnRyb2xzLm1vdXNlLmRZKSAqIDAuMDAzO1xuXHRcdFx0XHRuZXdQb3NpdGlvbi56IC09ICgtbW91c2VWZWN0b3IueCAqIENvbnRyb2xzLm1vdXNlLmRYICsgbW91c2VWZWN0b3IueiAqIENvbnRyb2xzLm1vdXNlLmRZKSAqIDAuMDAzO1xuXG5cdFx0XHRcdHBhcmVudC53b3JsZFRvTG9jYWwobmV3UG9zaXRpb24pO1xuXHRcdFx0XHRpZighQ29udHJvbHMuc2VsZWN0ZWQub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pICYmIENvbnRyb2xzLnNlbGVjdGVkLmlzQm9vaygpKSB7XG5cdFx0XHRcdFx0aWYocGFyZW50ICE9PSBvbGRQYXJlbnQpIHtcblx0XHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdC5zZXRQYXJlbnQob2xkUGFyZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LyogZWxzZSBpZihVSS5tZW51LnNlY3Rpb25NZW51LmlzUm90YXRlT3B0aW9uKCkgJiYgQ29udHJvbHMuc2VsZWN0ZWQuaXNTZWN0aW9uKCkpIHtcblx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdC5yb3RhdGUoQ29udHJvbHMubW91c2UuZFgpO1x0XHRcdFxuXHRcdH0qL1xuXHR9O1xuXG5cdHJldHVybiBDb250cm9scztcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0RhdGEnLCBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG5cdHZhciBEYXRhID0ge307XG5cblx0RGF0YS5URVhUVVJFX1JFU09MVVRJT04gPSA1MTI7XG5cdERhdGEuQ09WRVJfTUFYX1kgPSAzOTQ7XG5cdERhdGEuQ09WRVJfRkFDRV9YID0gMjk2O1xuXG4gICAgRGF0YS5sb2FkSW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJyc7IFxuICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICBcbiAgICAgICAgaWYoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9O1xuICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTsgXG4gICAgfTtcblxuXHREYXRhLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcicpO1xuXHR9O1xuXG5cdERhdGEuZ2V0VXNlckJvb2tzID0gZnVuY3Rpb24odXNlcklkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2ZyZWVCb29rcy8nICsgdXNlcklkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHREYXRhLnBvc3RCb29rID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYm9vaycsIGJvb2spO1xuXHR9O1xuXG5cdERhdGEuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAoe1xuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdHVybDogJy9ib29rJyxcblx0XHRcdGRhdGE6IGJvb2ssXG5cdFx0XHRoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnfVxuXHRcdH0pO1xuXHR9O1xuXG5cdERhdGEuZ2V0VUlEYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL29iai9kYXRhLmpzb24nKTtcblx0fTtcblxuXHREYXRhLmdldExpYnJhcmllcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJpZXMnKTtcblx0fTtcblxuXHREYXRhLmdldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyeS8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHREYXRhLnBvc3RMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeU1vZGVsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbGlicmFyeS8nICsgbGlicmFyeU1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5nZXRTZWN0aW9ucyA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2VjdGlvbnMvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRGF0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NlY3Rpb24nLCBzZWN0aW9uRGF0YSk7XG5cdH07XG5cblx0RGF0YS5nZXRCb29rcyA9IGZ1bmN0aW9uKHNlY3Rpb25JZCkge1xuXHRcdC8vVE9ETzogdXNlcklkXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9ib29rcy8nICsgc2VjdGlvbklkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5sb2FkR2VvbWV0cnkgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0dmFyIGpzb25Mb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuXG4gICAgICAgIC8vVE9ETzogZm91bmQgbm8gd2F5IHRvIHJlamVjdFxuXHRcdGpzb25Mb2FkZXIubG9hZChsaW5rLCBmdW5jdGlvbiAoZ2VvbWV0cnkpIHtcblx0XHRcdGRlZmZlcmVkLnJlc29sdmUoZ2VvbWV0cnkpO1xuXHRcdH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXG5cdERhdGEuZ2V0RGF0YSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGFcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5wb3N0RmVlZGJhY2sgPSBmdW5jdGlvbihkdG8pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9mZWVkYmFjaycsIGR0byk7XG5cdH07XG5cblx0cmV0dXJuIERhdGE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZW52aXJvbm1lbnQnLCBmdW5jdGlvbiAoJHEsICRsb2csIExpYnJhcnlPYmplY3QsIFNlY3Rpb25PYmplY3QsIERhdGEsIENhbWVyYSwgVXNlcikge1xuXHR2YXIgZW52aXJvbm1lbnQgPSB7fTtcblxuXHRlbnZpcm9ubWVudC5zY2VuZSA9IG51bGw7XG5cdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXHRlbnZpcm9ubWVudC5zZWN0aW9ucyA9IHt9O1xuXHRlbnZpcm9ubWVudC5ib29rcyA9IHt9O1xuXG5cdHZhciBzZWN0aW9uc0NhY2hlID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdGNsZWFyU2NlbmUoKTtcblxuXHRcdERhdGEuZ2V0TGlicmFyeShsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKGxpYnJhcnlEdG8pIHtcblx0XHRcdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbGlicmFyeUR0by5tb2RlbCk7XG5cdCAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qc29uJztcblx0ICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuXHQgICAgICAgIHJldHVybiAkcS5hbGwoW0RhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgRGF0YS5sb2FkSW1hZ2UobWFwVXJsKSwgbGlicmFyeUR0bywgcGFyc2VMaWJyYXJ5RHRvKGxpYnJhcnlEdG8pXSk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gcmVzdWx0c1swXTtcbiAgICAgICAgICAgIHZhciBtYXBJbWFnZSA9IHJlc3VsdHNbMV07XG4gICAgICAgICAgICB2YXIgbGlicmFyeUR0byA9IHJlc3VsdHNbMl07XG4gICAgICAgICAgICB2YXIgcGFyc2VSZXN1bHQgPSByZXN1bHRzWzNdO1xuXG4gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKG1hcEltYWdlKTtcbiAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdFx0XHRDYW1lcmEuc2V0UGFyZW50KGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUuYWRkKGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdFx0Ly8gZW52aXJvbm1lbnQubGlicmFyeS5sb2FkU2VjdGlvbnMoKTtcblxuXHRcdFx0c2VjdGlvbnNDYWNoZSA9IHBhcnNlUmVzdWx0O1xuXHRcdFx0Y3JlYXRlU2VjdGlvbnMoZW52aXJvbm1lbnQuc2VjdGlvbnMsIHNlY3Rpb25zQ2FjaGUsIGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBjbGVhclNjZW5lID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQ29udHJvbHMuY2xlYXIoKTtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblxuXHRcdHdoaWxlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdGlmKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW5bMF0uZGlzcG9zZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUucmVtb3ZlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHBhcnNlTGlicmFyeUR0byA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8pIHtcblx0XHR2YXIgc2VjdGlvbk1vZGVscyA9IHt9O1xuXHRcdHZhciBib29rTW9kZWxzID0ge307XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblxuXHRcdFx0ZW52aXJvbm1lbnQuc2VjdGlvbnNbc2VjdGlvbkR0by5pZF0gPSBzZWN0aW9uRHRvO1xuXHRcdFx0aWYoIXNlY3Rpb25Nb2RlbHNbc2VjdGlvbkR0by5tb2RlbF0pIHtcblx0XHRcdFx0c2VjdGlvbk1vZGVsc1tzZWN0aW9uRHRvLm1vZGVsXSA9IGxvYWRTZWN0aW9uRGF0YShzZWN0aW9uRHRvLm1vZGVsKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKHZhciBib29rSW5kZXggPSBzZWN0aW9uRHRvLmJvb2tzLmxlbmd0aCAtIDE7IGJvb2tJbmRleCA+PSAwOyBib29rSW5kZXgtLSkge1xuXHRcdFx0XHR2YXIgYm9va0R0byA9IHNlY3Rpb25EdG8uYm9va3NbYm9va0luZGV4XTtcblxuXHRcdFx0XHRlbnZpcm9ubWVudC5ib29rc1tib29rRHRvLmlkXSA9IGJvb2tEdG87XG5cdFx0XHRcdC8vIGlmKCFib29rTW9kZWxzW2Jvb2tEdG8ubW9kZWxdKSB7XG5cdFx0XHRcdC8vIFx0Ym9va01vZGVsc1tib29rRHRvLm1vZGVsXSA9IGxvYWRCb29rRGF0YShib29rRHRvLm1vZGVsKTtcblx0XHRcdFx0Ly8gfVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAkcS5hbGwoc2VjdGlvbk1vZGVscyk7XG5cdH07XG5cblx0dmFyIGxvYWRTZWN0aW9uRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9zZWN0aW9ucy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCksIFxuICAgICAgICBcdGRhdGE6IERhdGEuZ2V0RGF0YShkYXRhVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZEJvb2tEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG4gICAgICAgIHZhciBkYXRhVXJsID0gcGF0aCArICdkYXRhLmpzb24nO1xuXG4gICAgICAgIHJldHVybiAkcS5hbGwoW0RhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgRGF0YS5sb2FkSW1hZ2UobWFwVXJsKSwgRGF0YS5nZXREYXRhKGRhdGFVcmwpXSk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnMsIHNlY3Rpb25zQ2FjaGUsIGxpYnJhcnkpIHtcblx0XHRmb3Ioa2V5IGluIHNlY3Rpb25zKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IHNlY3Rpb25zW2tleV07XG5cdFx0XHR2YXIgY2FjaGUgPSBzZWN0aW9uc0NhY2hlW3NlY3Rpb25EdG8ubW9kZWxdO1xuICAgICAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXG4gICAgICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlY3Rpb25EdG8uZGF0YSA9IGNhY2hlLmRhdGE7XG5cdFx0XHRsaWJyYXJ5LmFkZChuZXcgU2VjdGlvbk9iamVjdChzZWN0aW9uRHRvLCBjYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpKTtcdFx0XHRcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGVudmlyb25tZW50O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ01haW4nLCBmdW5jdGlvbiAoRGF0YSwgQ2FtZXJhLCBMaWJyYXJ5T2JqZWN0LCBDb250cm9scywgVXNlciwgVUksIGVudmlyb25tZW50KSB7XG5cdHZhciBTVEFUU19DT05UQUlORVJfSUQgPSAnc3RhdHMnO1xuXHR2YXIgTElCUkFSWV9DQU5WQVNfSUQgPSAnTElCUkFSWSc7XG5cdFxuXHR2YXIgY2FudmFzO1xuXHR2YXIgcmVuZGVyZXI7XG5cdHZhciBzdGF0cztcblx0XG5cdHZhciBNYWluID0ge307XG5cblx0TWFpbi5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRpZighRGV0ZWN0b3Iud2ViZ2wpIHtcblx0XHRcdERldGVjdG9yLmFkZEdldFdlYkdMTWVzc2FnZSgpO1xuXHRcdH1cblxuXHRcdGluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q2FtZXJhLmluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q29udHJvbHMuaW5pdCgpO1xuXG5cdFx0c3RhcnRSZW5kZXJMb29wKCk7XG5cblxuXHRcdFVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0ZW52aXJvbm1lbnQubG9hZExpYnJhcnkoVXNlci5nZXRMaWJyYXJ5KCkgfHwgMSk7XG5cdFx0XHRVSS5pbml0KCk7XG5cdFx0fSwgZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0Ly9UT0RPOiBzaG93IGVycm9yIG1lc3NhZ2UgIFxuXHRcdH0pO1x0XHRcblx0fTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHR2YXIgc3RhdHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTVEFUU19DT05UQUlORVJfSUQpO1xuXG5cdFx0c3RhdHMgPSBuZXcgU3RhdHMoKTtcblx0XHRzdGF0c0NvbnRhaW5lci5hcHBlbmRDaGlsZChzdGF0cy5kb21FbGVtZW50KTtcblxuXHRcdGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKExJQlJBUllfQ0FOVkFTX0lEKTtcblx0XHRyZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtjYW52YXM6IGNhbnZhc30pO1xuXHRcdHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cblx0XHRlbnZpcm9ubWVudC5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXHRcdGVudmlyb25tZW50LnNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2coMHgwMDAwMDAsIDQsIDcpO1xuXHR9O1xuXG5cdHZhciBzdGFydFJlbmRlckxvb3AgPSBmdW5jdGlvbigpIHtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RhcnRSZW5kZXJMb29wKTtcblx0XHRDb250cm9scy51cGRhdGUoKTtcblx0XHRyZW5kZXJlci5yZW5kZXIoZW52aXJvbm1lbnQuc2NlbmUsIENhbWVyYS5jYW1lcmEpO1xuXG5cdFx0c3RhdHMudXBkYXRlKCk7XG5cdH07XG5cblx0cmV0dXJuIE1haW47XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbmF2aWdhdGlvbicsIGZ1bmN0aW9uICgpIHtcblx0dmFyIG5hdmlnYXRpb24gPSB7XG5cdFx0c3RhdGU6IHtcblx0XHRcdGZvcndhcmQ6IGZhbHNlLFxuXHRcdFx0YmFja3dhcmQ6IGZhbHNlLFxuXHRcdFx0bGVmdDogZmFsc2UsXG5cdFx0XHRyaWdodDogZmFsc2VcdFx0XHRcblx0XHR9XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb1N0b3AgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmZvcndhcmQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLmJhY2t3YXJkID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5sZWZ0ID0gZmFsc2U7XG5cdFx0dGhpcy5zdGF0ZS5yaWdodCA9IGZhbHNlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29Gb3J3YXJkID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5mb3J3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvQmFja3dhcmQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmJhY2t3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUubGVmdCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb1JpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5yaWdodCA9IHRydWU7XG5cdH07XG5cblx0cmV0dXJuIG5hdmlnYXRpb247XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnVUknLCBmdW5jdGlvbiAoJHEsIFVzZXIsIERhdGEsIG5hdmlnYXRpb24sIGVudmlyb25tZW50LCBibG9ja1VJKSB7XG5cdHZhciBCT09LX0lNQUdFX1VSTCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vaW1nLmpwZyc7XG5cdHZhciBVSSA9IHttZW51OiB7fX07XG5cblx0VUkubWVudS5zZWxlY3RMaWJyYXJ5ID0ge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdHVwZGF0ZUxpc3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdCAgICBEYXRhLmdldExpYnJhcmllcygpXG5cdFx0ICAgIFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdCAgICAgICAgICAgIHNjb3BlLmxpc3QgPSByZXMuZGF0YTtcblx0XHQgICAgXHR9KTtcblx0XHR9LFxuXHRcdGdvOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0aWYoaWQpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQubG9hZExpYnJhcnkoaWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUxpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubW9kZWwgPyAnL29iai9saWJyYXJpZXMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0RGF0YS5wb3N0TGlicmFyeSh0aGlzLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeShyZXN1bHQuaWQpO1xuXHRcdFx0XHRcdFVJLm1lbnUuc2hvdyA9IG51bGw7IC8vIFRPRE86IGhpZGUgYWZ0ZXIgZ28gXG5cdFx0XHRcdFx0VUkubWVudS5zZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKTtcblx0XHRcdFx0XHQvL1RPRE86IGFkZCBsaWJyYXJ5IHdpdGhvdXQgcmVsb2FkXG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZVNlY3Rpb24gPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cdFx0XG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGVsID8gJy9vYmovc2VjdGlvbnMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0dmFyIHNlY3Rpb25EYXRhID0ge1xuXHRcdFx0XHRcdG1vZGVsOiB0aGlzLm1vZGVsLFxuXHRcdFx0XHRcdHVzZXJJZDogVXNlci5nZXRJZCgpXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0RGF0YS5wb3N0U2VjdGlvbihzZWN0aW9uRGF0YSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiByZWZhY3RvciAoZG9uJ3Qgc2VlIG5ldyBzZWN0aW9uIGNyZWF0aW9uKVxuXHRcdFx0XHRcdC8vIHBvc3NpYmx5IGFkZCB0byBpbnZlbnRvcnkgb25seVxuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmZlZWRiYWNrID0ge1xuXHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0c2hvdzogdHJ1ZSxcblxuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2hvdyA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0c3VibWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkYXRhT2JqZWN0O1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLm1lc3NhZ2UpIHtcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dXNlcklkOiBVc2VyLmdldElkKClcblx0XHRcdFx0fTtcblxuXHRcdFx0XHREYXRhLnBvc3RGZWVkYmFjayhkYXRhT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51Lm5hdmlnYXRpb24gPSB7XG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvU3RvcCgpO1xuXHRcdH0sXG5cdFx0Zm9yd2FyZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCgpO1xuXHRcdH0sXG5cdFx0YmFja3dhcmQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvbi5nb0JhY2t3YXJkKCk7XG5cdFx0fSxcblx0XHRsZWZ0OiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29MZWZ0KCk7XG5cdFx0fSxcblx0XHRyaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvUmlnaHQoKTtcblx0XHR9XG5cdH07XG5cblx0VUkubWVudS5sb2dpbiA9IHtcblx0XHQvLyBUT0RPOiBvYXV0aC5pb1xuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gIVVzZXIuaXNBdXRob3JpemVkKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuaW52ZW50b3J5ID0ge1xuXHRcdHNlYXJjaDogbnVsbCxcblx0XHRsaXN0OiBudWxsLFxuXHRcdGJsb2NrZXI6ICdpbnZlbnRvcnknLFxuXHRcblx0XHRleHBhbmQ6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdFVJLm1lbnUuY3JlYXRlQm9vay5zZXRCb29rKGJvb2spO1xuXHRcdH0sXG5cdFx0YmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0YmxvY2tVSS5pbnN0YW5jZXMuZ2V0KHRoaXMuYmxvY2tlcikuc3RhcnQoKTtcblx0XHR9LFxuXHRcdHVuYmxvY2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0YmxvY2tVSS5pbnN0YW5jZXMuZ2V0KHRoaXMuYmxvY2tlcikuc3RvcCgpO1xuXHRcdH0sXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBVc2VyLmlzQXV0aG9yaXplZCgpO1xuXHRcdH0sXG5cdFx0YWRkQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh7dXNlcklkOiBVc2VyLmdldElkKCl9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0c2NvcGUuZXhwYW5kKHJlcy5kYXRhKTtcblx0XHRcdFx0XHRyZXR1cm4gc2NvcGUubG9hZERhdGEoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdC8vVE9ETzogcmVzZWFyY2gsIGxvb2tzIHJpZ3RoXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maW5hbGx5KGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRzY29wZS51bmJsb2NrKCk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5kZWxldGVCb29rKGJvb2spXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2NvcGUubG9hZERhdGEoKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZpbmFsbHkoZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdFx0fSk7XG5cdFx0fSxcblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0dmFyIHByb21pc2U7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih0aGlzLmlzU2hvdygpID8gRGF0YS5nZXRVc2VyQm9va3MoVXNlci5nZXRJZCgpKSA6IG51bGwpXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChib29rcykge1xuXHRcdFx0XHRcdHNjb3BlLmxpc3QgPSBib29rcztcblx0XHRcdFx0fSlcblx0XHRcdFx0LmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcdFx0XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHR9XG5cdH07XG5cblx0VUkubWVudS5jcmVhdGVCb29rID0ge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdGJvb2s6IHt9LFxuXG5cdFx0c2V0Qm9vazogZnVuY3Rpb24oYm9vaykge1xuXHRcdFx0dGhpcy5ib29rID0ge307IC8vIGNyZWF0ZSBuZXcgb2JqZWN0IGZvciB1bmJpbmQgZnJvbSBzY29wZVxuXHRcdFx0aWYoYm9vaykge1xuXHRcdFx0XHR0aGlzLmJvb2suaWQgPSBib29rLmlkO1xuXHRcdFx0XHR0aGlzLmJvb2sudXNlcklkID0gYm9vay51c2VySWQ7XG5cdFx0XHRcdHRoaXMuYm9vay5tb2RlbCA9IGJvb2subW9kZWw7XG5cdFx0XHRcdHRoaXMuYm9vay5jb3ZlciA9IGJvb2suY292ZXI7XG5cdFx0XHRcdHRoaXMuYm9vay50aXRsZSA9IGJvb2sudGl0bGU7XG5cdFx0XHRcdHRoaXMuYm9vay5hdXRob3IgPSBib29rLmF1dGhvcjtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGdldEltZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5ib29rLm1vZGVsID8gQk9PS19JTUFHRV9VUkwucmVwbGFjZSgne21vZGVsfScsIHRoaXMuYm9vay5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0aXNTaG93OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAhIXRoaXMuYm9vay5pZDtcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdFx0XG5cdFx0XHRVSS5tZW51LmludmVudG9yeS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh0aGlzLmJvb2spXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHRzY29wZS5jYW5jZWwoKTtcblx0XHRcdFx0XHRyZXR1cm4gVUkubWVudS5pbnZlbnRvcnkubG9hZERhdGEoKVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvclxuXHRcdFx0XHR9KVxuXHRcdFx0XHQuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0VUkubWVudS5pbnZlbnRvcnkudW5ibG9jaygpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXHRcdGNhbmNlbDogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnNldEJvb2soKTtcblx0XHR9XG5cdH07XG5cblx0VUkuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vVE9ETzogbW92ZSB0byBtZW51IG1vZGVsc1xuXHRcdERhdGEuZ2V0VUlEYXRhKClcblx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZUxpYnJhcnkubGlzdCA9IHJlcy5kYXRhLmxpYnJhcmllcztcblx0XHRcdFVJLm1lbnUuY3JlYXRlU2VjdGlvbi5saXN0ID0gcmVzLmRhdGEuYm9va3NoZWx2ZXM7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZUJvb2subGlzdCA9IHJlcy5kYXRhLmJvb2tzO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdH0pO1xuXG5cdFx0VUkubWVudS5zZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKTtcblx0XHRVSS5tZW51LmludmVudG9yeS5sb2FkRGF0YSgpO1x0XG5cdH07XG5cblx0cmV0dXJuIFVJO1xufSk7XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuaW5pdENvbnRyb2xzRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm1vZGVsLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGV4dHVyZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va1RleHR1cmU7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmNvdmVyLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rQ292ZXI7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmF1dGhvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3RleHQnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yU2l6ZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yQ29sb3Iub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ2F1dGhvcicsICdjb2xvcicpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAndGV4dCcpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZVNpemUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ3RpdGxlJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGl0bGVDb2xvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAnY29sb3InKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdENvdmVyLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdEF1dGhvci5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRUaXRsZS5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm9rLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnNhdmVCb29rO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5jYW5jZWwub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2FuY2VsQm9va0VkaXQ7XG4vLyB9O1xuXG4vLyBjcmVhdGUgYm9va1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnNob3dDcmVhdGVCb29rID0gZnVuY3Rpb24oKSB7XG4vLyBcdHZhciBtZW51Tm9kZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rO1xuXG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHRtZW51Tm9kZS5zaG93KCk7XG4vLyBcdFx0bWVudU5vZGUuc2V0VmFsdWVzKCk7XG4vLyBcdH0gZWxzZSBpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzU2VjdGlvbigpKSB7XG4vLyBcdFx0dmFyIHNlY3Rpb24gPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgc2hlbGYgPSBzZWN0aW9uLmdldFNoZWxmQnlQb2ludChWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnBvaW50KTtcbi8vIFx0XHR2YXIgZnJlZVBvc2l0aW9uID0gc2VjdGlvbi5nZXRHZXRGcmVlU2hlbGZQb3NpdGlvbihzaGVsZiwge3g6IDAuMDUsIHk6IDAuMTIsIHo6IDAuMX0pOyBcbi8vIFx0XHRpZihmcmVlUG9zaXRpb24pIHtcbi8vIFx0XHRcdG1lbnVOb2RlLnNob3coKTtcblxuLy8gXHRcdFx0dmFyIGRhdGFPYmplY3QgPSB7XG4vLyBcdFx0XHRcdG1vZGVsOiBtZW51Tm9kZS5tb2RlbC52YWx1ZSwgXG4vLyBcdFx0XHRcdHRleHR1cmU6IG1lbnVOb2RlLnRleHR1cmUudmFsdWUsIFxuLy8gXHRcdFx0XHRjb3ZlcjogbWVudU5vZGUuY292ZXIudmFsdWUsXG4vLyBcdFx0XHRcdHBvc194OiBmcmVlUG9zaXRpb24ueCxcbi8vIFx0XHRcdFx0cG9zX3k6IGZyZWVQb3NpdGlvbi55LFxuLy8gXHRcdFx0XHRwb3NfejogZnJlZVBvc2l0aW9uLnosXG4vLyBcdFx0XHRcdHNlY3Rpb25JZDogc2VjdGlvbi5kYXRhT2JqZWN0LmlkLFxuLy8gXHRcdFx0XHRzaGVsZklkOiBzaGVsZi5pZCxcbi8vIFx0XHRcdFx0dXNlcklkOiBWaXJ0dWFsQm9va3NoZWxmLnVzZXIuaWRcbi8vIFx0XHRcdH07XG5cbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRcdGJvb2sucGFyZW50ID0gc2hlbGY7XG4vLyBcdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gYm9vaztcbi8vIFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5nZXQoKTtcbi8vIFx0XHRcdH0pO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRhbGVydCgnVGhlcmUgaXMgbm8gZnJlZSBzcGFjZSBvbiBzZWxlY3RlZCBzaGVsZi4nKTtcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIG9sZEJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgZGF0YU9iamVjdCA9IHtcbi8vIFx0XHRcdG1vZGVsOiB0aGlzLnZhbHVlLFxuLy8gXHRcdFx0dGV4dHVyZTogb2xkQm9vay50ZXh0dXJlLnRvU3RyaW5nKCksXG4vLyBcdFx0XHRjb3Zlcjogb2xkQm9vay5jb3Zlci50b1N0cmluZygpXG4vLyBcdFx0fTtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRib29rLmNvcHlTdGF0ZShvbGRCb29rKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdGJvb2sudGV4dHVyZS5sb2FkKHRoaXMudmFsdWUsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tDb3ZlciA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHRib29rLmNvdmVyLmxvYWQodGhpcy52YWx1ZSwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUgPSBmdW5jdGlvbihmaWVsZCwgcHJvcGVydHkpIHtcbi8vIFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcbi8vIFx0XHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdFtmaWVsZF1bcHJvcGVydHldID0gdGhpcy52YWx1ZTtcbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0LnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9XG4vLyBcdH07XG4vLyB9O1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHR2YXIgYWN0aXZlRWxlbWV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYWN0aXZlRWRpdCcpO1xuXG4vLyBcdGZvcih2YXIgaSA9IGFjdGl2ZUVsZW1ldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbi8vIFx0XHRhY3RpdmVFbGVtZXRzW2ldLmNsYXNzTmFtZSA9ICdpbmFjdGl2ZUVkaXQnO1xuLy8gXHR9O1xuXG4vLyBcdHZhciBwcmV2aW91c0VkaXRlZCA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZDtcbi8vIFx0dmFyIGN1cnJlbnRFZGl0ZWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZWRpdCcpO1xuXG4vLyBcdGlmKHByZXZpb3VzRWRpdGVkICE9IGN1cnJlbnRFZGl0ZWQpIHtcbi8vIFx0XHR0aGlzLmNsYXNzTmFtZSA9ICdhY3RpdmVFZGl0Jztcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPSBjdXJyZW50RWRpdGVkO1xuLy8gXHR9IGVsc2Uge1xuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9IG51bGw7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5zYXZlQm9vayA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucHV0KCk7XG4vLyBcdFx0Ym9vay5zYXZlKCk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jYW5jZWxCb29rRWRpdCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblx0XHRcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnB1dCgpO1xuLy8gXHRcdGJvb2sucmVmcmVzaCgpO1xuLy8gXHR9XG4vLyB9IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1VzZXInLCBmdW5jdGlvbiAoRGF0YSkge1xuXHR2YXIgVXNlciA9IHtcblx0XHRfZGF0YU9iamVjdDogbnVsbCxcblx0XHRfcG9zaXRpb246IG51bGwsXG5cdFx0X2xpYnJhcnk6IG51bGwsXG5cblx0XHRsb2FkOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHRcdHJldHVybiBEYXRhLmdldFVzZXIoKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChyZXMuZGF0YSk7XG5cdFx0XHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0XHR9KTtcblx0XHR9LFxuXHRcdHNldERhdGFPYmplY3Q6IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRcdHRoaXMuX2RhdGFPYmplY3QgPSBkYXRhT2JqZWN0O1xuXHRcdH0sXG5cdFx0Z2V0TGlicmFyeTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fbGlicmFyeTtcblx0XHR9LFxuXHRcdHNldExpYnJhcnk6IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdFx0dGhpcy5fbGlicmFyeSA9IGxpYnJhcnlJZCB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpO1xuXHRcdH0sXG5cdFx0Z2V0SWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2RhdGFPYmplY3QgJiYgdGhpcy5fZGF0YU9iamVjdC5pZDtcblx0XHR9LFxuXHRcdGlzQXV0aG9yaXplZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLl9kYXRhT2JqZWN0KTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIFVzZXI7XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCYXNlT2JqZWN0JywgZnVuY3Rpb24gKCkge1xuXHR2YXIgQmFzZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdFRIUkVFLk1lc2guY2FsbCh0aGlzLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0ID0gZGF0YU9iamVjdCB8fCB7fTtcblx0XHR0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gPSB0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gfHwgWzAsIDAsIDBdO1xuXHRcdFxuXHRcdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMuZGF0YU9iamVjdC5wb3NfeCwgdGhpcy5kYXRhT2JqZWN0LnBvc195LCB0aGlzLmRhdGFPYmplY3QucG9zX3opO1xuXHRcdHRoaXMucm90YXRpb24ub3JkZXIgPSAnWFlaJztcblx0XHR0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdFx0dGhpcy51cGRhdGVNYXRyaXgoKTtcblx0XHR0aGlzLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG5cdH07XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBUSFJFRS5NZXNoKCk7XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJhc2VPYmplY3Q7XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc091dE9mUGFycmVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLngpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy54IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueClcblx0XHRcdC8vfHwgTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueSAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci55KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueSAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkpXG5cdFx0XHR8fCBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLnopID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy56IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueik7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuaXNDb2xsaWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0dGFyZ2V0cyxcblx0XHRcdHRhcmdldCxcblx0XHRcdGk7XG5cblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXN1bHQgPSB0aGlzLmlzT3V0T2ZQYXJyZW50KCk7XG5cdFx0dGFyZ2V0cyA9IHRoaXMucGFyZW50LmNoaWxkcmVuO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0Zm9yKGkgPSB0YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldHNbaV0uYm91bmRpbmdCb3g7XG5cblx0XHRcdFx0aWYodGFyZ2V0c1tpXSA9PT0gdGhpc1xuXHRcdFx0XHR8fCAoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueCAtIHRhcmdldC5jZW50ZXIueCkgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueCArIHRhcmdldC5yYWRpdXMueCkpXG5cdFx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGFyZ2V0LmNlbnRlci55KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy55ICsgdGFyZ2V0LnJhZGl1cy55KSlcblx0XHRcdFx0fHwgKE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnogLSB0YXJnZXQuY2VudGVyLnopID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnogKyB0YXJnZXQucmFkaXVzLnopKSkge1x0XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdCAgICBcdHJlc3VsdCA9IHRydWU7XHRcdFxuXHRcdCAgICBcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKG5ld1Bvc2l0aW9uKSB7XG5cdFx0dmFyIFxuXHRcdFx0Y3VycmVudFBvc2l0aW9uLFxuXHRcdFx0cmVzdWx0O1xuXG5cdFx0cmVzdWx0ID0gZmFsc2U7XG5cdFx0Y3VycmVudFBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdFxuXHRcdGlmKG5ld1Bvc2l0aW9uLngpIHtcblx0XHRcdHRoaXMucG9zaXRpb24uc2V0WChuZXdQb3NpdGlvbi54KTtcblxuXHRcdFx0aWYodGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKGN1cnJlbnRQb3NpdGlvbi54KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYobmV3UG9zaXRpb24ueikge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRaKG5ld1Bvc2l0aW9uLnopO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFooY3VycmVudFBvc2l0aW9uLnopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmNoYW5nZWQgPSB0aGlzLmNoYW5nZWQgfHwgcmVzdWx0O1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oZFgsIGRZLCBpc0RlbW8pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50Um90YXRpb24gPSB0aGlzLnJvdGF0aW9uLmNsb25lKCksXG5cdFx0XHRyZXN1bHQgPSBmYWxzZTsgXG5cdFx0XG5cdFx0aWYoZFgpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueSArPSBkWCAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi55ID0gY3VycmVudFJvdGF0aW9uLnk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKGRZKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uLnggKz0gZFkgKiAwLjAxO1xuXG5cdFx0XHRpZighaXNEZW1vICYmIHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucm90YXRpb24ueCA9IGN1cnJlbnRSb3RhdGlvbi54O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLmNoYW5nZWQgPSB0aGlzLmNoYW5nZWQgfHwgKCFpc0RlbW8gJiYgcmVzdWx0KTtcblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUudXBkYXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXJcblx0XHRcdGJvdW5kaW5nQm94LFxuXHRcdFx0cmFkaXVzLFxuXHRcdFx0Y2VudGVyO1xuXG5cdFx0dGhpcy51cGRhdGVNYXRyaXgoKTtcblx0XHRib3VuZGluZ0JveCA9IHRoaXMuZ2VvbWV0cnkuYm91bmRpbmdCb3guY2xvbmUoKS5hcHBseU1hdHJpeDQodGhpcy5tYXRyaXgpO1xuXHRcdFxuXHRcdHJhZGl1cyA9IHtcblx0XHRcdHg6IChib3VuZGluZ0JveC5tYXgueCAtIGJvdW5kaW5nQm94Lm1pbi54KSAqIDAuNSxcblx0XHRcdHk6IChib3VuZGluZ0JveC5tYXgueSAtIGJvdW5kaW5nQm94Lm1pbi55KSAqIDAuNSxcblx0XHRcdHo6IChib3VuZGluZ0JveC5tYXgueiAtIGJvdW5kaW5nQm94Lm1pbi56KSAqIDAuNVxuXHRcdH07XG5cblx0XHRjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMyhcblx0XHRcdHJhZGl1cy54ICsgYm91bmRpbmdCb3gubWluLngsXG5cdFx0XHRyYWRpdXMueSArIGJvdW5kaW5nQm94Lm1pbi55LFxuXHRcdFx0cmFkaXVzLnogKyBib3VuZGluZ0JveC5taW4uelxuXHRcdCk7XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IGNlbnRlclxuXHRcdH07XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUucmVsb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wb3NpdGlvbi5zZXRYKHRoaXMuZGF0YU9iamVjdC5wb3NfeCk7XG5cdFx0dGhpcy5wb3NpdGlvbi5zZXRZKHRoaXMuZGF0YU9iamVjdC5wb3NfeSk7XG5cdFx0dGhpcy5wb3NpdGlvbi5zZXRaKHRoaXMuZGF0YU9iamVjdC5wb3Nfeik7XG5cdFx0dGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG5cdH07XG5cblx0cmV0dXJuIEJhc2VPYmplY3Q7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCb29rT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIENhbnZhc1RleHQsIENhbnZhc0ltYWdlLCBEYXRhKSB7XHRcblx0dmFyIEJvb2tPYmplY3QgPSBmdW5jdGlvbihkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHRcblx0XHR0aGlzLm1vZGVsID0gdGhpcy5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdHRoaXMuY2FudmFzID0gbWF0ZXJpYWwubWFwLmltYWdlO1xuXHRcdHRoaXMudGV4dHVyZSA9IG5ldyBDYW52YXNJbWFnZSgpO1xuXHRcdHRoaXMuY292ZXIgPSBuZXcgQ2FudmFzSW1hZ2UodGhpcy5kYXRhT2JqZWN0LmNvdmVyUG9zKTtcblx0XHR0aGlzLmF1dGhvciA9IG5ldyBDYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC5hdXRob3IsIHRoaXMuZGF0YU9iamVjdC5hdXRob3JGb250KTtcblx0XHR0aGlzLnRpdGxlID0gbmV3IENhbnZhc1RleHQodGhpcy5kYXRhT2JqZWN0LnRpdGxlLCB0aGlzLmRhdGFPYmplY3QudGl0bGVGb250KTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvb2tPYmplY3Q7XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnRleHROb2RlcyA9IFsnYXV0aG9yJywgJ3RpdGxlJ107XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnVwZGF0ZVRleHR1cmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0dmFyIGNvdmVyID0gdGhpcy5jb3ZlcjtcblxuXHRcdGlmKHRoaXMudGV4dHVyZS5pbWFnZSkge1xuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltYWdlLCAwLCAwKTtcblx0XHR9XG5cblx0XHRpZihjb3Zlci5pbWFnZSkge1xuXHRcdFx0dmFyIGRpZmYgPSBjb3Zlci55ICsgY292ZXIuaGVpZ2h0IC0gRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHQgXHR2YXIgbGltaXRlZEhlaWdodCA9IGRpZmYgPiAwID8gY292ZXIuaGVpZ2h0IC0gZGlmZiA6IGNvdmVyLmhlaWdodDtcblx0XHQgXHR2YXIgY3JvcEhlaWdodCA9IGRpZmYgPiAwID8gY292ZXIuaW1hZ2UubmF0dXJhbEhlaWdodCAtIChjb3Zlci5pbWFnZS5uYXR1cmFsSGVpZ2h0IC8gY292ZXIuaGVpZ2h0ICogZGlmZikgOiBjb3Zlci5pbWFnZS5uYXR1cmFsSGVpZ2h0O1xuXG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZShjb3Zlci5pbWFnZSwgMCwgMCwgY292ZXIuaW1hZ2UubmF0dXJhbFdpZHRoLCBjcm9wSGVpZ2h0LCBjb3Zlci54LCBjb3Zlci55LCBjb3Zlci53aWR0aCwgbGltaXRlZEhlaWdodCk7XG5cdFx0fVxuXG5cdFx0Zm9yKHZhciBpID0gdGhpcy50ZXh0Tm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdHZhciB0ZXh0Tm9kZSA9IHRoaXNbdGhpcy50ZXh0Tm9kZXNbaV1dO1xuXG5cdFx0XHRpZih0ZXh0Tm9kZS5pc1ZhbGlkKCkpIHtcblxuXHRcdFx0XHRjb250ZXh0LmZvbnQgPSB0ZXh0Tm9kZS5nZXRGb250KCk7XG5cdFx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gdGV4dE5vZGUuY29sb3I7XG5cdFx0ICAgIFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0Tm9kZS50ZXh0LCB0ZXh0Tm9kZS54LCB0ZXh0Tm9kZS55LCB0ZXh0Tm9kZS53aWR0aCk7XG5cdFx0ICAgIH1cblx0XHR9XG5cblx0XHR0aGlzLm1hdGVyaWFsLm1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLm1vdmVFbGVtZW50ID0gZnVuY3Rpb24oZFgsIGRZLCBlbGVtZW50KSB7XG5cdFx0dmFyIGVsZW1lbnQgPSBlbGVtZW50ICYmIHRoaXNbZWxlbWVudF07XG5cdFx0XG5cdFx0aWYoZWxlbWVudCkge1xuXHRcdFx0aWYoZWxlbWVudC5tb3ZlKSB7XG5cdFx0XHRcdGVsZW1lbnQubW92ZShkWCwgZFkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC54ICs9IGRYO1xuXHRcdFx0XHRlbGVtZW50LnkgKz0gZFk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHRcdH1cblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUuc2NhbGVFbGVtZW50ID0gZnVuY3Rpb24oZFgsIGRZKSB7XG5cdFx0dGhpcy5jb3Zlci53aWR0aCArPSBkWDtcblx0XHR0aGlzLmNvdmVyLmhlaWdodCArPSBkWTtcblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QubW9kZWwgPSB0aGlzLm1vZGVsO1xuXHRcdHRoaXMuZGF0YU9iamVjdC50ZXh0dXJlID0gdGhpcy50ZXh0dXJlLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmNvdmVyID0gdGhpcy5jb3Zlci50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC5jb3ZlclBvcyA9IHRoaXMuY292ZXIuc2VyaWFsaXplUHJvcGVydGllcygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC5hdXRob3IgPSB0aGlzLmF1dGhvci50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC5hdXRob3JGb250ID0gdGhpcy5hdXRob3Iuc2VyaWFsaXplRm9udCgpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC50aXRsZSA9IHRoaXMudGl0bGUudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QudGl0bGVGb250ID0gdGhpcy50aXRsZS5zZXJpYWxpemVGb250KCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc194ID0gdGhpcy5wb3NpdGlvbi54O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeSA9IHRoaXMucG9zaXRpb24ueTtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ogPSB0aGlzLnBvc2l0aW9uLno7XG5cblx0XHREYXRhLnBvc3RCb29rKHRoaXMuZGF0YU9iamVjdCwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcblx0XHRcdGlmKCFlcnIgJiYgcmVzdWx0KSB7XG5cdFx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSByZXN1bHQ7XG5cdFx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vVE9ETzogaGlkZSBlZGl0LCBub3RpZnkgdXNlclxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHQvL1RPRE86IHVzZSBpbiBjb25zdHJ1Y3RvciBpbnN0ZWFkIG9mIHNlcGFyYXRlIGltYWdlcyBsb2FkaW5nXG5cdFx0c2NvcGUudGV4dHVyZS5sb2FkKHNjb3BlLmRhdGFPYmplY3QudGV4dHVyZSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcblx0XHRcdHNjb3BlLmNvdmVyLmxvYWQoc2NvcGUuZGF0YU9iamVjdC5jb3ZlciwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNjb3BlLm1vZGVsID0gc2NvcGUuZGF0YU9iamVjdC5tb2RlbDtcblx0XHRcdFx0c2NvcGUuY292ZXIucGFyc2VQcm9wZXJ0aWVzKHNjb3BlLmRhdGFPYmplY3QuY292ZXJQb3MpO1xuXHRcdFx0XHRzY29wZS5hdXRob3Iuc2V0VGV4dChzY29wZS5kYXRhT2JqZWN0LmF1dGhvcik7XG5cdFx0XHRcdHNjb3BlLmF1dGhvci5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC5hdXRob3JGb250KTtcblx0XHRcdFx0c2NvcGUudGl0bGUuc2V0VGV4dChzY29wZS5kYXRhT2JqZWN0LnRpdGxlKTtcblx0XHRcdFx0c2NvcGUudGl0bGUucGFyc2VQcm9wZXJ0aWVzKHNjb3BlLmRhdGFPYmplY3QudGl0bGVGb250KTtcblxuXHRcdFx0XHRzY29wZS51cGRhdGVUZXh0dXJlKCk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUuY29weVN0YXRlID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdGlmKGJvb2sgaW5zdGFuY2VvZiBCb29rT2JqZWN0KSB7XG5cdFx0XHR2YXIgZmllbGRzID0gWydkYXRhT2JqZWN0JywgJ3Bvc2l0aW9uJywgJ3JvdGF0aW9uJywgJ21vZGVsJywgJ3RleHR1cmUnLCAnY292ZXInLCAnYXV0aG9yJywgJ3RpdGxlJ107XG5cdFx0XHRmb3IodmFyIGkgPSBmaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dmFyIGZpZWxkID0gZmllbGRzW2ldO1xuXHRcdFx0XHR0aGlzW2ZpZWxkXSA9IGJvb2tbZmllbGRdO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy51cGRhdGVUZXh0dXJlKCk7XG5cdFx0XHRib29rLnBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHRib29rLnBhcmVudC5yZW1vdmUoYm9vayk7XG5cdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdCA9IHRoaXM7XG5cdFx0fVxuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRpZih0aGlzLnBhcmVudCAhPSBwYXJlbnQpIHtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuYWRkKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IHBhcmVudC5pZDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IHBhcmVudC5wYXJlbnQuaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gbnVsbDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBCb29rT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbWVyYU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0KSB7XG5cdHZhciBDYW1lcmFPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcyk7XG5cdH07XG5cblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2FtZXJhT2JqZWN0O1xuXHRcblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByYWRpdXMgPSB7eDogMC4xLCB5OiAxLCB6OiAwLjF9O1xuXHRcdHZhciBjZW50ZXIgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogdGhpcy5wb3NpdGlvbiAvL1RPRE86IG5lZWRzIGNlbnRlciBvZiBzZWN0aW9uIGluIHBhcmVudCBvciB3b3JsZCBjb29yZGluYXRlc1xuXHRcdH07XG5cdH07XG5cblx0cmV0dXJuIENhbWVyYU9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW52YXNJbWFnZScsIGZ1bmN0aW9uIChEYXRhKSB7XG5cdHZhciBDYW52YXNJbWFnZSA9IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcblx0XHR0aGlzLmxpbmsgPSAnJztcblx0XHR0aGlzLmltYWdlID0gbnVsbDtcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblx0Q2FudmFzSW1hZ2UucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBDYW52YXNJbWFnZSxcblx0XHRsb2FkOiBmdW5jdGlvbihsaW5rLCBwcm94eSwgZG9uZSkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcdGZ1bmN0aW9uIHN5bmMobGluaywgaW1hZ2UpIHtcblx0XHRcdFx0c2NvcGUubGluayA9IGxpbms7XG5cdFx0XHRcdHNjb3BlLmltYWdlID0gaW1hZ2U7XG5cdFx0XHRcdGRvbmUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoc2NvcGUubGluayAhPSBsaW5rICYmIGxpbmspIHtcblx0XHRcdFx0dmFyIHBhdGggPSAocHJveHkgPyAnL291dHNpZGU/bGluaz17bGlua30nIDogJy9vYmovYm9va1RleHR1cmVzL3tsaW5rfS5qcGcnKS5yZXBsYWNlKCd7bGlua30nLCBsaW5rKTtcblx0XHRcdFx0RGF0YS5sb2FkSW1hZ2UocGF0aCkudGhlbihmdW5jdGlvbiAoaW1hZ2UpIHtcblx0XHRcdFx0XHRzeW5jKGxpbmssIGltYWdlKTtcdFx0XHRcdFxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZighbGluaykge1xuXHRcdFx0XHRzeW5jKGxpbmspO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZG9uZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubGluaztcblx0XHR9LFxuXHRcdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdFx0dGhpcy54ID0gTnVtYmVyKGFyZ3NbMF0pIHx8IERhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdFx0dGhpcy55ID0gTnVtYmVyKGFyZ3NbMV0pIHx8IDA7XG5cdFx0XHR0aGlzLndpZHRoID0gTnVtYmVyKGFyZ3NbMl0pIHx8IDIxNjtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gTnVtYmVyKGFyZ3NbM10pIHx8IERhdGEuQ09WRVJfTUFYX1k7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XS5qb2luKCcsJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBDYW52YXNJbWFnZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW52YXNUZXh0JywgZnVuY3Rpb24gKERhdGEpIHtcblx0dmFyIENhbnZhc1RleHQgPSBmdW5jdGlvbih0ZXh0LCBwcm9wZXJ0aWVzKSB7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dCB8fCAnJztcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblxuXHRDYW52YXNUZXh0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogQ2FudmFzVGV4dCxcblx0XHRnZXRGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplICsgJ3B4JywgdGhpcy5mb250XS5qb2luKCcgJyk7XG5cdFx0fSxcblx0XHRpc1ZhbGlkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy50ZXh0ICYmIHRoaXMueCAmJiB0aGlzLnkpO1xuXHRcdH0sXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudGV4dCB8fCAnJztcblx0XHR9LFxuXHRcdHNldFRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplLCB0aGlzLmZvbnQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmNvbG9yLCB0aGlzLndpZHRoXS5qb2luKCcsJyk7XG5cdFx0fSxcblx0XHRwYXJzZVByb3BlcnRpZXM6IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcblx0XHRcdHZhciBhcmdzID0gcHJvcGVydGllcyAmJiBwcm9wZXJ0aWVzLnNwbGl0KCcsJykgfHwgW107XG5cblx0XHRcdHRoaXMuc3R5bGUgPSBhcmdzWzBdO1xuXHRcdFx0dGhpcy5zaXplID0gYXJnc1sxXSB8fCAxNDtcblx0XHRcdHRoaXMuZm9udCA9IGFyZ3NbMl0gfHwgJ0FyaWFsJztcblx0XHRcdHRoaXMueCA9IE51bWJlcihhcmdzWzNdKSB8fCBEYXRhLkNPVkVSX0ZBQ0VfWDtcblx0XHRcdHRoaXMueSA9IE51bWJlcihhcmdzWzRdKSB8fCAxMDtcblx0XHRcdHRoaXMuY29sb3IgPSBhcmdzWzVdIHx8ICdibGFjayc7XG5cdFx0XHR0aGlzLndpZHRoID0gYXJnc1s2XSB8fCA1MTI7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHRcdHRoaXMueCArPSBkWDtcblx0XHRcdHRoaXMueSArPSBkWTtcblxuXHRcdFx0aWYodGhpcy54IDw9IDApIHRoaXMueCA9IDE7XG5cdFx0XHRpZih0aGlzLnkgPD0gMCkgdGhpcy55ID0gMTtcblx0XHRcdGlmKHRoaXMueCA+PSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTikgdGhpcy54ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdFx0XHRpZih0aGlzLnkgPj0gRGF0YS5DT1ZFUl9NQVhfWSkgdGhpcy55ID0gRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIENhbnZhc1RleHQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uICgkcSwgQmFzZU9iamVjdCwgU2VjdGlvbk9iamVjdCwgRGF0YSkge1xuXHR2YXIgTGlicmFyeU9iamVjdCA9IGZ1bmN0aW9uKHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHR0aGlzLmxpYnJhcnlPYmplY3QgPSBwYXJhbXMubGlicmFyeU9iamVjdCB8fCB7fTtcblx0fTtcblxuXHRMaWJyYXJ5T2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdExpYnJhcnlPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlicmFyeU9iamVjdDtcblx0XG5cdC8vIExpYnJhcnlPYmplY3QucHJvdG90eXBlLmxvYWRTZWN0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHQvLyBcdHZhciBsaWJyYXJ5ID0gdGhpcztcblxuXHQvLyBcdERhdGEuZ2V0U2VjdGlvbnMobGlicmFyeS5pZCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbnMpIHtcblx0Ly8gXHRcdGZvcihrZXkgaW4gc2VjdGlvbnMpIHtcblx0Ly8gXHRcdFx0bG9hZFNlY3Rpb24oc2VjdGlvbnNba2V5XSwgbGlicmFyeSk7XG5cdC8vIFx0XHR9XG5cdC8vIFx0fSkuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHQvLyBcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdC8vIFx0fSk7XG5cdC8vIH07XG5cblx0Ly8gdmFyIGxvYWRTZWN0aW9uID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgbGlicmFyeSkge1xuXHQvLyBcdHZhciBwYXRoID0gJy9vYmovc2VjdGlvbnMve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBkYXRhT2JqZWN0Lm1vZGVsKTtcbiAvLyAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gLy8gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuIC8vICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuIC8vICAgICAgICAkcS5hbGwoW0RhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgRGF0YS5sb2FkSW1hZ2UobWFwVXJsKSwgRGF0YS5nZXREYXRhKGRhdGFVcmwpXSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuIC8vICAgICAgICAgICAgdmFyIGdlb21ldHJ5ID0gcmVzdWx0c1swXTtcbiAvLyAgICAgICAgICAgIHZhciBtYXBJbWFnZSA9IHJlc3VsdHNbMV07XG4gLy8gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdHNbMl07XG4gLy8gICAgICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKG1hcEltYWdlKTtcbiAvLyAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAvLyAgICAgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuIC8vICAgICAgICAgICAgZGF0YU9iamVjdC5kYXRhID0gcmVzdWx0c1syXTtcblx0Ly8gXHRcdGxpYnJhcnkuYWRkKG5ldyBTZWN0aW9uT2JqZWN0KGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCkpO1xuIC8vICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG4gLy8gICAgICAgIFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG4gLy8gICAgICAgIH0pO1xuXHQvLyB9O1xuXG5cdHJldHVybiBMaWJyYXJ5T2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2VjdGlvbk9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBTaGVsZk9iamVjdCwgQm9va09iamVjdCwgRGF0YSkge1xuXHR2YXIgU2VjdGlvbk9iamVjdCA9IGZ1bmN0aW9uKHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdHRoaXMuc2hlbHZlcyA9IHt9O1xuXHRcdGZvcihrZXkgaW4gcGFyYW1zLmRhdGEuc2hlbHZlcykge1xuXHRcdFx0dGhpcy5zaGVsdmVzW2tleV0gPSBuZXcgU2hlbGZPYmplY3QocGFyYW1zLmRhdGEuc2hlbHZlc1trZXldKTsgXG5cdFx0XHR0aGlzLmFkZCh0aGlzLnNoZWx2ZXNba2V5XSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIHRoaXMubG9hZEJvb2tzKCk7XG5cdH07XG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZWN0aW9uT2JqZWN0O1xuXHRcblx0Ly8gU2VjdGlvbk9iamVjdC5wcm90b3R5cGUubG9hZEJvb2tzID0gZnVuY3Rpb24oKSB7XHRcblx0Ly8gXHR2YXIgc2VjdGlvbiA9IHRoaXM7XG5cblx0Ly8gXHREYXRhLmdldEJvb2tzKHNlY3Rpb24uaWQpLnRoZW4oZnVuY3Rpb24gKGJvb2tzKSB7XG5cdC8vIFx0XHRib29rcy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhT2JqZWN0KSB7XG5cdC8vIFx0XHRcdGNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcblx0Ly8gXHRcdFx0XHR2YXIgc2hlbGYgPSBzZWN0aW9uLnNoZWx2ZXNbZGF0YU9iamVjdC5zaGVsZklkXTtcblx0Ly8gXHRcdFx0XHRzaGVsZiAmJiBzaGVsZi5hZGQoYm9vayk7XG5cdC8vIFx0XHRcdH0pO1xuXHQvLyBcdFx0fSk7XG5cdC8vIFx0fSkuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHQvLyBcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdC8vIFx0fSk7XG5cdC8vIH07XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ggPSB0aGlzLnBvc2l0aW9uLng7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc195ID0gdGhpcy5wb3NpdGlvbi55O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeiA9IHRoaXMucG9zaXRpb24uejtcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbiA9IFt0aGlzLnJvdGF0aW9uLngsIHRoaXMucm90YXRpb24ueSwgdGhpcy5yb3RhdGlvbi56XTtcblxuXHRcdERhdGEucG9zdFNlY3Rpb24odGhpcy5kYXRhT2JqZWN0KS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSBkdG87XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0Ly9UT0RPOiBoaWRlIGVkaXQsIG5vdGlmeSB1c2VyXG5cdFx0fSk7XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuZ2V0U2hlbGZCeVBvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcblx0XHRpZighcG9pbnQgfHwgIXRoaXMuc2hlbHZlcykgcmV0dXJuIG51bGw7XG5cdFx0dGhpcy53b3JsZFRvTG9jYWwocG9pbnQpO1xuXHRcdFxuXHRcdHZhciBtaW5EaXN0YW5jZTtcblx0XHR2YXIgY2xvc2VzdDtcblx0XHRmb3Ioa2V5IGluIHRoaXMuc2hlbHZlcykge1xuXHRcdFx0dmFyIHNoZWxmID0gdGhpcy5zaGVsdmVzW2tleV07XG5cdFx0XHR2YXIgZGlzdGFuY2UgPSBwb2ludC5kaXN0YW5jZVRvKG5ldyBUSFJFRS5WZWN0b3IzKHNoZWxmLnBvc2l0aW9uLngsIHNoZWxmLnBvc2l0aW9uLnksIHNoZWxmLnBvc2l0aW9uLnopKTtcblx0XHRcdGlmKCFtaW5EaXN0YW5jZSB8fCBkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG5cdFx0XHRcdG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG5cdFx0XHRcdGNsb3Nlc3QgPSBzaGVsZjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvc2VzdDtcblx0fTtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuZ2V0R2V0RnJlZVNoZWxmUG9zaXRpb24gPSBmdW5jdGlvbihzaGVsZiwgYm9va1NpemUpIHtcblx0XHRpZighc2hlbGYpIHJldHVybiBudWxsO1xuXHRcdHZhciBzb3J0ZWRCb29rcyA9IFtdO1xuXHRcdHZhciByZXN1bHQ7XG5cblx0XHRzb3J0ZWRCb29rcy5wdXNoKHtcblx0XHRcdGxlZnQ6IC1zaGVsZi5zaXplLngsXG5cdFx0XHRyaWdodDogLXNoZWxmLnNpemUueCAqIDAuNVxuXHRcdH0pO1xuXHRcdHNvcnRlZEJvb2tzLnB1c2goe1xuXHRcdFx0bGVmdDogc2hlbGYuc2l6ZS54ICogMC41LFxuXHRcdFx0cmlnaHQ6IHNoZWxmLnNpemUueFxuXHRcdH0pO1xuXG5cdFx0c2hlbGYuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoYm9vaykge1xuXHRcdFx0aWYoYm9vayBpbnN0YW5jZW9mIEJvb2spIHtcblx0XHRcdFx0dmFyIGluc2VydGVkID0gZmFsc2U7XG5cdFx0XHRcdHZhciBzcGFjZSA9IHtcblx0XHRcdFx0XHRsZWZ0OiBib29rLnBvc2l0aW9uLnggKyBib29rLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1pbi54LFxuXHRcdFx0XHRcdHJpZ2h0OiBib29rLnBvc2l0aW9uLnggKyBib29rLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzb3J0ZWRCb29rcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdHZhciBzb3J0ZWRCb29rID0gc29ydGVkQm9va3NbaV07XG5cdFx0XHRcdFx0aWYoYm9vay5wb3NpdGlvbi54IDwgc29ydGVkQm9vay5sZWZ0KSB7XG5cdFx0XHRcdFx0XHRzb3J0ZWRCb29rcy5zcGxpY2UoaSwgMCwgc3BhY2UpO1xuXHRcdFx0XHRcdFx0aW5zZXJ0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIWluc2VydGVkKSB7XG5cdFx0XHRcdFx0c29ydGVkQm9va3MucHVzaChzcGFjZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgKHNvcnRlZEJvb2tzLmxlbmd0aCAtIDEpOyBpKyspIHtcblx0XHRcdHZhciBsZWZ0ID0gc29ydGVkQm9va3NbaV0ucmlnaHQ7XG5cdFx0XHR2YXIgcmlnaHQgPSBzb3J0ZWRCb29rc1tpICsgMV0ubGVmdDtcblx0XHRcdHZhciBkaXN0YW5jZSA9IHJpZ2h0IC0gbGVmdDtcblx0XHRcdFxuXHRcdFx0aWYoZGlzdGFuY2UgPiBib29rU2l6ZS54KSB7XG5cdFx0XHRcdHJlc3VsdCA9IG5ldyBUSFJFRS5WZWN0b3IzKGxlZnQgKyBib29rU2l6ZS54ICogMC41LCBib29rU2l6ZS55ICogLTAuNSwgMCk7XHRcdFxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHQvLyB2YXIgY3JlYXRlQm9vayA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGRvbmUpIHtcblx0Ly8gXHR2YXIgbW9kZWxQYXRoID0gJy9vYmovYm9va3Mve21vZGVsfS9tb2RlbC5qcycucmVwbGFjZSgne21vZGVsfScsIGRhdGFPYmplY3QubW9kZWwpO1xuXG5cdC8vIFx0RGF0YS5sb2FkR2VvbWV0cnkobW9kZWxQYXRoKS50aGVuKGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuXHQvLyBcdFx0dmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHQvLyBcdFx0dmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuXHQvLyBcdCAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXHQvLyBcdFx0dmFyIGJvb2sgPSBuZXcgQm9va09iamVjdChkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdC8vIFx0XHRjYW52YXMud2lkdGggPSBjYW52YXMuaGVpZ2h0ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdC8vIFx0XHRib29rLnRleHR1cmUubG9hZChkYXRhT2JqZWN0LnRleHR1cmUsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG5cdC8vIFx0XHRcdGJvb2suY292ZXIubG9hZChkYXRhT2JqZWN0LmNvdmVyLCB0cnVlLCBmdW5jdGlvbiAoKSB7XG5cdC8vIFx0XHRcdFx0Ym9vay51cGRhdGVUZXh0dXJlKCk7XG5cdC8vIFx0XHRcdFx0ZG9uZShib29rLCBkYXRhT2JqZWN0KTtcblx0Ly8gXHRcdFx0fSk7XG5cdC8vIFx0XHR9KTtcblx0Ly8gXHR9KTtcblx0Ly8gfTtcdFxuXG5cdHJldHVybiBTZWN0aW9uT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NoZWxmT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QpIHtcblx0dmFyIFNoZWxmT2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0dmFyIHNpemUgPSBwYXJhbXMuc2l6ZSB8fCBbMSwxLDFdO1x0XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgbmV3IFRIUkVFLkN1YmVHZW9tZXRyeShzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKSk7XG5cblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMocGFyYW1zLnBvc2l0aW9uWzBdLCBwYXJhbXMucG9zaXRpb25bMV0sIHBhcmFtcy5wb3NpdGlvblsyXSk7XG5cdFx0dGhpcy5zaXplID0gbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG5cdH07XG5cblx0U2hlbGZPYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0U2hlbGZPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2hlbGZPYmplY3Q7XG5cblx0cmV0dXJuIFNoZWxmT2JqZWN0O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9