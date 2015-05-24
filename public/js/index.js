angular.module('VirtualBookshelf', ['angular-growl', 'blockUI', 'ngDialog', 'angularUtils.directives.dirPagination'])
.config(function (growlProvider, blockUIConfig, paginationTemplateProvider) {
    growlProvider.globalTimeToLive(2000);
    growlProvider.globalPosition('top-left');
    growlProvider.globalDisableCountDown(true);

	blockUIConfig.delay = 0;
	blockUIConfig.autoBlock = false;
	blockUIConfig.autoInjectBodyBlock = false;
	
    paginationTemplateProvider.setPath('/ui/dirPagination');
}).run(function (main) {
	main.start();
});
angular.module('VirtualBookshelf')
.controller('AuthCtrl', function (authorization) {
	this.loginGoogle = function() {
		authorization.google();
	};

	this.loginTwitter = function() {
		authorization.twitter();
	};

	this.loginFacebook = function() {
		authorization.facebook();
	};

	this.loginVkontakte = function() {
		authorization.vkontakte();
	};
});
angular.module('VirtualBookshelf')
.controller('BookEditCtrl', function (bookEdit, dialog, data) {
	var scope = this;

	this.book = bookEdit.book;
	this.coverInputURL = null;

	this.applyCover = function() {
		if(!isCoverDisabled()) {
			bookEdit.applyCover(this.coverInputURL);
		} else {
			dialog.openError('Fill author and title fields, please.');
		}
	};

	this.getCoverImg = function() {
		return bookEdit.getCoverImg();
	};

	this.getImg = function() {
		return bookEdit.getImg();
	};

	this.cancel = function() {
		bookEdit.cancel();
	};

	this.submit = function() {
		if(this.form.$valid) {
			bookEdit.save();
		} else {
			dialog.openError('Fill all required fields, please.');
		}
	};

	var isCoverDisabled = function() {
		return scope.coverInputURL && (scope.form.title.$invalid || scope.form.author.$invalid);
	};

	data.common.then(function (commonData) {
		scope.list = commonData.books;
	});	
});
angular.module('VirtualBookshelf')
.controller('CreateLibraryCtrl', function (createLibrary, data) {
	var scope = this;

	this.list = null;
	this.model = null;

	this.getImg = function() {
		return createLibrary.getImg(this.model);
	};

	this.create = function() {
		createLibrary.create(this.model);
	};

	data.common.then(function (commonData) {
		scope.list = commonData.libraries;
	});
});
angular.module('VirtualBookshelf')
.controller('CreateSectionCtrl', function (createSection, data) {
	var scope = this;

	this.model = null;
	this.list = null;

	this.getImg = function() {
		return createSection.getImg(this.model);
	};
		
	this.create = function() {
		createSection.create(this.model);
	};

	data.common.then(function (commonData) {
		scope.list = commonData.bookshelves;
	});
});
angular.module('VirtualBookshelf')
.controller('FeedbackCtrl', function (feedback, user, dialog) {
	this.submit = function() {
		if(this.form.message.$valid) {
			feedback.send({
				message: this.message,
				userId: user.getId()
			});
		} else {
			dialog.openError('Feedback field is required.');
		}
	};
});
angular.module('VirtualBookshelf')
.controller('InventoryCtrl', function (SelectorMetaDto, BookObject, user, bookEdit, selector) {
	this.isShow = function() {
		return user.isAuthorized();
	};

	this.isBookSelected = function(id) {
		return selector.isBookSelected(id);
	};

	this.select = function(dto) {
		var meta = new SelectorMetaDto(BookObject.TYPE, dto.id);
		selector.select(meta);
	};

	this.addBook = function() {
		bookEdit.show({userId: user.getId()});
	};
});
angular.module('VirtualBookshelf')
.controller('LinkAccountCtrl', function (authorization, linkAccount) {
	this.linkGoogle = function() {
		authorization.google();
	};

	this.linkTwitter = function() {
		authorization.twitter();
	};

	this.linkFacebook = function() {
		authorization.facebook();
	};

	this.linkVkontakte = function() {
		authorization.vkontakte();
	};

	this.isGoogleShow = function() {
		return linkAccount.isGoogleShow();
	};

	this.isTwitterShow = function() {
		return linkAccount.isTwitterShow();
	};

	this.isFacebookShow = function() {
		return linkAccount.isFacebookShow();
	};

	this.isVkontakteShow = function() {
		return linkAccount.isVkontakteShow();
	};

	this.isAvailable = function() {
		return linkAccount.isAvailable();
	};
});
angular.module('VirtualBookshelf')
.controller('RegistrationCtrl', function (registration) {
	this.user = registration.user;

	this.showValidationError = function() {
		registration.showValidationError();
	};
});
angular.module('VirtualBookshelf')
.controller('SelectLibraryCtrl', function (selectLibrary) {
	this.go = selectLibrary.go;

	this.getList = function() {
		return selectLibrary.list;
	};
});
angular.module('VirtualBookshelf')
.controller('ToolsCtrl', function (user, selector, tools, preview, bookEdit, dialog, block, growl) {
    var DELETE_CONFIRM = 'Delete {0}: {1}?';
    var DELETE_SUCCESS = '{0}: {1} deleted.';
    var DELETE_ERROR = 'Can not delete {0}: {1}.';
    var BOOK = 'book';
    var SECTION = 'section';

    this.isShow = function() {
        return selector.isSelectedEditable() || preview.isActive();
    };

    this.isBook = function() {
        return selector.isSelectedBook();
    };

    this.isSection = function() {
        return selector.isSelectedSection();
    };

    this.isRotatable = function() {
        return selector.isSelectedSection() || preview.isActive();
    };

    this.isEditable = function() {
        return this.isBook() && !preview.isActive();
    };

    this.isDeletable = function() {
        return selector.isSelectedEditable() && user.isAuthorized() && !preview.isActive();
    };

    this.isWatchable = function() {
        return selector.isSelectedBook() && !preview.isActive() && !this.isPlaceble();
    };

    this.isPlaceble = function() {
        var obj = selector.getSelectedObject();
        return !obj && selector.isSelectedBook() && user.isAuthorized();
    };

    this.isUnplaceble = function() {
        var obj = selector.getSelectedObject();
        return obj && selector.isSelectedBook() && user.isAuthorized() && !preview.isActive();
    };

    this.isPlacing = function() {
        return selector.placing;
    };

    this.place = function() {
        selector.placing = !selector.placing;
    };

    this.unplace = function() {
        tools.unplace();
    };

    this.watch = function()  {
        var obj = selector.getSelectedObject();
        preview.enable(obj);
    };

    this.getTitle = function() {
        return  this.isBook() ? selector.getSelectedDto().title :
                this.isSection() ? selector.getSelectedObject().id :
                null;
    };

    this.edit = function() {
        bookEdit.show(selector.getSelectedDto());
    };

    this.delete = function() {
        var dto = selector.getSelectedDto();
        var confirmMsg;
        var successMsg;
        var errorMsg;
        var deleteFnc;

        if(selector.isSelectedBook()) {
            deleteFnc = tools.deleteBook;
            confirmMsg = DELETE_CONFIRM.replace('{0}', BOOK).replace('{1}', dto.title);
            successMsg = DELETE_SUCCESS.replace('{0}', BOOK).replace('{1}', dto.title);
            errorMsg = DELETE_ERROR.replace('{0}', BOOK).replace('{1}', dto.title);
        } else if(selector.isSelectedSection()) {
            deleteFnc = tools.deleteSection;
            confirmMsg = DELETE_CONFIRM.replace('{0}', SECTION).replace('{1}', dto.id);
            successMsg = DELETE_SUCCESS.replace('{0}', SECTION).replace('{1}', dto.id);
            errorMsg = DELETE_ERROR.replace('{0}', SECTION).replace('{1}', dto.id);
        }

        dialog.openConfirm(confirmMsg).then(function () {
            block.global.start();
            deleteFnc(dto.id).then(function () {
                growl.success(successMsg);
            }).catch(function () {
                growl.error(errorMsg);
            }).finally(function () {
                block.global.stop();
            });
        });
    };

    this.unwatch = preview.disable;
    this.isWatchActive = preview.isActive;

    this.rotateLeft = tools.rotateLeft;
    this.rotateRight = tools.rotateRight;
    this.stop = tools.stop;
});
angular.module('VirtualBookshelf')
.controller('TooltipCtrl', function (tooltip, BookObject) {
    this.isShow = function() {
        return tooltip.obj.type === BookObject.TYPE;
    };

    this.obj = tooltip.obj;
});
angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, mainMenu, selectLibrary, createLibrary, createSection, feedback, authorization, navigation, bookEdit, catalog) {
    $scope.mainMenu = mainMenu;

    $scope.selectLibrary = selectLibrary;
    $scope.createLibrary = createLibrary;
    $scope.createSection = createSection;
    $scope.feedback = feedback;
    $scope.authorization = authorization;

    $scope.bookEdit = bookEdit;
    $scope.catalog = catalog;

	$scope.navigation = {
		stop: navigation.goStop,
		forward: navigation.goForward,
		backward: navigation.goBackward,
		left: navigation.goLeft,
		right: navigation.goRight
	};
});
angular.module('VirtualBookshelf')
.controller('WelcomeCtrl', function (authorization, selectLibrary, createLibrary, environment, user) {
	var closed = false;

	this.isShowAuthorization = function() {
		return authorization.isShow();
	};
	
	this.isShowSelectLibrary = function() {
		return selectLibrary.isAvailable() && !selectLibrary.isUserLibrary(user.getId());
	};

	this.isShowCreateLibrary = function() {
		return !this.isShowAuthorization() && !selectLibrary.isAvailable();
	};

	this.isShow = function() {
		return !closed && (this.isShowAuthorization() || this.isShowCreateLibrary() || this.isShowSelectLibrary());
	};

	this.isLoaded = function() {
		return environment.getLoaded();
	};

	this.showLoginDialog = function() {
		authorization.show();
	};

	this.showSelectLibraryDialog = function() {
		selectLibrary.show();
	};

	this.showCreateLibraryDialog = function() {
		createLibrary.show();
	};

	this.close = function() {
		closed = true;
	};
});
angular.module('VirtualBookshelf')
.directive('vbSelect', function() {
	return {
		require: 'ngModel',
		restrict: 'E',
    	transclude: true,
		templateUrl: '/ui/select.ejs',
		scope: {
			options: '=',
			value: '@',
			label: '@'
		},

		link: function(scope, element, attrs, controller) {
			scope.select = function(item) {
				controller.$setViewValue(item[scope.value]);
			};

			scope.isSelected = function(item) {
				return controller.$modelValue === item[scope.value];
			};
		}
	};
});

angular.module('VirtualBookshelf')
.factory('archive', function (data) {
	var archive = {};

	archive.sendExternalURL = function(externalURL, tags) {
		return data.postCover(externalURL, tags);
	};

	return archive;
});
angular.module('VirtualBookshelf')
.factory('cache', function ($q, $log, data) {
	var cache = {};

	var library = null;
	var sections = {};
	var books = {};
	var images = {};

	cache.init = function(libraryModel, sectionModels, bookModels, covers) {
		var libraryLoad = loadLibraryData(libraryModel);
		var sectionsLoad = [];
		var booksLoad = [];
		var imagesLoad = [];
		var model, coverId; // iterators

		for (model in sectionModels) {
			sectionsLoad.push(addSection(model));
		}

		for (model in bookModels) {
			booksLoad.push(addBook(model));
		}

		for (coverId in covers) {
			imagesLoad.push(addImageByDto(covers[coverId]));
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

	cache.getImage = function(id) {
		return commonGetter(images, id, addImageById);
	};

	var addSection = function(model) {
		return commonAdder(sections, model, loadSectionData);
	};

	var addBook = function(model) {
		return commonAdder(books, model, loadBookData);
	};

	var addImageById = function(id) {
		return data.getCover(id).then(function (coverDto) {
			return data.loadImage(coverDto.url).then(function (image) {
				return addImage(coverDto, image);
			});
		}).catch(function () {
			$log.error('Error adding image by id:', id);
			return null;
		});
	};

	var addImageByDto = function(coverDto) {
		return data.loadImage(coverDto.url).then(function (image) {
			return addImage(coverDto, image);
		}).catch(function () {
			$log.error('Error adding image by dto:', coverDto.id);
			return null;
		});
	};

	var addImage = function(dto, image) {
		var loadedCache = {
			dto: dto,
			image: image
		};

		images[dto.id] = loadedCache;
		return loadedCache;
	};

	var commonGetter = function(from, key, addFunction) {
		var result = from[key];

		if(!result) {
			result = addFunction(key);
		}

		return $q.when(result);
	};

	var commonAdder = function(where, what, loader) {
		var promise = loader(what).then(function (loadedCache) {
			where[what] = loadedCache;

			return loadedCache;
		});

		return promise;
	};

	var loadLibraryData = function(model) {
		var path = '/obj/libraries/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.json';
        var mapUrl = path + 'map.jpg';

        var promise = $q.all({
        	geometry: data.loadGeometry(modelUrl), 
        	mapImage: data.loadImage(mapUrl)
        });

        return promise;
	};

	var loadSectionData = function(model) {
		var path = '/obj/sections/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';
        var dataUrl = path + 'data.json';

        var promise = $q.all({
        	geometry: data.loadGeometry(modelUrl), 
        	mapImage: data.loadImage(mapUrl), 
        	data: data.getData(dataUrl)
        });

        return promise;
	};

	var loadBookData = function(model) {
		var path = '/obj/books/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';
        var bumpMapUrl = path + 'bump_map.jpg';
        var specularMapUrl = path + 'specular_map.jpg';

        var promise = $q.all({
        	geometry: data.loadGeometry(modelUrl),
        	mapImage: data.loadImage(mapUrl).catch(function () {
        		$log.error('Cache: Error loading book map:', model);
        		return null;
        	}),
        	bumpMapImage: data.loadImage(bumpMapUrl).catch(function () {
        		$log.error('Cache: Error loading book bumpMap:', model);
        		return null;
        	}),
        	specularMapImage: data.loadImage(specularMapUrl).catch(function () {
        		$log.error('Cache: Error loading book specularMap:', model);
        		return null;
        	})
        });

        return promise;
	};

	return cache;
});
angular.module('VirtualBookshelf')
.factory('camera', function (CameraObject) {
	var camera = {
		HEIGTH: 1.5,
		object: new CameraObject(),
		setParent: function(parent) {
			parent.add(this.object);
		},
		getPosition: function() {
			return this.object.position;
		}
	};

	var init = function() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		
		camera.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
		camera.object.position = new THREE.Vector3(0, camera.HEIGTH, 0);
		camera.object.rotation.order = 'YXZ';

		var candle = new THREE.PointLight(0x665555, 1.6, 10);
		candle.position.set(0, 0, 0);
		camera.object.add(candle);

		camera.object.add(camera.camera);
	};

	camera.rotate = function(x, y) {
		var newX = this.object.rotation.x + y * 0.0001 || 0;
		var newY = this.object.rotation.y + x * 0.0001 || 0;

		if(newX < 1.57 && newX > -1.57) {	
			this.object.rotation.x = newX;
		}

		this.object.rotation.y = newY;
	};

	camera.go = function(speed) {
		var direction = this.getVector();
		var newPosition = this.object.position.clone();
		newPosition.add(direction.multiplyScalar(speed));

		this.object.move(newPosition);
	};

	camera.getVector = function() {
		var vector = new THREE.Vector3(0, 0, -1);

		return vector.applyEuler(this.object.rotation);
	};

	init();

	return camera;
});
angular.module('VirtualBookshelf')
/* 
 * controls.js is a service for processing not UI(menus) events 
 * like mouse, keyboard, touch or gestures.
 *
 * TODO: remove all busines logic from there and leave only
 * events functionality to make it more similar to usual controller
 */
.factory('controls', function ($q, $log, $rootScope, SelectorMeta, BookObject, ShelfObject, SectionObject, camera, navigation, environment, mouse, selector, preview, block, tools) {
	var controls = {};

	controls.init = function() {
		controls.initListeners();
	};

	controls.initListeners = function() {
		document.addEventListener('mousedown', controls.onMouseDown, false);
		document.addEventListener('mouseup', controls.onMouseUp, false);
		document.addEventListener('mousemove', controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;};
	};

	controls.update = function() {
		if(!preview.isActive()) {
			if(mouse[3]) {
				camera.rotate(mouse.longX, mouse.longY);
			}
			if(mouse[1] && mouse[3]) {
				camera.go(navigation.BUTTONS_GO_SPEED);
			}
		}
	};

	controls.onMouseDown = function(event) {
		mouse.down(event); 

		if(mouse.isCanvas() && mouse[1] && !mouse[3] && !preview.isActive()) {
			controls.selectObject();

			if(selector.placing) {
				tools.place();
			} else {
				selector.selectFocused();
			}

			$rootScope.$apply();
		}
	};

	controls.onMouseUp = function(event) {
		mouse.up(event);
		
		if(event.which === 1 && !preview.isActive()) {
			if(selector.isSelectedEditable()) {
				var obj = selector.getSelectedObject();

				if(obj && obj.changed) {
					block.global.start();
					obj.save().catch(function () {
						obj.rollback();
					}).finally(function () {
						block.global.stop();
					});
				}
			}
		}
	};

	controls.onMouseMove = function(event) {
		mouse.move(event);

		if(mouse.isCanvas() && !preview.isActive()) {
			event.preventDefault();

			if(mouse[1] && !mouse[3]) {		
				controls.moveObject();
			} else {
				controls.selectObject();
				$rootScope.$apply();
			}
		}
	};

	//****

	controls.selectObject = function() {
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

	controls.moveObject = function() {
		var mouseVector;
		var newPosition;
		var parent;
		var selectedObject;

		if(selector.isSelectedEditable()) {
			selectedObject = selector.getSelectedObject();

			if(selectedObject) {
				mouseVector = camera.getVector();	
				newPosition = selectedObject.position.clone();
				parent = selectedObject.parent;
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				selectedObject.move(newPosition);
			}
		}
	};

	return controls;	
});
angular.module('VirtualBookshelf')
.factory('data', function ($http, $q, $log) {
	var data = {};

	data.TEXTURE_RESOLUTION = 512;
	data.COVER_MAX_Y = 394;
	data.COVER_FACE_X = 296;

    data.loadImage = function(url) {
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

	data.getCover = function(id) {
		return $http.get('/cover/' + id).then(function (res) {
			return res.data;
		});
	};

    data.postCover = function(externalURL, tags) {
    	var data = {
    		url: externalURL,
    		tags: tags
    	};

    	return $http.post('/cover', data).then(function (res) {
    		return res.data;
    	});
    };

    data.logout = function() {
    	return $http.post('/auth/logout');
    };

	data.getUser = function() {
		return $http.get('/user').then(function (res) {
			return res.data;
		}).catch(function () {
			return null;
		});
	};

	data.putUser = function(dto) {
		return $http.put('/user', dto);
	};

	data.deleteUser = function(id) {
		return $http.delete('/user/' + id);
	};

	data.getUserBooks = function(userId) {
		return $http.get('/freeBooks/' + userId).then(function (res) {
			return res.data;
		});
	};

	data.postBook = function(book) {
		return $http.post('/book', book).then(function (res) {
			return res.data;
		});
	};

	data.deleteBook = function(id) {
		return $http({
			method: 'DELETE',
			url: '/book/' + id
		});
	};

	data.getUIData = function() {
		return $http.get('/obj/data.json');
	};

	data.getLibraries = function() {
		return $http.get('/libraries').then(function (res) {
			return res.data;
		});
	};

	data.getLibrary = function(libraryId) {
		return $http.get('/library/' + libraryId).then(function (res) {
			return res.data;
		});
	};

	data.postLibrary = function(libraryModel) {
        return $http.post('/library/' + libraryModel).then(function (res) {
            return res.data;
        });
	};

	data.getSections = function(libraryId) {
        return $http.get('/sections/' + libraryId).then(function (res) {
            return res.data;
        });
	};

	data.postSection = function(sectionData) {
        return $http.post('/section', sectionData).then(function (res) {
        	return res.data;
        });
	};

	data.deleteSection = function(id) {
		return $http({
			method: 'DELETE',
			url: '/sections/' + id
		});
	};

	data.loadGeometry = function(link) {
        var deffered = $q.defer();
		var jsonLoader = new THREE.JSONLoader();

        //TODO: found no way to reject
		jsonLoader.load(link, function (geometry) {
			geometry.computeBoundingBox();
			deffered.resolve(geometry);
		});

        return deffered.promise;
	};

	data.getData = function(url) {
        return $http.get(url).then(function (res) {
            return res.data;
        });
	};

	data.postFeedback = function(dto) {
        return $http.post('/feedback', dto);
	};

	data.common = data.getUIData().then(function (res) {
		return res.data;
	}).catch(function () {
		$log.error('data: loading common error');
	});

	return data;
});
angular.module('VirtualBookshelf')
.factory('dialog', function (ngDialog) {
	var dialog = {};

	var TEMPLATE = 'confirmDialog';
	var ERROR = 1;
	var CONFIRM = 2;
	var WARNING = 3;
	var INFO = 4;

	var iconClassMap = {};
	iconClassMap[ERROR] = 'fa-times-circle';
	iconClassMap[CONFIRM] = 'fa-question-circle';
	iconClassMap[WARNING] = 'fa-exclamation-triangle';
	iconClassMap[INFO] = 'fa-info-circle';

	dialog.openError = function(msg) {
		return openDialog(msg, ERROR);
	};

	dialog.openConfirm = function(msg) {
		return openDialog(msg, CONFIRM, true);
	};

	dialog.openWarning = function(msg) {
		return openDialog(msg, WARNING);
	};

	dialog.openInfo = function(msg) {
		return openDialog(msg, INFO);
	};

	var openDialog = function(msg, type, cancelButton) {
		return ngDialog.openConfirm({
			template: TEMPLATE,
			data: {
				msg: msg,
				iconClass: getIconClass(type),
				cancelButton: cancelButton
			}
		});
	};

	var getIconClass = function(type) {
		return iconClassMap[type];
	};

	return dialog;
});
angular.module('VirtualBookshelf')
.factory('environment', function ($q, $log, $window, LibraryObject, SectionObject, BookObject, BookMaterial, data, camera, cache) {
	var environment = {};

	environment.CLEARANCE = 0.001;
	environment.LIBRARY_CANVAS_ID = 'LIBRARY';
	 
	var libraryDto = null;
	var sections = {};
	var books = {};
	var loaded = false;

	environment.scene = null;
	environment.library = null;

	environment.loadLibrary = function(libraryId) {
		clearScene(); // inits some fields

		var promise = data.getLibrary(libraryId).then(function (dto) {
			var dict = parseLibraryDto(dto);
			
			sections = dict.sections;
			books = dict.books;
			libraryDto = dto;

			return initCache(libraryDto, dict.sections, dict.books);
		}).then(function () {
			createLibrary(libraryDto);
			return createSections(sections);
		}).then(function () {
			return createBooks(books);
		});

		return promise;
	};

	environment.goToLibrary = function(id) {
		if(id) $window.location = '/' + id;
	};

	environment.setLoaded = function(value) {
		loaded = value;
	};

	environment.getLoaded = function() {
		return loaded;
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

	environment.updateSection = function(dto) {
		var promise;

		if(dto.libraryId == environment.library.id) {
			environment.removeSection(dto.id);
			promise = createSection(dto);
		} else {
			environment.removeSection(dto.id);
			promise = $q.when(dto);
		}

		return promise;	
	};

	environment.updateBook = function(dto) {
		var promise;
		var shelf = getBookShelf(dto);

		if(shelf) {
			environment.removeBook(dto.id);
			promise = createBook(dto);
		} else {
			environment.removeBook(dto.id);
			promise = $q.when(true);
		}

		return promise;
	};

	environment.removeBook = function(id) {
		removeObject(books, id);
	};

	environment.removeSection = function(id) {
		removeObject(sections, id);
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
				imageUrls[bookDto.cover.id] = bookDto.cover;
			}
		}

		return cache.init(libraryModel, sectionModels, bookModels, imageUrls);
	};

	var clearScene = function() {
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
		camera.setParent(library);

		environment.scene.add(library);
		environment.library = library;
	};

	var createSections = function(sectionsDict) {
		return createObjects(sectionsDict, createSection);
	};

	var createBooks = function(booksDict) {
		return createObjects(booksDict, createBook);
	};

	var createObjects = function(dict, factory) {
		var results = [];
		var key;

		for(key in dict) {
			results.push(factory(dict[key].dto));
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

			return sectionDto;
		});

		return promise;
	};

	var createBook = function(bookDto) {
		var promises = {};
		var promise;

		promises.bookCache = cache.getBook(bookDto.model);
		if(bookDto.coverId) {
			promises.coverCache = cache.getImage(bookDto.coverId);
		}

		promise = $q.all(promises).then(function (results) {
			var bookCache = results.bookCache;
			var coverMapImage = results.coverCache && results.coverCache.image;
			var material = new BookMaterial(bookCache.mapImage, bookCache.bumpMapImage, bookCache.specularMapImage, coverMapImage);
			var book = new BookObject(bookDto, bookCache.geometry, material);

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
.factory('main', function ($log, $q, camera, controls, user, environment, tools, navigation, userData, block, locator) {	
	var canvas;
	var renderer;
	
	var main = {};

	main.start = function() {
		if(Detector.webgl) {
			init();
			controls.init();

			startRenderLoop();

			block.global.start();
			user.load().then(function () {
				return $q.all([environment.loadLibrary(user.getLibrary() || 1), userData.load()]);
			}).catch(function (error) {
				$log.error(error);
				//TODO: show error message  
			}).finally(function () {
				locator.centerObject(camera.object);
				environment.setLoaded(true);
				block.global.stop();
			});		
		} else {
			// Detector.addGetWebGLMessage();
		}
	};

	var init = function() {
		var winResize;
		var width = window.innerWidth;
		var height = window.innerHeight;

		canvas = document.getElementById(environment.LIBRARY_CANVAS_ID);
		renderer = new THREE.WebGLRenderer({canvas: canvas ? canvas : undefined, antialias: true});
		renderer.setSize(width, height);
		winResize = new THREEx.WindowResize(renderer, camera.camera);

		environment.scene = new THREE.Scene();
		environment.scene.fog = new THREE.Fog(0x000000, 4, 7);
	};

	var startRenderLoop = function() {
		requestAnimationFrame(startRenderLoop);

		controls.update();
		navigation.update();
		tools.update();
		
		renderer.render(environment.scene, camera.camera);
	};

	return main;
});
angular.module('VirtualBookshelf')
.factory('mouse', function (camera, environment) {
	var mouse = {};

	var getWidth = function() {
		return window.innerWidth;
	};

	var getHeight = function() {
		return window.innerHeight;
	};

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
			x = event.clientX;
			y = event.clientY;
			mouse.longX = getWidth() * 0.5 - x;
			mouse.longY = getHeight() * 0.5 - y;
		}
	};

	mouse.up = function(event) {
		if(event) {
			this[event.which] = false;
			// linux chrome bug fix (when both keys release then both event.which equal 3)
			this[1] = false; 
		}
	};

	mouse.move = function(event) {
		if(event) {
			this.target = event.target;
			mouse.longX = getWidth() * 0.5 - x;
			mouse.longY = getHeight() * 0.5 - y;
			mouse.dX = event.clientX - x;
			mouse.dY = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
		}
	};

	mouse.isCanvas = function() {
		return this.target.id === environment.LIBRARY_CANVAS_ID;
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
		raycaster = new THREE.Raycaster(camera.getPosition(), vector);
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
		var vector = new THREE.Vector3((x / getWidth()) * 2 - 1, - (y / getHeight()) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera.camera);
	
		return vector.sub(camera.getPosition()).normalize();
	};

	return mouse;
});
angular.module('VirtualBookshelf')
.factory('navigation', function (camera) {
	var navigation = {};

	navigation.BUTTONS_ROTATE_SPEED = 100;
	navigation.BUTTONS_GO_SPEED = 0.02;

	var state = {
		forward: false,
		backward: false,
		left: false,
		right: false			
	};

	navigation.goStop = function() {
		state.forward = false;
		state.backward = false;
		state.left = false;
		state.right = false;
	};

	navigation.goForward = function() {
		state.forward = true;
	};

	navigation.goBackward = function() {
		state.backward = true;
	};

	navigation.goLeft = function() {
		state.left = true;
	};

	navigation.goRight = function() {
		state.right = true;
	};

	navigation.update = function() {
		if(state.forward) {
			camera.go(navigation.BUTTONS_GO_SPEED);
		} else if(state.backward) {
			camera.go(-navigation.BUTTONS_GO_SPEED);
		} else if(state.left) {
			camera.rotate(navigation.BUTTONS_ROTATE_SPEED, 0);
		} else if(state.right) {
			camera.rotate(-navigation.BUTTONS_ROTATE_SPEED, 0);
		}
	};

	return navigation;
});
angular.module('VirtualBookshelf')
.factory('user', function (data) {
	var user = {};

	var loaded = false;
	var _dataObject = null;
	var library = null;

	user.load = function() {
		var scope = this;

		return data.getUser().then(function (dto) {
			scope.setDataObject(dto);
			scope.setLibrary();
			loaded = true;
		});
	};

	user.logout = function() {
		return data.logout().then(function () {
			return user.load();
		});
	};

	user.setDataObject = function(dataObject) {
		_dataObject = dataObject;
	};

	user.getLibrary = function() {
		return library;
	};

	user.getName = function() {
		return _dataObject && _dataObject.name;
	};

	user.getEmail = function() {
		return _dataObject && _dataObject.email;
	};

	user.setLibrary = function(libraryId) {
		libraryId = libraryId || window.location.pathname.substring(1);
		library = Number(libraryId);
	};

	user.getId = function() {
		return _dataObject && _dataObject.id;
	};

	user.isAuthorized = function() {
		return _dataObject && !user.isTemporary();
	};

	user.isLoaded = function() {
		return loaded;
	};

	user.isTemporary = function() {
		return Boolean(_dataObject && _dataObject.temporary);
	};

	user.isGoogle = function() {
		return Boolean(_dataObject && _dataObject.googleId);
	};

	user.isTwitter = function() {
		return Boolean(_dataObject && _dataObject.twitterId);
	};

	user.isFacebook = function() {
		return Boolean(_dataObject && _dataObject.facebookId);
	};

	user.isVkontakte = function() {
		return Boolean(_dataObject && _dataObject.vkontakteId);
	};

	return user;
});

angular.module('VirtualBookshelf')
.factory('BookMaterial', function () {
	var BookMaterial = function(mapImage, bumpMapImage, specularMapImage, coverMapImage) {
		var defines = {};
		var uniforms;
		var parameters;

        var map;
        var bumpMap;
        var specularMap;
        var coverMap;
		
		uniforms = THREE.UniformsUtils.merge([
			THREE.UniformsLib.common,
			THREE.UniformsLib.bump,
			THREE.UniformsLib.fog,
			THREE.UniformsLib.lights
		]);

		uniforms.shininess = {type: 'f', value: 30};
		defines.PHONG = true;

		if(mapImage) {
			map = new THREE.Texture(mapImage);
			map.needsUpdate = true;
			uniforms.map = {type: 't', value: map};
			this.map = true;
		}
		if(bumpMapImage) {
			bumpMap = new THREE.Texture(bumpMapImage);
			bumpMap.needsUpdate = true;
			uniforms.bumpMap = {type: 't', value: bumpMap};
			uniforms.bumpScale.value = 0.005;
			this.bumpMap = true;
		}
		if(specularMapImage) {
			specularMap = new THREE.Texture(specularMapImage);
			specularMap.needsUpdate = true;
			uniforms.specular = {type: 'c', value: new THREE.Color(0x555555)};
			uniforms.specularMap = {type: 't', value: specularMap};
			this.specularMap = true;
		}
        if(coverMapImage) {
			coverMap = new THREE.Texture(coverMapImage);
			coverMap.needsUpdate = true;
			uniforms.coverMap = {type: 't', value: coverMap};
			defines.USE_COVER = true;
        }

		parameters = {
			vertexShader: vertexShader,	
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			defines: defines,
			lights: true,
			fog: true
		};

		THREE.ShaderMaterial.call(this, parameters);
	};

	BookMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

	BookMaterial.prototype.constructor = THREE.BookMaterial;

	var vertexShader = [
		'varying vec3 vViewPosition;',
		'varying vec3 vNormal;',

		THREE.ShaderChunk.map_pars_vertex,
		THREE.ShaderChunk.lights_phong_pars_vertex,
		THREE.ShaderChunk.color_pars_vertex,

		'void main() {',
			THREE.ShaderChunk.map_vertex,
			THREE.ShaderChunk.color_vertex,
			THREE.ShaderChunk.defaultnormal_vertex,
			'vNormal = normalize(transformedNormal);',
			THREE.ShaderChunk.default_vertex,
			'vViewPosition = -mvPosition.xyz;',
			THREE.ShaderChunk.worldpos_vertex,
			THREE.ShaderChunk.lights_phong_vertex,
		'}'
	].join('\n');

	var fragmentShader = [
		'uniform vec3 diffuse;',
		'uniform float opacity;',

		'uniform vec3 ambient;',
		'uniform vec3 emissive;',
		'uniform vec3 specular;',
		'uniform float shininess;',

		'uniform sampler2D coverMap;',

		THREE.ShaderChunk.color_pars_fragment,
		THREE.ShaderChunk.map_pars_fragment,
		THREE.ShaderChunk.fog_pars_fragment,
		THREE.ShaderChunk.lights_phong_pars_fragment,
		THREE.ShaderChunk.bumpmap_pars_fragment,
		THREE.ShaderChunk.specularmap_pars_fragment,

		'void main() {',
			'vec4 testcolor = vec4(1.0, 1.0, 1.0, 1.0);',
			'float eps = 0.004;',
			'vec4 baseColor  = texture2D(map, vUv);',

			'#ifdef USE_COVER',
		    	'vec4 coverColor = texture2D(coverMap, vUv * vec2(2.3, 1.3) - vec2(1.3, 0.3));',
			    'if(vUv.y > 0.23 && (vUv.x > 0.57 || (all(greaterThanEqual(baseColor,testcolor-eps)) && all(lessThanEqual(baseColor,testcolor+eps)))))',
			    	'gl_FragColor = coverColor;',
			    'else',
			    	'gl_FragColor = baseColor;',
			'#else',
		    	'gl_FragColor = baseColor;',
			'#endif',

			THREE.ShaderChunk.specularmap_fragment,
			THREE.ShaderChunk.lights_phong_fragment,
			THREE.ShaderChunk.color_fragment,
			THREE.ShaderChunk.fog_fragment,
		'}'		
	].join('\n');

	return BookMaterial;
});
angular.module('VirtualBookshelf')
.factory('BaseObject', function (subclassOf) {
	var BaseObject = function(dataObject, geometry, material) {
		THREE.Mesh.call(this, geometry, material);

		this.dataObject = dataObject || {};
		
		this.id = this.dataObject.id;
		this.rotation.order = 'XYZ';

		this.setDtoTransformations();
	};
	
	BaseObject.prototype = subclassOf(THREE.Mesh);

	BaseObject.prototype.getType = function() {
		return this.type;
	};

	BaseObject.prototype.setDtoTransformations = function() {
		this.position = new THREE.Vector3(this.dataObject.pos_x, this.dataObject.pos_y, this.dataObject.pos_z);
		if(this.dataObject.rotation) this.rotation.fromArray(this.dataObject.rotation.map(Number));

		this.updateBoundingBox();		
	};

	BaseObject.prototype.isOutOfParrent = function() {
		return Math.abs(this.boundingBox.center.x - this.parent.boundingBox.center.x) > (this.parent.boundingBox.radius.x - this.boundingBox.radius.x) ||
				Math.abs(this.boundingBox.center.z - this.parent.boundingBox.center.z) > (this.parent.boundingBox.radius.z - this.boundingBox.radius.z);
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

				if(targets[i] === this ||
					!target || // children without BB
					(Math.abs(this.boundingBox.center.x - target.center.x) > (this.boundingBox.radius.x + target.radius.x)) ||
					(Math.abs(this.boundingBox.center.y - target.center.y) > (this.boundingBox.radius.y + target.radius.y)) ||
					(Math.abs(this.boundingBox.center.z - target.center.z) > (this.boundingBox.radius.z + target.radius.z))) {	
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

		center = new THREE.Vector3();
		center.addVectors(boundingBox.min, boundingBox.max);
		center.multiplyScalar(0.5);

		this.boundingBox = {
			radius: radius,
			center: center
		};
	};

	BaseObject.prototype.rollback = function() {
		this.setDtoTransformations();
	};

	return BaseObject;	
});
angular.module('VirtualBookshelf')
.factory('BookObject', function ($log, BaseObject, data, subclassOf) {	
	var BookObject = function(dataObject, geometry, material) {
		BaseObject.call(this, dataObject, geometry, material);
	};

	BookObject.TYPE = 'BookObject';

	BookObject.prototype = subclassOf(BaseObject);
	BookObject.prototype.type = BookObject.TYPE;

	BookObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.dataObject.id,
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z
		};

		return data.postBook(dto).then(function (responseDto) {
			scope.dataObject = responseDto;
			scope.changed = false;
		});
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
.factory('CameraObject', function (BaseObject, subclassOf) {
	var CameraObject = function() {
		var geometry = new THREE.Geometry();
		geometry.boundingBox = new THREE.Box3(new THREE.Vector3(-0.1, -1, -0.1), new THREE.Vector3(0.1, 1, 0.1));

		BaseObject.call(this, null, geometry);
	};

	CameraObject.prototype = subclassOf(BaseObject);
	
	CameraObject.prototype.updateBoundingBox = function() {
		var radius = {
			x: this.geometry.boundingBox.max.x, 
			y: this.geometry.boundingBox.max.y, 
			z: this.geometry.boundingBox.max.z
		};

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	};

	return CameraObject;
});
angular.module('VirtualBookshelf')
.factory('LibraryObject', function (BaseObject, subclassOf) {
	var LibraryObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);
	};

	LibraryObject.prototype = subclassOf(BaseObject);

	return LibraryObject;	
});
angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, data, subclassOf) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(var key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
	};

	SectionObject.TYPE = 'SectionObject';

	SectionObject.prototype = subclassOf(BaseObject);
	SectionObject.prototype.type = SectionObject.TYPE;

	SectionObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.dataObject.id,
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z,
			rotation: [this.rotation.x, this.rotation.y, this.rotation.z]
		};

		return data.postSection(dto).then(function (responseDto) {
			scope.dataObject = responseDto;
			scope.changed = false;
		});
	};

	SectionObject.prototype.setParent = function(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.libraryId = parent.id;
			} else {
				this.parent.remove(this);
				this.dataObject.libraryId = null;
			}
		}
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
		return !(!meta || 
				meta.id !== this.id || 
				meta.parentId !== this.parentId || 
				meta.type !== this.type);
	};
	
	return SelectorMeta;
});
angular.module('VirtualBookshelf')
.factory('SelectorMetaDto', function (SelectorMeta, subclassOf) {
	var SelectorMetaDto = function(type, id, parentId) {
		this.type = type;
		this.id = id;
		this.parentId = parentId;
	};
	
	SelectorMetaDto.prototype = subclassOf(SelectorMeta);

	return SelectorMetaDto;
});
angular.module('VirtualBookshelf')
.factory('ShelfObject', function (BaseObject, subclassOf) {
	var ShelfObject = function(params) {
		var size = params.size;	
		var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);

		geometry.computeBoundingBox();
		BaseObject.call(this, params, geometry);

		this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		this.visible = false;
	};

	ShelfObject.TYPE = 'ShelfObject';

	ShelfObject.prototype = subclassOf(BaseObject);
	ShelfObject.prototype.type = ShelfObject.TYPE;

	return ShelfObject;
});
angular.module('VirtualBookshelf')
.factory('subclassOf', function () {
	function _subclassOf() {}

	function subclassOf(base) {
	    _subclassOf.prototype = base.prototype;
	    return new _subclassOf();
	}

	return subclassOf;
});
angular.module('VirtualBookshelf')
.factory('gridCalculator', function () {
	var gridCalculator = {};

	gridCalculator.getEdges = function(spaceBB, precision) {
		var posMin = this.posToCell(spaceBB.min, precision);
		var posMax = this.posToCell(spaceBB.max, precision);
		
		return {
			minXCell: posMin.x + 1,
			maxXCell: posMax.x - 1,
			minZCell: posMin.z + 1,
			maxZCell: posMax.z - 1
		};
	};

	gridCalculator.posToCell = function(pos, precision) {
		return pos.clone().divide(precision).round();
	};

	gridCalculator.cellToPos = function(cell, precision) {
		return cell.clone().multiply(precision);
	};

	return gridCalculator;
});
angular.module('VirtualBookshelf')
.factory('highlight', function (environment) {
	var highlight = {};

	var PLANE_ROTATION = Math.PI * 0.5;
	var PLANE_MULTIPLIER = 2;
	var COLOR_SELECT = 0x005533;
	var COLOR_FOCUS = 0x003355;

	var select;
	var focus;

	var init = function() {
		var materialProperties = {
			map: new THREE.ImageUtils.loadTexture( 'img/glow.png' ),
			transparent: true, 
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			depthTest: false
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
	};

	highlight.enable = function(enable) {
		focus.visible = select.visible = enable;
	};

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
.factory('locator', function ($q, $log, BaseObject, data, selector, environment, cache, gridCalculator) {
	var locator = {};

	var debugEnabled = false;

	locator.centerObject = function(obj) {
		var targetBB = obj.geometry.boundingBox;
		var spaceBB = environment.library.geometry.boundingBox;

		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
		var occupiedMatrix = getOccupiedMatrix(environment.library.children, matrixPrecision, obj);
		var freePosition = getFreeMatrix(occupiedMatrix, spaceBB, targetBB, matrixPrecision);		

		obj.position.setX(freePosition.x);
		obj.position.setZ(freePosition.z);
	};

	locator.placeSection = function(sectionDto) {
		var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
			var sectionBB = sectionCache.geometry.boundingBox;
			var libraryBB = environment.library.geometry.boundingBox;
			var freePlace = getFreePlace(environment.library.children, libraryBB, sectionBB);

			return freePlace ?
				saveSection(sectionDto, freePlace) :
				$q.reject('there is no free space');
		}).then(function (newDto) {
			return environment.updateSection(newDto);
		});

		return promise;
	};

	var saveSection = function(dto, position) {
		dto.libraryId = environment.library.id;
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postSection(dto);
	};

	locator.placeBook = function(bookDto, shelf) {
		var promise = cache.getBook(bookDto.model).then(function (bookCache) {
			var shelfBB = shelf.geometry.boundingBox;
			var bookBB = bookCache.geometry.boundingBox;
			var freePlace = getFreePlace(shelf.children, shelfBB, bookBB);

			return freePlace ? 
				saveBook(bookDto, freePlace, shelf) : 
				$q.reject('there is no free space');
		}).then(function (newDto) {
			return environment.updateBook(newDto);
		});

		return promise;
	};

	var saveBook = function(dto, position, shelf) {
		dto.shelfId = shelf.id;
		dto.sectionId = shelf.parent.id;
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return data.postBook(dto);
	};

	locator.unplaceBook = function(bookDto) {
		var promise;
		bookDto.sectionId = null;

		promise = data.postBook(bookDto).then(function () {
			return environment.updateBook(bookDto);
		});

		return promise;
	};

	var getFreePlace = function(objects, spaceBB, targetBB) {
		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x + 0.01, 0, targetBB.max.z - targetBB.min.z + 0.01);
		var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
		var freePosition = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);
		
		if (debugEnabled) {
			debugShowFree(freePosition, matrixPrecision, environment.library);
		}

		return freePosition;
	};

	var getFreeMatrix = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var DISTANCE = 1.3;

		var xIndex;
		var zIndex;
		var position = {};
		var minPosition = {};
		var edges = gridCalculator.getEdges(spaceBB, matrixPrecision);

		for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
			for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
				if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
					position.pos = getPositionFromCells([xIndex], zIndex, matrixPrecision, spaceBB, targetBB);
					position.length = position.pos.length();

					if(!minPosition.pos || position.length < minPosition.length) {
						minPosition.pos = position.pos;
						minPosition.length = position.length;
					}

					if(minPosition.pos && minPosition.length < DISTANCE) {
						return minPosition.pos;
					}
				}
			}
		}

		return minPosition.pos;
	};

	var getFreeMatrixCells = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var targetCellsSize = 1;
		var freeCellsCount = 0;
		var freeCellsStart;
		var xIndex;
		var zIndex;
		var cells;
		var edges = gridCalculator.getEdges(spaceBB, matrixPrecision);

		for (zIndex = edges.minZCell; zIndex <= edges.maxZCell; zIndex++) {
			for (xIndex = edges.minXCell; xIndex <= edges.maxXCell; xIndex++) {
				if (!occupiedMatrix[zIndex] || !occupiedMatrix[zIndex][xIndex]) {
					freeCellsStart = freeCellsStart || xIndex;
					freeCellsCount++;

					if (freeCellsCount === targetCellsSize) {
						cells = _.range(freeCellsStart, freeCellsStart + freeCellsCount);
						return getPositionFromCells(cells, zIndex, matrixPrecision, spaceBB, targetBB);
					}
				} else {
					freeCellsCount = 0;
				}
			}
		}

		return null;
	};

	var getPositionFromCells = function(cells, zIndex, matrixPrecision, spaceBB, targetBB) {
		var center = gridCalculator.cellToPos(new THREE.Vector3(cells[0], 0, zIndex), matrixPrecision);

		var offset = new THREE.Vector3();
		offset.addVectors(targetBB.min, targetBB.max);
		offset.multiplyScalar(-0.5);

		return center.add(offset).setY(getBottomY(spaceBB, targetBB));
	};

	var getBottomY = function(spaceBB, targetBB) {
		return spaceBB.min.y - targetBB.min.y + environment.CLEARANCE;
	};

	var getOccupiedMatrix = function(objects, matrixPrecision, obj) {
		var result = {};
		var objectBB;
		var minKeyX;
		var maxKeyX;
		var minKeyZ;
		var maxKeyZ;		
		var z, x;

		objects.forEach(function (child) {
			if(child instanceof BaseObject && child !== obj) {
				objectBB = child.boundingBox;

				minKeyX = Math.round((objectBB.center.x - objectBB.radius.x) / matrixPrecision.x);
				maxKeyX = Math.round((objectBB.center.x + objectBB.radius.x) / matrixPrecision.x);
				minKeyZ = Math.round((objectBB.center.z - objectBB.radius.z) / matrixPrecision.z);
				maxKeyZ = Math.round((objectBB.center.z + objectBB.radius.z) / matrixPrecision.z);

				for(z = minKeyZ; z <= maxKeyZ; z++) {
					result[z] = result[z] || {};
					var debugCells = [];

					for(x = minKeyX; x <= maxKeyX; x++) {
						result[z][x] = true;
						debugCells.push(x);
					}

					if(debugEnabled) {
						debugShowBB(child);
						debugAddOccupied(debugCells, matrixPrecision, child, z);
					}
				}
			}
		});

		return result;
	};

	locator.debug = function() {
		cache.getSection('bookshelf_0001').then(function (sectionCache) {
			debugEnabled = true;
			var sectionBB = sectionCache.geometry.boundingBox;
			var libraryBB = environment.library.geometry.boundingBox;
			getFreePlace(environment.library.children, libraryBB, sectionBB);
			debugEnabled = false;
		});
	};

	var debugShowBB = function(obj) {
		var objectBB = obj.boundingBox;
		var objBox = new THREE.Mesh(
			new THREE.BoxGeometry(
				objectBB.radius.x * 2, 
				objectBB.radius.y * 2 + 0.1, 
				objectBB.radius.z * 2
			), 
			new THREE.MeshLambertMaterial({
				color: 0xbbbbff,
				opacity: 0.2,
				transparent: true
			})
		);
		
		objBox.position.x = objectBB.center.x;
		objBox.position.y = objectBB.center.y;
		objBox.position.z = objectBB.center.z;

		obj.parent.add(objBox);
	};

	var debugAddOccupied = function(cells, matrixPrecision, obj, zKey) {
		cells.forEach(function (cell) {
			var pos = getPositionFromCells([cell], zKey, matrixPrecision, obj.parent.geometry.boundingBox, obj.geometry.boundingBox);
			var cellBox = new THREE.Mesh(new THREE.BoxGeometry(matrixPrecision.x - 0.01, 0.01, matrixPrecision.z - 0.01), new THREE.MeshLambertMaterial({color: 0xff0000}));
			
			cellBox.position = pos;
			obj.parent.add(cellBox);
		});
	};

	var debugShowFree = function(position, matrixPrecision, obj) {
		if (position) {
			var cellBox = new THREE.Mesh(new THREE.BoxGeometry(matrixPrecision.x, 0.5, matrixPrecision.z), new THREE.MeshLambertMaterial({color: 0x00ff00}));
			cellBox.position = position;
			obj.parent.add(cellBox);
		}
	};

	return locator;	
});
angular.module('VirtualBookshelf')
.factory('preview', function (camera, highlight) {
	var preview = {};

	var active = false;
	var container;

	var init = function() {
		container = new THREE.Object3D();
		container.position.set(0, 0, -0.5);
		container.rotation.y = -2;
		camera.camera.add(container);
	};

	var activate = function(value) {
		active = value;
		highlight.enable(!active);
	};

	preview.isActive = function() {
		return active;
	};

	preview.enable = function(obj) {
		var objClone;

		if(obj) {
			activate(true);

			objClone = obj.clone();
			objClone.position.set(0, 0, 0);
			container.add(objClone);
		}
	};

	preview.disable = function () {
		clearContainer();
		activate(false);
	};

	var clearContainer = function() {
		container.children.forEach(function (child) {
			container.remove(child);
		});
	};

	preview.rotate = function(dX) {
		container.rotation.y += dX ? dX * 0.05 : 0;
	};

	init();

	return preview;
});
angular.module('VirtualBookshelf')
.factory('selector', function (SelectorMeta, BookObject, ShelfObject, SectionObject, environment, highlight, preview, tooltip, catalog) {
	var selector = {};
	
	var selected = new SelectorMeta();
	var focused = new SelectorMeta();

	selector.placing = false;

	selector.focus = function(meta) {
		var obj;

		if(!meta.equals(focused)) {
			focused = meta;

			if(!focused.isEmpty()) {
				obj = selector.getFocusedObject();
				highlight.focus(obj);
			}

			tooltip.set(obj);
		}
	};

	selector.selectFocused = function() {
		selector.select(focused);
	};

	selector.select = function(meta) {
		var obj = getObject(meta);
		
		selector.unselect();
		selected = meta;

		highlight.select(obj);
		highlight.focus(null);

		selector.placing = false;
	};

	selector.unselect = function() {
		if(!selected.isEmpty()) {
			highlight.select(null);
			selected = new SelectorMeta();
		}

		preview.disable();
	};

	selector.getSelectedDto = function() {
		return selector.isSelectedBook() ? catalog.getBook(selected.id) : 
			selector.isSelectedSection() ? environment.getSection(selected.id) :
			null;
	};

	selector.getSelectedObject = function() {
		return getObject(selected);
	};

	selector.getFocusedObject = function() {
		return getObject(focused);
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

	selector.isSelectedEditable = function() {
		return selector.isSelectedBook() || selector.isSelectedSection();
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
angular.module('VirtualBookshelf')
.factory('authorization', function ($log, $q, $window, $interval, user, environment, registration, userData, block, ngDialog) {
	var authorization = {};

	var TEMPLATE = 'loginDialog';

	authorization.show = function() {
		ngDialog.open({template: TEMPLATE});
	};

	authorization.isShow = function() {
		return !user.isAuthorized() && user.isLoaded();
	};

	var login = function(link) {
		block.global.start();
		var win = $window.open(link, '', 'width=800,height=600,modal=yes,alwaysRaised=yes');
	    var checkAuthWindow = $interval(function () {
	        if (win && win.closed) {
	        	$interval.cancel(checkAuthWindow);

	        	environment.setLoaded(false);
	        	user.load().then(function () {
	        		return user.isTemporary() ? registration.show() : userData.load();
	        	}).finally(function () {
	        		environment.setLoaded(true);
	        		block.global.stop();
	        	}).catch(function () {
	        		$log.log('User loadind error');
					//TODO: show error message  
	        	});
	        }
	    }, 100);
	};

	authorization.google = function() {
		login('/auth/google');
	};

	authorization.twitter = function() {
		login('/auth/twitter');
	};

	authorization.facebook = function() {
		login('/auth/facebook');
	};

	authorization.vkontakte = function() {
		login('/auth/vkontakte');
	};

	authorization.logout = function() {
    	environment.setLoaded(false);
		user.logout().finally(function () {
    		return userData.load();
		}).finally(function () {
        	environment.setLoaded(true);
		}).catch(function () {
			$log.error('Logout error');
			//TODO: show an error
		});
	};
	
	return authorization;
});
angular.module('VirtualBookshelf')
.factory('block', function (blockUI) {
	var block = {};

	var INVENTORY = 'inventory';
	var MAIN_MENU = 'main_menu';
	var GLOBAL = 'global';

	block.inventory = blockUI.instances.get(INVENTORY);
	
	block.mainMenu = blockUI.instances.get(MAIN_MENU);

	block.global = blockUI.instances.get(GLOBAL);

	return block;
});
angular.module('VirtualBookshelf')
.factory('bookEdit', function ($log, data, environment, block, dialog, archive, catalog, selector, user, ngDialog) {
	var bookEdit = {};
	var bookDialog;

	var BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	var TEMPLATE = 'editBookDialog';
	
	bookEdit.book = {};

	bookEdit.show = function(book) {
		setBook(book);
		bookDialog = ngDialog.open({template: TEMPLATE});
	};

	var setBook = function(book) {
		if(book) {
			bookEdit.book.id = book.id;
			bookEdit.book.userId = book.userId;
			bookEdit.book.model = book.model;
			bookEdit.book.cover = book.cover;
			bookEdit.book.coverId = book.coverId;
			bookEdit.book.title = book.title;
			bookEdit.book.author = book.author;
		}
	};

	bookEdit.getImg = function() {
		return this.book.model ? BOOK_IMAGE_URL.replace('{model}', this.book.model) : EMPTY_IMAGE_URL;
	};

	bookEdit.getCoverImg = function() {
		return this.book.cover ? this.book.cover.url : EMPTY_IMAGE_URL;
	};

	bookEdit.applyCover = function(coverInputURL) {
		if(coverInputURL) {
			block.global.start();
			archive.sendExternalURL(coverInputURL, [this.book.title, this.book.author]).then(function (result) {
				bookEdit.book.cover = result;
				bookEdit.book.coverId = result.id;
			}).catch(function () {
				bookEdit.book.coverId = null;
				bookEdit.book.cover = null;
				
				dialog.openError('Can not apply this cover. Try another one, please.');
			}).finally(function () {
				coverInputURL = null;
				block.global.stop();
			});
		} else {
			bookEdit.book.coverId = null;
			bookEdit.book.cover = null;
		}
	};

	bookEdit.save = function() {
		var scope = this;
		
		block.global.start();
		data.postBook(this.book).then(function (dto) {
			if(selector.isBookSelected(dto.id)) {
				selector.unselect();
			}

			environment.updateBook(dto);
			scope.cancel();
			return catalog.loadBooks(user.getId());
		}).catch(function () {
			$log.error('Book save error');
			//TODO: show error
		}).finally(function () {
			block.global.stop();
		});
	};

	bookEdit.cancel = function() {
		bookDialog.close();
	};

	return bookEdit;
});
angular.module('VirtualBookshelf')
.factory('catalog', function ($q, data, block) {
	var catalog = {};

	catalog.books = null;

	catalog.loadBooks = function(userId) {
		var promise;

		if(userId) {
			block.inventory.start();
			promise = $q.when(userId ? data.getUserBooks(userId) : null).then(function (result) {
				catalog.books = result;
			}).finally(function () {
				block.inventory.stop();	
			});
		}

		return promise;
	};

	catalog.getBook = function(id) {
		return _.find(catalog.books, {id: id});
	};

	return catalog;
});
angular.module('VirtualBookshelf')
.factory('createLibrary', function (data, environment, dialog, block, ngDialog) {
	var createLibrary = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	var TEMPLATE_ID = 'createLibraryDialog';
	
	var createLibraryDialog;

	createLibrary.show = function() {
		createLibraryDialog = ngDialog.open({
			template: TEMPLATE_ID
		});
	};

	createLibrary.getImg = function(model) {
		return model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', model) : EMPTY_IMAGE_URL;
	};

	createLibrary.create = function(model) {
		if(model) {
			block.global.start();
			data.postLibrary(model).then(function (result) {
				environment.goToLibrary(result.id);
			}).catch(function () {
				dialog.openError('Can not create library because of an error.');
			}).finally(function () {
				block.global.stop();
			});

			createLibraryDialog.close();
		} else {
			dialog.openWarning('Select library, please.');
		}
	};

	return createLibrary;
});
angular.module('VirtualBookshelf')
.factory('createSection', function ($log, user, environment, locator, dialog, block, ngDialog) {
	var createSection = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';
	var TEMPLATE = 'createSectionDialog';

	var createSectionDialog;

	createSection.show = function() {
		createSectionDialog = ngDialog.open({template: TEMPLATE});
	};

	createSection.getImg = function(model) {
		return model ? '/obj/sections/{model}/img.jpg'.replace('{model}', model) : EMPTY_IMAGE_URL;
	};

	createSection.create = function(model) {
		if(model) {
			var sectionData = {
				model: model,
				libraryId: environment.library.id,
				userId: user.getId()
			};

			place(sectionData);
		} else {
			dialog.openWarning('Select model, please.');
		}	
	};

	var place = function(dto) {
		block.global.start();
		locator.placeSection(dto).catch(function (error) {
			dialog.openError('Can not create section because of an error.');
			$log.error(error);
		}).finally(function () {
			block.global.stop();
		});	

		createSectionDialog.close();
	};

	return createSection;
});
angular.module('VirtualBookshelf')
.factory('feedback', function (data, dialog, ngDialog) {
	var feedback = {};
	var feedbackDialog;

	var TEMPLATE = 'feedbackDialog';

	feedback.show = function() {
		feedbackDialog = ngDialog.open({template: TEMPLATE});
	};

	feedback.send = function(dto) {
		dialog.openConfirm('Send feedback?').then(function () {
			return data.postFeedback(dto).then(function () {
				feedbackDialog.close();
			}, function () {
				dialog.openError('Can not send feedback because of an error.');
			});
		});
	};

	return feedback;
});
angular.module('VirtualBookshelf')
.factory('linkAccount', function (user, ngDialog) {
	var linkAccount = {};

	var TEMPLATE = 'linkAccountDialog';

	linkAccount.show = function() {
		ngDialog.open({template: TEMPLATE});
	};

	linkAccount.isGoogleShow = function() {
		return !user.isGoogle();
	};

	linkAccount.isTwitterShow = function() {
		return !user.isTwitter();
	};

	linkAccount.isFacebookShow = function() {
		return !user.isFacebook();
	};

	linkAccount.isVkontakteShow = function() {
		return !user.isVkontakte();
	};

	linkAccount.isAvailable = function() {
		return this.isGoogleShow() || 
			this.isTwitterShow() || 
			this.isFacebookShow() || 
			this.isVkontakteShow();
	};

	return linkAccount;
});
angular.module('VirtualBookshelf')
.factory('mainMenu', function ($log, data, bookEdit, feedback, selectLibrary, createLibrary, createSection, linkAccount, authorization) {
	var mainMenu = {};
	
	var show = false;
	var createListShow = false;

	mainMenu.isShow = function() {
		return show;
	};

	mainMenu.show = function() {
		mainMenu.hideAll();
		show = true;
	};

	mainMenu.hide = function() {
		show = false;
	};

	mainMenu.isCreateListShow = function() {
		return createListShow;
	};

	mainMenu.createListShow = function() {
		mainMenu.hideAll();
		createListShow = true;
	};

	mainMenu.createListHide = function() {
		createListShow = false;
	};

	mainMenu.hideAll = function() {
		mainMenu.hide();
		mainMenu.createListHide();
	};

	mainMenu.trigger = function() {
		if(mainMenu.isShow()) {
			mainMenu.hide();
		} else {
			mainMenu.show();
		}
	};

	mainMenu.showFeedback = function() {
		mainMenu.hideAll();
		feedback.show();
	};

	mainMenu.showSelectLibrary = function() {
		mainMenu.hideAll();
		selectLibrary.show();
	};

	mainMenu.showCreateLibrary = function() {
		mainMenu.hideAll();
		createLibrary.show();
	};

	mainMenu.showCreateSection = function() {
		mainMenu.hideAll();
		createSection.show();
	};

	mainMenu.showLinkAccount = function() {
		mainMenu.hideAll();
		linkAccount.show();
	};

	mainMenu.isLinkAccountAvailable = function() {
		return !authorization.isShow() && linkAccount.isAvailable();
	};

	return mainMenu;
});
angular.module('VirtualBookshelf')
.factory('registration', function ($log, user, data, dialog, userData, ngDialog) {
	var registration = {};

	var FORM_VALIDATION_ERROR = 'Enter a valid data, please.';
	var SAVE_USER_ERROR = 'Error saving user. Try again, please.';
	var TEMPLATE = 'registrationDialog';

	registration.user = {
		id: null,
		name: null,
		email: null,
		temporary: false
	};

	registration.show = function() {
		registration.user.id = user.getId();
		registration.user.name = user.getName();
		registration.user.email = user.getEmail();

		return ngDialog.openConfirm({template: TEMPLATE}).then(function () {
			return saveUser();
		}, function () {
			return deleteUser();
		});
	};

	registration.showValidationError = function() {
		dialog.openError(FORM_VALIDATION_ERROR);
	};

	var saveUser = function() {
		return data.putUser(registration.user).then(function () {
        	return user.load().then(function () {
    			return userData.load();
        	});	
		}).catch(function () {
			dialog.openError(SAVE_USER_ERROR);
			$log.log('Registration: Error saving user:', registration.user.id);
		});
	};

	var deleteUser = function() {
		return data.deleteUser(registration.user.id);
	};

	return registration;
});
angular.module('VirtualBookshelf')
.factory('selectLibrary', function ($q, data, environment, user, ngDialog) {
	var selectLibrary = {};

	var TEMPLATE = 'selectLibraryDialog';

	selectLibrary.list = [];

	selectLibrary.show = function() {
		ngDialog.openConfirm({template: TEMPLATE});
	};

	selectLibrary.isAvailable = function() {
		return selectLibrary.list.length > 0;
	};

	selectLibrary.isUserLibrary = function() {
		return environment.library && environment.library.dataObject.userId === user.getId();
	};

	selectLibrary.updateList = function() {
		var scope = this;
		var promise;

		if(user.isAuthorized()) {
		    promise = data.getLibraries().then(function (libraries) {
	            scope.list = libraries;
	    	});
		} else {
			scope.list = [];
			promise = $q.when(scope.list);
		}

    	return promise;
	};

	selectLibrary.go = environment.goToLibrary;

	return selectLibrary;
});
angular.module('VirtualBookshelf')
.factory('tools', function ($q, $log, BookObject, SectionObject, ShelfObject, SelectorMetaDto, data, selector, dialog, block, catalog, environment, preview, user, locator, growl) {
	var tools = {};

	var ROTATION_SCALE = 1;

	var states = {
		rotateLeft: false,
		rotateRight: false
	};

	tools.place = function() {
		var selectedDto;
		var focusedObject = selector.getFocusedObject();

		if(focusedObject instanceof ShelfObject) {
			selector.placing = false;
			selectedDto = selector.getSelectedDto();

			block.global.start();
			locator.placeBook(selectedDto, focusedObject).then(function () {
				var bookDto = catalog.getBook(selectedDto.id);
				selector.select(new SelectorMetaDto(BookObject.TYPE, bookDto.id, bookDto.shelfId));
				growl.success('Book placed');
			}).catch(function (error) {
				growl.error(error);
				$log.error(error);
			}).finally(function () {
				block.global.stop();
			});
		} else {
			growl.error('Shelf is not selected');
		}
	};

	tools.unplace = function() {
		var bookDto = selector.isSelectedBook() ? selector.getSelectedDto() : null;

		if(bookDto) {
			block.global.start();
			locator.unplaceBook(bookDto).then(function () {
				growl.success('Book unplaced');
				return catalog.loadBooks(user.getId());		
			}).catch(function (error) {
				growl.error(error);
				$log.error(error);
			}).finally(function () {
				block.global.stop();
			});
		}
	};

	tools.deleteBook = function(id) {
		return data.deleteBook(id).then(function () {
			selector.unselect();
			environment.removeBook(id);
			return catalog.loadBooks(user.getId());
		});
	};

	tools.deleteSection = function(id) {
		return data.deleteSection(id).then(function () {
			selector.unselect();
			environment.removeSection(id);
		});
	};

	tools.rotateLeft = function() {
		states.rotateLeft = true;
	};

	tools.rotateRight = function() {
		states.rotateRight = true;
	};

	tools.stop = function() {
		states.rotateLeft = false;
		states.rotateRight = false;
	};

	tools.update = function() {
		if(states.rotateLeft) {
			rotate(ROTATION_SCALE);
		} else if(states.rotateRight) {
			rotate(-ROTATION_SCALE);
		}
	};

	var rotate = function(scale) {
		var obj;

		if(preview.isActive()) {
			preview.rotate(scale);
		} else {
			obj = selector.getSelectedObject();
			if(obj) obj.rotate(scale);
		}
	};

	return tools;
});
angular.module('VirtualBookshelf')
.factory('tooltip', function () {
	var tooltip = {};

	tooltip.obj = {};

	tooltip.set = function(obj) {
		if(obj) {
			this.obj.type = obj.type;
			this.obj.title = obj.dataObject.title;
			this.obj.author = obj.dataObject.author;
		} else {
			this.obj.type = null;
		}
	};

	return tooltip;
});
angular.module('VirtualBookshelf')
.factory('userData', function ($q, selectLibrary, catalog, user) {
	var userData = {};

	userData.load = function() {
		return $q.all([
			selectLibrary.updateList(), 
			catalog.loadBooks(user.getId())
		]);
	};

	return userData;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0F1dGhDdHJsLmpzIiwiY29udHJvbGxlcnMvQm9va0VkaXRDdHJsLmpzIiwiY29udHJvbGxlcnMvQ3JlYXRlTGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9DcmVhdGVTZWN0aW9uQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ZlZWRiYWNrQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ludmVudG9yeUN0cmwuanMiLCJjb250cm9sbGVycy9MaW5rQWNjb3VudEN0cmwuanMiLCJjb250cm9sbGVycy9SZWdpc3RyYXRpb25DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VsZWN0TGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9Ub29sc0N0cmwuanMiLCJjb250cm9sbGVycy9Ub29sdGlwQ3RybC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImNvbnRyb2xsZXJzL1dlbGNvbWVDdHJsLmpzIiwiZGlyZWN0aXZlcy9zZWxlY3QuanMiLCJzZXJ2aWNlcy9hcmNoaXZlLmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwic2VydmljZXMvbWF0ZXJpYWxzL0Jvb2tNYXRlcmlhbC5qcyIsInNlcnZpY2VzL21vZGVscy9CYXNlT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0Jvb2tPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FtZXJhT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VsZWN0b3JNZXRhRHRvLmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL3N1YmNsYXNzT2YuanMiLCJzZXJ2aWNlcy9zY2VuZS9ncmlkQ2FsY3VsYXRvci5qcyIsInNlcnZpY2VzL3NjZW5lL2hpZ2hsaWdodC5qcyIsInNlcnZpY2VzL3NjZW5lL2xvY2F0b3IuanMiLCJzZXJ2aWNlcy9zY2VuZS9wcmV2aWV3LmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiLCJzZXJ2aWNlcy91aS9hdXRob3JpemF0aW9uLmpzIiwic2VydmljZXMvdWkvYmxvY2suanMiLCJzZXJ2aWNlcy91aS9ib29rRWRpdC5qcyIsInNlcnZpY2VzL3VpL2NhdGFsb2cuanMiLCJzZXJ2aWNlcy91aS9jcmVhdGVMaWJyYXJ5LmpzIiwic2VydmljZXMvdWkvY3JlYXRlU2VjdGlvbi5qcyIsInNlcnZpY2VzL3VpL2ZlZWRiYWNrLmpzIiwic2VydmljZXMvdWkvbGlua0FjY291bnQuanMiLCJzZXJ2aWNlcy91aS9tYWluTWVudS5qcyIsInNlcnZpY2VzL3VpL3JlZ2lzdHJhdGlvbi5qcyIsInNlcnZpY2VzL3VpL3NlbGVjdExpYnJhcnkuanMiLCJzZXJ2aWNlcy91aS90b29scy5qcyIsInNlcnZpY2VzL3VpL3Rvb2x0aXAuanMiLCJzZXJ2aWNlcy91aS91c2VyRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJywgWydhbmd1bGFyLWdyb3dsJywgJ2Jsb2NrVUknLCAnbmdEaWFsb2cnLCAnYW5ndWxhclV0aWxzLmRpcmVjdGl2ZXMuZGlyUGFnaW5hdGlvbiddKVxuLmNvbmZpZyhmdW5jdGlvbiAoZ3Jvd2xQcm92aWRlciwgYmxvY2tVSUNvbmZpZywgcGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIpIHtcbiAgICBncm93bFByb3ZpZGVyLmdsb2JhbFRpbWVUb0xpdmUoMjAwMCk7XG4gICAgZ3Jvd2xQcm92aWRlci5nbG9iYWxQb3NpdGlvbigndG9wLWxlZnQnKTtcbiAgICBncm93bFByb3ZpZGVyLmdsb2JhbERpc2FibGVDb3VudERvd24odHJ1ZSk7XG5cblx0YmxvY2tVSUNvbmZpZy5kZWxheSA9IDA7XG5cdGJsb2NrVUlDb25maWcuYXV0b0Jsb2NrID0gZmFsc2U7XG5cdGJsb2NrVUlDb25maWcuYXV0b0luamVjdEJvZHlCbG9jayA9IGZhbHNlO1xuXHRcbiAgICBwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlci5zZXRQYXRoKCcvdWkvZGlyUGFnaW5hdGlvbicpO1xufSkucnVuKGZ1bmN0aW9uIChtYWluKSB7XG5cdG1haW4uc3RhcnQoKTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdBdXRoQ3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uKSB7XG5cdHRoaXMubG9naW5Hb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLmdvb2dsZSgpO1xuXHR9O1xuXG5cdHRoaXMubG9naW5Ud2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi50d2l0dGVyKCk7XG5cdH07XG5cblx0dGhpcy5sb2dpbkZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5mYWNlYm9vaygpO1xuXHR9O1xuXG5cdHRoaXMubG9naW5Wa29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnZrb250YWt0ZSgpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q3RybCcsIGZ1bmN0aW9uIChib29rRWRpdCwgZGlhbG9nLCBkYXRhKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dGhpcy5ib29rID0gYm9va0VkaXQuYm9vaztcblx0dGhpcy5jb3ZlcklucHV0VVJMID0gbnVsbDtcblxuXHR0aGlzLmFwcGx5Q292ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRpZighaXNDb3ZlckRpc2FibGVkKCkpIHtcblx0XHRcdGJvb2tFZGl0LmFwcGx5Q292ZXIodGhpcy5jb3ZlcklucHV0VVJMKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignRmlsbCBhdXRob3IgYW5kIHRpdGxlIGZpZWxkcywgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLmdldENvdmVySW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGJvb2tFZGl0LmdldENvdmVySW1nKCk7XG5cdH07XG5cblx0dGhpcy5nZXRJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYm9va0VkaXQuZ2V0SW1nKCk7XG5cdH07XG5cblx0dGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHRib29rRWRpdC5jYW5jZWwoKTtcblx0fTtcblxuXHR0aGlzLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuZm9ybS4kdmFsaWQpIHtcblx0XHRcdGJvb2tFZGl0LnNhdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignRmlsbCBhbGwgcmVxdWlyZWQgZmllbGRzLCBwbGVhc2UuJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpc0NvdmVyRGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NvcGUuY292ZXJJbnB1dFVSTCAmJiAoc2NvcGUuZm9ybS50aXRsZS4kaW52YWxpZCB8fCBzY29wZS5mb3JtLmF1dGhvci4kaW52YWxpZCk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24udGhlbihmdW5jdGlvbiAoY29tbW9uRGF0YSkge1xuXHRcdHNjb3BlLmxpc3QgPSBjb21tb25EYXRhLmJvb2tzO1xuXHR9KTtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0NyZWF0ZUxpYnJhcnlDdHJsJywgZnVuY3Rpb24gKGNyZWF0ZUxpYnJhcnksIGRhdGEpIHtcblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR0aGlzLmxpc3QgPSBudWxsO1xuXHR0aGlzLm1vZGVsID0gbnVsbDtcblxuXHR0aGlzLmdldEltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjcmVhdGVMaWJyYXJ5LmdldEltZyh0aGlzLm1vZGVsKTtcblx0fTtcblxuXHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnkuY3JlYXRlKHRoaXMubW9kZWwpO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uLnRoZW4oZnVuY3Rpb24gKGNvbW1vbkRhdGEpIHtcblx0XHRzY29wZS5saXN0ID0gY29tbW9uRGF0YS5saWJyYXJpZXM7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0NyZWF0ZVNlY3Rpb25DdHJsJywgZnVuY3Rpb24gKGNyZWF0ZVNlY3Rpb24sIGRhdGEpIHtcblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR0aGlzLm1vZGVsID0gbnVsbDtcblx0dGhpcy5saXN0ID0gbnVsbDtcblxuXHR0aGlzLmdldEltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjcmVhdGVTZWN0aW9uLmdldEltZyh0aGlzLm1vZGVsKTtcblx0fTtcblx0XHRcblx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVTZWN0aW9uLmNyZWF0ZSh0aGlzLm1vZGVsKTtcblx0fTtcblxuXHRkYXRhLmNvbW1vbi50aGVuKGZ1bmN0aW9uIChjb21tb25EYXRhKSB7XG5cdFx0c2NvcGUubGlzdCA9IGNvbW1vbkRhdGEuYm9va3NoZWx2ZXM7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0ZlZWRiYWNrQ3RybCcsIGZ1bmN0aW9uIChmZWVkYmFjaywgdXNlciwgZGlhbG9nKSB7XG5cdHRoaXMuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYodGhpcy5mb3JtLm1lc3NhZ2UuJHZhbGlkKSB7XG5cdFx0XHRmZWVkYmFjay5zZW5kKHtcblx0XHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuXHRcdFx0XHR1c2VySWQ6IHVzZXIuZ2V0SWQoKVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0ZlZWRiYWNrIGZpZWxkIGlzIHJlcXVpcmVkLicpO1xuXHRcdH1cblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdJbnZlbnRvcnlDdHJsJywgZnVuY3Rpb24gKFNlbGVjdG9yTWV0YUR0bywgQm9va09iamVjdCwgdXNlciwgYm9va0VkaXQsIHNlbGVjdG9yKSB7XG5cdHRoaXMuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHVzZXIuaXNBdXRob3JpemVkKCk7XG5cdH07XG5cblx0dGhpcy5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkKGlkKTtcblx0fTtcblxuXHR0aGlzLnNlbGVjdCA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHZhciBtZXRhID0gbmV3IFNlbGVjdG9yTWV0YUR0byhCb29rT2JqZWN0LlRZUEUsIGR0by5pZCk7XG5cdFx0c2VsZWN0b3Iuc2VsZWN0KG1ldGEpO1xuXHR9O1xuXG5cdHRoaXMuYWRkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdGJvb2tFZGl0LnNob3coe3VzZXJJZDogdXNlci5nZXRJZCgpfSk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignTGlua0FjY291bnRDdHJsJywgZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIGxpbmtBY2NvdW50KSB7XG5cdHRoaXMubGlua0dvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uZ29vZ2xlKCk7XG5cdH07XG5cblx0dGhpcy5saW5rVHdpdHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udHdpdHRlcigpO1xuXHR9O1xuXG5cdHRoaXMubGlua0ZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5mYWNlYm9vaygpO1xuXHR9O1xuXG5cdHRoaXMubGlua1Zrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udmtvbnRha3RlKCk7XG5cdH07XG5cblx0dGhpcy5pc0dvb2dsZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNHb29nbGVTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc1R3aXR0ZXJTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzVHdpdHRlclNob3coKTtcblx0fTtcblxuXHR0aGlzLmlzRmFjZWJvb2tTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzRmFjZWJvb2tTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc1Zrb250YWt0ZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNWa29udGFrdGVTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc0F2YWlsYWJsZSgpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdHJhdGlvbkN0cmwnLCBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XG5cdHRoaXMudXNlciA9IHJlZ2lzdHJhdGlvbi51c2VyO1xuXG5cdHRoaXMuc2hvd1ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlZ2lzdHJhdGlvbi5zaG93VmFsaWRhdGlvbkVycm9yKCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignU2VsZWN0TGlicmFyeUN0cmwnLCBmdW5jdGlvbiAoc2VsZWN0TGlicmFyeSkge1xuXHR0aGlzLmdvID0gc2VsZWN0TGlicmFyeS5nbztcblxuXHR0aGlzLmdldExpc3QgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5saXN0O1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1Rvb2xzQ3RybCcsIGZ1bmN0aW9uICh1c2VyLCBzZWxlY3RvciwgdG9vbHMsIHByZXZpZXcsIGJvb2tFZGl0LCBkaWFsb2csIGJsb2NrLCBncm93bCkge1xuICAgIHZhciBERUxFVEVfQ09ORklSTSA9ICdEZWxldGUgezB9OiB7MX0/JztcbiAgICB2YXIgREVMRVRFX1NVQ0NFU1MgPSAnezB9OiB7MX0gZGVsZXRlZC4nO1xuICAgIHZhciBERUxFVEVfRVJST1IgPSAnQ2FuIG5vdCBkZWxldGUgezB9OiB7MX0uJztcbiAgICB2YXIgQk9PSyA9ICdib29rJztcbiAgICB2YXIgU0VDVElPTiA9ICdzZWN0aW9uJztcblxuICAgIHRoaXMuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSB8fCBwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNCb29rID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1JvdGF0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKSB8fCBwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNFZGl0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Jvb2soKSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzRGVsZXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSAmJiB1c2VyLmlzQXV0aG9yaXplZCgpICYmICFwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNXYXRjaGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKSAmJiAhdGhpcy5pc1BsYWNlYmxlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNQbGFjZWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcmV0dXJuICFvYmogJiYgc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSAmJiB1c2VyLmlzQXV0aG9yaXplZCgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzVW5wbGFjZWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpICYmIHVzZXIuaXNBdXRob3JpemVkKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1BsYWNpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLnBsYWNpbmc7XG4gICAgfTtcblxuICAgIHRoaXMucGxhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZWN0b3IucGxhY2luZyA9ICFzZWxlY3Rvci5wbGFjaW5nO1xuICAgIH07XG5cbiAgICB0aGlzLnVucGxhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdG9vbHMudW5wbGFjZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLndhdGNoID0gZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcHJldmlldy5lbmFibGUob2JqKTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUaXRsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIHRoaXMuaXNCb29rKCkgPyBzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpLnRpdGxlIDpcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2VjdGlvbigpID8gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKS5pZCA6XG4gICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5lZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGJvb2tFZGl0LnNob3coc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkdG8gPSBzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpO1xuICAgICAgICB2YXIgY29uZmlybU1zZztcbiAgICAgICAgdmFyIHN1Y2Nlc3NNc2c7XG4gICAgICAgIHZhciBlcnJvck1zZztcbiAgICAgICAgdmFyIGRlbGV0ZUZuYztcblxuICAgICAgICBpZihzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVCb29rO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgQk9PSykucmVwbGFjZSgnezF9JywgZHRvLnRpdGxlKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVTZWN0aW9uO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgU0VDVElPTikucmVwbGFjZSgnezF9JywgZHRvLmlkKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2cub3BlbkNvbmZpcm0oY29uZmlybU1zZykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBibG9jay5nbG9iYWwuc3RhcnQoKTtcbiAgICAgICAgICAgIGRlbGV0ZUZuYyhkdG8uaWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGdyb3dsLnN1Y2Nlc3Moc3VjY2Vzc01zZyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IoZXJyb3JNc2cpO1xuICAgICAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suZ2xvYmFsLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy51bndhdGNoID0gcHJldmlldy5kaXNhYmxlO1xuICAgIHRoaXMuaXNXYXRjaEFjdGl2ZSA9IHByZXZpZXcuaXNBY3RpdmU7XG5cbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSB0b29scy5yb3RhdGVMZWZ0O1xuICAgIHRoaXMucm90YXRlUmlnaHQgPSB0b29scy5yb3RhdGVSaWdodDtcbiAgICB0aGlzLnN0b3AgPSB0b29scy5zdG9wO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1Rvb2x0aXBDdHJsJywgZnVuY3Rpb24gKHRvb2x0aXAsIEJvb2tPYmplY3QpIHtcbiAgICB0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdG9vbHRpcC5vYmoudHlwZSA9PT0gQm9va09iamVjdC5UWVBFO1xuICAgIH07XG5cbiAgICB0aGlzLm9iaiA9IHRvb2x0aXAub2JqO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1VpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIG1haW5NZW51LCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBjcmVhdGVTZWN0aW9uLCBmZWVkYmFjaywgYXV0aG9yaXphdGlvbiwgbmF2aWdhdGlvbiwgYm9va0VkaXQsIGNhdGFsb2cpIHtcbiAgICAkc2NvcGUubWFpbk1lbnUgPSBtYWluTWVudTtcblxuICAgICRzY29wZS5zZWxlY3RMaWJyYXJ5ID0gc2VsZWN0TGlicmFyeTtcbiAgICAkc2NvcGUuY3JlYXRlTGlicmFyeSA9IGNyZWF0ZUxpYnJhcnk7XG4gICAgJHNjb3BlLmNyZWF0ZVNlY3Rpb24gPSBjcmVhdGVTZWN0aW9uO1xuICAgICRzY29wZS5mZWVkYmFjayA9IGZlZWRiYWNrO1xuICAgICRzY29wZS5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcblxuICAgICRzY29wZS5ib29rRWRpdCA9IGJvb2tFZGl0O1xuICAgICRzY29wZS5jYXRhbG9nID0gY2F0YWxvZztcblxuXHQkc2NvcGUubmF2aWdhdGlvbiA9IHtcblx0XHRzdG9wOiBuYXZpZ2F0aW9uLmdvU3RvcCxcblx0XHRmb3J3YXJkOiBuYXZpZ2F0aW9uLmdvRm9yd2FyZCxcblx0XHRiYWNrd2FyZDogbmF2aWdhdGlvbi5nb0JhY2t3YXJkLFxuXHRcdGxlZnQ6IG5hdmlnYXRpb24uZ29MZWZ0LFxuXHRcdHJpZ2h0OiBuYXZpZ2F0aW9uLmdvUmlnaHRcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBlbnZpcm9ubWVudCwgdXNlcikge1xuXHR2YXIgY2xvc2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc1Nob3dBdXRob3JpemF0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGF1dGhvcml6YXRpb24uaXNTaG93KCk7XG5cdH07XG5cdFxuXHR0aGlzLmlzU2hvd1NlbGVjdExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5pc0F2YWlsYWJsZSgpICYmICFzZWxlY3RMaWJyYXJ5LmlzVXNlckxpYnJhcnkodXNlci5nZXRJZCgpKTtcblx0fTtcblxuXHR0aGlzLmlzU2hvd0NyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNTaG93QXV0aG9yaXphdGlvbigpICYmICFzZWxlY3RMaWJyYXJ5LmlzQXZhaWxhYmxlKCk7XG5cdH07XG5cblx0dGhpcy5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIWNsb3NlZCAmJiAodGhpcy5pc1Nob3dBdXRob3JpemF0aW9uKCkgfHwgdGhpcy5pc1Nob3dDcmVhdGVMaWJyYXJ5KCkgfHwgdGhpcy5pc1Nob3dTZWxlY3RMaWJyYXJ5KCkpO1xuXHR9O1xuXG5cdHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0TG9hZGVkKCk7XG5cdH07XG5cblx0dGhpcy5zaG93TG9naW5EaWFsb2cgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnNob3coKTtcblx0fTtcblxuXHR0aGlzLnNob3dTZWxlY3RMaWJyYXJ5RGlhbG9nID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VsZWN0TGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0dGhpcy5zaG93Q3JlYXRlTGlicmFyeURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnkuc2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0XHRjbG9zZWQgPSB0cnVlO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmRpcmVjdGl2ZSgndmJTZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0cmVzdHJpY3Q6ICdFJyxcbiAgICBcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmw6ICcvdWkvc2VsZWN0LmVqcycsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdHZhbHVlOiAnQCcsXG5cdFx0XHRsYWJlbDogJ0AnXG5cdFx0fSxcblxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRjb250cm9sbGVyLiRzZXRWaWV3VmFsdWUoaXRlbVtzY29wZS52YWx1ZV0pO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRyb2xsZXIuJG1vZGVsVmFsdWUgPT09IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdhcmNoaXZlJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIGFyY2hpdmUgPSB7fTtcblxuXHRhcmNoaXZlLnNlbmRFeHRlcm5hbFVSTCA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG5cdFx0cmV0dXJuIGRhdGEucG9zdENvdmVyKGV4dGVybmFsVVJMLCB0YWdzKTtcblx0fTtcblxuXHRyZXR1cm4gYXJjaGl2ZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYWNoZScsIGZ1bmN0aW9uICgkcSwgJGxvZywgZGF0YSkge1xuXHR2YXIgY2FjaGUgPSB7fTtcblxuXHR2YXIgbGlicmFyeSA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IHt9O1xuXHR2YXIgYm9va3MgPSB7fTtcblx0dmFyIGltYWdlcyA9IHt9O1xuXG5cdGNhY2hlLmluaXQgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGNvdmVycykge1xuXHRcdHZhciBsaWJyYXJ5TG9hZCA9IGxvYWRMaWJyYXJ5RGF0YShsaWJyYXJ5TW9kZWwpO1xuXHRcdHZhciBzZWN0aW9uc0xvYWQgPSBbXTtcblx0XHR2YXIgYm9va3NMb2FkID0gW107XG5cdFx0dmFyIGltYWdlc0xvYWQgPSBbXTtcblx0XHR2YXIgbW9kZWwsIGNvdmVySWQ7IC8vIGl0ZXJhdG9yc1xuXG5cdFx0Zm9yIChtb2RlbCBpbiBzZWN0aW9uTW9kZWxzKSB7XG5cdFx0XHRzZWN0aW9uc0xvYWQucHVzaChhZGRTZWN0aW9uKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChtb2RlbCBpbiBib29rTW9kZWxzKSB7XG5cdFx0XHRib29rc0xvYWQucHVzaChhZGRCb29rKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb3ZlcklkIGluIGNvdmVycykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlQnlEdG8oY292ZXJzW2NvdmVySWRdKSk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb21pc2UgPSAkcS5hbGwoe1xuXHRcdFx0bGlicmFyeUNhY2hlOiBsaWJyYXJ5TG9hZCwgXG5cdFx0XHRzZWN0aW9uc0xvYWQ6ICRxLmFsbChzZWN0aW9uc0xvYWQpLCBcblx0XHRcdGJvb2tzTG9hZDogJHEuYWxsKGJvb2tzTG9hZCksXG5cdFx0XHRpbWFnZXNMb2FkOiAkcS5hbGwoaW1hZ2VzTG9hZClcblx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cdFx0XHRsaWJyYXJ5ID0gcmVzdWx0cy5saWJyYXJ5Q2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRjYWNoZS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpYnJhcnk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0U2VjdGlvbiA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihzZWN0aW9ucywgbW9kZWwsIGFkZFNlY3Rpb24pO1xuXHR9O1xuXG5cdGNhY2hlLmdldEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoYm9va3MsIG1vZGVsLCBhZGRCb29rKTtcblx0fTtcblxuXHRjYWNoZS5nZXRJbWFnZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihpbWFnZXMsIGlkLCBhZGRJbWFnZUJ5SWQpO1xuXHR9O1xuXG5cdHZhciBhZGRTZWN0aW9uID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoc2VjdGlvbnMsIG1vZGVsLCBsb2FkU2VjdGlvbkRhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoYm9va3MsIG1vZGVsLCBsb2FkQm9va0RhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZUJ5SWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkYXRhLmdldENvdmVyKGlkKS50aGVuKGZ1bmN0aW9uIChjb3ZlckR0bykge1xuXHRcdFx0cmV0dXJuIGRhdGEubG9hZEltYWdlKGNvdmVyRHRvLnVybCkudGhlbihmdW5jdGlvbiAoaW1hZ2UpIHtcblx0XHRcdFx0cmV0dXJuIGFkZEltYWdlKGNvdmVyRHRvLCBpbWFnZSk7XG5cdFx0XHR9KTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgaWQ6JywgaWQpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlQnlEdG8gPSBmdW5jdGlvbihjb3ZlckR0bykge1xuXHRcdHJldHVybiBkYXRhLmxvYWRJbWFnZShjb3ZlckR0by51cmwpLnRoZW4oZnVuY3Rpb24gKGltYWdlKSB7XG5cdFx0XHRyZXR1cm4gYWRkSW1hZ2UoY292ZXJEdG8sIGltYWdlKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgZHRvOicsIGNvdmVyRHRvLmlkKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZSA9IGZ1bmN0aW9uKGR0bywgaW1hZ2UpIHtcblx0XHR2YXIgbG9hZGVkQ2FjaGUgPSB7XG5cdFx0XHRkdG86IGR0byxcblx0XHRcdGltYWdlOiBpbWFnZVxuXHRcdH07XG5cblx0XHRpbWFnZXNbZHRvLmlkXSA9IGxvYWRlZENhY2hlO1xuXHRcdHJldHVybiBsb2FkZWRDYWNoZTtcblx0fTtcblxuXHR2YXIgY29tbW9uR2V0dGVyID0gZnVuY3Rpb24oZnJvbSwga2V5LCBhZGRGdW5jdGlvbikge1xuXHRcdHZhciByZXN1bHQgPSBmcm9tW2tleV07XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRyZXN1bHQgPSBhZGRGdW5jdGlvbihrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS53aGVuKHJlc3VsdCk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkFkZGVyID0gZnVuY3Rpb24od2hlcmUsIHdoYXQsIGxvYWRlcikge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVt3aGF0XSA9IGxvYWRlZENhY2hlO1xuXG5cdFx0XHRyZXR1cm4gbG9hZGVkQ2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZExpYnJhcnlEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2xpYnJhcmllcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qc29uJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBsb2FkU2VjdGlvbkRhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovc2VjdGlvbnMve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBtb2RlbCk7XG4gICAgICAgIHZhciBtb2RlbFVybCA9IHBhdGggKyAnbW9kZWwuanMnO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcbiAgICAgICAgdmFyIGRhdGFVcmwgPSBwYXRoICsgJ2RhdGEuanNvbic7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpLCBcbiAgICAgICAgXHRkYXRhOiBkYXRhLmdldERhdGEoZGF0YVVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRCb29rRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9ib29rcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgYnVtcE1hcFVybCA9IHBhdGggKyAnYnVtcF9tYXAuanBnJztcbiAgICAgICAgdmFyIHNwZWN1bGFyTWFwVXJsID0gcGF0aCArICdzcGVjdWxhcl9tYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IGRhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSxcbiAgICAgICAgXHRtYXBJbWFnZTogZGF0YS5sb2FkSW1hZ2UobWFwVXJsKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0XHQkbG9nLmVycm9yKCdDYWNoZTogRXJyb3IgbG9hZGluZyBib29rIG1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRidW1wTWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKGJ1bXBNYXBVcmwpLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRcdCRsb2cuZXJyb3IoJ0NhY2hlOiBFcnJvciBsb2FkaW5nIGJvb2sgYnVtcE1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRzcGVjdWxhck1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShzcGVjdWxhck1hcFVybCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICBcdFx0JGxvZy5lcnJvcignQ2FjaGU6IEVycm9yIGxvYWRpbmcgYm9vayBzcGVjdWxhck1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRyZXR1cm4gY2FjaGU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY2FtZXJhJywgZnVuY3Rpb24gKENhbWVyYU9iamVjdCkge1xuXHR2YXIgY2FtZXJhID0ge1xuXHRcdEhFSUdUSDogMS41LFxuXHRcdG9iamVjdDogbmV3IENhbWVyYU9iamVjdCgpLFxuXHRcdHNldFBhcmVudDogZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0XHRwYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHR9LFxuXHRcdGdldFBvc2l0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm9iamVjdC5wb3NpdGlvbjtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdFxuXHRcdGNhbWVyYS5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIHdpZHRoIC8gaGVpZ2h0LCAwLjAxLCA1MCk7XG5cdFx0Y2FtZXJhLm9iamVjdC5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIGNhbWVyYS5IRUlHVEgsIDApO1xuXHRcdGNhbWVyYS5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHRjYW1lcmEub2JqZWN0LmFkZChjYW5kbGUpO1xuXG5cdFx0Y2FtZXJhLm9iamVjdC5hZGQoY2FtZXJhLmNhbWVyYSk7XG5cdH07XG5cblx0Y2FtZXJhLnJvdGF0ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0XHR2YXIgbmV3WCA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnggKyB5ICogMC4wMDAxIHx8IDA7XG5cdFx0dmFyIG5ld1kgPSB0aGlzLm9iamVjdC5yb3RhdGlvbi55ICsgeCAqIDAuMDAwMSB8fCAwO1xuXG5cdFx0aWYobmV3WCA8IDEuNTcgJiYgbmV3WCA+IC0xLjU3KSB7XHRcblx0XHRcdHRoaXMub2JqZWN0LnJvdGF0aW9uLnggPSBuZXdYO1xuXHRcdH1cblxuXHRcdHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgPSBuZXdZO1xuXHR9O1xuXG5cdGNhbWVyYS5nbyA9IGZ1bmN0aW9uKHNwZWVkKSB7XG5cdFx0dmFyIGRpcmVjdGlvbiA9IHRoaXMuZ2V0VmVjdG9yKCk7XG5cdFx0dmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRuZXdQb3NpdGlvbi5hZGQoZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKHNwZWVkKSk7XG5cblx0XHR0aGlzLm9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKTtcblx0fTtcblxuXHRjYW1lcmEuZ2V0VmVjdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKTtcblxuXHRcdHJldHVybiB2ZWN0b3IuYXBwbHlFdWxlcih0aGlzLm9iamVjdC5yb3RhdGlvbik7XG5cdH07XG5cblx0aW5pdCgpO1xuXG5cdHJldHVybiBjYW1lcmE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4vKiBcbiAqIGNvbnRyb2xzLmpzIGlzIGEgc2VydmljZSBmb3IgcHJvY2Vzc2luZyBub3QgVUkobWVudXMpIGV2ZW50cyBcbiAqIGxpa2UgbW91c2UsIGtleWJvYXJkLCB0b3VjaCBvciBnZXN0dXJlcy5cbiAqXG4gKiBUT0RPOiByZW1vdmUgYWxsIGJ1c2luZXMgbG9naWMgZnJvbSB0aGVyZSBhbmQgbGVhdmUgb25seVxuICogZXZlbnRzIGZ1bmN0aW9uYWxpdHkgdG8gbWFrZSBpdCBtb3JlIHNpbWlsYXIgdG8gdXN1YWwgY29udHJvbGxlclxuICovXG4uZmFjdG9yeSgnY29udHJvbHMnLCBmdW5jdGlvbiAoJHEsICRsb2csICRyb290U2NvcGUsIFNlbGVjdG9yTWV0YSwgQm9va09iamVjdCwgU2hlbGZPYmplY3QsIFNlY3Rpb25PYmplY3QsIGNhbWVyYSwgbmF2aWdhdGlvbiwgZW52aXJvbm1lbnQsIG1vdXNlLCBzZWxlY3RvciwgcHJldmlldywgYmxvY2ssIHRvb2xzKSB7XG5cdHZhciBjb250cm9scyA9IHt9O1xuXG5cdGNvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRjb250cm9scy5pbml0TGlzdGVuZXJzKCk7XG5cdH07XG5cblx0Y29udHJvbHMuaW5pdExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNvbnRyb2xzLm9uTW91c2VEb3duLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGNvbnRyb2xzLm9uTW91c2VVcCwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGNvbnRyb2xzLm9uTW91c2VNb3ZlLCBmYWxzZSk7XHRcblx0XHRkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGZhbHNlO307XG5cdH07XG5cblx0Y29udHJvbHMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIXByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0aWYobW91c2VbM10pIHtcblx0XHRcdFx0Y2FtZXJhLnJvdGF0ZShtb3VzZS5sb25nWCwgbW91c2UubG9uZ1kpO1xuXHRcdFx0fVxuXHRcdFx0aWYobW91c2VbMV0gJiYgbW91c2VbM10pIHtcblx0XHRcdFx0Y2FtZXJhLmdvKG5hdmlnYXRpb24uQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VEb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5kb3duKGV2ZW50KTsgXG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmIG1vdXNlWzFdICYmICFtb3VzZVszXSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRjb250cm9scy5zZWxlY3RPYmplY3QoKTtcblxuXHRcdFx0aWYoc2VsZWN0b3IucGxhY2luZykge1xuXHRcdFx0XHR0b29scy5wbGFjZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQkcm9vdFNjb3BlLiRhcHBseSgpO1xuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5vbk1vdXNlVXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdG1vdXNlLnVwKGV2ZW50KTtcblx0XHRcblx0XHRpZihldmVudC53aGljaCA9PT0gMSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRpZihzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSkge1xuXHRcdFx0XHR2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblxuXHRcdFx0XHRpZihvYmogJiYgb2JqLmNoYW5nZWQpIHtcblx0XHRcdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdFx0XHRvYmouc2F2ZSgpLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdG9iai5yb2xsYmFjaygpO1xuXHRcdFx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UubW92ZShldmVudCk7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmKG1vdXNlWzFdICYmICFtb3VzZVszXSkge1x0XHRcblx0XHRcdFx0Y29udHJvbHMubW92ZU9iamVjdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udHJvbHMuc2VsZWN0T2JqZWN0KCk7XG5cdFx0XHRcdCRyb290U2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vKioqKlxuXG5cdGNvbnRyb2xzLnNlbGVjdE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRvYmplY3Q7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmIGVudmlyb25tZW50LmxpYnJhcnkpIHtcblx0XHRcdC8vVE9ETzogb3B0aW1pemVcblx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW0Jvb2tPYmplY3RdKTtcblx0XHRcdGlmKCFpbnRlcnNlY3RlZCkge1xuXHRcdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTaGVsZk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NlY3Rpb25PYmplY3RdKTtcblx0XHRcdH1cblx0XHRcdGlmKGludGVyc2VjdGVkKSB7XG5cdFx0XHRcdG9iamVjdCA9IGludGVyc2VjdGVkLm9iamVjdDtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0b3IuZm9jdXMobmV3IFNlbGVjdG9yTWV0YShvYmplY3QpKTtcblx0XHR9XG5cdH07XG5cblx0Y29udHJvbHMubW92ZU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtb3VzZVZlY3Rvcjtcblx0XHR2YXIgbmV3UG9zaXRpb247XG5cdFx0dmFyIHBhcmVudDtcblx0XHR2YXIgc2VsZWN0ZWRPYmplY3Q7XG5cblx0XHRpZihzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSkge1xuXHRcdFx0c2VsZWN0ZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXG5cdFx0XHRpZihzZWxlY3RlZE9iamVjdCkge1xuXHRcdFx0XHRtb3VzZVZlY3RvciA9IGNhbWVyYS5nZXRWZWN0b3IoKTtcdFxuXHRcdFx0XHRuZXdQb3NpdGlvbiA9IHNlbGVjdGVkT2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRcdHBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblx0XHRcdFx0cGFyZW50LmxvY2FsVG9Xb3JsZChuZXdQb3NpdGlvbik7XG5cblx0XHRcdFx0bmV3UG9zaXRpb24ueCAtPSAobW91c2VWZWN0b3IueiAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueCAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXHRcdFx0XHRuZXdQb3NpdGlvbi56IC09ICgtbW91c2VWZWN0b3IueCAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueiAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXG5cdFx0XHRcdHBhcmVudC53b3JsZFRvTG9jYWwobmV3UG9zaXRpb24pO1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGNvbnRyb2xzO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZGF0YScsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRsb2cpIHtcblx0dmFyIGRhdGEgPSB7fTtcblxuXHRkYXRhLlRFWFRVUkVfUkVTT0xVVElPTiA9IDUxMjtcblx0ZGF0YS5DT1ZFUl9NQVhfWSA9IDM5NDtcblx0ZGF0YS5DT1ZFUl9GQUNFX1ggPSAyOTY7XG5cbiAgICBkYXRhLmxvYWRJbWFnZSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIFxuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnJzsgXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XG4gICAgICAgIFxuICAgICAgICBpZihpbWcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlOyBcbiAgICB9O1xuXG5cdGRhdGEuZ2V0Q292ZXIgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9jb3Zlci8nICsgaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG4gICAgZGF0YS5wb3N0Q292ZXIgPSBmdW5jdGlvbihleHRlcm5hbFVSTCwgdGFncykge1xuICAgIFx0dmFyIGRhdGEgPSB7XG4gICAgXHRcdHVybDogZXh0ZXJuYWxVUkwsXG4gICAgXHRcdHRhZ3M6IHRhZ3NcbiAgICBcdH07XG5cbiAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvY292ZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBcdFx0cmV0dXJuIHJlcy5kYXRhO1xuICAgIFx0fSk7XG4gICAgfTtcblxuICAgIGRhdGEubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2F1dGgvbG9nb3V0Jyk7XG4gICAgfTtcblxuXHRkYXRhLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcicpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucHV0VXNlciA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy91c2VyJywgZHRvKTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZVVzZXIgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5kZWxldGUoJy91c2VyLycgKyBpZCk7XG5cdH07XG5cblx0ZGF0YS5nZXRVc2VyQm9va3MgPSBmdW5jdGlvbih1c2VySWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvZnJlZUJvb2tzLycgKyB1c2VySWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9ib29rJywgYm9vaykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5kZWxldGVCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAoe1xuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdHVybDogJy9ib29rLycgKyBpZFxuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEuZ2V0VUlEYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL29iai9kYXRhLmpzb24nKTtcblx0fTtcblxuXHRkYXRhLmdldExpYnJhcmllcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJpZXMnKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLmdldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyeS8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLnBvc3RMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeU1vZGVsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbGlicmFyeS8nICsgbGlicmFyeU1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5nZXRTZWN0aW9ucyA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2VjdGlvbnMvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRGF0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NlY3Rpb24nLCBzZWN0aW9uRGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIFx0cmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZVNlY3Rpb24gPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0dXJsOiAnL3NlY3Rpb25zLycgKyBpZFxuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEubG9hZEdlb21ldHJ5ID0gZnVuY3Rpb24obGluaykge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdHZhciBqc29uTG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcblxuICAgICAgICAvL1RPRE86IGZvdW5kIG5vIHdheSB0byByZWplY3Rcblx0XHRqc29uTG9hZGVyLmxvYWQobGluaywgZnVuY3Rpb24gKGdlb21ldHJ5KSB7XG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcblx0XHRcdGRlZmZlcmVkLnJlc29sdmUoZ2VvbWV0cnkpO1xuXHRcdH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXG5cdGRhdGEuZ2V0RGF0YSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdEZlZWRiYWNrID0gZnVuY3Rpb24oZHRvKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvZmVlZGJhY2snLCBkdG8pO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uID0gZGF0YS5nZXRVSURhdGEoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHQkbG9nLmVycm9yKCdkYXRhOiBsb2FkaW5nIGNvbW1vbiBlcnJvcicpO1xuXHR9KTtcblxuXHRyZXR1cm4gZGF0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdkaWFsb2cnLCBmdW5jdGlvbiAobmdEaWFsb2cpIHtcblx0dmFyIGRpYWxvZyA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdjb25maXJtRGlhbG9nJztcblx0dmFyIEVSUk9SID0gMTtcblx0dmFyIENPTkZJUk0gPSAyO1xuXHR2YXIgV0FSTklORyA9IDM7XG5cdHZhciBJTkZPID0gNDtcblxuXHR2YXIgaWNvbkNsYXNzTWFwID0ge307XG5cdGljb25DbGFzc01hcFtFUlJPUl0gPSAnZmEtdGltZXMtY2lyY2xlJztcblx0aWNvbkNsYXNzTWFwW0NPTkZJUk1dID0gJ2ZhLXF1ZXN0aW9uLWNpcmNsZSc7XG5cdGljb25DbGFzc01hcFtXQVJOSU5HXSA9ICdmYS1leGNsYW1hdGlvbi10cmlhbmdsZSc7XG5cdGljb25DbGFzc01hcFtJTkZPXSA9ICdmYS1pbmZvLWNpcmNsZSc7XG5cblx0ZGlhbG9nLm9wZW5FcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgRVJST1IpO1xuXHR9O1xuXG5cdGRpYWxvZy5vcGVuQ29uZmlybSA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgQ09ORklSTSwgdHJ1ZSk7XG5cdH07XG5cblx0ZGlhbG9nLm9wZW5XYXJuaW5nID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBXQVJOSU5HKTtcblx0fTtcblxuXHRkaWFsb2cub3BlbkluZm8gPSBmdW5jdGlvbihtc2cpIHtcblx0XHRyZXR1cm4gb3BlbkRpYWxvZyhtc2csIElORk8pO1xuXHR9O1xuXG5cdHZhciBvcGVuRGlhbG9nID0gZnVuY3Rpb24obXNnLCB0eXBlLCBjYW5jZWxCdXR0b24pIHtcblx0XHRyZXR1cm4gbmdEaWFsb2cub3BlbkNvbmZpcm0oe1xuXHRcdFx0dGVtcGxhdGU6IFRFTVBMQVRFLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtc2c6IG1zZyxcblx0XHRcdFx0aWNvbkNsYXNzOiBnZXRJY29uQ2xhc3ModHlwZSksXG5cdFx0XHRcdGNhbmNlbEJ1dHRvbjogY2FuY2VsQnV0dG9uXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGdldEljb25DbGFzcyA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRyZXR1cm4gaWNvbkNsYXNzTWFwW3R5cGVdO1xuXHR9O1xuXG5cdHJldHVybiBkaWFsb2c7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZW52aXJvbm1lbnQnLCBmdW5jdGlvbiAoJHEsICRsb2csICR3aW5kb3csIExpYnJhcnlPYmplY3QsIFNlY3Rpb25PYmplY3QsIEJvb2tPYmplY3QsIEJvb2tNYXRlcmlhbCwgZGF0YSwgY2FtZXJhLCBjYWNoZSkge1xuXHR2YXIgZW52aXJvbm1lbnQgPSB7fTtcblxuXHRlbnZpcm9ubWVudC5DTEVBUkFOQ0UgPSAwLjAwMTtcblx0ZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQgPSAnTElCUkFSWSc7XG5cdCBcblx0dmFyIGxpYnJhcnlEdG8gPSBudWxsO1xuXHR2YXIgc2VjdGlvbnMgPSB7fTtcblx0dmFyIGJvb2tzID0ge307XG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblxuXHRlbnZpcm9ubWVudC5zY2VuZSA9IG51bGw7XG5cdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXG5cdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0Y2xlYXJTY2VuZSgpOyAvLyBpbml0cyBzb21lIGZpZWxkc1xuXG5cdFx0dmFyIHByb21pc2UgPSBkYXRhLmdldExpYnJhcnkobGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdHZhciBkaWN0ID0gcGFyc2VMaWJyYXJ5RHRvKGR0byk7XG5cdFx0XHRcblx0XHRcdHNlY3Rpb25zID0gZGljdC5zZWN0aW9ucztcblx0XHRcdGJvb2tzID0gZGljdC5ib29rcztcblx0XHRcdGxpYnJhcnlEdG8gPSBkdG87XG5cblx0XHRcdHJldHVybiBpbml0Q2FjaGUobGlicmFyeUR0bywgZGljdC5zZWN0aW9ucywgZGljdC5ib29rcyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRjcmVhdGVMaWJyYXJ5KGxpYnJhcnlEdG8pO1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVNlY3Rpb25zKHNlY3Rpb25zKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjcmVhdGVCb29rcyhib29rcyk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nb1RvTGlicmFyeSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0aWYoaWQpICR3aW5kb3cubG9jYXRpb24gPSAnLycgKyBpZDtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGxvYWRlZCA9IHZhbHVlO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldExvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsb2FkZWQ7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KGJvb2tzLCBib29rSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChzZWN0aW9ucywgc2VjdGlvbklkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTaGVsZiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgc2hlbGZJZCkge1xuXHRcdHZhciBzZWN0aW9uID0gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihzZWN0aW9uSWQpO1xuXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24gJiYgc2VjdGlvbi5zaGVsdmVzW3NoZWxmSWRdO1xuXG5cdFx0cmV0dXJuIHNoZWxmO1xuXHR9O1xuXG5cdHZhciBnZXREaWN0T2JqZWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqZWN0SWQpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W29iamVjdElkXTtcblx0XHR2YXIgZGljdE9iamVjdCA9IGRpY3RJdGVtICYmIGRpY3RJdGVtLm9iajtcblxuXHRcdHJldHVybiBkaWN0T2JqZWN0O1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdGlmKGR0by5saWJyYXJ5SWQgPT0gZW52aXJvbm1lbnQubGlicmFyeS5pZCkge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbihkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9IGNyZWF0ZVNlY3Rpb24oZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbihkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4oZHRvKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcdFxuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZUJvb2sgPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgcHJvbWlzZTtcblx0XHR2YXIgc2hlbGYgPSBnZXRCb29rU2hlbGYoZHRvKTtcblxuXHRcdGlmKHNoZWxmKSB7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKGR0by5pZCk7XG5cdFx0XHRwcm9taXNlID0gY3JlYXRlQm9vayhkdG8pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKGR0by5pZCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih0cnVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5yZW1vdmVCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGlkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5yZW1vdmVTZWN0aW9uID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZW1vdmVPYmplY3Qoc2VjdGlvbnMsIGlkKTtcblx0fTtcblxuXHR2YXIgcmVtb3ZlT2JqZWN0ID0gZnVuY3Rpb24oZGljdCwga2V5KSB7XG5cdFx0dmFyIGRpY3RJdGVtID0gZGljdFtrZXldO1xuXHRcdGlmKGRpY3RJdGVtKSB7XG5cdFx0XHRkZWxldGUgZGljdFtrZXldO1xuXHRcdFx0XG5cdFx0XHRpZihkaWN0SXRlbS5vYmopIHtcblx0XHRcdFx0ZGljdEl0ZW0ub2JqLnNldFBhcmVudChudWxsKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXRDYWNoZSA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8sIHNlY3Rpb25zRGljdCwgYm9va3NEaWN0KSB7XG5cdFx0dmFyIGxpYnJhcnlNb2RlbCA9IGxpYnJhcnlEdG8ubW9kZWw7XG5cdFx0dmFyIHNlY3Rpb25Nb2RlbHMgPSB7fTtcblx0XHR2YXIgYm9va01vZGVscyA9IHt9O1xuXHRcdHZhciBpbWFnZVVybHMgPSB7fTtcblxuXHRcdGZvciAodmFyIHNlY3Rpb25JZCBpbiBzZWN0aW9uc0RpY3QpIHtcblx0XHRcdHZhciBzZWN0aW9uRHRvID0gc2VjdGlvbnNEaWN0W3NlY3Rpb25JZF0uZHRvO1xuXHRcdFx0c2VjdGlvbk1vZGVsc1tzZWN0aW9uRHRvLm1vZGVsXSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgYm9va0lkIGluIGJvb2tzRGljdCkge1xuXHRcdFx0dmFyIGJvb2tEdG8gPSBib29rc0RpY3RbYm9va0lkXS5kdG87XG5cdFx0XHRib29rTW9kZWxzW2Jvb2tEdG8ubW9kZWxdID0gdHJ1ZTtcblxuXHRcdFx0aWYoYm9va0R0by5jb3Zlcikge1xuXHRcdFx0XHRpbWFnZVVybHNbYm9va0R0by5jb3Zlci5pZF0gPSBib29rRHRvLmNvdmVyO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjYWNoZS5pbml0KGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKTtcblx0fTtcblxuXHR2YXIgY2xlYXJTY2VuZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXHRcdHNlY3Rpb25zID0ge307XG5cdFx0Ym9va3MgPSB7fTtcblxuXHRcdHdoaWxlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdGlmKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUuY2hpbGRyZW5bMF0uZGlzcG9zZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZW52aXJvbm1lbnQuc2NlbmUucmVtb3ZlKGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHBhcnNlTGlicmFyeUR0byA9IGZ1bmN0aW9uKGxpYnJhcnlEdG8pIHtcblx0XHR2YXIgcmVzdWx0ID0ge1xuXHRcdFx0c2VjdGlvbnM6IHt9LFxuXHRcdFx0Ym9va3M6IHt9XG5cdFx0fTtcblxuXHRcdGZvcih2YXIgc2VjdGlvbkluZGV4ID0gbGlicmFyeUR0by5zZWN0aW9ucy5sZW5ndGggLSAxOyBzZWN0aW9uSW5kZXggPj0gMDsgc2VjdGlvbkluZGV4LS0pIHtcblx0XHRcdHZhciBzZWN0aW9uRHRvID0gbGlicmFyeUR0by5zZWN0aW9uc1tzZWN0aW9uSW5kZXhdO1xuXHRcdFx0cmVzdWx0LnNlY3Rpb25zW3NlY3Rpb25EdG8uaWRdID0ge2R0bzogc2VjdGlvbkR0b307XG5cblx0XHRcdGZvcih2YXIgYm9va0luZGV4ID0gc2VjdGlvbkR0by5ib29rcy5sZW5ndGggLSAxOyBib29rSW5kZXggPj0gMDsgYm9va0luZGV4LS0pIHtcblx0XHRcdFx0dmFyIGJvb2tEdG8gPSBzZWN0aW9uRHRvLmJvb2tzW2Jvb2tJbmRleF07XG5cdFx0XHRcdHJlc3VsdC5ib29rc1tib29rRHRvLmlkXSA9IHtkdG86IGJvb2tEdG99O1xuXHRcdFx0fVxuXG5cdFx0XHRkZWxldGUgc2VjdGlvbkR0by5ib29rcztcblx0XHR9XG5cblx0XHRkZWxldGUgbGlicmFyeUR0by5zZWN0aW9ucztcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGNyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIGxpYnJhcnkgPSBudWxsO1xuXHRcdHZhciBsaWJyYXJ5Q2FjaGUgPSBjYWNoZS5nZXRMaWJyYXJ5KCk7XG4gICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUobGlicmFyeUNhY2hlLm1hcEltYWdlKTtcbiAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblxuICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRsaWJyYXJ5ID0gbmV3IExpYnJhcnlPYmplY3QobGlicmFyeUR0bywgbGlicmFyeUNhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdFx0Y2FtZXJhLnNldFBhcmVudChsaWJyYXJ5KTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lLmFkZChsaWJyYXJ5KTtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbGlicmFyeTtcblx0fTtcblxuXHR2YXIgY3JlYXRlU2VjdGlvbnMgPSBmdW5jdGlvbihzZWN0aW9uc0RpY3QpIHtcblx0XHRyZXR1cm4gY3JlYXRlT2JqZWN0cyhzZWN0aW9uc0RpY3QsIGNyZWF0ZVNlY3Rpb24pO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVCb29rcyA9IGZ1bmN0aW9uKGJvb2tzRGljdCkge1xuXHRcdHJldHVybiBjcmVhdGVPYmplY3RzKGJvb2tzRGljdCwgY3JlYXRlQm9vayk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZU9iamVjdHMgPSBmdW5jdGlvbihkaWN0LCBmYWN0b3J5KSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Zm9yKGtleSBpbiBkaWN0KSB7XG5cdFx0XHRyZXN1bHRzLnB1c2goZmFjdG9yeShkaWN0W2tleV0uZHRvKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICRxLmFsbChyZXN1bHRzKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EdG8pIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldFNlY3Rpb24oc2VjdGlvbkR0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdCAgICAgICAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShzZWN0aW9uQ2FjaGUubWFwSW1hZ2UpO1xuXHQgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cdCAgICAgICAgdmFyIHNlY3Rpb247XG5cblx0ICAgICAgICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0ICAgICAgICBzZWN0aW9uRHRvLmRhdGEgPSBzZWN0aW9uQ2FjaGUuZGF0YTtcblxuXHQgICAgICAgIHNlY3Rpb24gPSBuZXcgU2VjdGlvbk9iamVjdChzZWN0aW9uRHRvLCBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdFx0ZW52aXJvbm1lbnQubGlicmFyeS5hZGQoc2VjdGlvbik7XG5cdFx0XHRhZGRUb0RpY3Qoc2VjdGlvbnMsIHNlY3Rpb24pO1xuXG5cdFx0XHRyZXR1cm4gc2VjdGlvbkR0bztcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlcyA9IHt9O1xuXHRcdHZhciBwcm9taXNlO1xuXG5cdFx0cHJvbWlzZXMuYm9va0NhY2hlID0gY2FjaGUuZ2V0Qm9vayhib29rRHRvLm1vZGVsKTtcblx0XHRpZihib29rRHRvLmNvdmVySWQpIHtcblx0XHRcdHByb21pc2VzLmNvdmVyQ2FjaGUgPSBjYWNoZS5nZXRJbWFnZShib29rRHRvLmNvdmVySWQpO1xuXHRcdH1cblxuXHRcdHByb21pc2UgPSAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcblx0XHRcdHZhciBib29rQ2FjaGUgPSByZXN1bHRzLmJvb2tDYWNoZTtcblx0XHRcdHZhciBjb3Zlck1hcEltYWdlID0gcmVzdWx0cy5jb3ZlckNhY2hlICYmIHJlc3VsdHMuY292ZXJDYWNoZS5pbWFnZTtcblx0XHRcdHZhciBtYXRlcmlhbCA9IG5ldyBCb29rTWF0ZXJpYWwoYm9va0NhY2hlLm1hcEltYWdlLCBib29rQ2FjaGUuYnVtcE1hcEltYWdlLCBib29rQ2FjaGUuc3BlY3VsYXJNYXBJbWFnZSwgY292ZXJNYXBJbWFnZSk7XG5cdFx0XHR2YXIgYm9vayA9IG5ldyBCb29rT2JqZWN0KGJvb2tEdG8sIGJvb2tDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0XHRhZGRUb0RpY3QoYm9va3MsIGJvb2spO1xuXHRcdFx0cGxhY2VCb29rT25TaGVsZihib29rKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBhZGRUb0RpY3QgPSBmdW5jdGlvbihkaWN0LCBvYmopIHtcblx0XHR2YXIgZGljdEl0ZW0gPSB7XG5cdFx0XHRkdG86IG9iai5kYXRhT2JqZWN0LFxuXHRcdFx0b2JqOiBvYmpcblx0XHR9O1xuXG5cdFx0ZGljdFtvYmouaWRdID0gZGljdEl0ZW07XG5cdH07XG5cblx0dmFyIGdldEJvb2tTaGVsZiA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0U2hlbGYoYm9va0R0by5zZWN0aW9uSWQsIGJvb2tEdG8uc2hlbGZJZCk7XG5cdH07XG5cblx0dmFyIHBsYWNlQm9va09uU2hlbGYgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGJvb2suZGF0YU9iamVjdCk7XG5cdFx0c2hlbGYuYWRkKGJvb2spO1xuXHR9O1xuXG5cdHJldHVybiBlbnZpcm9ubWVudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtYWluJywgZnVuY3Rpb24gKCRsb2csICRxLCBjYW1lcmEsIGNvbnRyb2xzLCB1c2VyLCBlbnZpcm9ubWVudCwgdG9vbHMsIG5hdmlnYXRpb24sIHVzZXJEYXRhLCBibG9jaywgbG9jYXRvcikge1x0XG5cdHZhciBjYW52YXM7XG5cdHZhciByZW5kZXJlcjtcblx0XG5cdHZhciBtYWluID0ge307XG5cblx0bWFpbi5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKERldGVjdG9yLndlYmdsKSB7XG5cdFx0XHRpbml0KCk7XG5cdFx0XHRjb250cm9scy5pbml0KCk7XG5cblx0XHRcdHN0YXJ0UmVuZGVyTG9vcCgpO1xuXG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gJHEuYWxsKFtlbnZpcm9ubWVudC5sb2FkTGlicmFyeSh1c2VyLmdldExpYnJhcnkoKSB8fCAxKSwgdXNlckRhdGEubG9hZCgpXSk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRsb2NhdG9yLmNlbnRlck9iamVjdChjYW1lcmEub2JqZWN0KTtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkKHRydWUpO1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBEZXRlY3Rvci5hZGRHZXRXZWJHTE1lc3NhZ2UoKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2luUmVzaXplO1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbnZpcm9ubWVudC5MSUJSQVJZX0NBTlZBU19JRCk7XG5cdFx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7Y2FudmFzOiBjYW52YXMgPyBjYW52YXMgOiB1bmRlZmluZWQsIGFudGlhbGlhczogdHJ1ZX0pO1xuXHRcdHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0d2luUmVzaXplID0gbmV3IFRIUkVFeC5XaW5kb3dSZXNpemUocmVuZGVyZXIsIGNhbWVyYS5jYW1lcmEpO1xuXG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblx0XHRlbnZpcm9ubWVudC5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKDB4MDAwMDAwLCA0LCA3KTtcblx0fTtcblxuXHR2YXIgc3RhcnRSZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0YXJ0UmVuZGVyTG9vcCk7XG5cblx0XHRjb250cm9scy51cGRhdGUoKTtcblx0XHRuYXZpZ2F0aW9uLnVwZGF0ZSgpO1xuXHRcdHRvb2xzLnVwZGF0ZSgpO1xuXHRcdFxuXHRcdHJlbmRlcmVyLnJlbmRlcihlbnZpcm9ubWVudC5zY2VuZSwgY2FtZXJhLmNhbWVyYSk7XG5cdH07XG5cblx0cmV0dXJuIG1haW47XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbW91c2UnLCBmdW5jdGlvbiAoY2FtZXJhLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgbW91c2UgPSB7fTtcblxuXHR2YXIgZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG5cdH07XG5cblx0dmFyIGdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH07XG5cblx0dmFyIHggPSBudWxsO1xuXHR2YXIgeSA9IG51bGw7XG5cdFxuXHRtb3VzZS50YXJnZXQgPSBudWxsO1xuXHRtb3VzZS5kWCA9IG51bGw7XG5cdG1vdXNlLmRZID0gbnVsbDtcblx0bW91c2UubG9uZ1ggPSBudWxsO1xuXHRtb3VzZS5sb25nWSA9IG51bGw7XG5cblx0bW91c2UuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHR9O1xuXG5cdG1vdXNlLmRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHggPSBldmVudC5jbGllbnRYO1xuXHRcdFx0eSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHRtb3VzZS5sb25nWCA9IGdldFdpZHRoKCkgKiAwLjUgLSB4O1xuXHRcdFx0bW91c2UubG9uZ1kgPSBnZXRIZWlnaHQoKSAqIDAuNSAtIHk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLnVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSBmYWxzZTtcblx0XHRcdC8vIGxpbnV4IGNocm9tZSBidWcgZml4ICh3aGVuIGJvdGgga2V5cyByZWxlYXNlIHRoZW4gYm90aCBldmVudC53aGljaCBlcXVhbCAzKVxuXHRcdFx0dGhpc1sxXSA9IGZhbHNlOyBcblx0XHR9XG5cdH07XG5cblx0bW91c2UubW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0bW91c2UubG9uZ1ggPSBnZXRXaWR0aCgpICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gZ2V0SGVpZ2h0KCkgKiAwLjUgLSB5O1xuXHRcdFx0bW91c2UuZFggPSBldmVudC5jbGllbnRYIC0geDtcblx0XHRcdG1vdXNlLmRZID0gZXZlbnQuY2xpZW50WSAtIHk7XG5cdFx0XHR4ID0gZXZlbnQuY2xpZW50WDtcblx0XHRcdHkgPSBldmVudC5jbGllbnRZO1xuXHRcdH1cblx0fTtcblxuXHRtb3VzZS5pc0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRhcmdldC5pZCA9PT0gZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQ7XG5cdH07XG5cblx0bW91c2UuaXNQb2NrZXRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvL1RPRE86IHN0dWJcblx0XHQvLyByZXR1cm4gISEodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQucGFyZW50Tm9kZSA9PSBVSS5tZW51LmludmVudG9yeS5ib29rcyk7XG5cdH07XG5cblx0bW91c2UuZ2V0SW50ZXJzZWN0ZWQgPSBmdW5jdGlvbihvYmplY3RzLCByZWN1cnNpdmUsIHNlYXJjaEZvcikge1xuXHRcdHZhclxuXHRcdFx0dmVjdG9yLFxuXHRcdFx0cmF5Y2FzdGVyLFxuXHRcdFx0aW50ZXJzZWN0cyxcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0aSwgajtcblxuXHRcdHJlc3VsdCA9IG51bGw7XG5cdFx0dmVjdG9yID0gZ2V0VmVjdG9yKCk7XG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcihjYW1lcmEuZ2V0UG9zaXRpb24oKSwgdmVjdG9yKTtcblx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdGlmKHNlYXJjaEZvcikge1xuXHRcdFx0aWYoaW50ZXJzZWN0cy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkID0gaW50ZXJzZWN0c1tpXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0aWYoaW50ZXJzZWN0ZWQub2JqZWN0IGluc3RhbmNlb2Ygc2VhcmNoRm9yW2pdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IGludGVyc2VjdGVkO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBnZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygoeCAvIGdldFdpZHRoKCkpICogMiAtIDEsIC0gKHkgLyBnZXRIZWlnaHQoKSkgKiAyICsgMSwgMC41KTtcblx0XHRwcm9qZWN0b3IudW5wcm9qZWN0VmVjdG9yKHZlY3RvciwgY2FtZXJhLmNhbWVyYSk7XG5cdFxuXHRcdHJldHVybiB2ZWN0b3Iuc3ViKGNhbWVyYS5nZXRQb3NpdGlvbigpKS5ub3JtYWxpemUoKTtcblx0fTtcblxuXHRyZXR1cm4gbW91c2U7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbmF2aWdhdGlvbicsIGZ1bmN0aW9uIChjYW1lcmEpIHtcblx0dmFyIG5hdmlnYXRpb24gPSB7fTtcblxuXHRuYXZpZ2F0aW9uLkJVVFRPTlNfUk9UQVRFX1NQRUVEID0gMTAwO1xuXHRuYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRmb3J3YXJkOiBmYWxzZSxcblx0XHRiYWNrd2FyZDogZmFsc2UsXG5cdFx0bGVmdDogZmFsc2UsXG5cdFx0cmlnaHQ6IGZhbHNlXHRcdFx0XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb1N0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5mb3J3YXJkID0gZmFsc2U7XG5cdFx0c3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0XHRzdGF0ZS5sZWZ0ID0gZmFsc2U7XG5cdFx0c3RhdGUucmlnaHQgPSBmYWxzZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmZvcndhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29CYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmJhY2t3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmxlZnQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29SaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLnJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHN0YXRlLmZvcndhcmQpIHtcblx0XHRcdGNhbWVyYS5nbyhuYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5iYWNrd2FyZCkge1xuXHRcdFx0Y2FtZXJhLmdvKC1uYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5sZWZ0KSB7XG5cdFx0XHRjYW1lcmEucm90YXRlKG5hdmlnYXRpb24uQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5yaWdodCkge1xuXHRcdFx0Y2FtZXJhLnJvdGF0ZSgtbmF2aWdhdGlvbi5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBuYXZpZ2F0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3VzZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuXHR2YXIgdXNlciA9IHt9O1xuXG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblx0dmFyIF9kYXRhT2JqZWN0ID0gbnVsbDtcblx0dmFyIGxpYnJhcnkgPSBudWxsO1xuXG5cdHVzZXIubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHRyZXR1cm4gZGF0YS5nZXRVc2VyKCkudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHRzY29wZS5zZXREYXRhT2JqZWN0KGR0byk7XG5cdFx0XHRzY29wZS5zZXRMaWJyYXJ5KCk7XG5cdFx0XHRsb2FkZWQgPSB0cnVlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHVzZXIubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRhdGEubG9nb3V0KCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdXNlci5sb2FkKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dXNlci5zZXREYXRhT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCkge1xuXHRcdF9kYXRhT2JqZWN0ID0gZGF0YU9iamVjdDtcblx0fTtcblxuXHR1c2VyLmdldExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlicmFyeTtcblx0fTtcblxuXHR1c2VyLmdldE5hbWUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX2RhdGFPYmplY3QgJiYgX2RhdGFPYmplY3QubmFtZTtcblx0fTtcblxuXHR1c2VyLmdldEVtYWlsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LmVtYWlsO1xuXHR9O1xuXG5cdHVzZXIuc2V0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdGxpYnJhcnlJZCA9IGxpYnJhcnlJZCB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpO1xuXHRcdGxpYnJhcnkgPSBOdW1iZXIobGlicmFyeUlkKTtcblx0fTtcblxuXHR1c2VyLmdldElkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LmlkO1xuXHR9O1xuXG5cdHVzZXIuaXNBdXRob3JpemVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmICF1c2VyLmlzVGVtcG9yYXJ5KCk7XG5cdH07XG5cblx0dXNlci5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsb2FkZWQ7XG5cdH07XG5cblx0dXNlci5pc1RlbXBvcmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnRlbXBvcmFyeSk7XG5cdH07XG5cblx0dXNlci5pc0dvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0Lmdvb2dsZUlkKTtcblx0fTtcblxuXHR1c2VyLmlzVHdpdHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnR3aXR0ZXJJZCk7XG5cdH07XG5cblx0dXNlci5pc0ZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIEJvb2xlYW4oX2RhdGFPYmplY3QgJiYgX2RhdGFPYmplY3QuZmFjZWJvb2tJZCk7XG5cdH07XG5cblx0dXNlci5pc1Zrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnZrb250YWt0ZUlkKTtcblx0fTtcblxuXHRyZXR1cm4gdXNlcjtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tNYXRlcmlhbCcsIGZ1bmN0aW9uICgpIHtcblx0dmFyIEJvb2tNYXRlcmlhbCA9IGZ1bmN0aW9uKG1hcEltYWdlLCBidW1wTWFwSW1hZ2UsIHNwZWN1bGFyTWFwSW1hZ2UsIGNvdmVyTWFwSW1hZ2UpIHtcblx0XHR2YXIgZGVmaW5lcyA9IHt9O1xuXHRcdHZhciB1bmlmb3Jtcztcblx0XHR2YXIgcGFyYW1ldGVycztcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICB2YXIgYnVtcE1hcDtcbiAgICAgICAgdmFyIHNwZWN1bGFyTWFwO1xuICAgICAgICB2YXIgY292ZXJNYXA7XG5cdFx0XG5cdFx0dW5pZm9ybXMgPSBUSFJFRS5Vbmlmb3Jtc1V0aWxzLm1lcmdlKFtcblx0XHRcdFRIUkVFLlVuaWZvcm1zTGliLmNvbW1vbixcblx0XHRcdFRIUkVFLlVuaWZvcm1zTGliLmJ1bXAsXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5mb2csXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5saWdodHNcblx0XHRdKTtcblxuXHRcdHVuaWZvcm1zLnNoaW5pbmVzcyA9IHt0eXBlOiAnZicsIHZhbHVlOiAzMH07XG5cdFx0ZGVmaW5lcy5QSE9ORyA9IHRydWU7XG5cblx0XHRpZihtYXBJbWFnZSkge1xuXHRcdFx0bWFwID0gbmV3IFRIUkVFLlRleHR1cmUobWFwSW1hZ2UpO1xuXHRcdFx0bWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRcdHVuaWZvcm1zLm1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBtYXB9O1xuXHRcdFx0dGhpcy5tYXAgPSB0cnVlO1xuXHRcdH1cblx0XHRpZihidW1wTWFwSW1hZ2UpIHtcblx0XHRcdGJ1bXBNYXAgPSBuZXcgVEhSRUUuVGV4dHVyZShidW1wTWFwSW1hZ2UpO1xuXHRcdFx0YnVtcE1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5idW1wTWFwID0ge3R5cGU6ICd0JywgdmFsdWU6IGJ1bXBNYXB9O1xuXHRcdFx0dW5pZm9ybXMuYnVtcFNjYWxlLnZhbHVlID0gMC4wMDU7XG5cdFx0XHR0aGlzLmJ1bXBNYXAgPSB0cnVlO1xuXHRcdH1cblx0XHRpZihzcGVjdWxhck1hcEltYWdlKSB7XG5cdFx0XHRzcGVjdWxhck1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKHNwZWN1bGFyTWFwSW1hZ2UpO1xuXHRcdFx0c3BlY3VsYXJNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuc3BlY3VsYXIgPSB7dHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKDB4NTU1NTU1KX07XG5cdFx0XHR1bmlmb3Jtcy5zcGVjdWxhck1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBzcGVjdWxhck1hcH07XG5cdFx0XHR0aGlzLnNwZWN1bGFyTWFwID0gdHJ1ZTtcblx0XHR9XG4gICAgICAgIGlmKGNvdmVyTWFwSW1hZ2UpIHtcblx0XHRcdGNvdmVyTWFwID0gbmV3IFRIUkVFLlRleHR1cmUoY292ZXJNYXBJbWFnZSk7XG5cdFx0XHRjb3Zlck1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5jb3Zlck1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBjb3Zlck1hcH07XG5cdFx0XHRkZWZpbmVzLlVTRV9DT1ZFUiA9IHRydWU7XG4gICAgICAgIH1cblxuXHRcdHBhcmFtZXRlcnMgPSB7XG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IHZlcnRleFNoYWRlcixcdFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyLFxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zLFxuXHRcdFx0ZGVmaW5lczogZGVmaW5lcyxcblx0XHRcdGxpZ2h0czogdHJ1ZSxcblx0XHRcdGZvZzogdHJ1ZVxuXHRcdH07XG5cblx0XHRUSFJFRS5TaGFkZXJNYXRlcmlhbC5jYWxsKHRoaXMsIHBhcmFtZXRlcnMpO1xuXHR9O1xuXG5cdEJvb2tNYXRlcmlhbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRIUkVFLlNoYWRlck1hdGVyaWFsLnByb3RvdHlwZSk7XG5cblx0Qm9va01hdGVyaWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRIUkVFLkJvb2tNYXRlcmlhbDtcblxuXHR2YXIgdmVydGV4U2hhZGVyID0gW1xuXHRcdCd2YXJ5aW5nIHZlYzMgdlZpZXdQb3NpdGlvbjsnLFxuXHRcdCd2YXJ5aW5nIHZlYzMgdk5vcm1hbDsnLFxuXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsubWFwX3BhcnNfdmVydGV4LFxuXHRcdFRIUkVFLlNoYWRlckNodW5rLmxpZ2h0c19waG9uZ19wYXJzX3ZlcnRleCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5jb2xvcl9wYXJzX3ZlcnRleCxcblxuXHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLm1hcF92ZXJ0ZXgsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5jb2xvcl92ZXJ0ZXgsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5kZWZhdWx0bm9ybWFsX3ZlcnRleCxcblx0XHRcdCd2Tm9ybWFsID0gbm9ybWFsaXplKHRyYW5zZm9ybWVkTm9ybWFsKTsnLFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuZGVmYXVsdF92ZXJ0ZXgsXG5cdFx0XHQndlZpZXdQb3NpdGlvbiA9IC1tdlBvc2l0aW9uLnh5ejsnLFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsud29ybGRwb3NfdmVydGV4LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsubGlnaHRzX3Bob25nX3ZlcnRleCxcblx0XHQnfSdcblx0XS5qb2luKCdcXG4nKTtcblxuXHR2YXIgZnJhZ21lbnRTaGFkZXIgPSBbXG5cdFx0J3VuaWZvcm0gdmVjMyBkaWZmdXNlOycsXG5cdFx0J3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuXG5cdFx0J3VuaWZvcm0gdmVjMyBhbWJpZW50OycsXG5cdFx0J3VuaWZvcm0gdmVjMyBlbWlzc2l2ZTsnLFxuXHRcdCd1bmlmb3JtIHZlYzMgc3BlY3VsYXI7Jyxcblx0XHQndW5pZm9ybSBmbG9hdCBzaGluaW5lc3M7JyxcblxuXHRcdCd1bmlmb3JtIHNhbXBsZXIyRCBjb3Zlck1hcDsnLFxuXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5tYXBfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5mb2dfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5saWdodHNfcGhvbmdfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5idW1wbWFwX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuc3BlY3VsYXJtYXBfcGFyc19mcmFnbWVudCxcblxuXHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdCd2ZWM0IHRlc3Rjb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTsnLFxuXHRcdFx0J2Zsb2F0IGVwcyA9IDAuMDA0OycsXG5cdFx0XHQndmVjNCBiYXNlQ29sb3IgID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuXG5cdFx0XHQnI2lmZGVmIFVTRV9DT1ZFUicsXG5cdFx0ICAgIFx0J3ZlYzQgY292ZXJDb2xvciA9IHRleHR1cmUyRChjb3Zlck1hcCwgdlV2ICogdmVjMigyLjMsIDEuMykgLSB2ZWMyKDEuMywgMC4zKSk7Jyxcblx0XHRcdCAgICAnaWYodlV2LnkgPiAwLjIzICYmICh2VXYueCA+IDAuNTcgfHwgKGFsbChncmVhdGVyVGhhbkVxdWFsKGJhc2VDb2xvcix0ZXN0Y29sb3ItZXBzKSkgJiYgYWxsKGxlc3NUaGFuRXF1YWwoYmFzZUNvbG9yLHRlc3Rjb2xvcitlcHMpKSkpKScsXG5cdFx0XHQgICAgXHQnZ2xfRnJhZ0NvbG9yID0gY292ZXJDb2xvcjsnLFxuXHRcdFx0ICAgICdlbHNlJyxcblx0XHRcdCAgICBcdCdnbF9GcmFnQ29sb3IgPSBiYXNlQ29sb3I7Jyxcblx0XHRcdCcjZWxzZScsXG5cdFx0ICAgIFx0J2dsX0ZyYWdDb2xvciA9IGJhc2VDb2xvcjsnLFxuXHRcdFx0JyNlbmRpZicsXG5cblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLnNwZWN1bGFybWFwX2ZyYWdtZW50LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsubGlnaHRzX3Bob25nX2ZyYWdtZW50LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfZnJhZ21lbnQsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5mb2dfZnJhZ21lbnQsXG5cdFx0J30nXHRcdFxuXHRdLmpvaW4oJ1xcbicpO1xuXG5cdHJldHVybiBCb29rTWF0ZXJpYWw7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQmFzZU9iamVjdCcsIGZ1bmN0aW9uIChzdWJjbGFzc09mKSB7XG5cdHZhciBCYXNlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QgPSBkYXRhT2JqZWN0IHx8IHt9O1xuXHRcdFxuXHRcdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdFx0dGhpcy5yb3RhdGlvbi5vcmRlciA9ICdYWVonO1xuXG5cdFx0dGhpcy5zZXREdG9UcmFuc2Zvcm1hdGlvbnMoKTtcblx0fTtcblx0XG5cdEJhc2VPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihUSFJFRS5NZXNoKTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudHlwZTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5zZXREdG9UcmFuc2Zvcm1hdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGhpcy5kYXRhT2JqZWN0LnBvc194LCB0aGlzLmRhdGFPYmplY3QucG9zX3ksIHRoaXMuZGF0YU9iamVjdC5wb3Nfeik7XG5cdFx0aWYodGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uKSB0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1x0XHRcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc091dE9mUGFycmVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLngpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy54IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueCkgfHxcblx0XHRcdFx0TWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci56KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueiAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnopO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmlzQ29sbGlkZWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXJcblx0XHRcdHJlc3VsdCxcblx0XHRcdHRhcmdldHMsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRpO1xuXG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmVzdWx0ID0gdGhpcy5pc091dE9mUGFycmVudCgpO1xuXHRcdHRhcmdldHMgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcblxuXHRcdGlmKCFyZXN1bHQpIHtcblx0XHRcdGZvcihpID0gdGFyZ2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR0YXJnZXQgPSB0YXJnZXRzW2ldLmJvdW5kaW5nQm94O1xuXG5cdFx0XHRcdGlmKHRhcmdldHNbaV0gPT09IHRoaXMgfHxcblx0XHRcdFx0XHQhdGFyZ2V0IHx8IC8vIGNoaWxkcmVuIHdpdGhvdXQgQkJcblx0XHRcdFx0XHQoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueCAtIHRhcmdldC5jZW50ZXIueCkgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueCArIHRhcmdldC5yYWRpdXMueCkpIHx8XG5cdFx0XHRcdFx0KE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnkgLSB0YXJnZXQuY2VudGVyLnkpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkgKyB0YXJnZXQucmFkaXVzLnkpKSB8fFxuXHRcdFx0XHRcdChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGFyZ2V0LmNlbnRlci56KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56ICsgdGFyZ2V0LnJhZGl1cy56KSkpIHtcdFxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgXHRyZXN1bHQgPSB0cnVlO1x0XHRcblx0XHQgICAgXHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbihuZXdQb3NpdGlvbikge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRQb3NpdGlvbixcblx0XHRcdHJlc3VsdDtcblxuXHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdGN1cnJlbnRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcblx0XHRpZihuZXdQb3NpdGlvbi54KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgobmV3UG9zaXRpb24ueCk7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WChjdXJyZW50UG9zaXRpb24ueCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKG5ld1Bvc2l0aW9uLnopIHtcblx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihuZXdQb3NpdGlvbi56KTtcblxuXHRcdFx0aWYodGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRaKGN1cnJlbnRQb3NpdGlvbi56KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8IHJlc3VsdDtcblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKGRYLCBkWSwgaXNEZW1vKSB7XG5cdFx0dmFyIFxuXHRcdFx0Y3VycmVudFJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi5jbG9uZSgpLFxuXHRcdFx0cmVzdWx0ID0gZmFsc2U7IFxuXHRcdFxuXHRcdGlmKGRYKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uLnkgKz0gZFggKiAwLjAxO1xuXG5cdFx0XHRpZighaXNEZW1vICYmIHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucm90YXRpb24ueSA9IGN1cnJlbnRSb3RhdGlvbi55O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihkWSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi54ICs9IGRZICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnggPSBjdXJyZW50Um90YXRpb24ueDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8ICghaXNEZW1vICYmIHJlc3VsdCk7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRib3VuZGluZ0JveCxcblx0XHRcdHJhZGl1cyxcblx0XHRcdGNlbnRlcjtcblxuXHRcdHRoaXMudXBkYXRlTWF0cml4KCk7XG5cdFx0Ym91bmRpbmdCb3ggPSB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94LmNsb25lKCkuYXBwbHlNYXRyaXg0KHRoaXMubWF0cml4KTtcblx0XHRcblx0XHRyYWRpdXMgPSB7XG5cdFx0XHR4OiAoYm91bmRpbmdCb3gubWF4LnggLSBib3VuZGluZ0JveC5taW4ueCkgKiAwLjUsXG5cdFx0XHR5OiAoYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueSkgKiAwLjUsXG5cdFx0XHR6OiAoYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4ueikgKiAwLjVcblx0XHR9O1xuXG5cdFx0Y2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0XHRjZW50ZXIuYWRkVmVjdG9ycyhib3VuZGluZ0JveC5taW4sIGJvdW5kaW5nQm94Lm1heCk7XG5cdFx0Y2VudGVyLm11bHRpcGx5U2NhbGFyKDAuNSk7XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IGNlbnRlclxuXHRcdH07XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUucm9sbGJhY2sgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldER0b1RyYW5zZm9ybWF0aW9ucygpO1xuXHR9O1xuXG5cdHJldHVybiBCYXNlT2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQm9va09iamVjdCcsIGZ1bmN0aW9uICgkbG9nLCBCYXNlT2JqZWN0LCBkYXRhLCBzdWJjbGFzc09mKSB7XHRcblx0dmFyIEJvb2tPYmplY3QgPSBmdW5jdGlvbihkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0fTtcblxuXHRCb29rT2JqZWN0LlRZUEUgPSAnQm9va09iamVjdCc7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS50eXBlID0gQm9va09iamVjdC5UWVBFO1xuXG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5kYXRhT2JqZWN0LmlkLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56XG5cdFx0fTtcblxuXHRcdHJldHVybiBkYXRhLnBvc3RCb29rKGR0bykudGhlbihmdW5jdGlvbiAocmVzcG9uc2VEdG8pIHtcblx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSByZXNwb25zZUR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRpZih0aGlzLnBhcmVudCAhPSBwYXJlbnQpIHtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuYWRkKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IHBhcmVudC5pZDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IHBhcmVudC5wYXJlbnQuaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gbnVsbDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBCb29rT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbWVyYU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBzdWJjbGFzc09mKSB7XG5cdHZhciBDYW1lcmFPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblx0XHRnZW9tZXRyeS5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKG5ldyBUSFJFRS5WZWN0b3IzKC0wLjEsIC0xLCAtMC4xKSwgbmV3IFRIUkVFLlZlY3RvcjMoMC4xLCAxLCAwLjEpKTtcblxuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBudWxsLCBnZW9tZXRyeSk7XG5cdH07XG5cblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZSA9IHN1YmNsYXNzT2YoQmFzZU9iamVjdCk7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhZGl1cyA9IHtcblx0XHRcdHg6IHRoaXMuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LngsIFxuXHRcdFx0eTogdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueSwgXG5cdFx0XHR6OiB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC56XG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogdGhpcy5wb3NpdGlvbiAvL1RPRE86IG5lZWRzIGNlbnRlciBvZiBzZWN0aW9uIGluIHBhcmVudCBvciB3b3JsZCBjb29yZGluYXRlc1xuXHRcdH07XG5cdH07XG5cblx0cmV0dXJuIENhbWVyYU9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdMaWJyYXJ5T2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIHN1YmNsYXNzT2YpIHtcblx0dmFyIExpYnJhcnlPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdH07XG5cblx0TGlicmFyeU9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXG5cdHJldHVybiBMaWJyYXJ5T2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2VjdGlvbk9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBTaGVsZk9iamVjdCwgZGF0YSwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2VjdGlvbk9iamVjdCA9IGZ1bmN0aW9uKHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdHRoaXMuc2hlbHZlcyA9IHt9O1xuXHRcdGZvcih2YXIga2V5IGluIHBhcmFtcy5kYXRhLnNoZWx2ZXMpIHtcblx0XHRcdHRoaXMuc2hlbHZlc1trZXldID0gbmV3IFNoZWxmT2JqZWN0KHBhcmFtcy5kYXRhLnNoZWx2ZXNba2V5XSk7IFxuXHRcdFx0dGhpcy5hZGQodGhpcy5zaGVsdmVzW2tleV0pO1xuXHRcdH1cblx0fTtcblxuXHRTZWN0aW9uT2JqZWN0LlRZUEUgPSAnU2VjdGlvbk9iamVjdCc7XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS50eXBlID0gU2VjdGlvbk9iamVjdC5UWVBFO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5kYXRhT2JqZWN0LmlkLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56LFxuXHRcdFx0cm90YXRpb246IFt0aGlzLnJvdGF0aW9uLngsIHRoaXMucm90YXRpb24ueSwgdGhpcy5yb3RhdGlvbi56XVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlRHRvKSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzcG9uc2VEdG87XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0aWYodGhpcy5wYXJlbnQgIT0gcGFyZW50KSB7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LmxpYnJhcnlJZCA9IHBhcmVudC5pZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LmxpYnJhcnlJZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBTZWN0aW9uT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlbGVjdG9yTWV0YScsIGZ1bmN0aW9uICgpIHtcblx0dmFyIFNlbGVjdG9yTWV0YSA9IGZ1bmN0aW9uKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0aWYoc2VsZWN0ZWRPYmplY3QpIHtcblx0XHRcdHRoaXMuaWQgPSBzZWxlY3RlZE9iamVjdC5pZDtcblx0XHRcdHRoaXMucGFyZW50SWQgPSBzZWxlY3RlZE9iamVjdC5wYXJlbnQuaWQ7XG5cdFx0XHR0aGlzLnR5cGUgPSBzZWxlY3RlZE9iamVjdC5nZXRUeXBlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlbGVjdG9yTWV0YS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5pZDtcblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gISghbWV0YSB8fCBcblx0XHRcdFx0bWV0YS5pZCAhPT0gdGhpcy5pZCB8fCBcblx0XHRcdFx0bWV0YS5wYXJlbnRJZCAhPT0gdGhpcy5wYXJlbnRJZCB8fCBcblx0XHRcdFx0bWV0YS50eXBlICE9PSB0aGlzLnR5cGUpO1xuXHR9O1xuXHRcblx0cmV0dXJuIFNlbGVjdG9yTWV0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGFEdG8nLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBzdWJjbGFzc09mKSB7XG5cdHZhciBTZWxlY3Rvck1ldGFEdG8gPSBmdW5jdGlvbih0eXBlLCBpZCwgcGFyZW50SWQpIHtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLnBhcmVudElkID0gcGFyZW50SWQ7XG5cdH07XG5cdFxuXHRTZWxlY3Rvck1ldGFEdG8ucHJvdG90eXBlID0gc3ViY2xhc3NPZihTZWxlY3Rvck1ldGEpO1xuXG5cdHJldHVybiBTZWxlY3Rvck1ldGFEdG87XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplO1x0XG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnkpO1xuXG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHBhcmFtcy5wb3NpdGlvblswXSwgcGFyYW1zLnBvc2l0aW9uWzFdLCBwYXJhbXMucG9zaXRpb25bMl0pO1xuXHRcdHRoaXMuc2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHR9O1xuXG5cdFNoZWxmT2JqZWN0LlRZUEUgPSAnU2hlbGZPYmplY3QnO1xuXG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZSA9IHN1YmNsYXNzT2YoQmFzZU9iamVjdCk7XG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZS50eXBlID0gU2hlbGZPYmplY3QuVFlQRTtcblxuXHRyZXR1cm4gU2hlbGZPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc3ViY2xhc3NPZicsIGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gX3N1YmNsYXNzT2YoKSB7fVxuXG5cdGZ1bmN0aW9uIHN1YmNsYXNzT2YoYmFzZSkge1xuXHQgICAgX3N1YmNsYXNzT2YucHJvdG90eXBlID0gYmFzZS5wcm90b3R5cGU7XG5cdCAgICByZXR1cm4gbmV3IF9zdWJjbGFzc09mKCk7XG5cdH1cblxuXHRyZXR1cm4gc3ViY2xhc3NPZjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdncmlkQ2FsY3VsYXRvcicsIGZ1bmN0aW9uICgpIHtcblx0dmFyIGdyaWRDYWxjdWxhdG9yID0ge307XG5cblx0Z3JpZENhbGN1bGF0b3IuZ2V0RWRnZXMgPSBmdW5jdGlvbihzcGFjZUJCLCBwcmVjaXNpb24pIHtcblx0XHR2YXIgcG9zTWluID0gdGhpcy5wb3NUb0NlbGwoc3BhY2VCQi5taW4sIHByZWNpc2lvbik7XG5cdFx0dmFyIHBvc01heCA9IHRoaXMucG9zVG9DZWxsKHNwYWNlQkIubWF4LCBwcmVjaXNpb24pO1xuXHRcdFxuXHRcdHJldHVybiB7XG5cdFx0XHRtaW5YQ2VsbDogcG9zTWluLnggKyAxLFxuXHRcdFx0bWF4WENlbGw6IHBvc01heC54IC0gMSxcblx0XHRcdG1pblpDZWxsOiBwb3NNaW4ueiArIDEsXG5cdFx0XHRtYXhaQ2VsbDogcG9zTWF4LnogLSAxXG5cdFx0fTtcblx0fTtcblxuXHRncmlkQ2FsY3VsYXRvci5wb3NUb0NlbGwgPSBmdW5jdGlvbihwb3MsIHByZWNpc2lvbikge1xuXHRcdHJldHVybiBwb3MuY2xvbmUoKS5kaXZpZGUocHJlY2lzaW9uKS5yb3VuZCgpO1xuXHR9O1xuXG5cdGdyaWRDYWxjdWxhdG9yLmNlbGxUb1BvcyA9IGZ1bmN0aW9uKGNlbGwsIHByZWNpc2lvbikge1xuXHRcdHJldHVybiBjZWxsLmNsb25lKCkubXVsdGlwbHkocHJlY2lzaW9uKTtcblx0fTtcblxuXHRyZXR1cm4gZ3JpZENhbGN1bGF0b3I7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG5cdHZhciBoaWdobGlnaHQgPSB7fTtcblxuXHR2YXIgUExBTkVfUk9UQVRJT04gPSBNYXRoLlBJICogMC41O1xuXHR2YXIgUExBTkVfTVVMVElQTElFUiA9IDI7XG5cdHZhciBDT0xPUl9TRUxFQ1QgPSAweDAwNTUzMztcblx0dmFyIENPTE9SX0ZPQ1VTID0gMHgwMDMzNTU7XG5cblx0dmFyIHNlbGVjdDtcblx0dmFyIGZvY3VzO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1hdGVyaWFsUHJvcGVydGllcyA9IHtcblx0XHRcdG1hcDogbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoICdpbWcvZ2xvdy5wbmcnICksXG5cdFx0XHR0cmFuc3BhcmVudDogdHJ1ZSwgXG5cdFx0XHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuXHRcdFx0YmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG5cdFx0XHRkZXB0aFRlc3Q6IGZhbHNlXG5cdFx0fTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX1NFTEVDVDtcblx0XHR2YXIgbWF0ZXJpYWxTZWxlY3QgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX0ZPQ1VTO1xuXHRcdHZhciBtYXRlcmlhbEZvY3VzID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKG1hdGVyaWFsUHJvcGVydGllcyk7XG5cblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxLCAxKTtcblxuXHRcdHNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbFNlbGVjdCk7XG5cdFx0c2VsZWN0LnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblxuXHRcdGZvY3VzID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsRm9jdXMpO1xuXHRcdGZvY3VzLnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblx0fTtcblxuXHR2YXIgY29tbW9uSGlnaGxpZ2h0ID0gZnVuY3Rpb24od2hpY2gsIG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dmFyIHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54ICogUExBTkVfTVVMVElQTElFUjtcblx0XHRcdHZhciBoZWlnaHQgPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGJvdHRvbSA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0XHRcdFxuXHRcdFx0d2hpY2gucG9zaXRpb24ueSA9IGJvdHRvbTtcblx0XHRcdHdoaWNoLnNjYWxlLnNldCh3aWR0aCwgaGVpZ2h0LCAxKTtcblx0XHRcdG9iai5hZGQod2hpY2gpO1xuXG5cdFx0XHR3aGljaC52aXNpYmxlID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2hpY2gudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRoaWdobGlnaHQuZW5hYmxlID0gZnVuY3Rpb24oZW5hYmxlKSB7XG5cdFx0Zm9jdXMudmlzaWJsZSA9IHNlbGVjdC52aXNpYmxlID0gZW5hYmxlO1xuXHR9O1xuXG5cdGhpZ2hsaWdodC5mb2N1cyA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGNvbW1vbkhpZ2hsaWdodChmb2N1cywgb2JqKTtcblx0fTtcblxuXHRoaWdobGlnaHQuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KHNlbGVjdCwgb2JqKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGhpZ2hsaWdodDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsb2NhdG9yJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBCYXNlT2JqZWN0LCBkYXRhLCBzZWxlY3RvciwgZW52aXJvbm1lbnQsIGNhY2hlLCBncmlkQ2FsY3VsYXRvcikge1xuXHR2YXIgbG9jYXRvciA9IHt9O1xuXG5cdHZhciBkZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcblxuXHRsb2NhdG9yLmNlbnRlck9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciB0YXJnZXRCQiA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHR2YXIgc3BhY2VCQiA9IGVudmlyb25tZW50LmxpYnJhcnkuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCArIDAuMDEsIDAsIHRhcmdldEJCLm1heC56IC0gdGFyZ2V0QkIubWluLnogKyAwLjAxKTtcblx0XHR2YXIgb2NjdXBpZWRNYXRyaXggPSBnZXRPY2N1cGllZE1hdHJpeChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBtYXRyaXhQcmVjaXNpb24sIG9iaik7XG5cdFx0dmFyIGZyZWVQb3NpdGlvbiA9IGdldEZyZWVNYXRyaXgob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pO1x0XHRcblxuXHRcdG9iai5wb3NpdGlvbi5zZXRYKGZyZWVQb3NpdGlvbi54KTtcblx0XHRvYmoucG9zaXRpb24uc2V0WihmcmVlUG9zaXRpb24ueik7XG5cdH07XG5cblx0bG9jYXRvci5wbGFjZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRHRvKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRTZWN0aW9uKHNlY3Rpb25EdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHRcdFx0dmFyIHNlY3Rpb25CQiA9IHNlY3Rpb25DYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBsaWJyYXJ5QkIgPSBlbnZpcm9ubWVudC5saWJyYXJ5Lmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGZyZWVQbGFjZSA9IGdldEZyZWVQbGFjZShlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBsaWJyYXJ5QkIsIHNlY3Rpb25CQik7XG5cblx0XHRcdHJldHVybiBmcmVlUGxhY2UgP1xuXHRcdFx0XHRzYXZlU2VjdGlvbihzZWN0aW9uRHRvLCBmcmVlUGxhY2UpIDpcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAobmV3RHRvKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlU2VjdGlvbihuZXdEdG8pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVTZWN0aW9uID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbikge1xuXHRcdGR0by5saWJyYXJ5SWQgPSBlbnZpcm9ubWVudC5saWJyYXJ5LmlkO1xuXHRcdGR0by5wb3NfeCA9IHBvc2l0aW9uLng7XG5cdFx0ZHRvLnBvc195ID0gcG9zaXRpb24ueTtcblx0XHRkdG8ucG9zX3ogPSBwb3NpdGlvbi56O1xuXG5cdFx0cmV0dXJuIGRhdGEucG9zdFNlY3Rpb24oZHRvKTtcblx0fTtcblxuXHRsb2NhdG9yLnBsYWNlQm9vayA9IGZ1bmN0aW9uKGJvb2tEdG8sIHNoZWxmKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRCb29rKGJvb2tEdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKGJvb2tDYWNoZSkge1xuXHRcdFx0dmFyIHNoZWxmQkIgPSBzaGVsZi5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBib29rQkIgPSBib29rQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgZnJlZVBsYWNlID0gZ2V0RnJlZVBsYWNlKHNoZWxmLmNoaWxkcmVuLCBzaGVsZkJCLCBib29rQkIpO1xuXG5cdFx0XHRyZXR1cm4gZnJlZVBsYWNlID8gXG5cdFx0XHRcdHNhdmVCb29rKGJvb2tEdG8sIGZyZWVQbGFjZSwgc2hlbGYpIDogXG5cdFx0XHRcdCRxLnJlamVjdCgndGhlcmUgaXMgbm8gZnJlZSBzcGFjZScpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKG5ld0R0bykge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2sobmV3RHRvKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBzYXZlQm9vayA9IGZ1bmN0aW9uKGR0bywgcG9zaXRpb24sIHNoZWxmKSB7XG5cdFx0ZHRvLnNoZWxmSWQgPSBzaGVsZi5pZDtcblx0XHRkdG8uc2VjdGlvbklkID0gc2hlbGYucGFyZW50LmlkO1xuXHRcdGR0by5wb3NfeCA9IHBvc2l0aW9uLng7XG5cdFx0ZHRvLnBvc195ID0gcG9zaXRpb24ueTtcblx0XHRkdG8ucG9zX3ogPSBwb3NpdGlvbi56O1xuXG5cdFx0cmV0dXJuIGRhdGEucG9zdEJvb2soZHRvKTtcblx0fTtcblxuXHRsb2NhdG9yLnVucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdGJvb2tEdG8uc2VjdGlvbklkID0gbnVsbDtcblxuXHRcdHByb21pc2UgPSBkYXRhLnBvc3RCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZVBsYWNlID0gZnVuY3Rpb24ob2JqZWN0cywgc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCArIDAuMDEsIDAsIHRhcmdldEJCLm1heC56IC0gdGFyZ2V0QkIubWluLnogKyAwLjAxKTtcblx0XHR2YXIgb2NjdXBpZWRNYXRyaXggPSBnZXRPY2N1cGllZE1hdHJpeChvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdHZhciBmcmVlUG9zaXRpb24gPSBnZXRGcmVlTWF0cml4Q2VsbHMob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdFxuXHRcdGlmIChkZWJ1Z0VuYWJsZWQpIHtcblx0XHRcdGRlYnVnU2hvd0ZyZWUoZnJlZVBvc2l0aW9uLCBtYXRyaXhQcmVjaXNpb24sIGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmcmVlUG9zaXRpb247XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXggPSBmdW5jdGlvbihvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbikge1xuXHRcdHZhciBESVNUQU5DRSA9IDEuMztcblxuXHRcdHZhciB4SW5kZXg7XG5cdFx0dmFyIHpJbmRleDtcblx0XHR2YXIgcG9zaXRpb24gPSB7fTtcblx0XHR2YXIgbWluUG9zaXRpb24gPSB7fTtcblx0XHR2YXIgZWRnZXMgPSBncmlkQ2FsY3VsYXRvci5nZXRFZGdlcyhzcGFjZUJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXG5cdFx0Zm9yICh6SW5kZXggPSBlZGdlcy5taW5aQ2VsbDsgekluZGV4IDw9IGVkZ2VzLm1heFpDZWxsOyB6SW5kZXgrKykge1xuXHRcdFx0Zm9yICh4SW5kZXggPSBlZGdlcy5taW5YQ2VsbDsgeEluZGV4IDw9IGVkZ2VzLm1heFhDZWxsOyB4SW5kZXgrKykge1xuXHRcdFx0XHRpZiAoIW9jY3VwaWVkTWF0cml4W3pJbmRleF0gfHwgIW9jY3VwaWVkTWF0cml4W3pJbmRleF1beEluZGV4XSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uLnBvcyA9IGdldFBvc2l0aW9uRnJvbUNlbGxzKFt4SW5kZXhdLCB6SW5kZXgsIG1hdHJpeFByZWNpc2lvbiwgc3BhY2VCQiwgdGFyZ2V0QkIpO1xuXHRcdFx0XHRcdHBvc2l0aW9uLmxlbmd0aCA9IHBvc2l0aW9uLnBvcy5sZW5ndGgoKTtcblxuXHRcdFx0XHRcdGlmKCFtaW5Qb3NpdGlvbi5wb3MgfHwgcG9zaXRpb24ubGVuZ3RoIDwgbWluUG9zaXRpb24ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRtaW5Qb3NpdGlvbi5wb3MgPSBwb3NpdGlvbi5wb3M7XG5cdFx0XHRcdFx0XHRtaW5Qb3NpdGlvbi5sZW5ndGggPSBwb3NpdGlvbi5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYobWluUG9zaXRpb24ucG9zICYmIG1pblBvc2l0aW9uLmxlbmd0aCA8IERJU1RBTkNFKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWluUG9zaXRpb24ucG9zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBtaW5Qb3NpdGlvbi5wb3M7XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXhDZWxscyA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHRhcmdldENlbGxzU2l6ZSA9IDE7XG5cdFx0dmFyIGZyZWVDZWxsc0NvdW50ID0gMDtcblx0XHR2YXIgZnJlZUNlbGxzU3RhcnQ7XG5cdFx0dmFyIHhJbmRleDtcblx0XHR2YXIgekluZGV4O1xuXHRcdHZhciBjZWxscztcblx0XHR2YXIgZWRnZXMgPSBncmlkQ2FsY3VsYXRvci5nZXRFZGdlcyhzcGFjZUJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXG5cdFx0Zm9yICh6SW5kZXggPSBlZGdlcy5taW5aQ2VsbDsgekluZGV4IDw9IGVkZ2VzLm1heFpDZWxsOyB6SW5kZXgrKykge1xuXHRcdFx0Zm9yICh4SW5kZXggPSBlZGdlcy5taW5YQ2VsbDsgeEluZGV4IDw9IGVkZ2VzLm1heFhDZWxsOyB4SW5kZXgrKykge1xuXHRcdFx0XHRpZiAoIW9jY3VwaWVkTWF0cml4W3pJbmRleF0gfHwgIW9jY3VwaWVkTWF0cml4W3pJbmRleF1beEluZGV4XSkge1xuXHRcdFx0XHRcdGZyZWVDZWxsc1N0YXJ0ID0gZnJlZUNlbGxzU3RhcnQgfHwgeEluZGV4O1xuXHRcdFx0XHRcdGZyZWVDZWxsc0NvdW50Kys7XG5cblx0XHRcdFx0XHRpZiAoZnJlZUNlbGxzQ291bnQgPT09IHRhcmdldENlbGxzU2l6ZSkge1xuXHRcdFx0XHRcdFx0Y2VsbHMgPSBfLnJhbmdlKGZyZWVDZWxsc1N0YXJ0LCBmcmVlQ2VsbHNTdGFydCArIGZyZWVDZWxsc0NvdW50KTtcblx0XHRcdFx0XHRcdHJldHVybiBnZXRQb3NpdGlvbkZyb21DZWxscyhjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0dmFyIGdldFBvc2l0aW9uRnJvbUNlbGxzID0gZnVuY3Rpb24oY2VsbHMsIHpJbmRleCwgbWF0cml4UHJlY2lzaW9uLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBjZW50ZXIgPSBncmlkQ2FsY3VsYXRvci5jZWxsVG9Qb3MobmV3IFRIUkVFLlZlY3RvcjMoY2VsbHNbMF0sIDAsIHpJbmRleCksIG1hdHJpeFByZWNpc2lvbik7XG5cblx0XHR2YXIgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0XHRvZmZzZXQuYWRkVmVjdG9ycyh0YXJnZXRCQi5taW4sIHRhcmdldEJCLm1heCk7XG5cdFx0b2Zmc2V0Lm11bHRpcGx5U2NhbGFyKC0wLjUpO1xuXG5cdFx0cmV0dXJuIGNlbnRlci5hZGQob2Zmc2V0KS5zZXRZKGdldEJvdHRvbVkoc3BhY2VCQiwgdGFyZ2V0QkIpKTtcblx0fTtcblxuXHR2YXIgZ2V0Qm90dG9tWSA9IGZ1bmN0aW9uKHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0cmV0dXJuIHNwYWNlQkIubWluLnkgLSB0YXJnZXRCQi5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24sIG9iaikge1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHR2YXIgb2JqZWN0QkI7XG5cdFx0dmFyIG1pbktleVg7XG5cdFx0dmFyIG1heEtleVg7XG5cdFx0dmFyIG1pbktleVo7XG5cdFx0dmFyIG1heEtleVo7XHRcdFxuXHRcdHZhciB6LCB4O1xuXG5cdFx0b2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0aWYoY2hpbGQgaW5zdGFuY2VvZiBCYXNlT2JqZWN0ICYmIGNoaWxkICE9PSBvYmopIHtcblx0XHRcdFx0b2JqZWN0QkIgPSBjaGlsZC5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRtaW5LZXlYID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnggLSBvYmplY3RCQi5yYWRpdXMueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0XHRcdG1heEtleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCArIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWluS2V5WiA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci56IC0gb2JqZWN0QkIucmFkaXVzLnopIC8gbWF0cml4UHJlY2lzaW9uLnopO1xuXHRcdFx0XHRtYXhLZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogKyBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRcdFx0Zm9yKHogPSBtaW5LZXlaOyB6IDw9IG1heEtleVo7IHorKykge1xuXHRcdFx0XHRcdHJlc3VsdFt6XSA9IHJlc3VsdFt6XSB8fCB7fTtcblx0XHRcdFx0XHR2YXIgZGVidWdDZWxscyA9IFtdO1xuXG5cdFx0XHRcdFx0Zm9yKHggPSBtaW5LZXlYOyB4IDw9IG1heEtleVg7IHgrKykge1xuXHRcdFx0XHRcdFx0cmVzdWx0W3pdW3hdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGRlYnVnQ2VsbHMucHVzaCh4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihkZWJ1Z0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdGRlYnVnU2hvd0JCKGNoaWxkKTtcblx0XHRcdFx0XHRcdGRlYnVnQWRkT2NjdXBpZWQoZGVidWdDZWxscywgbWF0cml4UHJlY2lzaW9uLCBjaGlsZCwgeik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGxvY2F0b3IuZGVidWcgPSBmdW5jdGlvbigpIHtcblx0XHRjYWNoZS5nZXRTZWN0aW9uKCdib29rc2hlbGZfMDAwMScpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHRcdFx0ZGVidWdFbmFibGVkID0gdHJ1ZTtcblx0XHRcdHZhciBzZWN0aW9uQkIgPSBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgbGlicmFyeUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdGdldEZyZWVQbGFjZShlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBsaWJyYXJ5QkIsIHNlY3Rpb25CQik7XG5cdFx0XHRkZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZGVidWdTaG93QkIgPSBmdW5jdGlvbihvYmopIHtcblx0XHR2YXIgb2JqZWN0QkIgPSBvYmouYm91bmRpbmdCb3g7XG5cdFx0dmFyIG9iakJveCA9IG5ldyBUSFJFRS5NZXNoKFxuXHRcdFx0bmV3IFRIUkVFLkJveEdlb21ldHJ5KFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueCAqIDIsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueSAqIDIgKyAwLjEsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueiAqIDJcblx0XHRcdCksIFxuXHRcdFx0bmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuXHRcdFx0XHRjb2xvcjogMHhiYmJiZmYsXG5cdFx0XHRcdG9wYWNpdHk6IDAuMixcblx0XHRcdFx0dHJhbnNwYXJlbnQ6IHRydWVcblx0XHRcdH0pXG5cdFx0KTtcblx0XHRcblx0XHRvYmpCb3gucG9zaXRpb24ueCA9IG9iamVjdEJCLmNlbnRlci54O1xuXHRcdG9iakJveC5wb3NpdGlvbi55ID0gb2JqZWN0QkIuY2VudGVyLnk7XG5cdFx0b2JqQm94LnBvc2l0aW9uLnogPSBvYmplY3RCQi5jZW50ZXIuejtcblxuXHRcdG9iai5wYXJlbnQuYWRkKG9iakJveCk7XG5cdH07XG5cblx0dmFyIGRlYnVnQWRkT2NjdXBpZWQgPSBmdW5jdGlvbihjZWxscywgbWF0cml4UHJlY2lzaW9uLCBvYmosIHpLZXkpIHtcblx0XHRjZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XG5cdFx0XHR2YXIgcG9zID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoW2NlbGxdLCB6S2V5LCBtYXRyaXhQcmVjaXNpb24sIG9iai5wYXJlbnQuZ2VvbWV0cnkuYm91bmRpbmdCb3gsIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveCk7XG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShtYXRyaXhQcmVjaXNpb24ueCAtIDAuMDEsIDAuMDEsIG1hdHJpeFByZWNpc2lvbi56IC0gMC4wMSksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHhmZjAwMDB9KSk7XG5cdFx0XHRcblx0XHRcdGNlbGxCb3gucG9zaXRpb24gPSBwb3M7XG5cdFx0XHRvYmoucGFyZW50LmFkZChjZWxsQm94KTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZGVidWdTaG93RnJlZSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBtYXRyaXhQcmVjaXNpb24sIG9iaikge1xuXHRcdGlmIChwb3NpdGlvbikge1xuXHRcdFx0dmFyIGNlbGxCb3ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQm94R2VvbWV0cnkobWF0cml4UHJlY2lzaW9uLngsIDAuNSwgbWF0cml4UHJlY2lzaW9uLnopLCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwfSkpO1xuXHRcdFx0Y2VsbEJveC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgncHJldmlldycsIGZ1bmN0aW9uIChjYW1lcmEsIGhpZ2hsaWdodCkge1xuXHR2YXIgcHJldmlldyA9IHt9O1xuXG5cdHZhciBhY3RpdmUgPSBmYWxzZTtcblx0dmFyIGNvbnRhaW5lcjtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lciA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXHRcdGNvbnRhaW5lci5wb3NpdGlvbi5zZXQoMCwgMCwgLTAuNSk7XG5cdFx0Y29udGFpbmVyLnJvdGF0aW9uLnkgPSAtMjtcblx0XHRjYW1lcmEuY2FtZXJhLmFkZChjb250YWluZXIpO1xuXHR9O1xuXG5cdHZhciBhY3RpdmF0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlID0gdmFsdWU7XG5cdFx0aGlnaGxpZ2h0LmVuYWJsZSghYWN0aXZlKTtcblx0fTtcblxuXHRwcmV2aWV3LmlzQWN0aXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZTtcblx0fTtcblxuXHRwcmV2aWV3LmVuYWJsZSA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciBvYmpDbG9uZTtcblxuXHRcdGlmKG9iaikge1xuXHRcdFx0YWN0aXZhdGUodHJ1ZSk7XG5cblx0XHRcdG9iakNsb25lID0gb2JqLmNsb25lKCk7XG5cdFx0XHRvYmpDbG9uZS5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG5cdFx0XHRjb250YWluZXIuYWRkKG9iakNsb25lKTtcblx0XHR9XG5cdH07XG5cblx0cHJldmlldy5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFyQ29udGFpbmVyKCk7XG5cdFx0YWN0aXZhdGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZhciBjbGVhckNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0Y29udGFpbmVyLnJlbW92ZShjaGlsZCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cHJldmlldy5yb3RhdGUgPSBmdW5jdGlvbihkWCkge1xuXHRcdGNvbnRhaW5lci5yb3RhdGlvbi55ICs9IGRYID8gZFggKiAwLjA1IDogMDtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIHByZXZpZXc7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgZW52aXJvbm1lbnQsIGhpZ2hsaWdodCwgcHJldmlldywgdG9vbHRpcCwgY2F0YWxvZykge1xuXHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XG5cdHZhciBzZWxlY3RlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblx0dmFyIGZvY3VzZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cblx0c2VsZWN0b3IucGxhY2luZyA9IGZhbHNlO1xuXG5cdHNlbGVjdG9yLmZvY3VzID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHZhciBvYmo7XG5cblx0XHRpZighbWV0YS5lcXVhbHMoZm9jdXNlZCkpIHtcblx0XHRcdGZvY3VzZWQgPSBtZXRhO1xuXG5cdFx0XHRpZighZm9jdXNlZC5pc0VtcHR5KCkpIHtcblx0XHRcdFx0b2JqID0gc2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCgpO1xuXHRcdFx0XHRoaWdobGlnaHQuZm9jdXMob2JqKTtcblx0XHRcdH1cblxuXHRcdFx0dG9vbHRpcC5zZXQob2JqKTtcblx0XHR9XG5cdH07XG5cblx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlbGVjdG9yLnNlbGVjdChmb2N1c2VkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iaiA9IGdldE9iamVjdChtZXRhKTtcblx0XHRcblx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdHNlbGVjdGVkID0gbWV0YTtcblxuXHRcdGhpZ2hsaWdodC5zZWxlY3Qob2JqKTtcblx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cblx0XHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cdH07XG5cblx0c2VsZWN0b3IudW5zZWxlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRpZighc2VsZWN0ZWQuaXNFbXB0eSgpKSB7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG51bGwpO1xuXHRcdFx0c2VsZWN0ZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cdFx0fVxuXG5cdFx0cHJldmlldy5kaXNhYmxlKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSA/IGNhdGFsb2cuZ2V0Qm9vayhzZWxlY3RlZC5pZCkgOiBcblx0XHRcdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCkgPyBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKHNlbGVjdGVkLmlkKSA6XG5cdFx0XHRudWxsO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldE9iamVjdChzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3QoZm9jdXNlZCk7XG5cdH07XG5cblx0dmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqZWN0O1xuXG5cdFx0aWYoIW1ldGEuaXNFbXB0eSgpKSB7XG5cdFx0XHRvYmplY3QgPSBpc1NoZWxmKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2hlbGYobWV0YS5wYXJlbnRJZCwgbWV0YS5pZClcblx0XHRcdFx0OiBpc0Jvb2sobWV0YSkgPyBlbnZpcm9ubWVudC5nZXRCb29rKG1ldGEuaWQpXG5cdFx0XHRcdDogaXNTZWN0aW9uKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihtZXRhLmlkKVxuXHRcdFx0XHQ6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcdFxuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpIHx8IHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNCb29rU2VsZWN0ZWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpICYmIHNlbGVjdGVkLmlkID09PSBpZDtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2hlbGYgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNTaGVsZihzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNCb29rKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NlY3Rpb24oc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBpc1NoZWxmID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNoZWxmT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzQm9vayA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBCb29rT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzU2VjdGlvbiA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBTZWN0aW9uT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0cmV0dXJuIHNlbGVjdG9yO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2F1dGhvcml6YXRpb24nLCBmdW5jdGlvbiAoJGxvZywgJHEsICR3aW5kb3csICRpbnRlcnZhbCwgdXNlciwgZW52aXJvbm1lbnQsIHJlZ2lzdHJhdGlvbiwgdXNlckRhdGEsIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgYXV0aG9yaXphdGlvbiA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdsb2dpbkRpYWxvZyc7XG5cblx0YXV0aG9yaXphdGlvbi5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNBdXRob3JpemVkKCkgJiYgdXNlci5pc0xvYWRlZCgpO1xuXHR9O1xuXG5cdHZhciBsb2dpbiA9IGZ1bmN0aW9uKGxpbmspIHtcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHR2YXIgd2luID0gJHdpbmRvdy5vcGVuKGxpbmssICcnLCAnd2lkdGg9ODAwLGhlaWdodD02MDAsbW9kYWw9eWVzLGFsd2F5c1JhaXNlZD15ZXMnKTtcblx0ICAgIHZhciBjaGVja0F1dGhXaW5kb3cgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGlmICh3aW4gJiYgd2luLmNsb3NlZCkge1xuXHQgICAgICAgIFx0JGludGVydmFsLmNhbmNlbChjaGVja0F1dGhXaW5kb3cpO1xuXG5cdCAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQoZmFsc2UpO1xuXHQgICAgICAgIFx0dXNlci5sb2FkKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdHJldHVybiB1c2VyLmlzVGVtcG9yYXJ5KCkgPyByZWdpc3RyYXRpb24uc2hvdygpIDogdXNlckRhdGEubG9hZCgpO1xuXHQgICAgICAgIFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdGVudmlyb25tZW50LnNldExvYWRlZCh0cnVlKTtcblx0ICAgICAgICBcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0ICAgICAgICBcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBcdFx0JGxvZy5sb2coJ1VzZXIgbG9hZGluZCBlcnJvcicpO1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0ICAgICAgICBcdH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIDEwMCk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5nb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvZ29vZ2xlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi50d2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL3R3aXR0ZXInKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL2ZhY2Vib29rJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi52a29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvdmtvbnRha3RlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICBcdGVudmlyb25tZW50LnNldExvYWRlZChmYWxzZSk7XG5cdFx0dXNlci5sb2dvdXQoKS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0cmV0dXJuIHVzZXJEYXRhLmxvYWQoKTtcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQodHJ1ZSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignTG9nb3V0IGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHR9KTtcblx0fTtcblx0XG5cdHJldHVybiBhdXRob3JpemF0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jsb2NrJywgZnVuY3Rpb24gKGJsb2NrVUkpIHtcblx0dmFyIGJsb2NrID0ge307XG5cblx0dmFyIElOVkVOVE9SWSA9ICdpbnZlbnRvcnknO1xuXHR2YXIgTUFJTl9NRU5VID0gJ21haW5fbWVudSc7XG5cdHZhciBHTE9CQUwgPSAnZ2xvYmFsJztcblxuXHRibG9jay5pbnZlbnRvcnkgPSBibG9ja1VJLmluc3RhbmNlcy5nZXQoSU5WRU5UT1JZKTtcblx0XG5cdGJsb2NrLm1haW5NZW51ID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KE1BSU5fTUVOVSk7XG5cblx0YmxvY2suZ2xvYmFsID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KEdMT0JBTCk7XG5cblx0cmV0dXJuIGJsb2NrO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jvb2tFZGl0JywgZnVuY3Rpb24gKCRsb2csIGRhdGEsIGVudmlyb25tZW50LCBibG9jaywgZGlhbG9nLCBhcmNoaXZlLCBjYXRhbG9nLCBzZWxlY3RvciwgdXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIGJvb2tFZGl0ID0ge307XG5cdHZhciBib29rRGlhbG9nO1xuXG5cdHZhciBCT09LX0lNQUdFX1VSTCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vaW1nLmpwZyc7XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEUgPSAnZWRpdEJvb2tEaWFsb2cnO1xuXHRcblx0Ym9va0VkaXQuYm9vayA9IHt9O1xuXG5cdGJvb2tFZGl0LnNob3cgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0c2V0Qm9vayhib29rKTtcblx0XHRib29rRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0dmFyIHNldEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vaykge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5pZCA9IGJvb2suaWQ7XG5cdFx0XHRib29rRWRpdC5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5tb2RlbCA9IGJvb2subW9kZWw7XG5cdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gYm9vay5jb3Zlcjtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXJJZCA9IGJvb2suY292ZXJJZDtcblx0XHRcdGJvb2tFZGl0LmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5hdXRob3IgPSBib29rLmF1dGhvcjtcblx0XHR9XG5cdH07XG5cblx0Ym9va0VkaXQuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5tb2RlbCA/IEJPT0tfSU1BR0VfVVJMLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLmJvb2subW9kZWwpIDogRU1QVFlfSU1BR0VfVVJMO1xuXHR9O1xuXG5cdGJvb2tFZGl0LmdldENvdmVySW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5jb3ZlciA/IHRoaXMuYm9vay5jb3Zlci51cmwgOiBFTVBUWV9JTUFHRV9VUkw7XG5cdH07XG5cblx0Ym9va0VkaXQuYXBwbHlDb3ZlciA9IGZ1bmN0aW9uKGNvdmVySW5wdXRVUkwpIHtcblx0XHRpZihjb3ZlcklucHV0VVJMKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdGFyY2hpdmUuc2VuZEV4dGVybmFsVVJMKGNvdmVySW5wdXRVUkwsIFt0aGlzLmJvb2sudGl0bGUsIHRoaXMuYm9vay5hdXRob3JdKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlciA9IHJlc3VsdDtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gcmVzdWx0LmlkO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVySWQgPSBudWxsO1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gbnVsbDtcblx0XHRcdFx0XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgYXBwbHkgdGhpcyBjb3Zlci4gVHJ5IGFub3RoZXIgb25lLCBwbGVhc2UuJyk7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y292ZXJJbnB1dFVSTCA9IG51bGw7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gbnVsbDtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXIgPSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRib29rRWRpdC5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRkYXRhLnBvc3RCb29rKHRoaXMuYm9vaykudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHRpZihzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZChkdG8uaWQpKSB7XG5cdFx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGVudmlyb25tZW50LnVwZGF0ZUJvb2soZHRvKTtcblx0XHRcdHNjb3BlLmNhbmNlbCgpO1xuXHRcdFx0cmV0dXJuIGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignQm9vayBzYXZlIGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgZXJyb3Jcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0Ym9va0VkaXQuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0Ym9va0RpYWxvZy5jbG9zZSgpO1xuXHR9O1xuXG5cdHJldHVybiBib29rRWRpdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYXRhbG9nJywgZnVuY3Rpb24gKCRxLCBkYXRhLCBibG9jaykge1xuXHR2YXIgY2F0YWxvZyA9IHt9O1xuXG5cdGNhdGFsb2cuYm9va3MgPSBudWxsO1xuXG5cdGNhdGFsb2cubG9hZEJvb2tzID0gZnVuY3Rpb24odXNlcklkKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZih1c2VySWQpIHtcblx0XHRcdGJsb2NrLmludmVudG9yeS5zdGFydCgpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odXNlcklkID8gZGF0YS5nZXRVc2VyQm9va3ModXNlcklkKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRjYXRhbG9nLmJvb2tzID0gcmVzdWx0O1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmludmVudG9yeS5zdG9wKCk7XHRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdGNhdGFsb2cuZ2V0Qm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIF8uZmluZChjYXRhbG9nLmJvb2tzLCB7aWQ6IGlkfSk7XG5cdH07XG5cblx0cmV0dXJuIGNhdGFsb2c7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY3JlYXRlTGlicmFyeScsIGZ1bmN0aW9uIChkYXRhLCBlbnZpcm9ubWVudCwgZGlhbG9nLCBibG9jaywgbmdEaWFsb2cpIHtcblx0dmFyIGNyZWF0ZUxpYnJhcnkgPSB7fTtcblx0XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEVfSUQgPSAnY3JlYXRlTGlicmFyeURpYWxvZyc7XG5cdFxuXHR2YXIgY3JlYXRlTGlicmFyeURpYWxvZztcblxuXHRjcmVhdGVMaWJyYXJ5LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVMaWJyYXJ5RGlhbG9nID0gbmdEaWFsb2cub3Blbih7XG5cdFx0XHR0ZW1wbGF0ZTogVEVNUExBVEVfSURcblx0XHR9KTtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmdldEltZyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIG1vZGVsID8gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0ZGF0YS5wb3N0TGlicmFyeShtb2RlbCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRcdGVudmlyb25tZW50LmdvVG9MaWJyYXJ5KHJlc3VsdC5pZCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGxpYnJhcnkgYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGNyZWF0ZUxpYnJhcnlEaWFsb2cuY2xvc2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5XYXJuaW5nKCdTZWxlY3QgbGlicmFyeSwgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY3JlYXRlTGlicmFyeTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjcmVhdGVTZWN0aW9uJywgZnVuY3Rpb24gKCRsb2csIHVzZXIsIGVudmlyb25tZW50LCBsb2NhdG9yLCBkaWFsb2csIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgY3JlYXRlU2VjdGlvbiA9IHt9O1xuXHRcblx0dmFyIEVNUFRZX0lNQUdFX1VSTCA9ICcvaW1nL2VtcHR5X2NvdmVyLmpwZyc7XG5cdHZhciBURU1QTEFURSA9ICdjcmVhdGVTZWN0aW9uRGlhbG9nJztcblxuXHR2YXIgY3JlYXRlU2VjdGlvbkRpYWxvZztcblxuXHRjcmVhdGVTZWN0aW9uLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVTZWN0aW9uRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0Y3JlYXRlU2VjdGlvbi5nZXRJbWcgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBtb2RlbCA/ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVTZWN0aW9uLmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdHZhciBzZWN0aW9uRGF0YSA9IHtcblx0XHRcdFx0bW9kZWw6IG1vZGVsLFxuXHRcdFx0XHRsaWJyYXJ5SWQ6IGVudmlyb25tZW50LmxpYnJhcnkuaWQsXG5cdFx0XHRcdHVzZXJJZDogdXNlci5nZXRJZCgpXG5cdFx0XHR9O1xuXG5cdFx0XHRwbGFjZShzZWN0aW9uRGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuV2FybmluZygnU2VsZWN0IG1vZGVsLCBwbGVhc2UuJyk7XG5cdFx0fVx0XG5cdH07XG5cblx0dmFyIHBsYWNlID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0bG9jYXRvci5wbGFjZVNlY3Rpb24oZHRvKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgY3JlYXRlIHNlY3Rpb24gYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHR9KTtcdFxuXG5cdFx0Y3JlYXRlU2VjdGlvbkRpYWxvZy5jbG9zZSgpO1xuXHR9O1xuXG5cdHJldHVybiBjcmVhdGVTZWN0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2ZlZWRiYWNrJywgZnVuY3Rpb24gKGRhdGEsIGRpYWxvZywgbmdEaWFsb2cpIHtcblx0dmFyIGZlZWRiYWNrID0ge307XG5cdHZhciBmZWVkYmFja0RpYWxvZztcblxuXHR2YXIgVEVNUExBVEUgPSAnZmVlZGJhY2tEaWFsb2cnO1xuXG5cdGZlZWRiYWNrLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRmZWVkYmFja0RpYWxvZyA9IG5nRGlhbG9nLm9wZW4oe3RlbXBsYXRlOiBURU1QTEFURX0pO1xuXHR9O1xuXG5cdGZlZWRiYWNrLnNlbmQgPSBmdW5jdGlvbihkdG8pIHtcblx0XHRkaWFsb2cub3BlbkNvbmZpcm0oJ1NlbmQgZmVlZGJhY2s/JykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YS5wb3N0RmVlZGJhY2soZHRvKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZmVlZGJhY2tEaWFsb2cuY2xvc2UoKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBzZW5kIGZlZWRiYWNrIGJlY2F1c2Ugb2YgYW4gZXJyb3IuJyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gZmVlZGJhY2s7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbGlua0FjY291bnQnLCBmdW5jdGlvbiAodXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIGxpbmtBY2NvdW50ID0ge307XG5cblx0dmFyIFRFTVBMQVRFID0gJ2xpbmtBY2NvdW50RGlhbG9nJztcblxuXHRsaW5rQWNjb3VudC5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNHb29nbGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzR29vZ2xlKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNUd2l0dGVyU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdXNlci5pc1R3aXR0ZXIoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0ZhY2Vib29rU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdXNlci5pc0ZhY2Vib29rKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNWa29udGFrdGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzVmtvbnRha3RlKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5pc0dvb2dsZVNob3coKSB8fCBcblx0XHRcdHRoaXMuaXNUd2l0dGVyU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc0ZhY2Vib29rU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc1Zrb250YWt0ZVNob3coKTtcblx0fTtcblxuXHRyZXR1cm4gbGlua0FjY291bnQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbWFpbk1lbnUnLCBmdW5jdGlvbiAoJGxvZywgZGF0YSwgYm9va0VkaXQsIGZlZWRiYWNrLCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBjcmVhdGVTZWN0aW9uLCBsaW5rQWNjb3VudCwgYXV0aG9yaXphdGlvbikge1xuXHR2YXIgbWFpbk1lbnUgPSB7fTtcblx0XG5cdHZhciBzaG93ID0gZmFsc2U7XG5cdHZhciBjcmVhdGVMaXN0U2hvdyA9IGZhbHNlO1xuXG5cdG1haW5NZW51LmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzaG93O1xuXHR9O1xuXG5cdG1haW5NZW51LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0c2hvdyA9IHRydWU7XG5cdH07XG5cblx0bWFpbk1lbnUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNob3cgPSBmYWxzZTtcblx0fTtcblxuXHRtYWluTWVudS5pc0NyZWF0ZUxpc3RTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUxpc3RTaG93O1xuXHR9O1xuXG5cdG1haW5NZW51LmNyZWF0ZUxpc3RTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGNyZWF0ZUxpc3RTaG93ID0gdHJ1ZTtcblx0fTtcblxuXHRtYWluTWVudS5jcmVhdGVMaXN0SGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpc3RTaG93ID0gZmFsc2U7XG5cdH07XG5cblx0bWFpbk1lbnUuaGlkZUFsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGUoKTtcblx0XHRtYWluTWVudS5jcmVhdGVMaXN0SGlkZSgpO1xuXHR9O1xuXG5cdG1haW5NZW51LnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcblx0XHRpZihtYWluTWVudS5pc1Nob3coKSkge1xuXHRcdFx0bWFpbk1lbnUuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTWVudS5zaG93KCk7XG5cdFx0fVxuXHR9O1xuXG5cdG1haW5NZW51LnNob3dGZWVkYmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRmZWVkYmFjay5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd1NlbGVjdExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0c2VsZWN0TGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0NyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlTGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0NyZWF0ZVNlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlU2VjdGlvbi5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0xpbmtBY2NvdW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGxpbmtBY2NvdW50LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5pc0xpbmtBY2NvdW50QXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICFhdXRob3JpemF0aW9uLmlzU2hvdygpICYmIGxpbmtBY2NvdW50LmlzQXZhaWxhYmxlKCk7XG5cdH07XG5cblx0cmV0dXJuIG1haW5NZW51O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3JlZ2lzdHJhdGlvbicsIGZ1bmN0aW9uICgkbG9nLCB1c2VyLCBkYXRhLCBkaWFsb2csIHVzZXJEYXRhLCBuZ0RpYWxvZykge1xuXHR2YXIgcmVnaXN0cmF0aW9uID0ge307XG5cblx0dmFyIEZPUk1fVkFMSURBVElPTl9FUlJPUiA9ICdFbnRlciBhIHZhbGlkIGRhdGEsIHBsZWFzZS4nO1xuXHR2YXIgU0FWRV9VU0VSX0VSUk9SID0gJ0Vycm9yIHNhdmluZyB1c2VyLiBUcnkgYWdhaW4sIHBsZWFzZS4nO1xuXHR2YXIgVEVNUExBVEUgPSAncmVnaXN0cmF0aW9uRGlhbG9nJztcblxuXHRyZWdpc3RyYXRpb24udXNlciA9IHtcblx0XHRpZDogbnVsbCxcblx0XHRuYW1lOiBudWxsLFxuXHRcdGVtYWlsOiBudWxsLFxuXHRcdHRlbXBvcmFyeTogZmFsc2Vcblx0fTtcblxuXHRyZWdpc3RyYXRpb24uc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLmlkID0gdXNlci5nZXRJZCgpO1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLm5hbWUgPSB1c2VyLmdldE5hbWUoKTtcblx0XHRyZWdpc3RyYXRpb24udXNlci5lbWFpbCA9IHVzZXIuZ2V0RW1haWwoKTtcblxuXHRcdHJldHVybiBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7dGVtcGxhdGU6IFRFTVBMQVRFfSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gc2F2ZVVzZXIoKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGVsZXRlVXNlcigpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJlZ2lzdHJhdGlvbi5zaG93VmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0ZGlhbG9nLm9wZW5FcnJvcihGT1JNX1ZBTElEQVRJT05fRVJST1IpO1xuXHR9O1xuXG5cdHZhciBzYXZlVXNlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkYXRhLnB1dFVzZXIocmVnaXN0cmF0aW9uLnVzZXIpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBcdHJldHVybiB1c2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRyZXR1cm4gdXNlckRhdGEubG9hZCgpO1xuICAgICAgICBcdH0pO1x0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcihTQVZFX1VTRVJfRVJST1IpO1xuXHRcdFx0JGxvZy5sb2coJ1JlZ2lzdHJhdGlvbjogRXJyb3Igc2F2aW5nIHVzZXI6JywgcmVnaXN0cmF0aW9uLnVzZXIuaWQpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBkZWxldGVVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRhdGEuZGVsZXRlVXNlcihyZWdpc3RyYXRpb24udXNlci5pZCk7XG5cdH07XG5cblx0cmV0dXJuIHJlZ2lzdHJhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdzZWxlY3RMaWJyYXJ5JywgZnVuY3Rpb24gKCRxLCBkYXRhLCBlbnZpcm9ubWVudCwgdXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIHNlbGVjdExpYnJhcnkgPSB7fTtcblxuXHR2YXIgVEVNUExBVEUgPSAnc2VsZWN0TGlicmFyeURpYWxvZyc7XG5cblx0c2VsZWN0TGlicmFyeS5saXN0ID0gW107XG5cblx0c2VsZWN0TGlicmFyeS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3BlbkNvbmZpcm0oe3RlbXBsYXRlOiBURU1QTEFURX0pO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkuaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5saXN0Lmxlbmd0aCA+IDA7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS5pc1VzZXJMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50LmxpYnJhcnkgJiYgZW52aXJvbm1lbnQubGlicmFyeS5kYXRhT2JqZWN0LnVzZXJJZCA9PT0gdXNlci5nZXRJZCgpO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZih1c2VyLmlzQXV0aG9yaXplZCgpKSB7XG5cdFx0ICAgIHByb21pc2UgPSBkYXRhLmdldExpYnJhcmllcygpLnRoZW4oZnVuY3Rpb24gKGxpYnJhcmllcykge1xuXHQgICAgICAgICAgICBzY29wZS5saXN0ID0gbGlicmFyaWVzO1xuXHQgICAgXHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2NvcGUubGlzdCA9IFtdO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4oc2NvcGUubGlzdCk7XG5cdFx0fVxuXG4gICAgXHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRzZWxlY3RMaWJyYXJ5LmdvID0gZW52aXJvbm1lbnQuZ29Ub0xpYnJhcnk7XG5cblx0cmV0dXJuIHNlbGVjdExpYnJhcnk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgndG9vbHMnLCBmdW5jdGlvbiAoJHEsICRsb2csIEJvb2tPYmplY3QsIFNlY3Rpb25PYmplY3QsIFNoZWxmT2JqZWN0LCBTZWxlY3Rvck1ldGFEdG8sIGRhdGEsIHNlbGVjdG9yLCBkaWFsb2csIGJsb2NrLCBjYXRhbG9nLCBlbnZpcm9ubWVudCwgcHJldmlldywgdXNlciwgbG9jYXRvciwgZ3Jvd2wpIHtcblx0dmFyIHRvb2xzID0ge307XG5cblx0dmFyIFJPVEFUSU9OX1NDQUxFID0gMTtcblxuXHR2YXIgc3RhdGVzID0ge1xuXHRcdHJvdGF0ZUxlZnQ6IGZhbHNlLFxuXHRcdHJvdGF0ZVJpZ2h0OiBmYWxzZVxuXHR9O1xuXG5cdHRvb2xzLnBsYWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkRHRvO1xuXHRcdHZhciBmb2N1c2VkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCgpO1xuXG5cdFx0aWYoZm9jdXNlZE9iamVjdCBpbnN0YW5jZW9mIFNoZWxmT2JqZWN0KSB7XG5cdFx0XHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cdFx0XHRzZWxlY3RlZER0byA9IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCk7XG5cblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0bG9jYXRvci5wbGFjZUJvb2soc2VsZWN0ZWREdG8sIGZvY3VzZWRPYmplY3QpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgYm9va0R0byA9IGNhdGFsb2cuZ2V0Qm9vayhzZWxlY3RlZER0by5pZCk7XG5cdFx0XHRcdHNlbGVjdG9yLnNlbGVjdChuZXcgU2VsZWN0b3JNZXRhRHRvKEJvb2tPYmplY3QuVFlQRSwgYm9va0R0by5pZCwgYm9va0R0by5zaGVsZklkKSk7XG5cdFx0XHRcdGdyb3dsLnN1Y2Nlc3MoJ0Jvb2sgcGxhY2VkJyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Z3Jvd2wuZXJyb3IoZXJyb3IpO1xuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdyb3dsLmVycm9yKCdTaGVsZiBpcyBub3Qgc2VsZWN0ZWQnKTtcblx0XHR9XG5cdH07XG5cblx0dG9vbHMudW5wbGFjZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBib29rRHRvID0gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSA/IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCkgOiBudWxsO1xuXG5cdFx0aWYoYm9va0R0bykge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHRsb2NhdG9yLnVucGxhY2VCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRncm93bC5zdWNjZXNzKCdCb29rIHVucGxhY2VkJyk7XG5cdFx0XHRcdHJldHVybiBjYXRhbG9nLmxvYWRCb29rcyh1c2VyLmdldElkKCkpO1x0XHRcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRncm93bC5lcnJvcihlcnJvcik7XG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0dG9vbHMuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGRhdGEuZGVsZXRlQm9vayhpZCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhpZCk7XG5cdFx0XHRyZXR1cm4gY2F0YWxvZy5sb2FkQm9va3ModXNlci5nZXRJZCgpKTtcblx0XHR9KTtcblx0fTtcblxuXHR0b29scy5kZWxldGVTZWN0aW9uID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVTZWN0aW9uKGlkKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVTZWN0aW9uKGlkKTtcblx0XHR9KTtcblx0fTtcblxuXHR0b29scy5yb3RhdGVMZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZUxlZnQgPSB0cnVlO1xuXHR9O1xuXG5cdHRvb2xzLnJvdGF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZVJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHR0b29scy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZUxlZnQgPSBmYWxzZTtcblx0XHRzdGF0ZXMucm90YXRlUmlnaHQgPSBmYWxzZTtcblx0fTtcblxuXHR0b29scy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZihzdGF0ZXMucm90YXRlTGVmdCkge1xuXHRcdFx0cm90YXRlKFJPVEFUSU9OX1NDQUxFKTtcblx0XHR9IGVsc2UgaWYoc3RhdGVzLnJvdGF0ZVJpZ2h0KSB7XG5cdFx0XHRyb3RhdGUoLVJPVEFUSU9OX1NDQUxFKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHJvdGF0ZSA9IGZ1bmN0aW9uKHNjYWxlKSB7XG5cdFx0dmFyIG9iajtcblxuXHRcdGlmKHByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0cHJldmlldy5yb3RhdGUoc2NhbGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXHRcdFx0aWYob2JqKSBvYmoucm90YXRlKHNjYWxlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHRvb2xzO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3Rvb2x0aXAnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciB0b29sdGlwID0ge307XG5cblx0dG9vbHRpcC5vYmogPSB7fTtcblxuXHR0b29sdGlwLnNldCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dGhpcy5vYmoudHlwZSA9IG9iai50eXBlO1xuXHRcdFx0dGhpcy5vYmoudGl0bGUgPSBvYmouZGF0YU9iamVjdC50aXRsZTtcblx0XHRcdHRoaXMub2JqLmF1dGhvciA9IG9iai5kYXRhT2JqZWN0LmF1dGhvcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vYmoudHlwZSA9IG51bGw7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB0b29sdGlwO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3VzZXJEYXRhJywgZnVuY3Rpb24gKCRxLCBzZWxlY3RMaWJyYXJ5LCBjYXRhbG9nLCB1c2VyKSB7XG5cdHZhciB1c2VyRGF0YSA9IHt9O1xuXG5cdHVzZXJEYXRhLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJHEuYWxsKFtcblx0XHRcdHNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpLCBcblx0XHRcdGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSlcblx0XHRdKTtcblx0fTtcblxuXHRyZXR1cm4gdXNlckRhdGE7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=