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
                this.isSection() ? selector.getSelectedObject().getId() :
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
		camera.object.position.set(0, camera.HEIGTH, 0);
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

		if(dto.libraryId == environment.library.getId()) {
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

		library.add(new THREE.AmbientLight(0x333333));
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

		dict[obj.getId()] = dictItem;
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

			block.global.start();
			user.load().then(function () {
				return $q.all([environment.loadLibrary(user.getLibrary() || 1), userData.load()]);
			}).catch(function (error) {
				$log.error(error);
				//TODO: show error message  
			}).finally(function () {
				locator.centerObject(camera.object);
				environment.setLoaded(true);
				startRenderLoop();
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
		raycaster = new THREE.Raycaster();
		raycaster.set(camera.getPosition(), vector);
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
		var vector = new THREE.Vector3((x / getWidth()) * 2 - 1, - (y / getHeight()) * 2 + 1, 0.5);
		vector.unproject(camera.camera);
	
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
		var VERTEX_SHADER_ID = 'BookMaterialVertexShader';
		var FRAGMENT_SHADER_ID = 'BookMaterialFragmentShader';

		var vertexShader = document.getElementById(VERTEX_SHADER_ID).textContent;
		var fragmentShader = document.getElementById(FRAGMENT_SHADER_ID).textContent;

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

	return BookMaterial;
});
angular.module('VirtualBookshelf')
.factory('BaseObject', function (subclassOf) {
	var BaseObject = function(dataObject, geometry, material) {
		THREE.Mesh.call(this, geometry, material);

		this.dataObject = dataObject || {};
		this.rotation.order = 'XYZ';
		this.setDtoTransformations();
	};
	
	BaseObject.prototype = subclassOf(THREE.Mesh);

	BaseObject.prototype.getType = function() {
		return this.vbType;
	};

	BaseObject.prototype.getId = function() {
		return this.dataObject && this.dataObject.id;
	};

	BaseObject.prototype.setDtoTransformations = function() {
		this.position.setX(this.dataObject.pos_x || 0);
		this.position.setY(this.dataObject.pos_y || 0);
		this.position.setZ(this.dataObject.pos_z || 0);

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
	BookObject.prototype.vbType = BookObject.TYPE;

	BookObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.getId(),
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
				this.dataObject.shelfId = parent.getId();
				this.dataObject.sectionId = parent.parent.getId();
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
	SectionObject.prototype.vbType = SectionObject.TYPE;

	SectionObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.getId(),
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
				this.dataObject.libraryId = parent.getId();
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
			this.id = selectedObject.getId();
			this.parentId = selectedObject.parent.getId();
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

		this.position.set(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		
		this.material.transparent = true;
		this.material.opacity = 0;
	};

	ShelfObject.TYPE = 'ShelfObject';

	ShelfObject.prototype = subclassOf(BaseObject);
	ShelfObject.prototype.vbType = ShelfObject.TYPE;

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

		var geometry = new THREE.PlaneBufferGeometry(1, 1, 1);

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
		dto.libraryId = environment.library.getId();
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
		dto.shelfId = shelf.getId();
		dto.sectionId = shelf.parent.getId();
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
			
			cellBox.position.set(pos.x, pos.y, pos.z);
			obj.parent.add(cellBox);
		});
	};

	var debugShowFree = function(position, matrixPrecision, obj) {
		if (position) {
			var cellBox = new THREE.Mesh(new THREE.BoxGeometry(matrixPrecision.x, 0.5, matrixPrecision.z), new THREE.MeshLambertMaterial({color: 0x00ff00}));
			cellBox.position.set(position.x, position.y, position.z);
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
				libraryId: environment.library.getId(),
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
			this.obj.type = obj.getType();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0F1dGhDdHJsLmpzIiwiY29udHJvbGxlcnMvQm9va0VkaXRDdHJsLmpzIiwiY29udHJvbGxlcnMvQ3JlYXRlTGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9DcmVhdGVTZWN0aW9uQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ZlZWRiYWNrQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ludmVudG9yeUN0cmwuanMiLCJjb250cm9sbGVycy9MaW5rQWNjb3VudEN0cmwuanMiLCJjb250cm9sbGVycy9SZWdpc3RyYXRpb25DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VsZWN0TGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9Ub29sc0N0cmwuanMiLCJjb250cm9sbGVycy9Ub29sdGlwQ3RybC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImNvbnRyb2xsZXJzL1dlbGNvbWVDdHJsLmpzIiwiZGlyZWN0aXZlcy9zZWxlY3QuanMiLCJzZXJ2aWNlcy9hcmNoaXZlLmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwic2VydmljZXMvbWF0ZXJpYWxzL0Jvb2tNYXRlcmlhbC5qcyIsInNlcnZpY2VzL21vZGVscy9CYXNlT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0Jvb2tPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FtZXJhT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VsZWN0b3JNZXRhRHRvLmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL3N1YmNsYXNzT2YuanMiLCJzZXJ2aWNlcy9zY2VuZS9ncmlkQ2FsY3VsYXRvci5qcyIsInNlcnZpY2VzL3NjZW5lL2hpZ2hsaWdodC5qcyIsInNlcnZpY2VzL3NjZW5lL2xvY2F0b3IuanMiLCJzZXJ2aWNlcy9zY2VuZS9wcmV2aWV3LmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiLCJzZXJ2aWNlcy91aS9hdXRob3JpemF0aW9uLmpzIiwic2VydmljZXMvdWkvYmxvY2suanMiLCJzZXJ2aWNlcy91aS9ib29rRWRpdC5qcyIsInNlcnZpY2VzL3VpL2NhdGFsb2cuanMiLCJzZXJ2aWNlcy91aS9jcmVhdGVMaWJyYXJ5LmpzIiwic2VydmljZXMvdWkvY3JlYXRlU2VjdGlvbi5qcyIsInNlcnZpY2VzL3VpL2ZlZWRiYWNrLmpzIiwic2VydmljZXMvdWkvbGlua0FjY291bnQuanMiLCJzZXJ2aWNlcy91aS9tYWluTWVudS5qcyIsInNlcnZpY2VzL3VpL3JlZ2lzdHJhdGlvbi5qcyIsInNlcnZpY2VzL3VpL3NlbGVjdExpYnJhcnkuanMiLCJzZXJ2aWNlcy91aS90b29scy5qcyIsInNlcnZpY2VzL3VpL3Rvb2x0aXAuanMiLCJzZXJ2aWNlcy91aS91c2VyRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicsIFsnYW5ndWxhci1ncm93bCcsICdibG9ja1VJJywgJ25nRGlhbG9nJywgJ2FuZ3VsYXJVdGlscy5kaXJlY3RpdmVzLmRpclBhZ2luYXRpb24nXSlcbi5jb25maWcoZnVuY3Rpb24gKGdyb3dsUHJvdmlkZXIsIGJsb2NrVUlDb25maWcsIHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyKSB7XG4gICAgZ3Jvd2xQcm92aWRlci5nbG9iYWxUaW1lVG9MaXZlKDIwMDApO1xuICAgIGdyb3dsUHJvdmlkZXIuZ2xvYmFsUG9zaXRpb24oJ3RvcC1sZWZ0Jyk7XG4gICAgZ3Jvd2xQcm92aWRlci5nbG9iYWxEaXNhYmxlQ291bnREb3duKHRydWUpO1xuXG5cdGJsb2NrVUlDb25maWcuZGVsYXkgPSAwO1xuXHRibG9ja1VJQ29uZmlnLmF1dG9CbG9jayA9IGZhbHNlO1xuXHRibG9ja1VJQ29uZmlnLmF1dG9JbmplY3RCb2R5QmxvY2sgPSBmYWxzZTtcblx0XG4gICAgcGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIuc2V0UGF0aCgnL3VpL2RpclBhZ2luYXRpb24nKTtcbn0pLnJ1bihmdW5jdGlvbiAobWFpbikge1xuXHRtYWluLnN0YXJ0KCk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignQXV0aEN0cmwnLCBmdW5jdGlvbiAoYXV0aG9yaXphdGlvbikge1xuXHR0aGlzLmxvZ2luR29vZ2xlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5nb29nbGUoKTtcblx0fTtcblxuXHR0aGlzLmxvZ2luVHdpdHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udHdpdHRlcigpO1xuXHR9O1xuXG5cdHRoaXMubG9naW5GYWNlYm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uZmFjZWJvb2soKTtcblx0fTtcblxuXHR0aGlzLmxvZ2luVmtvbnRha3RlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi52a29udGFrdGUoKTtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdCb29rRWRpdEN0cmwnLCBmdW5jdGlvbiAoYm9va0VkaXQsIGRpYWxvZywgZGF0YSkge1xuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHRoaXMuYm9vayA9IGJvb2tFZGl0LmJvb2s7XG5cdHRoaXMuY292ZXJJbnB1dFVSTCA9IG51bGw7XG5cblx0dGhpcy5hcHBseUNvdmVyID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIWlzQ292ZXJEaXNhYmxlZCgpKSB7XG5cdFx0XHRib29rRWRpdC5hcHBseUNvdmVyKHRoaXMuY292ZXJJbnB1dFVSTCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0ZpbGwgYXV0aG9yIGFuZCB0aXRsZSBmaWVsZHMsIHBsZWFzZS4nKTtcblx0XHR9XG5cdH07XG5cblx0dGhpcy5nZXRDb3ZlckltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBib29rRWRpdC5nZXRDb3ZlckltZygpO1xuXHR9O1xuXG5cdHRoaXMuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGJvb2tFZGl0LmdldEltZygpO1xuXHR9O1xuXG5cdHRoaXMuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0Ym9va0VkaXQuY2FuY2VsKCk7XG5cdH07XG5cblx0dGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLmZvcm0uJHZhbGlkKSB7XG5cdFx0XHRib29rRWRpdC5zYXZlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0ZpbGwgYWxsIHJlcXVpcmVkIGZpZWxkcywgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgaXNDb3ZlckRpc2FibGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNjb3BlLmNvdmVySW5wdXRVUkwgJiYgKHNjb3BlLmZvcm0udGl0bGUuJGludmFsaWQgfHwgc2NvcGUuZm9ybS5hdXRob3IuJGludmFsaWQpO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uLnRoZW4oZnVuY3Rpb24gKGNvbW1vbkRhdGEpIHtcblx0XHRzY29wZS5saXN0ID0gY29tbW9uRGF0YS5ib29rcztcblx0fSk7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdDcmVhdGVMaWJyYXJ5Q3RybCcsIGZ1bmN0aW9uIChjcmVhdGVMaWJyYXJ5LCBkYXRhKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dGhpcy5saXN0ID0gbnVsbDtcblx0dGhpcy5tb2RlbCA9IG51bGw7XG5cblx0dGhpcy5nZXRJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3JlYXRlTGlicmFyeS5nZXRJbWcodGhpcy5tb2RlbCk7XG5cdH07XG5cblx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVMaWJyYXJ5LmNyZWF0ZSh0aGlzLm1vZGVsKTtcblx0fTtcblxuXHRkYXRhLmNvbW1vbi50aGVuKGZ1bmN0aW9uIChjb21tb25EYXRhKSB7XG5cdFx0c2NvcGUubGlzdCA9IGNvbW1vbkRhdGEubGlicmFyaWVzO1xuXHR9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdDcmVhdGVTZWN0aW9uQ3RybCcsIGZ1bmN0aW9uIChjcmVhdGVTZWN0aW9uLCBkYXRhKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dGhpcy5tb2RlbCA9IG51bGw7XG5cdHRoaXMubGlzdCA9IG51bGw7XG5cblx0dGhpcy5nZXRJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3JlYXRlU2VjdGlvbi5nZXRJbWcodGhpcy5tb2RlbCk7XG5cdH07XG5cdFx0XG5cdHRoaXMuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlU2VjdGlvbi5jcmVhdGUodGhpcy5tb2RlbCk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24udGhlbihmdW5jdGlvbiAoY29tbW9uRGF0YSkge1xuXHRcdHNjb3BlLmxpc3QgPSBjb21tb25EYXRhLmJvb2tzaGVsdmVzO1xuXHR9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdGZWVkYmFja0N0cmwnLCBmdW5jdGlvbiAoZmVlZGJhY2ssIHVzZXIsIGRpYWxvZykge1xuXHR0aGlzLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuZm9ybS5tZXNzYWdlLiR2YWxpZCkge1xuXHRcdFx0ZmVlZGJhY2suc2VuZCh7XG5cdFx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcblx0XHRcdFx0dXNlcklkOiB1c2VyLmdldElkKClcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaWFsb2cub3BlbkVycm9yKCdGZWVkYmFjayBmaWVsZCBpcyByZXF1aXJlZC4nKTtcblx0XHR9XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignSW52ZW50b3J5Q3RybCcsIGZ1bmN0aW9uIChTZWxlY3Rvck1ldGFEdG8sIEJvb2tPYmplY3QsIHVzZXIsIGJvb2tFZGl0LCBzZWxlY3Rvcikge1xuXHR0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB1c2VyLmlzQXV0aG9yaXplZCgpO1xuXHR9O1xuXG5cdHRoaXMuaXNCb29rU2VsZWN0ZWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZChpZCk7XG5cdH07XG5cblx0dGhpcy5zZWxlY3QgPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgbWV0YSA9IG5ldyBTZWxlY3Rvck1ldGFEdG8oQm9va09iamVjdC5UWVBFLCBkdG8uaWQpO1xuXHRcdHNlbGVjdG9yLnNlbGVjdChtZXRhKTtcblx0fTtcblxuXHR0aGlzLmFkZEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRib29rRWRpdC5zaG93KHt1c2VySWQ6IHVzZXIuZ2V0SWQoKX0pO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0xpbmtBY2NvdW50Q3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCBsaW5rQWNjb3VudCkge1xuXHR0aGlzLmxpbmtHb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLmdvb2dsZSgpO1xuXHR9O1xuXG5cdHRoaXMubGlua1R3aXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnR3aXR0ZXIoKTtcblx0fTtcblxuXHR0aGlzLmxpbmtGYWNlYm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uZmFjZWJvb2soKTtcblx0fTtcblxuXHR0aGlzLmxpbmtWa29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnZrb250YWt0ZSgpO1xuXHR9O1xuXG5cdHRoaXMuaXNHb29nbGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzR29vZ2xlU2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuaXNUd2l0dGVyU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc1R3aXR0ZXJTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc0ZhY2Vib29rU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc0ZhY2Vib29rU2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuaXNWa29udGFrdGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzVmtvbnRha3RlU2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNBdmFpbGFibGUoKTtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdSZWdpc3RyYXRpb25DdHJsJywgZnVuY3Rpb24gKHJlZ2lzdHJhdGlvbikge1xuXHR0aGlzLnVzZXIgPSByZWdpc3RyYXRpb24udXNlcjtcblxuXHR0aGlzLnNob3dWYWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRyZWdpc3RyYXRpb24uc2hvd1ZhbGlkYXRpb25FcnJvcigpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1NlbGVjdExpYnJhcnlDdHJsJywgZnVuY3Rpb24gKHNlbGVjdExpYnJhcnkpIHtcblx0dGhpcy5nbyA9IHNlbGVjdExpYnJhcnkuZ287XG5cblx0dGhpcy5nZXRMaXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNlbGVjdExpYnJhcnkubGlzdDtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdUb29sc0N0cmwnLCBmdW5jdGlvbiAodXNlciwgc2VsZWN0b3IsIHRvb2xzLCBwcmV2aWV3LCBib29rRWRpdCwgZGlhbG9nLCBibG9jaywgZ3Jvd2wpIHtcbiAgICB2YXIgREVMRVRFX0NPTkZJUk0gPSAnRGVsZXRlIHswfTogezF9Pyc7XG4gICAgdmFyIERFTEVURV9TVUNDRVNTID0gJ3swfTogezF9IGRlbGV0ZWQuJztcbiAgICB2YXIgREVMRVRFX0VSUk9SID0gJ0NhbiBub3QgZGVsZXRlIHswfTogezF9Lic7XG4gICAgdmFyIEJPT0sgPSAnYm9vayc7XG4gICAgdmFyIFNFQ1RJT04gPSAnc2VjdGlvbic7XG5cbiAgICB0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEVkaXRhYmxlKCkgfHwgcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzQm9vayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1NlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNSb3RhdGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCkgfHwgcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzRWRpdGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNCb29rKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc0RlbGV0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEVkaXRhYmxlKCkgJiYgdXNlci5pc0F1dGhvcml6ZWQoKSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzV2F0Y2hhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpICYmICFwcmV2aWV3LmlzQWN0aXZlKCkgJiYgIXRoaXMuaXNQbGFjZWJsZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzUGxhY2VibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9iaiA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG4gICAgICAgIHJldHVybiAhb2JqICYmIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkgJiYgdXNlci5pc0F1dGhvcml6ZWQoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1VucGxhY2VibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9iaiA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG4gICAgICAgIHJldHVybiBvYmogJiYgc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSAmJiB1c2VyLmlzQXV0aG9yaXplZCgpICYmICFwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNQbGFjaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5wbGFjaW5nO1xuICAgIH07XG5cbiAgICB0aGlzLnBsYWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGVjdG9yLnBsYWNpbmcgPSAhc2VsZWN0b3IucGxhY2luZztcbiAgICB9O1xuXG4gICAgdGhpcy51bnBsYWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRvb2xzLnVucGxhY2UoKTtcbiAgICB9O1xuXG4gICAgdGhpcy53YXRjaCA9IGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIG9iaiA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG4gICAgICAgIHByZXZpZXcuZW5hYmxlKG9iaik7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VGl0bGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICB0aGlzLmlzQm9vaygpID8gc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKS50aXRsZSA6XG4gICAgICAgICAgICAgICAgdGhpcy5pc1NlY3Rpb24oKSA/IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCkuZ2V0SWQoKSA6XG4gICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5lZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGJvb2tFZGl0LnNob3coc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkdG8gPSBzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpO1xuICAgICAgICB2YXIgY29uZmlybU1zZztcbiAgICAgICAgdmFyIHN1Y2Nlc3NNc2c7XG4gICAgICAgIHZhciBlcnJvck1zZztcbiAgICAgICAgdmFyIGRlbGV0ZUZuYztcblxuICAgICAgICBpZihzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVCb29rO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgQk9PSykucmVwbGFjZSgnezF9JywgZHRvLnRpdGxlKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVTZWN0aW9uO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgU0VDVElPTikucmVwbGFjZSgnezF9JywgZHRvLmlkKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2cub3BlbkNvbmZpcm0oY29uZmlybU1zZykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBibG9jay5nbG9iYWwuc3RhcnQoKTtcbiAgICAgICAgICAgIGRlbGV0ZUZuYyhkdG8uaWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGdyb3dsLnN1Y2Nlc3Moc3VjY2Vzc01zZyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IoZXJyb3JNc2cpO1xuICAgICAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suZ2xvYmFsLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy51bndhdGNoID0gcHJldmlldy5kaXNhYmxlO1xuICAgIHRoaXMuaXNXYXRjaEFjdGl2ZSA9IHByZXZpZXcuaXNBY3RpdmU7XG5cbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSB0b29scy5yb3RhdGVMZWZ0O1xuICAgIHRoaXMucm90YXRlUmlnaHQgPSB0b29scy5yb3RhdGVSaWdodDtcbiAgICB0aGlzLnN0b3AgPSB0b29scy5zdG9wO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1Rvb2x0aXBDdHJsJywgZnVuY3Rpb24gKHRvb2x0aXAsIEJvb2tPYmplY3QpIHtcbiAgICB0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdG9vbHRpcC5vYmoudHlwZSA9PT0gQm9va09iamVjdC5UWVBFO1xuICAgIH07XG5cbiAgICB0aGlzLm9iaiA9IHRvb2x0aXAub2JqO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1VpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIG1haW5NZW51LCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBjcmVhdGVTZWN0aW9uLCBmZWVkYmFjaywgYXV0aG9yaXphdGlvbiwgbmF2aWdhdGlvbiwgYm9va0VkaXQsIGNhdGFsb2cpIHtcbiAgICAkc2NvcGUubWFpbk1lbnUgPSBtYWluTWVudTtcblxuICAgICRzY29wZS5zZWxlY3RMaWJyYXJ5ID0gc2VsZWN0TGlicmFyeTtcbiAgICAkc2NvcGUuY3JlYXRlTGlicmFyeSA9IGNyZWF0ZUxpYnJhcnk7XG4gICAgJHNjb3BlLmNyZWF0ZVNlY3Rpb24gPSBjcmVhdGVTZWN0aW9uO1xuICAgICRzY29wZS5mZWVkYmFjayA9IGZlZWRiYWNrO1xuICAgICRzY29wZS5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcblxuICAgICRzY29wZS5ib29rRWRpdCA9IGJvb2tFZGl0O1xuICAgICRzY29wZS5jYXRhbG9nID0gY2F0YWxvZztcblxuXHQkc2NvcGUubmF2aWdhdGlvbiA9IHtcblx0XHRzdG9wOiBuYXZpZ2F0aW9uLmdvU3RvcCxcblx0XHRmb3J3YXJkOiBuYXZpZ2F0aW9uLmdvRm9yd2FyZCxcblx0XHRiYWNrd2FyZDogbmF2aWdhdGlvbi5nb0JhY2t3YXJkLFxuXHRcdGxlZnQ6IG5hdmlnYXRpb24uZ29MZWZ0LFxuXHRcdHJpZ2h0OiBuYXZpZ2F0aW9uLmdvUmlnaHRcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBlbnZpcm9ubWVudCwgdXNlcikge1xuXHR2YXIgY2xvc2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc1Nob3dBdXRob3JpemF0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGF1dGhvcml6YXRpb24uaXNTaG93KCk7XG5cdH07XG5cdFxuXHR0aGlzLmlzU2hvd1NlbGVjdExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5pc0F2YWlsYWJsZSgpICYmICFzZWxlY3RMaWJyYXJ5LmlzVXNlckxpYnJhcnkodXNlci5nZXRJZCgpKTtcblx0fTtcblxuXHR0aGlzLmlzU2hvd0NyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNTaG93QXV0aG9yaXphdGlvbigpICYmICFzZWxlY3RMaWJyYXJ5LmlzQXZhaWxhYmxlKCk7XG5cdH07XG5cblx0dGhpcy5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIWNsb3NlZCAmJiAodGhpcy5pc1Nob3dBdXRob3JpemF0aW9uKCkgfHwgdGhpcy5pc1Nob3dDcmVhdGVMaWJyYXJ5KCkgfHwgdGhpcy5pc1Nob3dTZWxlY3RMaWJyYXJ5KCkpO1xuXHR9O1xuXG5cdHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0TG9hZGVkKCk7XG5cdH07XG5cblx0dGhpcy5zaG93TG9naW5EaWFsb2cgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnNob3coKTtcblx0fTtcblxuXHR0aGlzLnNob3dTZWxlY3RMaWJyYXJ5RGlhbG9nID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VsZWN0TGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0dGhpcy5zaG93Q3JlYXRlTGlicmFyeURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnkuc2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0XHRjbG9zZWQgPSB0cnVlO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmRpcmVjdGl2ZSgndmJTZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0cmVzdHJpY3Q6ICdFJyxcbiAgICBcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmw6ICcvdWkvc2VsZWN0LmVqcycsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdHZhbHVlOiAnQCcsXG5cdFx0XHRsYWJlbDogJ0AnXG5cdFx0fSxcblxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRjb250cm9sbGVyLiRzZXRWaWV3VmFsdWUoaXRlbVtzY29wZS52YWx1ZV0pO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRyb2xsZXIuJG1vZGVsVmFsdWUgPT09IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdhcmNoaXZlJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIGFyY2hpdmUgPSB7fTtcblxuXHRhcmNoaXZlLnNlbmRFeHRlcm5hbFVSTCA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG5cdFx0cmV0dXJuIGRhdGEucG9zdENvdmVyKGV4dGVybmFsVVJMLCB0YWdzKTtcblx0fTtcblxuXHRyZXR1cm4gYXJjaGl2ZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYWNoZScsIGZ1bmN0aW9uICgkcSwgJGxvZywgZGF0YSkge1xuXHR2YXIgY2FjaGUgPSB7fTtcblxuXHR2YXIgbGlicmFyeSA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IHt9O1xuXHR2YXIgYm9va3MgPSB7fTtcblx0dmFyIGltYWdlcyA9IHt9O1xuXG5cdGNhY2hlLmluaXQgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGNvdmVycykge1xuXHRcdHZhciBsaWJyYXJ5TG9hZCA9IGxvYWRMaWJyYXJ5RGF0YShsaWJyYXJ5TW9kZWwpO1xuXHRcdHZhciBzZWN0aW9uc0xvYWQgPSBbXTtcblx0XHR2YXIgYm9va3NMb2FkID0gW107XG5cdFx0dmFyIGltYWdlc0xvYWQgPSBbXTtcblx0XHR2YXIgbW9kZWwsIGNvdmVySWQ7IC8vIGl0ZXJhdG9yc1xuXG5cdFx0Zm9yIChtb2RlbCBpbiBzZWN0aW9uTW9kZWxzKSB7XG5cdFx0XHRzZWN0aW9uc0xvYWQucHVzaChhZGRTZWN0aW9uKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChtb2RlbCBpbiBib29rTW9kZWxzKSB7XG5cdFx0XHRib29rc0xvYWQucHVzaChhZGRCb29rKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb3ZlcklkIGluIGNvdmVycykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlQnlEdG8oY292ZXJzW2NvdmVySWRdKSk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb21pc2UgPSAkcS5hbGwoe1xuXHRcdFx0bGlicmFyeUNhY2hlOiBsaWJyYXJ5TG9hZCwgXG5cdFx0XHRzZWN0aW9uc0xvYWQ6ICRxLmFsbChzZWN0aW9uc0xvYWQpLCBcblx0XHRcdGJvb2tzTG9hZDogJHEuYWxsKGJvb2tzTG9hZCksXG5cdFx0XHRpbWFnZXNMb2FkOiAkcS5hbGwoaW1hZ2VzTG9hZClcblx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cdFx0XHRsaWJyYXJ5ID0gcmVzdWx0cy5saWJyYXJ5Q2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRjYWNoZS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpYnJhcnk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0U2VjdGlvbiA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihzZWN0aW9ucywgbW9kZWwsIGFkZFNlY3Rpb24pO1xuXHR9O1xuXG5cdGNhY2hlLmdldEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoYm9va3MsIG1vZGVsLCBhZGRCb29rKTtcblx0fTtcblxuXHRjYWNoZS5nZXRJbWFnZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihpbWFnZXMsIGlkLCBhZGRJbWFnZUJ5SWQpO1xuXHR9O1xuXG5cdHZhciBhZGRTZWN0aW9uID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoc2VjdGlvbnMsIG1vZGVsLCBsb2FkU2VjdGlvbkRhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoYm9va3MsIG1vZGVsLCBsb2FkQm9va0RhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZUJ5SWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkYXRhLmdldENvdmVyKGlkKS50aGVuKGZ1bmN0aW9uIChjb3ZlckR0bykge1xuXHRcdFx0cmV0dXJuIGRhdGEubG9hZEltYWdlKGNvdmVyRHRvLnVybCkudGhlbihmdW5jdGlvbiAoaW1hZ2UpIHtcblx0XHRcdFx0cmV0dXJuIGFkZEltYWdlKGNvdmVyRHRvLCBpbWFnZSk7XG5cdFx0XHR9KTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgaWQ6JywgaWQpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlQnlEdG8gPSBmdW5jdGlvbihjb3ZlckR0bykge1xuXHRcdHJldHVybiBkYXRhLmxvYWRJbWFnZShjb3ZlckR0by51cmwpLnRoZW4oZnVuY3Rpb24gKGltYWdlKSB7XG5cdFx0XHRyZXR1cm4gYWRkSW1hZ2UoY292ZXJEdG8sIGltYWdlKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgZHRvOicsIGNvdmVyRHRvLmlkKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZSA9IGZ1bmN0aW9uKGR0bywgaW1hZ2UpIHtcblx0XHR2YXIgbG9hZGVkQ2FjaGUgPSB7XG5cdFx0XHRkdG86IGR0byxcblx0XHRcdGltYWdlOiBpbWFnZVxuXHRcdH07XG5cblx0XHRpbWFnZXNbZHRvLmlkXSA9IGxvYWRlZENhY2hlO1xuXHRcdHJldHVybiBsb2FkZWRDYWNoZTtcblx0fTtcblxuXHR2YXIgY29tbW9uR2V0dGVyID0gZnVuY3Rpb24oZnJvbSwga2V5LCBhZGRGdW5jdGlvbikge1xuXHRcdHZhciByZXN1bHQgPSBmcm9tW2tleV07XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRyZXN1bHQgPSBhZGRGdW5jdGlvbihrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS53aGVuKHJlc3VsdCk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkFkZGVyID0gZnVuY3Rpb24od2hlcmUsIHdoYXQsIGxvYWRlcikge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVt3aGF0XSA9IGxvYWRlZENhY2hlO1xuXG5cdFx0XHRyZXR1cm4gbG9hZGVkQ2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZExpYnJhcnlEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2xpYnJhcmllcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qc29uJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBsb2FkU2VjdGlvbkRhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovc2VjdGlvbnMve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBtb2RlbCk7XG4gICAgICAgIHZhciBtb2RlbFVybCA9IHBhdGggKyAnbW9kZWwuanMnO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcbiAgICAgICAgdmFyIGRhdGFVcmwgPSBwYXRoICsgJ2RhdGEuanNvbic7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpLCBcbiAgICAgICAgXHRkYXRhOiBkYXRhLmdldERhdGEoZGF0YVVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRCb29rRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9ib29rcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgYnVtcE1hcFVybCA9IHBhdGggKyAnYnVtcF9tYXAuanBnJztcbiAgICAgICAgdmFyIHNwZWN1bGFyTWFwVXJsID0gcGF0aCArICdzcGVjdWxhcl9tYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IGRhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSxcbiAgICAgICAgXHRtYXBJbWFnZTogZGF0YS5sb2FkSW1hZ2UobWFwVXJsKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0XHQkbG9nLmVycm9yKCdDYWNoZTogRXJyb3IgbG9hZGluZyBib29rIG1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRidW1wTWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKGJ1bXBNYXBVcmwpLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRcdCRsb2cuZXJyb3IoJ0NhY2hlOiBFcnJvciBsb2FkaW5nIGJvb2sgYnVtcE1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRzcGVjdWxhck1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShzcGVjdWxhck1hcFVybCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICBcdFx0JGxvZy5lcnJvcignQ2FjaGU6IEVycm9yIGxvYWRpbmcgYm9vayBzcGVjdWxhck1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRyZXR1cm4gY2FjaGU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY2FtZXJhJywgZnVuY3Rpb24gKENhbWVyYU9iamVjdCkge1xuXHR2YXIgY2FtZXJhID0ge1xuXHRcdEhFSUdUSDogMS41LFxuXHRcdG9iamVjdDogbmV3IENhbWVyYU9iamVjdCgpLFxuXHRcdHNldFBhcmVudDogZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0XHRwYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHR9LFxuXHRcdGdldFBvc2l0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm9iamVjdC5wb3NpdGlvbjtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdFxuXHRcdGNhbWVyYS5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIHdpZHRoIC8gaGVpZ2h0LCAwLjAxLCA1MCk7XG5cdFx0Y2FtZXJhLm9iamVjdC5wb3NpdGlvbi5zZXQoMCwgY2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0Y2FtZXJhLm9iamVjdC5yb3RhdGlvbi5vcmRlciA9ICdZWFonO1xuXG5cdFx0dmFyIGNhbmRsZSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4NjY1NTU1LCAxLjYsIDEwKTtcblx0XHRjYW5kbGUucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuXG5cdFx0Y2FtZXJhLm9iamVjdC5hZGQoY2FuZGxlKTtcblx0XHRjYW1lcmEub2JqZWN0LmFkZChjYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRjYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Y2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdGNhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGNhbWVyYTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi8qIFxuICogY29udHJvbHMuanMgaXMgYSBzZXJ2aWNlIGZvciBwcm9jZXNzaW5nIG5vdCBVSShtZW51cykgZXZlbnRzIFxuICogbGlrZSBtb3VzZSwga2V5Ym9hcmQsIHRvdWNoIG9yIGdlc3R1cmVzLlxuICpcbiAqIFRPRE86IHJlbW92ZSBhbGwgYnVzaW5lcyBsb2dpYyBmcm9tIHRoZXJlIGFuZCBsZWF2ZSBvbmx5XG4gKiBldmVudHMgZnVuY3Rpb25hbGl0eSB0byBtYWtlIGl0IG1vcmUgc2ltaWxhciB0byB1c3VhbCBjb250cm9sbGVyXG4gKi9cbi5mYWN0b3J5KCdjb250cm9scycsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHJvb3RTY29wZSwgU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgY2FtZXJhLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCwgbW91c2UsIHNlbGVjdG9yLCBwcmV2aWV3LCBibG9jaywgdG9vbHMpIHtcblx0dmFyIGNvbnRyb2xzID0ge307XG5cblx0Y29udHJvbHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcblx0fTtcblxuXHRjb250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgY29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRcdGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZmFsc2U7fTtcblx0fTtcblxuXHRjb250cm9scy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZighcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHRjYW1lcmEucm90YXRlKG1vdXNlLmxvbmdYLCBtb3VzZS5sb25nWSk7XG5cdFx0XHR9XG5cdFx0XHRpZihtb3VzZVsxXSAmJiBtb3VzZVszXSkge1xuXHRcdFx0XHRjYW1lcmEuZ28obmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Y29udHJvbHMub25Nb3VzZURvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdG1vdXNlLmRvd24oZXZlbnQpOyBcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgbW91c2VbMV0gJiYgIW1vdXNlWzNdICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGNvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXG5cdFx0XHRpZihzZWxlY3Rvci5wbGFjaW5nKSB7XG5cdFx0XHRcdHRvb2xzLnBsYWNlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxlY3Rvci5zZWxlY3RGb2N1c2VkKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRyb290U2NvcGUuJGFwcGx5KCk7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VVcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UudXAoZXZlbnQpO1xuXHRcdFxuXHRcdGlmKGV2ZW50LndoaWNoID09PSAxICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpKSB7XG5cdFx0XHRcdHZhciBvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXG5cdFx0XHRcdGlmKG9iaiAmJiBvYmouY2hhbmdlZCkge1xuXHRcdFx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0XHRcdG9iai5zYXZlKCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b2JqLnJvbGxiYWNrKCk7XG5cdFx0XHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5tb3ZlKGV2ZW50KTtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdKSB7XHRcdFxuXHRcdFx0XHRjb250cm9scy5tb3ZlT2JqZWN0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8qKioqXG5cblx0Y29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdG9iamVjdDtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgZW52aXJvbm1lbnQubGlicmFyeSkge1xuXHRcdFx0Ly9UT0RPOiBvcHRpbWl6ZVxuXHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbQm9va09iamVjdF0pO1xuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NoZWxmT2JqZWN0XSk7XG5cdFx0XHR9XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2VjdGlvbk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rvci5mb2N1cyhuZXcgU2VsZWN0b3JNZXRhKG9iamVjdCkpO1xuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5tb3ZlT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1vdXNlVmVjdG9yO1xuXHRcdHZhciBuZXdQb3NpdGlvbjtcblx0XHR2YXIgcGFyZW50O1xuXHRcdHZhciBzZWxlY3RlZE9iamVjdDtcblxuXHRcdGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpKSB7XG5cdFx0XHRzZWxlY3RlZE9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cblx0XHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHRcdG1vdXNlVmVjdG9yID0gY2FtZXJhLmdldFZlY3RvcigpO1x0XG5cdFx0XHRcdG5ld1Bvc2l0aW9uID0gc2VsZWN0ZWRPYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdFx0cGFyZW50ID0gc2VsZWN0ZWRPYmplY3QucGFyZW50O1xuXHRcdFx0XHRwYXJlbnQubG9jYWxUb1dvcmxkKG5ld1Bvc2l0aW9uKTtcblxuXHRcdFx0XHRuZXdQb3NpdGlvbi54IC09IChtb3VzZVZlY3Rvci56ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci54ICogbW91c2UuZFkpICogMC4wMDM7XG5cdFx0XHRcdG5ld1Bvc2l0aW9uLnogLT0gKC1tb3VzZVZlY3Rvci54ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci56ICogbW91c2UuZFkpICogMC4wMDM7XG5cblx0XHRcdFx0cGFyZW50LndvcmxkVG9Mb2NhbChuZXdQb3NpdGlvbik7XG5cdFx0XHRcdHNlbGVjdGVkT2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY29udHJvbHM7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdkYXRhJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGxvZykge1xuXHR2YXIgZGF0YSA9IHt9O1xuXG5cdGRhdGEuVEVYVFVSRV9SRVNPTFVUSU9OID0gNTEyO1xuXHRkYXRhLkNPVkVSX01BWF9ZID0gMzk0O1xuXHRkYXRhLkNPVkVSX0ZBQ0VfWCA9IDI5NjtcblxuICAgIGRhdGEubG9hZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICcnOyBcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgXG4gICAgICAgIGlmKGltZy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7IFxuICAgIH07XG5cblx0ZGF0YS5nZXRDb3ZlciA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2NvdmVyLycgKyBpZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cbiAgICBkYXRhLnBvc3RDb3ZlciA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG4gICAgXHR2YXIgZGF0YSA9IHtcbiAgICBcdFx0dXJsOiBleHRlcm5hbFVSTCxcbiAgICBcdFx0dGFnczogdGFnc1xuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9jb3ZlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIFx0XHRyZXR1cm4gcmVzLmRhdGE7XG4gICAgXHR9KTtcbiAgICB9O1xuXG4gICAgZGF0YS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXV0aC9sb2dvdXQnKTtcbiAgICB9O1xuXG5cdGRhdGEuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy91c2VyJykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5wdXRVc2VyID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL3VzZXInLCBkdG8pO1xuXHR9O1xuXG5cdGRhdGEuZGVsZXRlVXNlciA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL3VzZXIvJyArIGlkKTtcblx0fTtcblxuXHRkYXRhLmdldFVzZXJCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9mcmVlQm9va3MvJyArIHVzZXJJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0Qm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2Jvb2snLCBib29rKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZUJvb2sgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0dXJsOiAnL2Jvb2svJyArIGlkXG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5nZXRVSURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvb2JqL2RhdGEuanNvbicpO1xuXHR9O1xuXG5cdGRhdGEuZ2V0TGlicmFyaWVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2xpYnJhcmllcycpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJ5LycgKyBsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9saWJyYXJ5LycgKyBsaWJyYXJ5TW9kZWwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHRkYXRhLmdldFNlY3Rpb25zID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZWN0aW9ucy8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0U2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EYXRhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2VjdGlvbicsIHNlY3Rpb25EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgXHRyZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEuZGVsZXRlU2VjdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHR1cmw6ICcvc2VjdGlvbnMvJyArIGlkXG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5sb2FkR2VvbWV0cnkgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0dmFyIGpzb25Mb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuXG4gICAgICAgIC8vVE9ETzogZm91bmQgbm8gd2F5IHRvIHJlamVjdFxuXHRcdGpzb25Mb2FkZXIubG9hZChsaW5rLCBmdW5jdGlvbiAoZ2VvbWV0cnkpIHtcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdFx0ZGVmZmVyZWQucmVzb2x2ZShnZW9tZXRyeSk7XG5cdFx0fSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XG5cdH07XG5cblx0ZGF0YS5nZXREYXRhID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0RmVlZGJhY2sgPSBmdW5jdGlvbihkdG8pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9mZWVkYmFjaycsIGR0byk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24gPSBkYXRhLmdldFVJRGF0YSgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdHJldHVybiByZXMuZGF0YTtcblx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdCRsb2cuZXJyb3IoJ2RhdGE6IGxvYWRpbmcgY29tbW9uIGVycm9yJyk7XG5cdH0pO1xuXG5cdHJldHVybiBkYXRhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2RpYWxvZycsIGZ1bmN0aW9uIChuZ0RpYWxvZykge1xuXHR2YXIgZGlhbG9nID0ge307XG5cblx0dmFyIFRFTVBMQVRFID0gJ2NvbmZpcm1EaWFsb2cnO1xuXHR2YXIgRVJST1IgPSAxO1xuXHR2YXIgQ09ORklSTSA9IDI7XG5cdHZhciBXQVJOSU5HID0gMztcblx0dmFyIElORk8gPSA0O1xuXG5cdHZhciBpY29uQ2xhc3NNYXAgPSB7fTtcblx0aWNvbkNsYXNzTWFwW0VSUk9SXSA9ICdmYS10aW1lcy1jaXJjbGUnO1xuXHRpY29uQ2xhc3NNYXBbQ09ORklSTV0gPSAnZmEtcXVlc3Rpb24tY2lyY2xlJztcblx0aWNvbkNsYXNzTWFwW1dBUk5JTkddID0gJ2ZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlJztcblx0aWNvbkNsYXNzTWFwW0lORk9dID0gJ2ZhLWluZm8tY2lyY2xlJztcblxuXHRkaWFsb2cub3BlbkVycm9yID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBFUlJPUik7XG5cdH07XG5cblx0ZGlhbG9nLm9wZW5Db25maXJtID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBDT05GSVJNLCB0cnVlKTtcblx0fTtcblxuXHRkaWFsb2cub3Blbldhcm5pbmcgPSBmdW5jdGlvbihtc2cpIHtcblx0XHRyZXR1cm4gb3BlbkRpYWxvZyhtc2csIFdBUk5JTkcpO1xuXHR9O1xuXG5cdGRpYWxvZy5vcGVuSW5mbyA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgSU5GTyk7XG5cdH07XG5cblx0dmFyIG9wZW5EaWFsb2cgPSBmdW5jdGlvbihtc2csIHR5cGUsIGNhbmNlbEJ1dHRvbikge1xuXHRcdHJldHVybiBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7XG5cdFx0XHR0ZW1wbGF0ZTogVEVNUExBVEUsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1zZzogbXNnLFxuXHRcdFx0XHRpY29uQ2xhc3M6IGdldEljb25DbGFzcyh0eXBlKSxcblx0XHRcdFx0Y2FuY2VsQnV0dG9uOiBjYW5jZWxCdXR0b25cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZ2V0SWNvbkNsYXNzID0gZnVuY3Rpb24odHlwZSkge1xuXHRcdHJldHVybiBpY29uQ2xhc3NNYXBbdHlwZV07XG5cdH07XG5cblx0cmV0dXJuIGRpYWxvZztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdlbnZpcm9ubWVudCcsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHdpbmRvdywgTGlicmFyeU9iamVjdCwgU2VjdGlvbk9iamVjdCwgQm9va09iamVjdCwgQm9va01hdGVyaWFsLCBkYXRhLCBjYW1lcmEsIGNhY2hlKSB7XG5cdHZhciBlbnZpcm9ubWVudCA9IHt9O1xuXG5cdGVudmlyb25tZW50LkNMRUFSQU5DRSA9IDAuMDAxO1xuXHRlbnZpcm9ubWVudC5MSUJSQVJZX0NBTlZBU19JRCA9ICdMSUJSQVJZJztcblx0IFxuXHR2YXIgbGlicmFyeUR0byA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IHt9O1xuXHR2YXIgYm9va3MgPSB7fTtcblx0dmFyIGxvYWRlZCA9IGZhbHNlO1xuXG5cdGVudmlyb25tZW50LnNjZW5lID0gbnVsbDtcblx0ZW52aXJvbm1lbnQubGlicmFyeSA9IG51bGw7XG5cblx0ZW52aXJvbm1lbnQubG9hZExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRjbGVhclNjZW5lKCk7IC8vIGluaXRzIHNvbWUgZmllbGRzXG5cblx0XHR2YXIgcHJvbWlzZSA9IGRhdGEuZ2V0TGlicmFyeShsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0dmFyIGRpY3QgPSBwYXJzZUxpYnJhcnlEdG8oZHRvKTtcblx0XHRcdFxuXHRcdFx0c2VjdGlvbnMgPSBkaWN0LnNlY3Rpb25zO1xuXHRcdFx0Ym9va3MgPSBkaWN0LmJvb2tzO1xuXHRcdFx0bGlicmFyeUR0byA9IGR0bztcblxuXHRcdFx0cmV0dXJuIGluaXRDYWNoZShsaWJyYXJ5RHRvLCBkaWN0LnNlY3Rpb25zLCBkaWN0LmJvb2tzKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNyZWF0ZUxpYnJhcnkobGlicmFyeUR0byk7XG5cdFx0XHRyZXR1cm4gY3JlYXRlU2VjdGlvbnMoc2VjdGlvbnMpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNyZWF0ZUJvb2tzKGJvb2tzKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdvVG9MaWJyYXJ5ID0gZnVuY3Rpb24oaWQpIHtcblx0XHRpZihpZCkgJHdpbmRvdy5sb2NhdGlvbiA9ICcvJyArIGlkO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnNldExvYWRlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0bG9hZGVkID0gdmFsdWU7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0TG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxvYWRlZDtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRCb29rID0gZnVuY3Rpb24oYm9va0lkKSB7XG5cdFx0cmV0dXJuIGdldERpY3RPYmplY3QoYm9va3MsIGJvb2tJZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0U2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KHNlY3Rpb25zLCBzZWN0aW9uSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNoZWxmID0gZnVuY3Rpb24oc2VjdGlvbklkLCBzaGVsZklkKSB7XG5cdFx0dmFyIHNlY3Rpb24gPSBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKHNlY3Rpb25JZCk7XG5cdFx0dmFyIHNoZWxmID0gc2VjdGlvbiAmJiBzZWN0aW9uLnNoZWx2ZXNbc2hlbGZJZF07XG5cblx0XHRyZXR1cm4gc2hlbGY7XG5cdH07XG5cblx0dmFyIGdldERpY3RPYmplY3QgPSBmdW5jdGlvbihkaWN0LCBvYmplY3RJZCkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rbb2JqZWN0SWRdO1xuXHRcdHZhciBkaWN0T2JqZWN0ID0gZGljdEl0ZW0gJiYgZGljdEl0ZW0ub2JqO1xuXG5cdFx0cmV0dXJuIGRpY3RPYmplY3Q7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQudXBkYXRlU2VjdGlvbiA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXG5cdFx0aWYoZHRvLmxpYnJhcnlJZCA9PSBlbnZpcm9ubWVudC5saWJyYXJ5LmdldElkKCkpIHtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oZHRvLmlkKTtcblx0XHRcdHByb21pc2UgPSBjcmVhdGVTZWN0aW9uKGR0byk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oZHRvLmlkKTtcblx0XHRcdHByb21pc2UgPSAkcS53aGVuKGR0byk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XHRcblx0fTtcblxuXHRlbnZpcm9ubWVudC51cGRhdGVCb29rID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGR0byk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9IGNyZWF0ZUJvb2soZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KGJvb2tzLCBpZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KHNlY3Rpb25zLCBpZCk7XG5cdH07XG5cblx0dmFyIHJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKGRpY3QsIGtleSkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rba2V5XTtcblx0XHRpZihkaWN0SXRlbSkge1xuXHRcdFx0ZGVsZXRlIGRpY3Rba2V5XTtcblx0XHRcdFxuXHRcdFx0aWYoZGljdEl0ZW0ub2JqKSB7XG5cdFx0XHRcdGRpY3RJdGVtLm9iai5zZXRQYXJlbnQobnVsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0Q2FjaGUgPSBmdW5jdGlvbihsaWJyYXJ5RHRvLCBzZWN0aW9uc0RpY3QsIGJvb2tzRGljdCkge1xuXHRcdHZhciBsaWJyYXJ5TW9kZWwgPSBsaWJyYXJ5RHRvLm1vZGVsO1xuXHRcdHZhciBzZWN0aW9uTW9kZWxzID0ge307XG5cdFx0dmFyIGJvb2tNb2RlbHMgPSB7fTtcblx0XHR2YXIgaW1hZ2VVcmxzID0ge307XG5cblx0XHRmb3IgKHZhciBzZWN0aW9uSWQgaW4gc2VjdGlvbnNEaWN0KSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IHNlY3Rpb25zRGljdFtzZWN0aW9uSWRdLmR0bztcblx0XHRcdHNlY3Rpb25Nb2RlbHNbc2VjdGlvbkR0by5tb2RlbF0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGJvb2tJZCBpbiBib29rc0RpY3QpIHtcblx0XHRcdHZhciBib29rRHRvID0gYm9va3NEaWN0W2Jvb2tJZF0uZHRvO1xuXHRcdFx0Ym9va01vZGVsc1tib29rRHRvLm1vZGVsXSA9IHRydWU7XG5cblx0XHRcdGlmKGJvb2tEdG8uY292ZXIpIHtcblx0XHRcdFx0aW1hZ2VVcmxzW2Jvb2tEdG8uY292ZXIuaWRdID0gYm9va0R0by5jb3Zlcjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGUuaW5pdChsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGltYWdlVXJscyk7XG5cdH07XG5cblx0dmFyIGNsZWFyU2NlbmUgPSBmdW5jdGlvbigpIHtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblx0XHRzZWN0aW9ucyA9IHt9O1xuXHRcdGJvb2tzID0ge307XG5cblx0XHR3aGlsZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZihlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UoKTtcblx0XHRcdH1cblx0XHRcdGVudmlyb25tZW50LnNjZW5lLnJlbW92ZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBwYXJzZUxpYnJhcnlEdG8gPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHNlY3Rpb25zOiB7fSxcblx0XHRcdGJvb2tzOiB7fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblx0XHRcdHJlc3VsdC5zZWN0aW9uc1tzZWN0aW9uRHRvLmlkXSA9IHtkdG86IHNlY3Rpb25EdG99O1xuXG5cdFx0XHRmb3IodmFyIGJvb2tJbmRleCA9IHNlY3Rpb25EdG8uYm9va3MubGVuZ3RoIC0gMTsgYm9va0luZGV4ID49IDA7IGJvb2tJbmRleC0tKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gc2VjdGlvbkR0by5ib29rc1tib29rSW5kZXhdO1xuXHRcdFx0XHRyZXN1bHQuYm9va3NbYm9va0R0by5pZF0gPSB7ZHRvOiBib29rRHRvfTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHNlY3Rpb25EdG8uYm9va3M7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGxpYnJhcnlEdG8uc2VjdGlvbnM7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0XHR2YXIgbGlicmFyeUNhY2hlID0gY2FjaGUuZ2V0TGlicmFyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGxpYnJhcnlDYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0bGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGxpYnJhcnlDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0bGlicmFyeS5hZGQobmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDMzMzMzMykpO1xuXHRcdGNhbWVyYS5zZXRQYXJlbnQobGlicmFyeSk7XG5cdFx0XG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuYWRkKGxpYnJhcnkpO1xuXHRcdGVudmlyb25tZW50LmxpYnJhcnkgPSBsaWJyYXJ5O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVTZWN0aW9ucyA9IGZ1bmN0aW9uKHNlY3Rpb25zRGljdCkge1xuXHRcdHJldHVybiBjcmVhdGVPYmplY3RzKHNlY3Rpb25zRGljdCwgY3JlYXRlU2VjdGlvbik7XG5cdH07XG5cblx0dmFyIGNyZWF0ZUJvb2tzID0gZnVuY3Rpb24oYm9va3NEaWN0KSB7XG5cdFx0cmV0dXJuIGNyZWF0ZU9iamVjdHMoYm9va3NEaWN0LCBjcmVhdGVCb29rKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlT2JqZWN0cyA9IGZ1bmN0aW9uKGRpY3QsIGZhY3RvcnkpIHtcblx0XHR2YXIgcmVzdWx0cyA9IFtdO1xuXHRcdHZhciBrZXk7XG5cblx0XHRmb3Ioa2V5IGluIGRpY3QpIHtcblx0XHRcdHJlc3VsdHMucHVzaChmYWN0b3J5KGRpY3Rba2V5XS5kdG8pKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEuYWxsKHJlc3VsdHMpO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkR0bykge1xuXHRcdHZhciBwcm9taXNlID0gY2FjaGUuZ2V0U2VjdGlvbihzZWN0aW9uRHRvLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChzZWN0aW9uQ2FjaGUpIHtcblx0ICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKHNlY3Rpb25DYWNoZS5tYXBJbWFnZSk7XG5cdCAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblx0ICAgICAgICB2YXIgc2VjdGlvbjtcblxuXHQgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHQgICAgICAgIHNlY3Rpb25EdG8uZGF0YSA9IHNlY3Rpb25DYWNoZS5kYXRhO1xuXG5cdCAgICAgICAgc2VjdGlvbiA9IG5ldyBTZWN0aW9uT2JqZWN0KHNlY3Rpb25EdG8sIHNlY3Rpb25DYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0XHRlbnZpcm9ubWVudC5saWJyYXJ5LmFkZChzZWN0aW9uKTtcblx0XHRcdGFkZFRvRGljdChzZWN0aW9ucywgc2VjdGlvbik7XG5cblx0XHRcdHJldHVybiBzZWN0aW9uRHRvO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGNyZWF0ZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2VzID0ge307XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRwcm9taXNlcy5ib29rQ2FjaGUgPSBjYWNoZS5nZXRCb29rKGJvb2tEdG8ubW9kZWwpO1xuXHRcdGlmKGJvb2tEdG8uY292ZXJJZCkge1xuXHRcdFx0cHJvbWlzZXMuY292ZXJDYWNoZSA9IGNhY2hlLmdldEltYWdlKGJvb2tEdG8uY292ZXJJZCk7XG5cdFx0fVxuXG5cdFx0cHJvbWlzZSA9ICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0dmFyIGJvb2tDYWNoZSA9IHJlc3VsdHMuYm9va0NhY2hlO1xuXHRcdFx0dmFyIGNvdmVyTWFwSW1hZ2UgPSByZXN1bHRzLmNvdmVyQ2FjaGUgJiYgcmVzdWx0cy5jb3ZlckNhY2hlLmltYWdlO1xuXHRcdFx0dmFyIG1hdGVyaWFsID0gbmV3IEJvb2tNYXRlcmlhbChib29rQ2FjaGUubWFwSW1hZ2UsIGJvb2tDYWNoZS5idW1wTWFwSW1hZ2UsIGJvb2tDYWNoZS5zcGVjdWxhck1hcEltYWdlLCBjb3Zlck1hcEltYWdlKTtcblx0XHRcdHZhciBib29rID0gbmV3IEJvb2tPYmplY3QoYm9va0R0bywgYm9va0NhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHRcdGFkZFRvRGljdChib29rcywgYm9vayk7XG5cdFx0XHRwbGFjZUJvb2tPblNoZWxmKGJvb2spO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGFkZFRvRGljdCA9IGZ1bmN0aW9uKGRpY3QsIG9iaikge1xuXHRcdHZhciBkaWN0SXRlbSA9IHtcblx0XHRcdGR0bzogb2JqLmRhdGFPYmplY3QsXG5cdFx0XHRvYmo6IG9ialxuXHRcdH07XG5cblx0XHRkaWN0W29iai5nZXRJZCgpXSA9IGRpY3RJdGVtO1xuXHR9O1xuXG5cdHZhciBnZXRCb29rU2hlbGYgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50LmdldFNoZWxmKGJvb2tEdG8uc2VjdGlvbklkLCBib29rRHRvLnNoZWxmSWQpO1xuXHR9O1xuXG5cdHZhciBwbGFjZUJvb2tPblNoZWxmID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHZhciBzaGVsZiA9IGdldEJvb2tTaGVsZihib29rLmRhdGFPYmplY3QpO1xuXHRcdHNoZWxmLmFkZChib29rKTtcblx0fTtcblxuXHRyZXR1cm4gZW52aXJvbm1lbnQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbWFpbicsIGZ1bmN0aW9uICgkbG9nLCAkcSwgY2FtZXJhLCBjb250cm9scywgdXNlciwgZW52aXJvbm1lbnQsIHRvb2xzLCBuYXZpZ2F0aW9uLCB1c2VyRGF0YSwgYmxvY2ssIGxvY2F0b3IpIHtcdFxuXHR2YXIgY2FudmFzO1xuXHR2YXIgcmVuZGVyZXI7XG5cdFxuXHR2YXIgbWFpbiA9IHt9O1xuXG5cdG1haW4uc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHRpZihEZXRlY3Rvci53ZWJnbCkge1xuXHRcdFx0aW5pdCgpO1xuXHRcdFx0Y29udHJvbHMuaW5pdCgpO1xuXG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gJHEuYWxsKFtlbnZpcm9ubWVudC5sb2FkTGlicmFyeSh1c2VyLmdldExpYnJhcnkoKSB8fCAxKSwgdXNlckRhdGEubG9hZCgpXSk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRsb2NhdG9yLmNlbnRlck9iamVjdChjYW1lcmEub2JqZWN0KTtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkKHRydWUpO1xuXHRcdFx0XHRzdGFydFJlbmRlckxvb3AoKTtcblx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdH0pO1x0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHdpblJlc2l6ZTtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQpO1xuXHRcdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2NhbnZhczogY2FudmFzID8gY2FudmFzIDogdW5kZWZpbmVkLCBhbnRpYWxpYXM6IHRydWV9KTtcblx0XHRyZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdHdpblJlc2l6ZSA9IG5ldyBUSFJFRXguV2luZG93UmVzaXplKHJlbmRlcmVyLCBjYW1lcmEuY2FtZXJhKTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZygweDAwMDAwMCwgNCwgNyk7XG5cdH07XG5cblx0dmFyIHN0YXJ0UmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGFydFJlbmRlckxvb3ApO1xuXG5cdFx0Y29udHJvbHMudXBkYXRlKCk7XG5cdFx0bmF2aWdhdGlvbi51cGRhdGUoKTtcblx0XHR0b29scy51cGRhdGUoKTtcblx0XHRcblx0XHRyZW5kZXJlci5yZW5kZXIoZW52aXJvbm1lbnQuc2NlbmUsIGNhbWVyYS5jYW1lcmEpO1xuXHR9O1xuXG5cdHJldHVybiBtYWluO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ21vdXNlJywgZnVuY3Rpb24gKGNhbWVyYSwgZW52aXJvbm1lbnQpIHtcblx0dmFyIG1vdXNlID0ge307XG5cblx0dmFyIGdldFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuXHR9O1xuXG5cdHZhciBnZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9O1xuXG5cdHZhciB4ID0gbnVsbDtcblx0dmFyIHkgPSBudWxsO1xuXHRcblx0bW91c2UudGFyZ2V0ID0gbnVsbDtcblx0bW91c2UuZFggPSBudWxsO1xuXHRtb3VzZS5kWSA9IG51bGw7XG5cdG1vdXNlLmxvbmdYID0gbnVsbDtcblx0bW91c2UubG9uZ1kgPSBudWxsO1xuXG5cdG1vdXNlLmdldFRhcmdldCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRhcmdldDtcblx0fTtcblxuXHRtb3VzZS5kb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSB0cnVlO1xuXHRcdFx0dGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHR4ID0gZXZlbnQuY2xpZW50WDtcblx0XHRcdHkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0bW91c2UubG9uZ1ggPSBnZXRXaWR0aCgpICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gZ2V0SGVpZ2h0KCkgKiAwLjUgLSB5O1xuXHRcdH1cblx0fTtcblxuXHRtb3VzZS51cCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gZmFsc2U7XG5cdFx0XHQvLyBsaW51eCBjaHJvbWUgYnVnIGZpeCAod2hlbiBib3RoIGtleXMgcmVsZWFzZSB0aGVuIGJvdGggZXZlbnQud2hpY2ggZXF1YWwgMylcblx0XHRcdHRoaXNbMV0gPSBmYWxzZTsgXG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLm1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdG1vdXNlLmxvbmdYID0gZ2V0V2lkdGgoKSAqIDAuNSAtIHg7XG5cdFx0XHRtb3VzZS5sb25nWSA9IGdldEhlaWdodCgpICogMC41IC0geTtcblx0XHRcdG1vdXNlLmRYID0gZXZlbnQuY2xpZW50WCAtIHg7XG5cdFx0XHRtb3VzZS5kWSA9IGV2ZW50LmNsaWVudFkgLSB5O1xuXHRcdFx0eCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHR5ID0gZXZlbnQuY2xpZW50WTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UuaXNDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQuaWQgPT09IGVudmlyb25tZW50LkxJQlJBUllfQ0FOVkFTX0lEO1xuXHR9O1xuXG5cdG1vdXNlLmdldEludGVyc2VjdGVkID0gZnVuY3Rpb24ob2JqZWN0cywgcmVjdXJzaXZlLCBzZWFyY2hGb3IpIHtcblx0XHR2YXJcblx0XHRcdHZlY3Rvcixcblx0XHRcdHJheWNhc3Rlcixcblx0XHRcdGludGVyc2VjdHMsXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdHJlc3VsdCxcblx0XHRcdGksIGo7XG5cblx0XHRyZXN1bHQgPSBudWxsO1xuXHRcdHZlY3RvciA9IGdldFZlY3RvcigpO1xuXHRcdHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoKTtcblx0XHRyYXljYXN0ZXIuc2V0KGNhbWVyYS5nZXRQb3NpdGlvbigpLCB2ZWN0b3IpO1xuXHRcdGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyhvYmplY3RzLCByZWN1cnNpdmUpO1xuXG5cdFx0aWYoc2VhcmNoRm9yKSB7XG5cdFx0XHRpZihpbnRlcnNlY3RzLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBpbnRlcnNlY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBpbnRlcnNlY3RzW2ldO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvcihqID0gc2VhcmNoRm9yLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRcdFx0XHRpZihpbnRlcnNlY3RlZC5vYmplY3QgaW5zdGFuY2VvZiBzZWFyY2hGb3Jbal0pIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0ZWQ7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBpbnRlcnNlY3RzO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGdldFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygoeCAvIGdldFdpZHRoKCkpICogMiAtIDEsIC0gKHkgLyBnZXRIZWlnaHQoKSkgKiAyICsgMSwgMC41KTtcblx0XHR2ZWN0b3IudW5wcm9qZWN0KGNhbWVyYS5jYW1lcmEpO1xuXHRcblx0XHRyZXR1cm4gdmVjdG9yLnN1YihjYW1lcmEuZ2V0UG9zaXRpb24oKSkubm9ybWFsaXplKCk7XG5cdH07XG5cblx0cmV0dXJuIG1vdXNlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ25hdmlnYXRpb24nLCBmdW5jdGlvbiAoY2FtZXJhKSB7XG5cdHZhciBuYXZpZ2F0aW9uID0ge307XG5cblx0bmF2aWdhdGlvbi5CVVRUT05TX1JPVEFURV9TUEVFRCA9IDEwMDtcblx0bmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEID0gMC4wMjtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0Zm9yd2FyZDogZmFsc2UsXG5cdFx0YmFja3dhcmQ6IGZhbHNlLFxuXHRcdGxlZnQ6IGZhbHNlLFxuXHRcdHJpZ2h0OiBmYWxzZVx0XHRcdFxuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29TdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGUuZm9yd2FyZCA9IGZhbHNlO1xuXHRcdHN0YXRlLmJhY2t3YXJkID0gZmFsc2U7XG5cdFx0c3RhdGUubGVmdCA9IGZhbHNlO1xuXHRcdHN0YXRlLnJpZ2h0ID0gZmFsc2U7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5mb3J3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvQmFja3dhcmQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5iYWNrd2FyZCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0xlZnQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5sZWZ0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5yaWdodCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZihzdGF0ZS5mb3J3YXJkKSB7XG5cdFx0XHRjYW1lcmEuZ28obmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUuYmFja3dhcmQpIHtcblx0XHRcdGNhbWVyYS5nbygtbmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUubGVmdCkge1xuXHRcdFx0Y2FtZXJhLnJvdGF0ZShuYXZpZ2F0aW9uLkJVVFRPTlNfUk9UQVRFX1NQRUVELCAwKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUucmlnaHQpIHtcblx0XHRcdGNhbWVyYS5yb3RhdGUoLW5hdmlnYXRpb24uQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCd1c2VyJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIHVzZXIgPSB7fTtcblxuXHR2YXIgbG9hZGVkID0gZmFsc2U7XG5cdHZhciBfZGF0YU9iamVjdCA9IG51bGw7XG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblxuXHR1c2VyLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIGRhdGEuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChkdG8pO1xuXHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblx0XHR9KTtcblx0fTtcblxuXHR1c2VyLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkYXRhLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHVzZXIubG9hZCgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHVzZXIuc2V0RGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRfZGF0YU9iamVjdCA9IGRhdGFPYmplY3Q7XG5cdH07XG5cblx0dXNlci5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpYnJhcnk7XG5cdH07XG5cblx0dXNlci5nZXROYW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0Lm5hbWU7XG5cdH07XG5cblx0dXNlci5nZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5lbWFpbDtcblx0fTtcblxuXHR1c2VyLnNldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRsaWJyYXJ5SWQgPSBsaWJyYXJ5SWQgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnN1YnN0cmluZygxKTtcblx0XHRsaWJyYXJ5ID0gTnVtYmVyKGxpYnJhcnlJZCk7XG5cdH07XG5cblx0dXNlci5nZXRJZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5pZDtcblx0fTtcblxuXHR1c2VyLmlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiAhdXNlci5pc1RlbXBvcmFyeSgpO1xuXHR9O1xuXG5cdHVzZXIuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbG9hZGVkO1xuXHR9O1xuXG5cdHVzZXIuaXNUZW1wb3JhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC50ZW1wb3JhcnkpO1xuXHR9O1xuXG5cdHVzZXIuaXNHb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5nb29nbGVJZCk7XG5cdH07XG5cblx0dXNlci5pc1R3aXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC50d2l0dGVySWQpO1xuXHR9O1xuXG5cdHVzZXIuaXNGYWNlYm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LmZhY2Vib29rSWQpO1xuXHR9O1xuXG5cdHVzZXIuaXNWa29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC52a29udGFrdGVJZCk7XG5cdH07XG5cblx0cmV0dXJuIHVzZXI7XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCb29rTWF0ZXJpYWwnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBCb29rTWF0ZXJpYWwgPSBmdW5jdGlvbihtYXBJbWFnZSwgYnVtcE1hcEltYWdlLCBzcGVjdWxhck1hcEltYWdlLCBjb3Zlck1hcEltYWdlKSB7XG5cdFx0dmFyIFZFUlRFWF9TSEFERVJfSUQgPSAnQm9va01hdGVyaWFsVmVydGV4U2hhZGVyJztcblx0XHR2YXIgRlJBR01FTlRfU0hBREVSX0lEID0gJ0Jvb2tNYXRlcmlhbEZyYWdtZW50U2hhZGVyJztcblxuXHRcdHZhciB2ZXJ0ZXhTaGFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChWRVJURVhfU0hBREVSX0lEKS50ZXh0Q29udGVudDtcblx0XHR2YXIgZnJhZ21lbnRTaGFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChGUkFHTUVOVF9TSEFERVJfSUQpLnRleHRDb250ZW50O1xuXG5cdFx0dmFyIGRlZmluZXMgPSB7fTtcblx0XHR2YXIgdW5pZm9ybXM7XG5cdFx0dmFyIHBhcmFtZXRlcnM7XG5cbiAgICAgICAgdmFyIG1hcDtcbiAgICAgICAgdmFyIGJ1bXBNYXA7XG4gICAgICAgIHZhciBzcGVjdWxhck1hcDtcbiAgICAgICAgdmFyIGNvdmVyTWFwO1xuXHRcdFxuXHRcdHVuaWZvcm1zID0gVEhSRUUuVW5pZm9ybXNVdGlscy5tZXJnZShbXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5jb21tb24sXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5idW1wLFxuXHRcdFx0VEhSRUUuVW5pZm9ybXNMaWIuZm9nLFxuXHRcdFx0VEhSRUUuVW5pZm9ybXNMaWIubGlnaHRzXG5cdFx0XSk7XG5cblx0XHR1bmlmb3Jtcy5zaGluaW5lc3MgPSB7dHlwZTogJ2YnLCB2YWx1ZTogMzB9O1xuXHRcdGRlZmluZXMuUEhPTkcgPSB0cnVlO1xuXG5cdFx0aWYobWFwSW1hZ2UpIHtcblx0XHRcdG1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKG1hcEltYWdlKTtcblx0XHRcdG1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5tYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogbWFwfTtcblx0XHRcdHRoaXMubWFwID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYoYnVtcE1hcEltYWdlKSB7XG5cdFx0XHRidW1wTWFwID0gbmV3IFRIUkVFLlRleHR1cmUoYnVtcE1hcEltYWdlKTtcblx0XHRcdGJ1bXBNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuYnVtcE1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBidW1wTWFwfTtcblx0XHRcdHVuaWZvcm1zLmJ1bXBTY2FsZS52YWx1ZSA9IDAuMDA1O1xuXHRcdFx0dGhpcy5idW1wTWFwID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYoc3BlY3VsYXJNYXBJbWFnZSkge1xuXHRcdFx0c3BlY3VsYXJNYXAgPSBuZXcgVEhSRUUuVGV4dHVyZShzcGVjdWxhck1hcEltYWdlKTtcblx0XHRcdHNwZWN1bGFyTWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRcdHVuaWZvcm1zLnNwZWN1bGFyID0ge3R5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigweDU1NTU1NSl9O1xuXHRcdFx0dW5pZm9ybXMuc3BlY3VsYXJNYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogc3BlY3VsYXJNYXB9O1xuXHRcdFx0dGhpcy5zcGVjdWxhck1hcCA9IHRydWU7XG5cdFx0fVxuICAgICAgICBpZihjb3Zlck1hcEltYWdlKSB7XG5cdFx0XHRjb3Zlck1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKGNvdmVyTWFwSW1hZ2UpO1xuXHRcdFx0Y292ZXJNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuY292ZXJNYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogY292ZXJNYXB9O1xuXHRcdFx0ZGVmaW5lcy5VU0VfQ09WRVIgPSB0cnVlO1xuICAgICAgICB9XG5cblx0XHRwYXJhbWV0ZXJzID0ge1xuXHRcdFx0dmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXIsXG5cdFx0XHRmcmFnbWVudFNoYWRlcjogZnJhZ21lbnRTaGFkZXIsXG5cdFx0XHR1bmlmb3JtczogdW5pZm9ybXMsXG5cdFx0XHRkZWZpbmVzOiBkZWZpbmVzLFxuXHRcdFx0bGlnaHRzOiB0cnVlLFxuXHRcdFx0Zm9nOiB0cnVlXG5cdFx0fTtcblxuXHRcdFRIUkVFLlNoYWRlck1hdGVyaWFsLmNhbGwodGhpcywgcGFyYW1ldGVycyk7XG5cdH07XG5cblx0Qm9va01hdGVyaWFsLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVEhSRUUuU2hhZGVyTWF0ZXJpYWwucHJvdG90eXBlKTtcblxuXHRCb29rTWF0ZXJpYWwucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVEhSRUUuQm9va01hdGVyaWFsO1xuXG5cdHJldHVybiBCb29rTWF0ZXJpYWw7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQmFzZU9iamVjdCcsIGZ1bmN0aW9uIChzdWJjbGFzc09mKSB7XG5cdHZhciBCYXNlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QgPSBkYXRhT2JqZWN0IHx8IHt9O1xuXHRcdHRoaXMucm90YXRpb24ub3JkZXIgPSAnWFlaJztcblx0XHR0aGlzLnNldER0b1RyYW5zZm9ybWF0aW9ucygpO1xuXHR9O1xuXHRcblx0QmFzZU9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKFRIUkVFLk1lc2gpO1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy52YlR5cGU7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuZ2V0SWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5kYXRhT2JqZWN0ICYmIHRoaXMuZGF0YU9iamVjdC5pZDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5zZXREdG9UcmFuc2Zvcm1hdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFgodGhpcy5kYXRhT2JqZWN0LnBvc194IHx8IDApO1xuXHRcdHRoaXMucG9zaXRpb24uc2V0WSh0aGlzLmRhdGFPYmplY3QucG9zX3kgfHwgMCk7XG5cdFx0dGhpcy5wb3NpdGlvbi5zZXRaKHRoaXMuZGF0YU9iamVjdC5wb3NfeiB8fCAwKTtcblxuXHRcdGlmKHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbikgdGhpcy5yb3RhdGlvbi5mcm9tQXJyYXkodGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uLm1hcChOdW1iZXIpKTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuaXNPdXRPZlBhcnJlbnQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueCAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci54KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueCAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLngpIHx8XG5cdFx0XHRcdE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnogLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueikgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnogLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56KTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc0NvbGxpZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHR0YXJnZXRzLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0aTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRcdHJlc3VsdCA9IHRoaXMuaXNPdXRPZlBhcnJlbnQoKTtcblx0XHR0YXJnZXRzID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRmb3IoaSA9IHRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0c1tpXS5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRpZih0YXJnZXRzW2ldID09PSB0aGlzIHx8XG5cdFx0XHRcdFx0IXRhcmdldCB8fCAvLyBjaGlsZHJlbiB3aXRob3V0IEJCXG5cdFx0XHRcdFx0KE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0YXJnZXQuY2VudGVyLngpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnggKyB0YXJnZXQucmFkaXVzLngpKSB8fFxuXHRcdFx0XHRcdChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGFyZ2V0LmNlbnRlci55KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy55ICsgdGFyZ2V0LnJhZGl1cy55KSkgfHxcblx0XHRcdFx0XHQoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRhcmdldC5jZW50ZXIueikgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueiArIHRhcmdldC5yYWRpdXMueikpKSB7XHRcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIFx0cmVzdWx0ID0gdHJ1ZTtcdFx0XG5cdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24obmV3UG9zaXRpb24pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0XHRyZXN1bHQ7XG5cblx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XG5cdFx0aWYobmV3UG9zaXRpb24ueCkge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgoY3VycmVudFBvc2l0aW9uLngpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihuZXdQb3NpdGlvbi56KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFoobmV3UG9zaXRpb24ueik7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihjdXJyZW50UG9zaXRpb24ueik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihkWCwgZFksIGlzRGVtbykge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKSxcblx0XHRcdHJlc3VsdCA9IGZhbHNlOyBcblx0XHRcblx0XHRpZihkWCkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ICs9IGRYICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnkgPSBjdXJyZW50Um90YXRpb24ueTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZFkpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueCArPSBkWSAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCAoIWlzRGVtbyAmJiByZXN1bHQpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0Ym91bmRpbmdCb3gsXG5cdFx0XHRyYWRpdXMsXG5cdFx0XHRjZW50ZXI7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXHRcdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFx0XG5cdFx0cmFkaXVzID0ge1xuXHRcdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdFx0eTogKGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnkpICogMC41LFxuXHRcdFx0ejogKGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLnopICogMC41XG5cdFx0fTtcblxuXHRcdGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdFx0Y2VudGVyLmFkZFZlY3RvcnMoYm91bmRpbmdCb3gubWluLCBib3VuZGluZ0JveC5tYXgpO1xuXHRcdGNlbnRlci5tdWx0aXBseVNjYWxhcigwLjUpO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiBjZW50ZXJcblx0XHR9O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJvbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXREdG9UcmFuc2Zvcm1hdGlvbnMoKTtcblx0fTtcblxuXHRyZXR1cm4gQmFzZU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tPYmplY3QnLCBmdW5jdGlvbiAoJGxvZywgQmFzZU9iamVjdCwgZGF0YSwgc3ViY2xhc3NPZikge1x0XG5cdHZhciBCb29rT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdH07XG5cblx0Qm9va09iamVjdC5UWVBFID0gJ0Jvb2tPYmplY3QnO1xuXG5cdEJvb2tPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUudmJUeXBlID0gQm9va09iamVjdC5UWVBFO1xuXG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5nZXRJZCgpLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56XG5cdFx0fTtcblxuXHRcdHJldHVybiBkYXRhLnBvc3RCb29rKGR0bykudGhlbihmdW5jdGlvbiAocmVzcG9uc2VEdG8pIHtcblx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSByZXNwb25zZUR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRpZih0aGlzLnBhcmVudCAhPSBwYXJlbnQpIHtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuYWRkKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IHBhcmVudC5nZXRJZCgpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gcGFyZW50LnBhcmVudC5nZXRJZCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQucmVtb3ZlKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gQm9va09iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmFPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgc3ViY2xhc3NPZikge1xuXHR2YXIgQ2FtZXJhT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cdFx0Z2VvbWV0cnkuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MyhuZXcgVEhSRUUuVmVjdG9yMygtMC4xLCAtMSwgLTAuMSksIG5ldyBUSFJFRS5WZWN0b3IzKDAuMSwgMSwgMC4xKSk7XG5cblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgbnVsbCwgZ2VvbWV0cnkpO1xuXHR9O1xuXG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRcblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByYWRpdXMgPSB7XG5cdFx0XHR4OiB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54LCBcblx0XHRcdHk6IHRoaXMuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnksIFxuXHRcdFx0ejogdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXguelxuXHRcdH07XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IHRoaXMucG9zaXRpb24gLy9UT0RPOiBuZWVkcyBjZW50ZXIgb2Ygc2VjdGlvbiBpbiBwYXJlbnQgb3Igd29ybGQgY29vcmRpbmF0ZXNcblx0XHR9O1xuXHR9O1xuXG5cdHJldHVybiBDYW1lcmFPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBzdWJjbGFzc09mKSB7XG5cdHZhciBMaWJyYXJ5T2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHR9O1xuXG5cdExpYnJhcnlPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblxuXHRyZXR1cm4gTGlicmFyeU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlY3Rpb25PYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgU2hlbGZPYmplY3QsIGRhdGEsIHN1YmNsYXNzT2YpIHtcblx0dmFyIFNlY3Rpb25PYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLnNoZWx2ZXMgPSB7fTtcblx0XHRmb3IodmFyIGtleSBpbiBwYXJhbXMuZGF0YS5zaGVsdmVzKSB7XG5cdFx0XHR0aGlzLnNoZWx2ZXNba2V5XSA9IG5ldyBTaGVsZk9iamVjdChwYXJhbXMuZGF0YS5zaGVsdmVzW2tleV0pOyBcblx0XHRcdHRoaXMuYWRkKHRoaXMuc2hlbHZlc1trZXldKTtcblx0XHR9XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5UWVBFID0gJ1NlY3Rpb25PYmplY3QnO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUudmJUeXBlID0gU2VjdGlvbk9iamVjdC5UWVBFO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5nZXRJZCgpLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56LFxuXHRcdFx0cm90YXRpb246IFt0aGlzLnJvdGF0aW9uLngsIHRoaXMucm90YXRpb24ueSwgdGhpcy5yb3RhdGlvbi56XVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlRHRvKSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzcG9uc2VEdG87XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0aWYodGhpcy5wYXJlbnQgIT0gcGFyZW50KSB7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LmxpYnJhcnlJZCA9IHBhcmVudC5nZXRJZCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQucmVtb3ZlKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3QubGlicmFyeUlkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIFNlY3Rpb25PYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2VsZWN0b3JNZXRhJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgU2VsZWN0b3JNZXRhID0gZnVuY3Rpb24oc2VsZWN0ZWRPYmplY3QpIHtcblx0XHRpZihzZWxlY3RlZE9iamVjdCkge1xuXHRcdFx0dGhpcy5pZCA9IHNlbGVjdGVkT2JqZWN0LmdldElkKCk7XG5cdFx0XHR0aGlzLnBhcmVudElkID0gc2VsZWN0ZWRPYmplY3QucGFyZW50LmdldElkKCk7XG5cdFx0XHR0aGlzLnR5cGUgPSBzZWxlY3RlZE9iamVjdC5nZXRUeXBlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlbGVjdG9yTWV0YS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5pZDtcblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gISghbWV0YSB8fCBcblx0XHRcdFx0bWV0YS5pZCAhPT0gdGhpcy5pZCB8fCBcblx0XHRcdFx0bWV0YS5wYXJlbnRJZCAhPT0gdGhpcy5wYXJlbnRJZCB8fCBcblx0XHRcdFx0bWV0YS50eXBlICE9PSB0aGlzLnR5cGUpO1xuXHR9O1xuXHRcblx0cmV0dXJuIFNlbGVjdG9yTWV0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGFEdG8nLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBzdWJjbGFzc09mKSB7XG5cdHZhciBTZWxlY3Rvck1ldGFEdG8gPSBmdW5jdGlvbih0eXBlLCBpZCwgcGFyZW50SWQpIHtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLnBhcmVudElkID0gcGFyZW50SWQ7XG5cdH07XG5cdFxuXHRTZWxlY3Rvck1ldGFEdG8ucHJvdG90eXBlID0gc3ViY2xhc3NPZihTZWxlY3Rvck1ldGEpO1xuXG5cdHJldHVybiBTZWxlY3Rvck1ldGFEdG87XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplO1x0XG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXG5cdFx0Z2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnkpO1xuXG5cdFx0dGhpcy5wb3NpdGlvbi5zZXQocGFyYW1zLnBvc2l0aW9uWzBdLCBwYXJhbXMucG9zaXRpb25bMV0sIHBhcmFtcy5wb3NpdGlvblsyXSk7XG5cdFx0dGhpcy5zaXplID0gbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cdFx0XG5cdFx0dGhpcy5tYXRlcmlhbC50cmFuc3BhcmVudCA9IHRydWU7XG5cdFx0dGhpcy5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcblx0fTtcblxuXHRTaGVsZk9iamVjdC5UWVBFID0gJ1NoZWxmT2JqZWN0JztcblxuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUudmJUeXBlID0gU2hlbGZPYmplY3QuVFlQRTtcblxuXHRyZXR1cm4gU2hlbGZPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc3ViY2xhc3NPZicsIGZ1bmN0aW9uICgpIHtcblx0ZnVuY3Rpb24gX3N1YmNsYXNzT2YoKSB7fVxuXG5cdGZ1bmN0aW9uIHN1YmNsYXNzT2YoYmFzZSkge1xuXHQgICAgX3N1YmNsYXNzT2YucHJvdG90eXBlID0gYmFzZS5wcm90b3R5cGU7XG5cdCAgICByZXR1cm4gbmV3IF9zdWJjbGFzc09mKCk7XG5cdH1cblxuXHRyZXR1cm4gc3ViY2xhc3NPZjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdncmlkQ2FsY3VsYXRvcicsIGZ1bmN0aW9uICgpIHtcblx0dmFyIGdyaWRDYWxjdWxhdG9yID0ge307XG5cblx0Z3JpZENhbGN1bGF0b3IuZ2V0RWRnZXMgPSBmdW5jdGlvbihzcGFjZUJCLCBwcmVjaXNpb24pIHtcblx0XHR2YXIgcG9zTWluID0gdGhpcy5wb3NUb0NlbGwoc3BhY2VCQi5taW4sIHByZWNpc2lvbik7XG5cdFx0dmFyIHBvc01heCA9IHRoaXMucG9zVG9DZWxsKHNwYWNlQkIubWF4LCBwcmVjaXNpb24pO1xuXHRcdFxuXHRcdHJldHVybiB7XG5cdFx0XHRtaW5YQ2VsbDogcG9zTWluLnggKyAxLFxuXHRcdFx0bWF4WENlbGw6IHBvc01heC54IC0gMSxcblx0XHRcdG1pblpDZWxsOiBwb3NNaW4ueiArIDEsXG5cdFx0XHRtYXhaQ2VsbDogcG9zTWF4LnogLSAxXG5cdFx0fTtcblx0fTtcblxuXHRncmlkQ2FsY3VsYXRvci5wb3NUb0NlbGwgPSBmdW5jdGlvbihwb3MsIHByZWNpc2lvbikge1xuXHRcdHJldHVybiBwb3MuY2xvbmUoKS5kaXZpZGUocHJlY2lzaW9uKS5yb3VuZCgpO1xuXHR9O1xuXG5cdGdyaWRDYWxjdWxhdG9yLmNlbGxUb1BvcyA9IGZ1bmN0aW9uKGNlbGwsIHByZWNpc2lvbikge1xuXHRcdHJldHVybiBjZWxsLmNsb25lKCkubXVsdGlwbHkocHJlY2lzaW9uKTtcblx0fTtcblxuXHRyZXR1cm4gZ3JpZENhbGN1bGF0b3I7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG5cdHZhciBoaWdobGlnaHQgPSB7fTtcblxuXHR2YXIgUExBTkVfUk9UQVRJT04gPSBNYXRoLlBJICogMC41O1xuXHR2YXIgUExBTkVfTVVMVElQTElFUiA9IDI7XG5cdHZhciBDT0xPUl9TRUxFQ1QgPSAweDAwNTUzMztcblx0dmFyIENPTE9SX0ZPQ1VTID0gMHgwMDMzNTU7XG5cblx0dmFyIHNlbGVjdDtcblx0dmFyIGZvY3VzO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1hdGVyaWFsUHJvcGVydGllcyA9IHtcblx0XHRcdG1hcDogbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoICdpbWcvZ2xvdy5wbmcnICksXG5cdFx0XHR0cmFuc3BhcmVudDogdHJ1ZSwgXG5cdFx0XHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuXHRcdFx0YmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG5cdFx0XHRkZXB0aFRlc3Q6IGZhbHNlXG5cdFx0fTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX1NFTEVDVDtcblx0XHR2YXIgbWF0ZXJpYWxTZWxlY3QgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX0ZPQ1VTO1xuXHRcdHZhciBtYXRlcmlhbEZvY3VzID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKG1hdGVyaWFsUHJvcGVydGllcyk7XG5cblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxLCAxLCAxKTtcblxuXHRcdHNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbFNlbGVjdCk7XG5cdFx0c2VsZWN0LnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblxuXHRcdGZvY3VzID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsRm9jdXMpO1xuXHRcdGZvY3VzLnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblx0fTtcblxuXHR2YXIgY29tbW9uSGlnaGxpZ2h0ID0gZnVuY3Rpb24od2hpY2gsIG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dmFyIHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54ICogUExBTkVfTVVMVElQTElFUjtcblx0XHRcdHZhciBoZWlnaHQgPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGJvdHRvbSA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0XHRcdFxuXHRcdFx0d2hpY2gucG9zaXRpb24ueSA9IGJvdHRvbTtcblx0XHRcdHdoaWNoLnNjYWxlLnNldCh3aWR0aCwgaGVpZ2h0LCAxKTtcblx0XHRcdG9iai5hZGQod2hpY2gpO1xuXG5cdFx0XHR3aGljaC52aXNpYmxlID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2hpY2gudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRoaWdobGlnaHQuZW5hYmxlID0gZnVuY3Rpb24oZW5hYmxlKSB7XG5cdFx0Zm9jdXMudmlzaWJsZSA9IHNlbGVjdC52aXNpYmxlID0gZW5hYmxlO1xuXHR9O1xuXG5cdGhpZ2hsaWdodC5mb2N1cyA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGNvbW1vbkhpZ2hsaWdodChmb2N1cywgb2JqKTtcblx0fTtcblxuXHRoaWdobGlnaHQuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KHNlbGVjdCwgb2JqKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGhpZ2hsaWdodDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsb2NhdG9yJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBCYXNlT2JqZWN0LCBkYXRhLCBzZWxlY3RvciwgZW52aXJvbm1lbnQsIGNhY2hlLCBncmlkQ2FsY3VsYXRvcikge1xuXHR2YXIgbG9jYXRvciA9IHt9O1xuXG5cdHZhciBkZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcblxuXHRsb2NhdG9yLmNlbnRlck9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciB0YXJnZXRCQiA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHR2YXIgc3BhY2VCQiA9IGVudmlyb25tZW50LmxpYnJhcnkuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCArIDAuMDEsIDAsIHRhcmdldEJCLm1heC56IC0gdGFyZ2V0QkIubWluLnogKyAwLjAxKTtcblx0XHR2YXIgb2NjdXBpZWRNYXRyaXggPSBnZXRPY2N1cGllZE1hdHJpeChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBtYXRyaXhQcmVjaXNpb24sIG9iaik7XG5cdFx0dmFyIGZyZWVQb3NpdGlvbiA9IGdldEZyZWVNYXRyaXgob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pO1x0XHRcblxuXHRcdG9iai5wb3NpdGlvbi5zZXRYKGZyZWVQb3NpdGlvbi54KTtcblx0XHRvYmoucG9zaXRpb24uc2V0WihmcmVlUG9zaXRpb24ueik7XG5cdH07XG5cblx0bG9jYXRvci5wbGFjZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRHRvKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRTZWN0aW9uKHNlY3Rpb25EdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHRcdFx0dmFyIHNlY3Rpb25CQiA9IHNlY3Rpb25DYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBsaWJyYXJ5QkIgPSBlbnZpcm9ubWVudC5saWJyYXJ5Lmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGZyZWVQbGFjZSA9IGdldEZyZWVQbGFjZShlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBsaWJyYXJ5QkIsIHNlY3Rpb25CQik7XG5cblx0XHRcdHJldHVybiBmcmVlUGxhY2UgP1xuXHRcdFx0XHRzYXZlU2VjdGlvbihzZWN0aW9uRHRvLCBmcmVlUGxhY2UpIDpcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAobmV3RHRvKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlU2VjdGlvbihuZXdEdG8pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVTZWN0aW9uID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbikge1xuXHRcdGR0by5saWJyYXJ5SWQgPSBlbnZpcm9ubWVudC5saWJyYXJ5LmdldElkKCk7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bywgc2hlbGYpIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHR2YXIgc2hlbGZCQiA9IHNoZWxmLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGJvb2tCQiA9IGJvb2tDYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdHJldHVybiBmcmVlUGxhY2UgPyBcblx0XHRcdFx0c2F2ZUJvb2soYm9va0R0bywgZnJlZVBsYWNlLCBzaGVsZikgOiBcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAobmV3RHRvKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhuZXdEdG8pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVCb29rID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbiwgc2hlbGYpIHtcblx0XHRkdG8uc2hlbGZJZCA9IHNoZWxmLmdldElkKCk7XG5cdFx0ZHRvLnNlY3Rpb25JZCA9IHNoZWxmLnBhcmVudC5nZXRJZCgpO1xuXHRcdGR0by5wb3NfeCA9IHBvc2l0aW9uLng7XG5cdFx0ZHRvLnBvc195ID0gcG9zaXRpb24ueTtcblx0XHRkdG8ucG9zX3ogPSBwb3NpdGlvbi56O1xuXG5cdFx0cmV0dXJuIGRhdGEucG9zdEJvb2soZHRvKTtcblx0fTtcblxuXHRsb2NhdG9yLnVucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdGJvb2tEdG8uc2VjdGlvbklkID0gbnVsbDtcblxuXHRcdHByb21pc2UgPSBkYXRhLnBvc3RCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZVBsYWNlID0gZnVuY3Rpb24ob2JqZWN0cywgc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCArIDAuMDEsIDAsIHRhcmdldEJCLm1heC56IC0gdGFyZ2V0QkIubWluLnogKyAwLjAxKTtcblx0XHR2YXIgb2NjdXBpZWRNYXRyaXggPSBnZXRPY2N1cGllZE1hdHJpeChvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdHZhciBmcmVlUG9zaXRpb24gPSBnZXRGcmVlTWF0cml4Q2VsbHMob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdFxuXHRcdGlmIChkZWJ1Z0VuYWJsZWQpIHtcblx0XHRcdGRlYnVnU2hvd0ZyZWUoZnJlZVBvc2l0aW9uLCBtYXRyaXhQcmVjaXNpb24sIGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmcmVlUG9zaXRpb247XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXggPSBmdW5jdGlvbihvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbikge1xuXHRcdHZhciBESVNUQU5DRSA9IDEuMztcblxuXHRcdHZhciB4SW5kZXg7XG5cdFx0dmFyIHpJbmRleDtcblx0XHR2YXIgcG9zaXRpb24gPSB7fTtcblx0XHR2YXIgbWluUG9zaXRpb24gPSB7fTtcblx0XHR2YXIgZWRnZXMgPSBncmlkQ2FsY3VsYXRvci5nZXRFZGdlcyhzcGFjZUJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXG5cdFx0Zm9yICh6SW5kZXggPSBlZGdlcy5taW5aQ2VsbDsgekluZGV4IDw9IGVkZ2VzLm1heFpDZWxsOyB6SW5kZXgrKykge1xuXHRcdFx0Zm9yICh4SW5kZXggPSBlZGdlcy5taW5YQ2VsbDsgeEluZGV4IDw9IGVkZ2VzLm1heFhDZWxsOyB4SW5kZXgrKykge1xuXHRcdFx0XHRpZiAoIW9jY3VwaWVkTWF0cml4W3pJbmRleF0gfHwgIW9jY3VwaWVkTWF0cml4W3pJbmRleF1beEluZGV4XSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uLnBvcyA9IGdldFBvc2l0aW9uRnJvbUNlbGxzKFt4SW5kZXhdLCB6SW5kZXgsIG1hdHJpeFByZWNpc2lvbiwgc3BhY2VCQiwgdGFyZ2V0QkIpO1xuXHRcdFx0XHRcdHBvc2l0aW9uLmxlbmd0aCA9IHBvc2l0aW9uLnBvcy5sZW5ndGgoKTtcblxuXHRcdFx0XHRcdGlmKCFtaW5Qb3NpdGlvbi5wb3MgfHwgcG9zaXRpb24ubGVuZ3RoIDwgbWluUG9zaXRpb24ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRtaW5Qb3NpdGlvbi5wb3MgPSBwb3NpdGlvbi5wb3M7XG5cdFx0XHRcdFx0XHRtaW5Qb3NpdGlvbi5sZW5ndGggPSBwb3NpdGlvbi5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYobWluUG9zaXRpb24ucG9zICYmIG1pblBvc2l0aW9uLmxlbmd0aCA8IERJU1RBTkNFKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbWluUG9zaXRpb24ucG9zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBtaW5Qb3NpdGlvbi5wb3M7XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXhDZWxscyA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHRhcmdldENlbGxzU2l6ZSA9IDE7XG5cdFx0dmFyIGZyZWVDZWxsc0NvdW50ID0gMDtcblx0XHR2YXIgZnJlZUNlbGxzU3RhcnQ7XG5cdFx0dmFyIHhJbmRleDtcblx0XHR2YXIgekluZGV4O1xuXHRcdHZhciBjZWxscztcblx0XHR2YXIgZWRnZXMgPSBncmlkQ2FsY3VsYXRvci5nZXRFZGdlcyhzcGFjZUJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXG5cdFx0Zm9yICh6SW5kZXggPSBlZGdlcy5taW5aQ2VsbDsgekluZGV4IDw9IGVkZ2VzLm1heFpDZWxsOyB6SW5kZXgrKykge1xuXHRcdFx0Zm9yICh4SW5kZXggPSBlZGdlcy5taW5YQ2VsbDsgeEluZGV4IDw9IGVkZ2VzLm1heFhDZWxsOyB4SW5kZXgrKykge1xuXHRcdFx0XHRpZiAoIW9jY3VwaWVkTWF0cml4W3pJbmRleF0gfHwgIW9jY3VwaWVkTWF0cml4W3pJbmRleF1beEluZGV4XSkge1xuXHRcdFx0XHRcdGZyZWVDZWxsc1N0YXJ0ID0gZnJlZUNlbGxzU3RhcnQgfHwgeEluZGV4O1xuXHRcdFx0XHRcdGZyZWVDZWxsc0NvdW50Kys7XG5cblx0XHRcdFx0XHRpZiAoZnJlZUNlbGxzQ291bnQgPT09IHRhcmdldENlbGxzU2l6ZSkge1xuXHRcdFx0XHRcdFx0Y2VsbHMgPSBfLnJhbmdlKGZyZWVDZWxsc1N0YXJ0LCBmcmVlQ2VsbHNTdGFydCArIGZyZWVDZWxsc0NvdW50KTtcblx0XHRcdFx0XHRcdHJldHVybiBnZXRQb3NpdGlvbkZyb21DZWxscyhjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0dmFyIGdldFBvc2l0aW9uRnJvbUNlbGxzID0gZnVuY3Rpb24oY2VsbHMsIHpJbmRleCwgbWF0cml4UHJlY2lzaW9uLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBjZW50ZXIgPSBncmlkQ2FsY3VsYXRvci5jZWxsVG9Qb3MobmV3IFRIUkVFLlZlY3RvcjMoY2VsbHNbMF0sIDAsIHpJbmRleCksIG1hdHJpeFByZWNpc2lvbik7XG5cblx0XHR2YXIgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0XHRvZmZzZXQuYWRkVmVjdG9ycyh0YXJnZXRCQi5taW4sIHRhcmdldEJCLm1heCk7XG5cdFx0b2Zmc2V0Lm11bHRpcGx5U2NhbGFyKC0wLjUpO1xuXG5cdFx0cmV0dXJuIGNlbnRlci5hZGQob2Zmc2V0KS5zZXRZKGdldEJvdHRvbVkoc3BhY2VCQiwgdGFyZ2V0QkIpKTtcblx0fTtcblxuXHR2YXIgZ2V0Qm90dG9tWSA9IGZ1bmN0aW9uKHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0cmV0dXJuIHNwYWNlQkIubWluLnkgLSB0YXJnZXRCQi5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24sIG9iaikge1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHR2YXIgb2JqZWN0QkI7XG5cdFx0dmFyIG1pbktleVg7XG5cdFx0dmFyIG1heEtleVg7XG5cdFx0dmFyIG1pbktleVo7XG5cdFx0dmFyIG1heEtleVo7XHRcdFxuXHRcdHZhciB6LCB4O1xuXG5cdFx0b2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0aWYoY2hpbGQgaW5zdGFuY2VvZiBCYXNlT2JqZWN0ICYmIGNoaWxkICE9PSBvYmopIHtcblx0XHRcdFx0b2JqZWN0QkIgPSBjaGlsZC5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRtaW5LZXlYID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnggLSBvYmplY3RCQi5yYWRpdXMueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0XHRcdG1heEtleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCArIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWluS2V5WiA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci56IC0gb2JqZWN0QkIucmFkaXVzLnopIC8gbWF0cml4UHJlY2lzaW9uLnopO1xuXHRcdFx0XHRtYXhLZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogKyBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRcdFx0Zm9yKHogPSBtaW5LZXlaOyB6IDw9IG1heEtleVo7IHorKykge1xuXHRcdFx0XHRcdHJlc3VsdFt6XSA9IHJlc3VsdFt6XSB8fCB7fTtcblx0XHRcdFx0XHR2YXIgZGVidWdDZWxscyA9IFtdO1xuXG5cdFx0XHRcdFx0Zm9yKHggPSBtaW5LZXlYOyB4IDw9IG1heEtleVg7IHgrKykge1xuXHRcdFx0XHRcdFx0cmVzdWx0W3pdW3hdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGRlYnVnQ2VsbHMucHVzaCh4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihkZWJ1Z0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdGRlYnVnU2hvd0JCKGNoaWxkKTtcblx0XHRcdFx0XHRcdGRlYnVnQWRkT2NjdXBpZWQoZGVidWdDZWxscywgbWF0cml4UHJlY2lzaW9uLCBjaGlsZCwgeik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGxvY2F0b3IuZGVidWcgPSBmdW5jdGlvbigpIHtcblx0XHRjYWNoZS5nZXRTZWN0aW9uKCdib29rc2hlbGZfMDAwMScpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHRcdFx0ZGVidWdFbmFibGVkID0gdHJ1ZTtcblx0XHRcdHZhciBzZWN0aW9uQkIgPSBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgbGlicmFyeUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdGdldEZyZWVQbGFjZShlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBsaWJyYXJ5QkIsIHNlY3Rpb25CQik7XG5cdFx0XHRkZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZGVidWdTaG93QkIgPSBmdW5jdGlvbihvYmopIHtcblx0XHR2YXIgb2JqZWN0QkIgPSBvYmouYm91bmRpbmdCb3g7XG5cdFx0dmFyIG9iakJveCA9IG5ldyBUSFJFRS5NZXNoKFxuXHRcdFx0bmV3IFRIUkVFLkJveEdlb21ldHJ5KFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueCAqIDIsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueSAqIDIgKyAwLjEsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueiAqIDJcblx0XHRcdCksIFxuXHRcdFx0bmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuXHRcdFx0XHRjb2xvcjogMHhiYmJiZmYsXG5cdFx0XHRcdG9wYWNpdHk6IDAuMixcblx0XHRcdFx0dHJhbnNwYXJlbnQ6IHRydWVcblx0XHRcdH0pXG5cdFx0KTtcblx0XHRcblx0XHRvYmpCb3gucG9zaXRpb24ueCA9IG9iamVjdEJCLmNlbnRlci54O1xuXHRcdG9iakJveC5wb3NpdGlvbi55ID0gb2JqZWN0QkIuY2VudGVyLnk7XG5cdFx0b2JqQm94LnBvc2l0aW9uLnogPSBvYmplY3RCQi5jZW50ZXIuejtcblxuXHRcdG9iai5wYXJlbnQuYWRkKG9iakJveCk7XG5cdH07XG5cblx0dmFyIGRlYnVnQWRkT2NjdXBpZWQgPSBmdW5jdGlvbihjZWxscywgbWF0cml4UHJlY2lzaW9uLCBvYmosIHpLZXkpIHtcblx0XHRjZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XG5cdFx0XHR2YXIgcG9zID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoW2NlbGxdLCB6S2V5LCBtYXRyaXhQcmVjaXNpb24sIG9iai5wYXJlbnQuZ2VvbWV0cnkuYm91bmRpbmdCb3gsIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveCk7XG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShtYXRyaXhQcmVjaXNpb24ueCAtIDAuMDEsIDAuMDEsIG1hdHJpeFByZWNpc2lvbi56IC0gMC4wMSksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHhmZjAwMDB9KSk7XG5cdFx0XHRcblx0XHRcdGNlbGxCb3gucG9zaXRpb24uc2V0KHBvcy54LCBwb3MueSwgcG9zLnopO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGRlYnVnU2hvd0ZyZWUgPSBmdW5jdGlvbihwb3NpdGlvbiwgbWF0cml4UHJlY2lzaW9uLCBvYmopIHtcblx0XHRpZiAocG9zaXRpb24pIHtcblx0XHRcdHZhciBjZWxsQm94ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KG1hdHJpeFByZWNpc2lvbi54LCAwLjUsIG1hdHJpeFByZWNpc2lvbi56KSwgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweDAwZmYwMH0pKTtcblx0XHRcdGNlbGxCb3gucG9zaXRpb24uc2V0KHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHBvc2l0aW9uLnopO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgncHJldmlldycsIGZ1bmN0aW9uIChjYW1lcmEsIGhpZ2hsaWdodCkge1xuXHR2YXIgcHJldmlldyA9IHt9O1xuXG5cdHZhciBhY3RpdmUgPSBmYWxzZTtcblx0dmFyIGNvbnRhaW5lcjtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lciA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXHRcdGNvbnRhaW5lci5wb3NpdGlvbi5zZXQoMCwgMCwgLTAuNSk7XG5cdFx0Y29udGFpbmVyLnJvdGF0aW9uLnkgPSAtMjtcblx0XHRjYW1lcmEuY2FtZXJhLmFkZChjb250YWluZXIpO1xuXHR9O1xuXG5cdHZhciBhY3RpdmF0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlID0gdmFsdWU7XG5cdFx0aGlnaGxpZ2h0LmVuYWJsZSghYWN0aXZlKTtcblx0fTtcblxuXHRwcmV2aWV3LmlzQWN0aXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZTtcblx0fTtcblxuXHRwcmV2aWV3LmVuYWJsZSA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciBvYmpDbG9uZTtcblxuXHRcdGlmKG9iaikge1xuXHRcdFx0YWN0aXZhdGUodHJ1ZSk7XG5cblx0XHRcdG9iakNsb25lID0gb2JqLmNsb25lKCk7XG5cdFx0XHRvYmpDbG9uZS5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG5cdFx0XHRjb250YWluZXIuYWRkKG9iakNsb25lKTtcblx0XHR9XG5cdH07XG5cblx0cHJldmlldy5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFyQ29udGFpbmVyKCk7XG5cdFx0YWN0aXZhdGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZhciBjbGVhckNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0Y29udGFpbmVyLnJlbW92ZShjaGlsZCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cHJldmlldy5yb3RhdGUgPSBmdW5jdGlvbihkWCkge1xuXHRcdGNvbnRhaW5lci5yb3RhdGlvbi55ICs9IGRYID8gZFggKiAwLjA1IDogMDtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIHByZXZpZXc7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgZW52aXJvbm1lbnQsIGhpZ2hsaWdodCwgcHJldmlldywgdG9vbHRpcCwgY2F0YWxvZykge1xuXHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XG5cdHZhciBzZWxlY3RlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblx0dmFyIGZvY3VzZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cblx0c2VsZWN0b3IucGxhY2luZyA9IGZhbHNlO1xuXG5cdHNlbGVjdG9yLmZvY3VzID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHZhciBvYmo7XG5cblx0XHRpZighbWV0YS5lcXVhbHMoZm9jdXNlZCkpIHtcblx0XHRcdGZvY3VzZWQgPSBtZXRhO1xuXG5cdFx0XHRpZighZm9jdXNlZC5pc0VtcHR5KCkpIHtcblx0XHRcdFx0b2JqID0gc2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCgpO1xuXHRcdFx0XHRoaWdobGlnaHQuZm9jdXMob2JqKTtcblx0XHRcdH1cblxuXHRcdFx0dG9vbHRpcC5zZXQob2JqKTtcblx0XHR9XG5cdH07XG5cblx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlbGVjdG9yLnNlbGVjdChmb2N1c2VkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iaiA9IGdldE9iamVjdChtZXRhKTtcblx0XHRcblx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdHNlbGVjdGVkID0gbWV0YTtcblxuXHRcdGhpZ2hsaWdodC5zZWxlY3Qob2JqKTtcblx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cblx0XHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cdH07XG5cblx0c2VsZWN0b3IudW5zZWxlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRpZighc2VsZWN0ZWQuaXNFbXB0eSgpKSB7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG51bGwpO1xuXHRcdFx0c2VsZWN0ZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cdFx0fVxuXG5cdFx0cHJldmlldy5kaXNhYmxlKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSA/IGNhdGFsb2cuZ2V0Qm9vayhzZWxlY3RlZC5pZCkgOiBcblx0XHRcdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCkgPyBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKHNlbGVjdGVkLmlkKSA6XG5cdFx0XHRudWxsO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldE9iamVjdChzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3QoZm9jdXNlZCk7XG5cdH07XG5cblx0dmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqZWN0O1xuXG5cdFx0aWYoIW1ldGEuaXNFbXB0eSgpKSB7XG5cdFx0XHRvYmplY3QgPSBpc1NoZWxmKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2hlbGYobWV0YS5wYXJlbnRJZCwgbWV0YS5pZClcblx0XHRcdFx0OiBpc0Jvb2sobWV0YSkgPyBlbnZpcm9ubWVudC5nZXRCb29rKG1ldGEuaWQpXG5cdFx0XHRcdDogaXNTZWN0aW9uKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihtZXRhLmlkKVxuXHRcdFx0XHQ6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcdFxuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpIHx8IHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNCb29rU2VsZWN0ZWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpICYmIHNlbGVjdGVkLmlkID09PSBpZDtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2hlbGYgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNTaGVsZihzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNCb29rKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NlY3Rpb24oc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBpc1NoZWxmID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNoZWxmT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzQm9vayA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBCb29rT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzU2VjdGlvbiA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBTZWN0aW9uT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0cmV0dXJuIHNlbGVjdG9yO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2F1dGhvcml6YXRpb24nLCBmdW5jdGlvbiAoJGxvZywgJHEsICR3aW5kb3csICRpbnRlcnZhbCwgdXNlciwgZW52aXJvbm1lbnQsIHJlZ2lzdHJhdGlvbiwgdXNlckRhdGEsIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgYXV0aG9yaXphdGlvbiA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdsb2dpbkRpYWxvZyc7XG5cblx0YXV0aG9yaXphdGlvbi5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNBdXRob3JpemVkKCkgJiYgdXNlci5pc0xvYWRlZCgpO1xuXHR9O1xuXG5cdHZhciBsb2dpbiA9IGZ1bmN0aW9uKGxpbmspIHtcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHR2YXIgd2luID0gJHdpbmRvdy5vcGVuKGxpbmssICcnLCAnd2lkdGg9ODAwLGhlaWdodD02MDAsbW9kYWw9eWVzLGFsd2F5c1JhaXNlZD15ZXMnKTtcblx0ICAgIHZhciBjaGVja0F1dGhXaW5kb3cgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGlmICh3aW4gJiYgd2luLmNsb3NlZCkge1xuXHQgICAgICAgIFx0JGludGVydmFsLmNhbmNlbChjaGVja0F1dGhXaW5kb3cpO1xuXG5cdCAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQoZmFsc2UpO1xuXHQgICAgICAgIFx0dXNlci5sb2FkKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdHJldHVybiB1c2VyLmlzVGVtcG9yYXJ5KCkgPyByZWdpc3RyYXRpb24uc2hvdygpIDogdXNlckRhdGEubG9hZCgpO1xuXHQgICAgICAgIFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdGVudmlyb25tZW50LnNldExvYWRlZCh0cnVlKTtcblx0ICAgICAgICBcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0ICAgICAgICBcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBcdFx0JGxvZy5sb2coJ1VzZXIgbG9hZGluZCBlcnJvcicpO1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0ICAgICAgICBcdH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIDEwMCk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5nb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvZ29vZ2xlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi50d2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL3R3aXR0ZXInKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL2ZhY2Vib29rJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi52a29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvdmtvbnRha3RlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICBcdGVudmlyb25tZW50LnNldExvYWRlZChmYWxzZSk7XG5cdFx0dXNlci5sb2dvdXQoKS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0cmV0dXJuIHVzZXJEYXRhLmxvYWQoKTtcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQodHJ1ZSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignTG9nb3V0IGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHR9KTtcblx0fTtcblx0XG5cdHJldHVybiBhdXRob3JpemF0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jsb2NrJywgZnVuY3Rpb24gKGJsb2NrVUkpIHtcblx0dmFyIGJsb2NrID0ge307XG5cblx0dmFyIElOVkVOVE9SWSA9ICdpbnZlbnRvcnknO1xuXHR2YXIgTUFJTl9NRU5VID0gJ21haW5fbWVudSc7XG5cdHZhciBHTE9CQUwgPSAnZ2xvYmFsJztcblxuXHRibG9jay5pbnZlbnRvcnkgPSBibG9ja1VJLmluc3RhbmNlcy5nZXQoSU5WRU5UT1JZKTtcblx0XG5cdGJsb2NrLm1haW5NZW51ID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KE1BSU5fTUVOVSk7XG5cblx0YmxvY2suZ2xvYmFsID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KEdMT0JBTCk7XG5cblx0cmV0dXJuIGJsb2NrO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jvb2tFZGl0JywgZnVuY3Rpb24gKCRsb2csIGRhdGEsIGVudmlyb25tZW50LCBibG9jaywgZGlhbG9nLCBhcmNoaXZlLCBjYXRhbG9nLCBzZWxlY3RvciwgdXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIGJvb2tFZGl0ID0ge307XG5cdHZhciBib29rRGlhbG9nO1xuXG5cdHZhciBCT09LX0lNQUdFX1VSTCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vaW1nLmpwZyc7XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEUgPSAnZWRpdEJvb2tEaWFsb2cnO1xuXHRcblx0Ym9va0VkaXQuYm9vayA9IHt9O1xuXG5cdGJvb2tFZGl0LnNob3cgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0c2V0Qm9vayhib29rKTtcblx0XHRib29rRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0dmFyIHNldEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vaykge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5pZCA9IGJvb2suaWQ7XG5cdFx0XHRib29rRWRpdC5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5tb2RlbCA9IGJvb2subW9kZWw7XG5cdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gYm9vay5jb3Zlcjtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXJJZCA9IGJvb2suY292ZXJJZDtcblx0XHRcdGJvb2tFZGl0LmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5hdXRob3IgPSBib29rLmF1dGhvcjtcblx0XHR9XG5cdH07XG5cblx0Ym9va0VkaXQuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5tb2RlbCA/IEJPT0tfSU1BR0VfVVJMLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLmJvb2subW9kZWwpIDogRU1QVFlfSU1BR0VfVVJMO1xuXHR9O1xuXG5cdGJvb2tFZGl0LmdldENvdmVySW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5jb3ZlciA/IHRoaXMuYm9vay5jb3Zlci51cmwgOiBFTVBUWV9JTUFHRV9VUkw7XG5cdH07XG5cblx0Ym9va0VkaXQuYXBwbHlDb3ZlciA9IGZ1bmN0aW9uKGNvdmVySW5wdXRVUkwpIHtcblx0XHRpZihjb3ZlcklucHV0VVJMKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdGFyY2hpdmUuc2VuZEV4dGVybmFsVVJMKGNvdmVySW5wdXRVUkwsIFt0aGlzLmJvb2sudGl0bGUsIHRoaXMuYm9vay5hdXRob3JdKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlciA9IHJlc3VsdDtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gcmVzdWx0LmlkO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVySWQgPSBudWxsO1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gbnVsbDtcblx0XHRcdFx0XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgYXBwbHkgdGhpcyBjb3Zlci4gVHJ5IGFub3RoZXIgb25lLCBwbGVhc2UuJyk7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y292ZXJJbnB1dFVSTCA9IG51bGw7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gbnVsbDtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXIgPSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRib29rRWRpdC5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRkYXRhLnBvc3RCb29rKHRoaXMuYm9vaykudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHRpZihzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZChkdG8uaWQpKSB7XG5cdFx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGVudmlyb25tZW50LnVwZGF0ZUJvb2soZHRvKTtcblx0XHRcdHNjb3BlLmNhbmNlbCgpO1xuXHRcdFx0cmV0dXJuIGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignQm9vayBzYXZlIGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgZXJyb3Jcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0Ym9va0VkaXQuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0Ym9va0RpYWxvZy5jbG9zZSgpO1xuXHR9O1xuXG5cdHJldHVybiBib29rRWRpdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYXRhbG9nJywgZnVuY3Rpb24gKCRxLCBkYXRhLCBibG9jaykge1xuXHR2YXIgY2F0YWxvZyA9IHt9O1xuXG5cdGNhdGFsb2cuYm9va3MgPSBudWxsO1xuXG5cdGNhdGFsb2cubG9hZEJvb2tzID0gZnVuY3Rpb24odXNlcklkKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZih1c2VySWQpIHtcblx0XHRcdGJsb2NrLmludmVudG9yeS5zdGFydCgpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odXNlcklkID8gZGF0YS5nZXRVc2VyQm9va3ModXNlcklkKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRjYXRhbG9nLmJvb2tzID0gcmVzdWx0O1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmludmVudG9yeS5zdG9wKCk7XHRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdGNhdGFsb2cuZ2V0Qm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIF8uZmluZChjYXRhbG9nLmJvb2tzLCB7aWQ6IGlkfSk7XG5cdH07XG5cblx0cmV0dXJuIGNhdGFsb2c7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY3JlYXRlTGlicmFyeScsIGZ1bmN0aW9uIChkYXRhLCBlbnZpcm9ubWVudCwgZGlhbG9nLCBibG9jaywgbmdEaWFsb2cpIHtcblx0dmFyIGNyZWF0ZUxpYnJhcnkgPSB7fTtcblx0XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEVfSUQgPSAnY3JlYXRlTGlicmFyeURpYWxvZyc7XG5cdFxuXHR2YXIgY3JlYXRlTGlicmFyeURpYWxvZztcblxuXHRjcmVhdGVMaWJyYXJ5LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVMaWJyYXJ5RGlhbG9nID0gbmdEaWFsb2cub3Blbih7XG5cdFx0XHR0ZW1wbGF0ZTogVEVNUExBVEVfSURcblx0XHR9KTtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmdldEltZyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIG1vZGVsID8gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0ZGF0YS5wb3N0TGlicmFyeShtb2RlbCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRcdGVudmlyb25tZW50LmdvVG9MaWJyYXJ5KHJlc3VsdC5pZCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGxpYnJhcnkgYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGNyZWF0ZUxpYnJhcnlEaWFsb2cuY2xvc2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5XYXJuaW5nKCdTZWxlY3QgbGlicmFyeSwgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY3JlYXRlTGlicmFyeTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjcmVhdGVTZWN0aW9uJywgZnVuY3Rpb24gKCRsb2csIHVzZXIsIGVudmlyb25tZW50LCBsb2NhdG9yLCBkaWFsb2csIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgY3JlYXRlU2VjdGlvbiA9IHt9O1xuXHRcblx0dmFyIEVNUFRZX0lNQUdFX1VSTCA9ICcvaW1nL2VtcHR5X2NvdmVyLmpwZyc7XG5cdHZhciBURU1QTEFURSA9ICdjcmVhdGVTZWN0aW9uRGlhbG9nJztcblxuXHR2YXIgY3JlYXRlU2VjdGlvbkRpYWxvZztcblxuXHRjcmVhdGVTZWN0aW9uLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVTZWN0aW9uRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0Y3JlYXRlU2VjdGlvbi5nZXRJbWcgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBtb2RlbCA/ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVTZWN0aW9uLmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdHZhciBzZWN0aW9uRGF0YSA9IHtcblx0XHRcdFx0bW9kZWw6IG1vZGVsLFxuXHRcdFx0XHRsaWJyYXJ5SWQ6IGVudmlyb25tZW50LmxpYnJhcnkuZ2V0SWQoKSxcblx0XHRcdFx0dXNlcklkOiB1c2VyLmdldElkKClcblx0XHRcdH07XG5cblx0XHRcdHBsYWNlKHNlY3Rpb25EYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5XYXJuaW5nKCdTZWxlY3QgbW9kZWwsIHBsZWFzZS4nKTtcblx0XHR9XHRcblx0fTtcblxuXHR2YXIgcGxhY2UgPSBmdW5jdGlvbihkdG8pIHtcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRsb2NhdG9yLnBsYWNlU2VjdGlvbihkdG8pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBjcmVhdGUgc2VjdGlvbiBiZWNhdXNlIG9mIGFuIGVycm9yLicpO1xuXHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdH0pO1x0XG5cblx0XHRjcmVhdGVTZWN0aW9uRGlhbG9nLmNsb3NlKCk7XG5cdH07XG5cblx0cmV0dXJuIGNyZWF0ZVNlY3Rpb247XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZmVlZGJhY2snLCBmdW5jdGlvbiAoZGF0YSwgZGlhbG9nLCBuZ0RpYWxvZykge1xuXHR2YXIgZmVlZGJhY2sgPSB7fTtcblx0dmFyIGZlZWRiYWNrRGlhbG9nO1xuXG5cdHZhciBURU1QTEFURSA9ICdmZWVkYmFja0RpYWxvZyc7XG5cblx0ZmVlZGJhY2suc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGZlZWRiYWNrRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0ZmVlZGJhY2suc2VuZCA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdGRpYWxvZy5vcGVuQ29uZmlybSgnU2VuZCBmZWVkYmFjaz8nKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBkYXRhLnBvc3RGZWVkYmFjayhkdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmZWVkYmFja0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkaWFsb2cub3BlbkVycm9yKCdDYW4gbm90IHNlbmQgZmVlZGJhY2sgYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiBmZWVkYmFjaztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsaW5rQWNjb3VudCcsIGZ1bmN0aW9uICh1c2VyLCBuZ0RpYWxvZykge1xuXHR2YXIgbGlua0FjY291bnQgPSB7fTtcblxuXHR2YXIgVEVNUExBVEUgPSAnbGlua0FjY291bnREaWFsb2cnO1xuXG5cdGxpbmtBY2NvdW50LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRuZ0RpYWxvZy5vcGVuKHt0ZW1wbGF0ZTogVEVNUExBVEV9KTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0dvb2dsZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNHb29nbGUoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc1R3aXR0ZXJTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzVHdpdHRlcigpO1xuXHR9O1xuXG5cdGxpbmtBY2NvdW50LmlzRmFjZWJvb2tTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzRmFjZWJvb2soKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc1Zrb250YWt0ZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNWa29udGFrdGUoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmlzR29vZ2xlU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc1R3aXR0ZXJTaG93KCkgfHwgXG5cdFx0XHR0aGlzLmlzRmFjZWJvb2tTaG93KCkgfHwgXG5cdFx0XHR0aGlzLmlzVmtvbnRha3RlU2hvdygpO1xuXHR9O1xuXG5cdHJldHVybiBsaW5rQWNjb3VudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtYWluTWVudScsIGZ1bmN0aW9uICgkbG9nLCBkYXRhLCBib29rRWRpdCwgZmVlZGJhY2ssIHNlbGVjdExpYnJhcnksIGNyZWF0ZUxpYnJhcnksIGNyZWF0ZVNlY3Rpb24sIGxpbmtBY2NvdW50LCBhdXRob3JpemF0aW9uKSB7XG5cdHZhciBtYWluTWVudSA9IHt9O1xuXHRcblx0dmFyIHNob3cgPSBmYWxzZTtcblx0dmFyIGNyZWF0ZUxpc3RTaG93ID0gZmFsc2U7XG5cblx0bWFpbk1lbnUuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNob3c7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRzaG93ID0gdHJ1ZTtcblx0fTtcblxuXHRtYWluTWVudS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0c2hvdyA9IGZhbHNlO1xuXHR9O1xuXG5cdG1haW5NZW51LmlzQ3JlYXRlTGlzdFNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3JlYXRlTGlzdFNob3c7XG5cdH07XG5cblx0bWFpbk1lbnUuY3JlYXRlTGlzdFNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlTGlzdFNob3cgPSB0cnVlO1xuXHR9O1xuXG5cdG1haW5NZW51LmNyZWF0ZUxpc3RIaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlTGlzdFNob3cgPSBmYWxzZTtcblx0fTtcblxuXHRtYWluTWVudS5oaWRlQWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZSgpO1xuXHRcdG1haW5NZW51LmNyZWF0ZUxpc3RIaWRlKCk7XG5cdH07XG5cblx0bWFpbk1lbnUudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKG1haW5NZW51LmlzU2hvdygpKSB7XG5cdFx0XHRtYWluTWVudS5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1haW5NZW51LnNob3coKTtcblx0XHR9XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0ZlZWRiYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGZlZWRiYWNrLnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93U2VsZWN0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRzZWxlY3RMaWJyYXJ5LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93Q3JlYXRlTGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRjcmVhdGVMaWJyYXJ5LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93Q3JlYXRlU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRjcmVhdGVTZWN0aW9uLnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93TGlua0FjY291bnQgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0bGlua0FjY291bnQuc2hvdygpO1xuXHR9O1xuXG5cdG1haW5NZW51LmlzTGlua0FjY291bnRBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIWF1dGhvcml6YXRpb24uaXNTaG93KCkgJiYgbGlua0FjY291bnQuaXNBdmFpbGFibGUoKTtcblx0fTtcblxuXHRyZXR1cm4gbWFpbk1lbnU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgncmVnaXN0cmF0aW9uJywgZnVuY3Rpb24gKCRsb2csIHVzZXIsIGRhdGEsIGRpYWxvZywgdXNlckRhdGEsIG5nRGlhbG9nKSB7XG5cdHZhciByZWdpc3RyYXRpb24gPSB7fTtcblxuXHR2YXIgRk9STV9WQUxJREFUSU9OX0VSUk9SID0gJ0VudGVyIGEgdmFsaWQgZGF0YSwgcGxlYXNlLic7XG5cdHZhciBTQVZFX1VTRVJfRVJST1IgPSAnRXJyb3Igc2F2aW5nIHVzZXIuIFRyeSBhZ2FpbiwgcGxlYXNlLic7XG5cdHZhciBURU1QTEFURSA9ICdyZWdpc3RyYXRpb25EaWFsb2cnO1xuXG5cdHJlZ2lzdHJhdGlvbi51c2VyID0ge1xuXHRcdGlkOiBudWxsLFxuXHRcdG5hbWU6IG51bGwsXG5cdFx0ZW1haWw6IG51bGwsXG5cdFx0dGVtcG9yYXJ5OiBmYWxzZVxuXHR9O1xuXG5cdHJlZ2lzdHJhdGlvbi5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVnaXN0cmF0aW9uLnVzZXIuaWQgPSB1c2VyLmdldElkKCk7XG5cdFx0cmVnaXN0cmF0aW9uLnVzZXIubmFtZSA9IHVzZXIuZ2V0TmFtZSgpO1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLmVtYWlsID0gdXNlci5nZXRFbWFpbCgpO1xuXG5cdFx0cmV0dXJuIG5nRGlhbG9nLm9wZW5Db25maXJtKHt0ZW1wbGF0ZTogVEVNUExBVEV9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBzYXZlVXNlcigpO1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBkZWxldGVVc2VyKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmVnaXN0cmF0aW9uLnNob3dWYWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRkaWFsb2cub3BlbkVycm9yKEZPUk1fVkFMSURBVElPTl9FUlJPUik7XG5cdH07XG5cblx0dmFyIHNhdmVVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRhdGEucHV0VXNlcihyZWdpc3RyYXRpb24udXNlcikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0cmV0dXJuIHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIFx0XHRcdHJldHVybiB1c2VyRGF0YS5sb2FkKCk7XG4gICAgICAgIFx0fSk7XHRcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRkaWFsb2cub3BlbkVycm9yKFNBVkVfVVNFUl9FUlJPUik7XG5cdFx0XHQkbG9nLmxvZygnUmVnaXN0cmF0aW9uOiBFcnJvciBzYXZpbmcgdXNlcjonLCByZWdpc3RyYXRpb24udXNlci5pZCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGRlbGV0ZVVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVVc2VyKHJlZ2lzdHJhdGlvbi51c2VyLmlkKTtcblx0fTtcblxuXHRyZXR1cm4gcmVnaXN0cmF0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3NlbGVjdExpYnJhcnknLCBmdW5jdGlvbiAoJHEsIGRhdGEsIGVudmlyb25tZW50LCB1c2VyLCBuZ0RpYWxvZykge1xuXHR2YXIgc2VsZWN0TGlicmFyeSA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdzZWxlY3RMaWJyYXJ5RGlhbG9nJztcblxuXHRzZWxlY3RMaWJyYXJ5Lmxpc3QgPSBbXTtcblxuXHRzZWxlY3RMaWJyYXJ5LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRuZ0RpYWxvZy5vcGVuQ29uZmlybSh7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3RMaWJyYXJ5Lmxpc3QubGVuZ3RoID4gMDtcblx0fTtcblxuXHRzZWxlY3RMaWJyYXJ5LmlzVXNlckxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQubGlicmFyeSAmJiBlbnZpcm9ubWVudC5saWJyYXJ5LmRhdGFPYmplY3QudXNlcklkID09PSB1c2VyLmdldElkKCk7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS51cGRhdGVMaXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdGlmKHVzZXIuaXNBdXRob3JpemVkKCkpIHtcblx0XHQgICAgcHJvbWlzZSA9IGRhdGEuZ2V0TGlicmFyaWVzKCkudGhlbihmdW5jdGlvbiAobGlicmFyaWVzKSB7XG5cdCAgICAgICAgICAgIHNjb3BlLmxpc3QgPSBsaWJyYXJpZXM7XG5cdCAgICBcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzY29wZS5saXN0ID0gW107XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbihzY29wZS5saXN0KTtcblx0XHR9XG5cbiAgICBcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkuZ28gPSBlbnZpcm9ubWVudC5nb1RvTGlicmFyeTtcblxuXHRyZXR1cm4gc2VsZWN0TGlicmFyeTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCd0b29scycsIGZ1bmN0aW9uICgkcSwgJGxvZywgQm9va09iamVjdCwgU2VjdGlvbk9iamVjdCwgU2hlbGZPYmplY3QsIFNlbGVjdG9yTWV0YUR0bywgZGF0YSwgc2VsZWN0b3IsIGRpYWxvZywgYmxvY2ssIGNhdGFsb2csIGVudmlyb25tZW50LCBwcmV2aWV3LCB1c2VyLCBsb2NhdG9yLCBncm93bCkge1xuXHR2YXIgdG9vbHMgPSB7fTtcblxuXHR2YXIgUk9UQVRJT05fU0NBTEUgPSAxO1xuXG5cdHZhciBzdGF0ZXMgPSB7XG5cdFx0cm90YXRlTGVmdDogZmFsc2UsXG5cdFx0cm90YXRlUmlnaHQ6IGZhbHNlXG5cdH07XG5cblx0dG9vbHMucGxhY2UgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZWN0ZWREdG87XG5cdFx0dmFyIGZvY3VzZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRGb2N1c2VkT2JqZWN0KCk7XG5cblx0XHRpZihmb2N1c2VkT2JqZWN0IGluc3RhbmNlb2YgU2hlbGZPYmplY3QpIHtcblx0XHRcdHNlbGVjdG9yLnBsYWNpbmcgPSBmYWxzZTtcblx0XHRcdHNlbGVjdGVkRHRvID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKTtcblxuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHRsb2NhdG9yLnBsYWNlQm9vayhzZWxlY3RlZER0bywgZm9jdXNlZE9iamVjdCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gY2F0YWxvZy5nZXRCb29rKHNlbGVjdGVkRHRvLmlkKTtcblx0XHRcdFx0c2VsZWN0b3Iuc2VsZWN0KG5ldyBTZWxlY3Rvck1ldGFEdG8oQm9va09iamVjdC5UWVBFLCBib29rRHRvLmlkLCBib29rRHRvLnNoZWxmSWQpKTtcblx0XHRcdFx0Z3Jvd2wuc3VjY2VzcygnQm9vayBwbGFjZWQnKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRncm93bC5lcnJvcihlcnJvcik7XG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z3Jvd2wuZXJyb3IoJ1NoZWxmIGlzIG5vdCBzZWxlY3RlZCcpO1xuXHRcdH1cblx0fTtcblxuXHR0b29scy51bnBsYWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJvb2tEdG8gPSBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpID8gc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKSA6IG51bGw7XG5cblx0XHRpZihib29rRHRvKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdGxvY2F0b3IudW5wbGFjZUJvb2soYm9va0R0bykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGdyb3dsLnN1Y2Nlc3MoJ0Jvb2sgdW5wbGFjZWQnKTtcblx0XHRcdFx0cmV0dXJuIGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSk7XHRcdFxuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdGdyb3dsLmVycm9yKGVycm9yKTtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR0b29scy5kZWxldGVCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVCb29rKGlkKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKGlkKTtcblx0XHRcdHJldHVybiBjYXRhbG9nLmxvYWRCb29rcyh1c2VyLmdldElkKCkpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHRvb2xzLmRlbGV0ZVNlY3Rpb24gPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkYXRhLmRlbGV0ZVNlY3Rpb24oaWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oaWQpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHRvb2xzLnJvdGF0ZUxlZnQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlTGVmdCA9IHRydWU7XG5cdH07XG5cblx0dG9vbHMucm90YXRlUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlUmlnaHQgPSB0cnVlO1xuXHR9O1xuXG5cdHRvb2xzLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlTGVmdCA9IGZhbHNlO1xuXHRcdHN0YXRlcy5yb3RhdGVSaWdodCA9IGZhbHNlO1xuXHR9O1xuXG5cdHRvb2xzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHN0YXRlcy5yb3RhdGVMZWZ0KSB7XG5cdFx0XHRyb3RhdGUoUk9UQVRJT05fU0NBTEUpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZXMucm90YXRlUmlnaHQpIHtcblx0XHRcdHJvdGF0ZSgtUk9UQVRJT05fU0NBTEUpO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgcm90YXRlID0gZnVuY3Rpb24oc2NhbGUpIHtcblx0XHR2YXIgb2JqO1xuXG5cdFx0aWYocHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRwcmV2aWV3LnJvdGF0ZShzY2FsZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iaiA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHRpZihvYmopIG9iai5yb3RhdGUoc2NhbGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gdG9vbHM7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgndG9vbHRpcCcsIGZ1bmN0aW9uICgpIHtcblx0dmFyIHRvb2x0aXAgPSB7fTtcblxuXHR0b29sdGlwLm9iaiA9IHt9O1xuXG5cdHRvb2x0aXAuc2V0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0aWYob2JqKSB7XG5cdFx0XHR0aGlzLm9iai50eXBlID0gb2JqLmdldFR5cGUoKTtcblx0XHRcdHRoaXMub2JqLnRpdGxlID0gb2JqLmRhdGFPYmplY3QudGl0bGU7XG5cdFx0XHR0aGlzLm9iai5hdXRob3IgPSBvYmouZGF0YU9iamVjdC5hdXRob3I7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMub2JqLnR5cGUgPSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gdG9vbHRpcDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCd1c2VyRGF0YScsIGZ1bmN0aW9uICgkcSwgc2VsZWN0TGlicmFyeSwgY2F0YWxvZywgdXNlcikge1xuXHR2YXIgdXNlckRhdGEgPSB7fTtcblxuXHR1c2VyRGF0YS5sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRxLmFsbChbXG5cdFx0XHRzZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKSwgXG5cdFx0XHRjYXRhbG9nLmxvYWRCb29rcyh1c2VyLmdldElkKCkpXG5cdFx0XSk7XG5cdH07XG5cblx0cmV0dXJuIHVzZXJEYXRhO1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9