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
	var sections = null;
	var books = null;
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
			promise = $q.when(true);
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
	var _library = null;

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
		return _library;
	};

	user.getName = function() {
		return _dataObject && _dataObject.name;
	};

	user.getEmail = function() {
		return _dataObject && _dataObject.email;
	};

	user.setLibrary = function(libraryId) {
		_library = libraryId || window.location.pathname.substring(1);
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
		var geometry = new THREE.CubeGeometry(size[0], size[1], size[2]);

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
.factory('locator', function ($q, $log, BaseObject, data, selector, environment, cache) {
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

		var minXCell = Math.floor(spaceBB.min.x / matrixPrecision.x) + 1;
		var maxXCell = Math.floor(spaceBB.max.x / matrixPrecision.x);
		var minZCell = Math.floor(spaceBB.min.z / matrixPrecision.z) + 1;
		var maxZCell = Math.floor(spaceBB.max.z / matrixPrecision.z);

		for (zIndex = minZCell; zIndex <= maxZCell; zIndex++) {
			for (xIndex = minXCell; xIndex <= maxXCell; xIndex++) {
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

		var minXCell = Math.floor(spaceBB.min.x / matrixPrecision.x) + 1;
		var maxXCell = Math.floor(spaceBB.max.x / matrixPrecision.x);
		var minZCell = Math.floor(spaceBB.min.z / matrixPrecision.z) + 1;
		var maxZCell = Math.floor(spaceBB.max.z / matrixPrecision.z);

		for (zIndex = minZCell; zIndex <= maxZCell; zIndex++) {
			for (xIndex = minXCell; xIndex <= maxXCell; xIndex++) {
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
		var freeX = cells[0] * matrixPrecision.x;
		var freeZ =	zIndex * matrixPrecision.z;

		var offset = new THREE.Vector3();
		offset.addVectors(targetBB.min, targetBB.max);
		offset.multiplyScalar(-0.5);

		return new THREE.Vector3(freeX + offset.x, getBottomY(spaceBB, targetBB), freeZ + offset.z);
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
			new THREE.CubeGeometry(
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
			var cellBox = new THREE.Mesh(new THREE.CubeGeometry(matrixPrecision.x - 0.01, 0.01, matrixPrecision.z - 0.01), new THREE.MeshLambertMaterial({color: 0xff0000}));
			
			cellBox.position = pos;
			obj.parent.add(cellBox);
		});
	};

	var debugShowFree = function(position, matrixPrecision, obj) {
		if (position) {
			var cellBox = new THREE.Mesh(new THREE.CubeGeometry(matrixPrecision.x, 0.5, matrixPrecision.z), new THREE.MeshLambertMaterial({color: 0x00ff00}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0F1dGhDdHJsLmpzIiwiY29udHJvbGxlcnMvQm9va0VkaXRDdHJsLmpzIiwiY29udHJvbGxlcnMvQ3JlYXRlTGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9DcmVhdGVTZWN0aW9uQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ZlZWRiYWNrQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ludmVudG9yeUN0cmwuanMiLCJjb250cm9sbGVycy9MaW5rQWNjb3VudEN0cmwuanMiLCJjb250cm9sbGVycy9SZWdpc3RyYXRpb25DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VsZWN0TGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9Ub29sc0N0cmwuanMiLCJjb250cm9sbGVycy9Ub29sdGlwQ3RybC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImNvbnRyb2xsZXJzL1dlbGNvbWVDdHJsLmpzIiwiZGlyZWN0aXZlcy9zZWxlY3QuanMiLCJzZXJ2aWNlcy9hcmNoaXZlLmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwic2VydmljZXMvbWF0ZXJpYWxzL0Jvb2tNYXRlcmlhbC5qcyIsInNlcnZpY2VzL21vZGVscy9CYXNlT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0Jvb2tPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FtZXJhT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VsZWN0b3JNZXRhRHRvLmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL3N1YmNsYXNzT2YuanMiLCJzZXJ2aWNlcy9zY2VuZS9oaWdobGlnaHQuanMiLCJzZXJ2aWNlcy9zY2VuZS9sb2NhdG9yLmpzIiwic2VydmljZXMvc2NlbmUvcHJldmlldy5qcyIsInNlcnZpY2VzL3NjZW5lL3NlbGVjdG9yLmpzIiwic2VydmljZXMvdWkvYXV0aG9yaXphdGlvbi5qcyIsInNlcnZpY2VzL3VpL2Jsb2NrLmpzIiwic2VydmljZXMvdWkvYm9va0VkaXQuanMiLCJzZXJ2aWNlcy91aS9jYXRhbG9nLmpzIiwic2VydmljZXMvdWkvY3JlYXRlTGlicmFyeS5qcyIsInNlcnZpY2VzL3VpL2NyZWF0ZVNlY3Rpb24uanMiLCJzZXJ2aWNlcy91aS9mZWVkYmFjay5qcyIsInNlcnZpY2VzL3VpL2xpbmtBY2NvdW50LmpzIiwic2VydmljZXMvdWkvbWFpbk1lbnUuanMiLCJzZXJ2aWNlcy91aS9yZWdpc3RyYXRpb24uanMiLCJzZXJ2aWNlcy91aS9zZWxlY3RMaWJyYXJ5LmpzIiwic2VydmljZXMvdWkvdG9vbHMuanMiLCJzZXJ2aWNlcy91aS90b29sdGlwLmpzIiwic2VydmljZXMvdWkvdXNlckRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnLCBbJ2FuZ3VsYXItZ3Jvd2wnLCAnYmxvY2tVSScsICduZ0RpYWxvZycsICdhbmd1bGFyVXRpbHMuZGlyZWN0aXZlcy5kaXJQYWdpbmF0aW9uJ10pXG4uY29uZmlnKGZ1bmN0aW9uIChncm93bFByb3ZpZGVyLCBibG9ja1VJQ29uZmlnLCBwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlcikge1xuICAgIGdyb3dsUHJvdmlkZXIuZ2xvYmFsVGltZVRvTGl2ZSgyMDAwKTtcbiAgICBncm93bFByb3ZpZGVyLmdsb2JhbFBvc2l0aW9uKCd0b3AtbGVmdCcpO1xuICAgIGdyb3dsUHJvdmlkZXIuZ2xvYmFsRGlzYWJsZUNvdW50RG93bih0cnVlKTtcblxuXHRibG9ja1VJQ29uZmlnLmRlbGF5ID0gMDtcblx0YmxvY2tVSUNvbmZpZy5hdXRvQmxvY2sgPSBmYWxzZTtcblx0YmxvY2tVSUNvbmZpZy5hdXRvSW5qZWN0Qm9keUJsb2NrID0gZmFsc2U7XG5cdFxuICAgIHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyLnNldFBhdGgoJy91aS9kaXJQYWdpbmF0aW9uJyk7XG59KS5ydW4oZnVuY3Rpb24gKG1haW4pIHtcblx0bWFpbi5zdGFydCgpO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0F1dGhDdHJsJywgZnVuY3Rpb24gKGF1dGhvcml6YXRpb24pIHtcblx0dGhpcy5sb2dpbkdvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uZ29vZ2xlKCk7XG5cdH07XG5cblx0dGhpcy5sb2dpblR3aXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnR3aXR0ZXIoKTtcblx0fTtcblxuXHR0aGlzLmxvZ2luRmFjZWJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLmZhY2Vib29rKCk7XG5cdH07XG5cblx0dGhpcy5sb2dpblZrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udmtvbnRha3RlKCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignQm9va0VkaXRDdHJsJywgZnVuY3Rpb24gKGJvb2tFZGl0LCBkaWFsb2csIGRhdGEpIHtcblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR0aGlzLmJvb2sgPSBib29rRWRpdC5ib29rO1xuXHR0aGlzLmNvdmVySW5wdXRVUkwgPSBudWxsO1xuXG5cdHRoaXMuYXBwbHlDb3ZlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFpc0NvdmVyRGlzYWJsZWQoKSkge1xuXHRcdFx0Ym9va0VkaXQuYXBwbHlDb3Zlcih0aGlzLmNvdmVySW5wdXRVUkwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaWFsb2cub3BlbkVycm9yKCdGaWxsIGF1dGhvciBhbmQgdGl0bGUgZmllbGRzLCBwbGVhc2UuJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHRoaXMuZ2V0Q292ZXJJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYm9va0VkaXQuZ2V0Q292ZXJJbWcoKTtcblx0fTtcblxuXHR0aGlzLmdldEltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBib29rRWRpdC5nZXRJbWcoKTtcblx0fTtcblxuXHR0aGlzLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xuXHRcdGJvb2tFZGl0LmNhbmNlbCgpO1xuXHR9O1xuXG5cdHRoaXMuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYodGhpcy5mb3JtLiR2YWxpZCkge1xuXHRcdFx0Ym9va0VkaXQuc2F2ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaWFsb2cub3BlbkVycm9yKCdGaWxsIGFsbCByZXF1aXJlZCBmaWVsZHMsIHBsZWFzZS4nKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIGlzQ292ZXJEaXNhYmxlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzY29wZS5jb3ZlcklucHV0VVJMICYmIChzY29wZS5mb3JtLnRpdGxlLiRpbnZhbGlkIHx8IHNjb3BlLmZvcm0uYXV0aG9yLiRpbnZhbGlkKTtcblx0fTtcblxuXHRkYXRhLmNvbW1vbi50aGVuKGZ1bmN0aW9uIChjb21tb25EYXRhKSB7XG5cdFx0c2NvcGUubGlzdCA9IGNvbW1vbkRhdGEuYm9va3M7XG5cdH0pO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignQ3JlYXRlTGlicmFyeUN0cmwnLCBmdW5jdGlvbiAoY3JlYXRlTGlicmFyeSwgZGF0YSkge1xuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHRoaXMubGlzdCA9IG51bGw7XG5cdHRoaXMubW9kZWwgPSBudWxsO1xuXG5cdHRoaXMuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUxpYnJhcnkuZ2V0SW1nKHRoaXMubW9kZWwpO1xuXHR9O1xuXG5cdHRoaXMuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlTGlicmFyeS5jcmVhdGUodGhpcy5tb2RlbCk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24udGhlbihmdW5jdGlvbiAoY29tbW9uRGF0YSkge1xuXHRcdHNjb3BlLmxpc3QgPSBjb21tb25EYXRhLmxpYnJhcmllcztcblx0fSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignQ3JlYXRlU2VjdGlvbkN0cmwnLCBmdW5jdGlvbiAoY3JlYXRlU2VjdGlvbiwgZGF0YSkge1xuXHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdHRoaXMubW9kZWwgPSBudWxsO1xuXHR0aGlzLmxpc3QgPSBudWxsO1xuXG5cdHRoaXMuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZVNlY3Rpb24uZ2V0SW1nKHRoaXMubW9kZWwpO1xuXHR9O1xuXHRcdFxuXHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZVNlY3Rpb24uY3JlYXRlKHRoaXMubW9kZWwpO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uLnRoZW4oZnVuY3Rpb24gKGNvbW1vbkRhdGEpIHtcblx0XHRzY29wZS5saXN0ID0gY29tbW9uRGF0YS5ib29rc2hlbHZlcztcblx0fSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignRmVlZGJhY2tDdHJsJywgZnVuY3Rpb24gKGZlZWRiYWNrLCB1c2VyLCBkaWFsb2cpIHtcblx0dGhpcy5zdWJtaXQgPSBmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLmZvcm0ubWVzc2FnZS4kdmFsaWQpIHtcblx0XHRcdGZlZWRiYWNrLnNlbmQoe1xuXHRcdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRcdHVzZXJJZDogdXNlci5nZXRJZCgpXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignRmVlZGJhY2sgZmllbGQgaXMgcmVxdWlyZWQuJyk7XG5cdFx0fVxuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0ludmVudG9yeUN0cmwnLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhRHRvLCBCb29rT2JqZWN0LCB1c2VyLCBib29rRWRpdCwgc2VsZWN0b3IpIHtcblx0dGhpcy5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdXNlci5pc0F1dGhvcml6ZWQoKTtcblx0fTtcblxuXHR0aGlzLmlzQm9va1NlbGVjdGVkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gc2VsZWN0b3IuaXNCb29rU2VsZWN0ZWQoaWQpO1xuXHR9O1xuXG5cdHRoaXMuc2VsZWN0ID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0dmFyIG1ldGEgPSBuZXcgU2VsZWN0b3JNZXRhRHRvKEJvb2tPYmplY3QuVFlQRSwgZHRvLmlkKTtcblx0XHRzZWxlY3Rvci5zZWxlY3QobWV0YSk7XG5cdH07XG5cblx0dGhpcy5hZGRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0Ym9va0VkaXQuc2hvdyh7dXNlcklkOiB1c2VyLmdldElkKCl9KTtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdMaW5rQWNjb3VudEN0cmwnLCBmdW5jdGlvbiAoYXV0aG9yaXphdGlvbiwgbGlua0FjY291bnQpIHtcblx0dGhpcy5saW5rR29vZ2xlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5nb29nbGUoKTtcblx0fTtcblxuXHR0aGlzLmxpbmtUd2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi50d2l0dGVyKCk7XG5cdH07XG5cblx0dGhpcy5saW5rRmFjZWJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLmZhY2Vib29rKCk7XG5cdH07XG5cblx0dGhpcy5saW5rVmtvbnRha3RlID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi52a29udGFrdGUoKTtcblx0fTtcblxuXHR0aGlzLmlzR29vZ2xlU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc0dvb2dsZVNob3coKTtcblx0fTtcblxuXHR0aGlzLmlzVHdpdHRlclNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNUd2l0dGVyU2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuaXNGYWNlYm9va1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNGYWNlYm9va1Nob3coKTtcblx0fTtcblxuXHR0aGlzLmlzVmtvbnRha3RlU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc1Zrb250YWt0ZVNob3coKTtcblx0fTtcblxuXHR0aGlzLmlzQXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzQXZhaWxhYmxlKCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignUmVnaXN0cmF0aW9uQ3RybCcsIGZ1bmN0aW9uIChyZWdpc3RyYXRpb24pIHtcblx0dGhpcy51c2VyID0gcmVnaXN0cmF0aW9uLnVzZXI7XG5cblx0dGhpcy5zaG93VmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVnaXN0cmF0aW9uLnNob3dWYWxpZGF0aW9uRXJyb3IoKTtcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdTZWxlY3RMaWJyYXJ5Q3RybCcsIGZ1bmN0aW9uIChzZWxlY3RMaWJyYXJ5KSB7XG5cdHRoaXMuZ28gPSBzZWxlY3RMaWJyYXJ5LmdvO1xuXG5cdHRoaXMuZ2V0TGlzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3RMaWJyYXJ5Lmxpc3Q7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignVG9vbHNDdHJsJywgZnVuY3Rpb24gKHVzZXIsIHNlbGVjdG9yLCB0b29scywgcHJldmlldywgYm9va0VkaXQsIGRpYWxvZywgYmxvY2ssIGdyb3dsKSB7XG4gICAgdmFyIERFTEVURV9DT05GSVJNID0gJ0RlbGV0ZSB7MH06IHsxfT8nO1xuICAgIHZhciBERUxFVEVfU1VDQ0VTUyA9ICd7MH06IHsxfSBkZWxldGVkLic7XG4gICAgdmFyIERFTEVURV9FUlJPUiA9ICdDYW4gbm90IGRlbGV0ZSB7MH06IHsxfS4nO1xuICAgIHZhciBCT09LID0gJ2Jvb2snO1xuICAgIHZhciBTRUNUSU9OID0gJ3NlY3Rpb24nO1xuXG4gICAgdGhpcy5pc1Nob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpIHx8IHByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc0Jvb2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNTZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzUm90YXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpIHx8IHByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc0VkaXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQm9vaygpICYmICFwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNEZWxldGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpICYmIHVzZXIuaXNBdXRob3JpemVkKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1dhdGNoYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpICYmICF0aGlzLmlzUGxhY2VibGUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1BsYWNlYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuICAgICAgICByZXR1cm4gIW9iaiAmJiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpICYmIHVzZXIuaXNBdXRob3JpemVkKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNVbnBsYWNlYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuICAgICAgICByZXR1cm4gb2JqICYmIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkgJiYgdXNlci5pc0F1dGhvcml6ZWQoKSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzUGxhY2luZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IucGxhY2luZztcbiAgICB9O1xuXG4gICAgdGhpcy5wbGFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzZWxlY3Rvci5wbGFjaW5nID0gIXNlbGVjdG9yLnBsYWNpbmc7XG4gICAgfTtcblxuICAgIHRoaXMudW5wbGFjZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0b29scy51bnBsYWNlKCk7XG4gICAgfTtcblxuICAgIHRoaXMud2F0Y2ggPSBmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuICAgICAgICBwcmV2aWV3LmVuYWJsZShvYmopO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFRpdGxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAgdGhpcy5pc0Jvb2soKSA/IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCkudGl0bGUgOlxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWN0aW9uKCkgPyBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpLmlkIDpcbiAgICAgICAgICAgICAgICBudWxsO1xuICAgIH07XG5cbiAgICB0aGlzLmVkaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYm9va0VkaXQuc2hvdyhzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGR0byA9IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCk7XG4gICAgICAgIHZhciBjb25maXJtTXNnO1xuICAgICAgICB2YXIgc3VjY2Vzc01zZztcbiAgICAgICAgdmFyIGVycm9yTXNnO1xuICAgICAgICB2YXIgZGVsZXRlRm5jO1xuXG4gICAgICAgIGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZUZuYyA9IHRvb2xzLmRlbGV0ZUJvb2s7XG4gICAgICAgICAgICBjb25maXJtTXNnID0gREVMRVRFX0NPTkZJUk0ucmVwbGFjZSgnezB9JywgQk9PSykucmVwbGFjZSgnezF9JywgZHRvLnRpdGxlKTtcbiAgICAgICAgICAgIHN1Y2Nlc3NNc2cgPSBERUxFVEVfU1VDQ0VTUy5yZXBsYWNlKCd7MH0nLCBCT09LKS5yZXBsYWNlKCd7MX0nLCBkdG8udGl0bGUpO1xuICAgICAgICAgICAgZXJyb3JNc2cgPSBERUxFVEVfRVJST1IucmVwbGFjZSgnezB9JywgQk9PSykucmVwbGFjZSgnezF9JywgZHRvLnRpdGxlKTtcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZUZuYyA9IHRvb2xzLmRlbGV0ZVNlY3Rpb247XG4gICAgICAgICAgICBjb25maXJtTXNnID0gREVMRVRFX0NPTkZJUk0ucmVwbGFjZSgnezB9JywgU0VDVElPTikucmVwbGFjZSgnezF9JywgZHRvLmlkKTtcbiAgICAgICAgICAgIHN1Y2Nlc3NNc2cgPSBERUxFVEVfU1VDQ0VTUy5yZXBsYWNlKCd7MH0nLCBTRUNUSU9OKS5yZXBsYWNlKCd7MX0nLCBkdG8uaWQpO1xuICAgICAgICAgICAgZXJyb3JNc2cgPSBERUxFVEVfRVJST1IucmVwbGFjZSgnezB9JywgU0VDVElPTikucmVwbGFjZSgnezF9JywgZHRvLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpYWxvZy5vcGVuQ29uZmlybShjb25maXJtTXNnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuICAgICAgICAgICAgZGVsZXRlRm5jKGR0by5pZCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ3Jvd2wuc3VjY2VzcyhzdWNjZXNzTXNnKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBncm93bC5lcnJvcihlcnJvck1zZyk7XG4gICAgICAgICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBibG9jay5nbG9iYWwuc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLnVud2F0Y2ggPSBwcmV2aWV3LmRpc2FibGU7XG4gICAgdGhpcy5pc1dhdGNoQWN0aXZlID0gcHJldmlldy5pc0FjdGl2ZTtcblxuICAgIHRoaXMucm90YXRlTGVmdCA9IHRvb2xzLnJvdGF0ZUxlZnQ7XG4gICAgdGhpcy5yb3RhdGVSaWdodCA9IHRvb2xzLnJvdGF0ZVJpZ2h0O1xuICAgIHRoaXMuc3RvcCA9IHRvb2xzLnN0b3A7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignVG9vbHRpcEN0cmwnLCBmdW5jdGlvbiAodG9vbHRpcCwgQm9va09iamVjdCkge1xuICAgIHRoaXMuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0b29sdGlwLm9iai50eXBlID09PSBCb29rT2JqZWN0LlRZUEU7XG4gICAgfTtcblxuICAgIHRoaXMub2JqID0gdG9vbHRpcC5vYmo7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignVWlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgbWFpbk1lbnUsIHNlbGVjdExpYnJhcnksIGNyZWF0ZUxpYnJhcnksIGNyZWF0ZVNlY3Rpb24sIGZlZWRiYWNrLCBhdXRob3JpemF0aW9uLCBuYXZpZ2F0aW9uLCBib29rRWRpdCwgY2F0YWxvZykge1xuICAgICRzY29wZS5tYWluTWVudSA9IG1haW5NZW51O1xuXG4gICAgJHNjb3BlLnNlbGVjdExpYnJhcnkgPSBzZWxlY3RMaWJyYXJ5O1xuICAgICRzY29wZS5jcmVhdGVMaWJyYXJ5ID0gY3JlYXRlTGlicmFyeTtcbiAgICAkc2NvcGUuY3JlYXRlU2VjdGlvbiA9IGNyZWF0ZVNlY3Rpb247XG4gICAgJHNjb3BlLmZlZWRiYWNrID0gZmVlZGJhY2s7XG4gICAgJHNjb3BlLmF1dGhvcml6YXRpb24gPSBhdXRob3JpemF0aW9uO1xuXG4gICAgJHNjb3BlLmJvb2tFZGl0ID0gYm9va0VkaXQ7XG4gICAgJHNjb3BlLmNhdGFsb2cgPSBjYXRhbG9nO1xuXG5cdCRzY29wZS5uYXZpZ2F0aW9uID0ge1xuXHRcdHN0b3A6IG5hdmlnYXRpb24uZ29TdG9wLFxuXHRcdGZvcndhcmQ6IG5hdmlnYXRpb24uZ29Gb3J3YXJkLFxuXHRcdGJhY2t3YXJkOiBuYXZpZ2F0aW9uLmdvQmFja3dhcmQsXG5cdFx0bGVmdDogbmF2aWdhdGlvbi5nb0xlZnQsXG5cdFx0cmlnaHQ6IG5hdmlnYXRpb24uZ29SaWdodFxuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1dlbGNvbWVDdHJsJywgZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHNlbGVjdExpYnJhcnksIGNyZWF0ZUxpYnJhcnksIGVudmlyb25tZW50LCB1c2VyKSB7XG5cdHZhciBjbG9zZWQgPSBmYWxzZTtcblxuXHR0aGlzLmlzU2hvd0F1dGhvcml6YXRpb24gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXV0aG9yaXphdGlvbi5pc1Nob3coKTtcblx0fTtcblx0XG5cdHRoaXMuaXNTaG93U2VsZWN0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3RMaWJyYXJ5LmlzQXZhaWxhYmxlKCkgJiYgIXNlbGVjdExpYnJhcnkuaXNVc2VyTGlicmFyeSh1c2VyLmdldElkKCkpO1xuXHR9O1xuXG5cdHRoaXMuaXNTaG93Q3JlYXRlTGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5pc1Nob3dBdXRob3JpemF0aW9uKCkgJiYgIXNlbGVjdExpYnJhcnkuaXNBdmFpbGFibGUoKTtcblx0fTtcblxuXHR0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhY2xvc2VkICYmICh0aGlzLmlzU2hvd0F1dGhvcml6YXRpb24oKSB8fCB0aGlzLmlzU2hvd0NyZWF0ZUxpYnJhcnkoKSB8fCB0aGlzLmlzU2hvd1NlbGVjdExpYnJhcnkoKSk7XG5cdH07XG5cblx0dGhpcy5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBlbnZpcm9ubWVudC5nZXRMb2FkZWQoKTtcblx0fTtcblxuXHR0aGlzLnNob3dMb2dpbkRpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uc2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuc2hvd1NlbGVjdExpYnJhcnlEaWFsb2cgPSBmdW5jdGlvbigpIHtcblx0XHRzZWxlY3RMaWJyYXJ5LnNob3coKTtcblx0fTtcblxuXHR0aGlzLnNob3dDcmVhdGVMaWJyYXJ5RGlhbG9nID0gZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlTGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0dGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNsb3NlZCA9IHRydWU7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZGlyZWN0aXZlKCd2YlNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlcXVpcmU6ICduZ01vZGVsJyxcblx0XHRyZXN0cmljdDogJ0UnLFxuICAgIFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybDogJy91aS9zZWxlY3QuZWpzJyxcblx0XHRzY29wZToge1xuXHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0dmFsdWU6ICdAJyxcblx0XHRcdGxhYmVsOiAnQCdcblx0XHR9LFxuXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjb250cm9sbGVyKSB7XG5cdFx0XHRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdGNvbnRyb2xsZXIuJHNldFZpZXdWYWx1ZShpdGVtW3Njb3BlLnZhbHVlXSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRzY29wZS5pc1NlbGVjdGVkID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gY29udHJvbGxlci4kbW9kZWxWYWx1ZSA9PT0gaXRlbVtzY29wZS52YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2FyY2hpdmUnLCBmdW5jdGlvbiAoZGF0YSkge1xuXHR2YXIgYXJjaGl2ZSA9IHt9O1xuXG5cdGFyY2hpdmUuc2VuZEV4dGVybmFsVVJMID0gZnVuY3Rpb24oZXh0ZXJuYWxVUkwsIHRhZ3MpIHtcblx0XHRyZXR1cm4gZGF0YS5wb3N0Q292ZXIoZXh0ZXJuYWxVUkwsIHRhZ3MpO1xuXHR9O1xuXG5cdHJldHVybiBhcmNoaXZlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhY2hlJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBkYXRhKSB7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0ge307XG5cdHZhciBib29rcyA9IHt9O1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0Y2FjaGUuaW5pdCA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgY292ZXJzKSB7XG5cdFx0dmFyIGxpYnJhcnlMb2FkID0gbG9hZExpYnJhcnlEYXRhKGxpYnJhcnlNb2RlbCk7XG5cdFx0dmFyIHNlY3Rpb25zTG9hZCA9IFtdO1xuXHRcdHZhciBib29rc0xvYWQgPSBbXTtcblx0XHR2YXIgaW1hZ2VzTG9hZCA9IFtdO1xuXHRcdHZhciBtb2RlbCwgY292ZXJJZDsgLy8gaXRlcmF0b3JzXG5cblx0XHRmb3IgKG1vZGVsIGluIHNlY3Rpb25Nb2RlbHMpIHtcblx0XHRcdHNlY3Rpb25zTG9hZC5wdXNoKGFkZFNlY3Rpb24obW9kZWwpKTtcblx0XHR9XG5cblx0XHRmb3IgKG1vZGVsIGluIGJvb2tNb2RlbHMpIHtcblx0XHRcdGJvb2tzTG9hZC5wdXNoKGFkZEJvb2sobW9kZWwpKTtcblx0XHR9XG5cblx0XHRmb3IgKGNvdmVySWQgaW4gY292ZXJzKSB7XG5cdFx0XHRpbWFnZXNMb2FkLnB1c2goYWRkSW1hZ2VCeUR0byhjb3ZlcnNbY292ZXJJZF0pKTtcblx0XHR9XG5cblx0XHR2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG5cdFx0XHRsaWJyYXJ5Q2FjaGU6IGxpYnJhcnlMb2FkLCBcblx0XHRcdHNlY3Rpb25zTG9hZDogJHEuYWxsKHNlY3Rpb25zTG9hZCksIFxuXHRcdFx0Ym9va3NMb2FkOiAkcS5hbGwoYm9va3NMb2FkKSxcblx0XHRcdGltYWdlc0xvYWQ6ICRxLmFsbChpbWFnZXNMb2FkKVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcblx0XHRcdGxpYnJhcnkgPSByZXN1bHRzLmxpYnJhcnlDYWNoZTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdGNhY2hlLmdldExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlicmFyeTtcblx0fTtcblxuXHRjYWNoZS5nZXRTZWN0aW9uID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKHNlY3Rpb25zLCBtb2RlbCwgYWRkU2VjdGlvbik7XG5cdH07XG5cblx0Y2FjaGUuZ2V0Qm9vayA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihib29rcywgbW9kZWwsIGFkZEJvb2spO1xuXHR9O1xuXG5cdGNhY2hlLmdldEltYWdlID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGltYWdlcywgaWQsIGFkZEltYWdlQnlJZCk7XG5cdH07XG5cblx0dmFyIGFkZFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihzZWN0aW9ucywgbW9kZWwsIGxvYWRTZWN0aW9uRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihib29rcywgbW9kZWwsIGxvYWRCb29rRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlQnlJZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGRhdGEuZ2V0Q292ZXIoaWQpLnRoZW4oZnVuY3Rpb24gKGNvdmVyRHRvKSB7XG5cdFx0XHRyZXR1cm4gZGF0YS5sb2FkSW1hZ2UoY292ZXJEdG8udXJsKS50aGVuKGZ1bmN0aW9uIChpbWFnZSkge1xuXHRcdFx0XHRyZXR1cm4gYWRkSW1hZ2UoY292ZXJEdG8sIGltYWdlKTtcblx0XHRcdH0pO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuZXJyb3IoJ0Vycm9yIGFkZGluZyBpbWFnZSBieSBpZDonLCBpZCk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgYWRkSW1hZ2VCeUR0byA9IGZ1bmN0aW9uKGNvdmVyRHRvKSB7XG5cdFx0cmV0dXJuIGRhdGEubG9hZEltYWdlKGNvdmVyRHRvLnVybCkudGhlbihmdW5jdGlvbiAoaW1hZ2UpIHtcblx0XHRcdHJldHVybiBhZGRJbWFnZShjb3ZlckR0bywgaW1hZ2UpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cuZXJyb3IoJ0Vycm9yIGFkZGluZyBpbWFnZSBieSBkdG86JywgY292ZXJEdG8uaWQpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlID0gZnVuY3Rpb24oZHRvLCBpbWFnZSkge1xuXHRcdHZhciBsb2FkZWRDYWNoZSA9IHtcblx0XHRcdGR0bzogZHRvLFxuXHRcdFx0aW1hZ2U6IGltYWdlXG5cdFx0fTtcblxuXHRcdGltYWdlc1tkdG8uaWRdID0gbG9hZGVkQ2FjaGU7XG5cdFx0cmV0dXJuIGxvYWRlZENhY2hlO1xuXHR9O1xuXG5cdHZhciBjb21tb25HZXR0ZXIgPSBmdW5jdGlvbihmcm9tLCBrZXksIGFkZEZ1bmN0aW9uKSB7XG5cdFx0dmFyIHJlc3VsdCA9IGZyb21ba2V5XTtcblxuXHRcdGlmKCFyZXN1bHQpIHtcblx0XHRcdHJlc3VsdCA9IGFkZEZ1bmN0aW9uKGtleSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICRxLndoZW4ocmVzdWx0KTtcblx0fTtcblxuXHR2YXIgY29tbW9uQWRkZXIgPSBmdW5jdGlvbih3aGVyZSwgd2hhdCwgbG9hZGVyKSB7XG5cdFx0dmFyIHByb21pc2UgPSBsb2FkZXIod2hhdCkudGhlbihmdW5jdGlvbiAobG9hZGVkQ2FjaGUpIHtcblx0XHRcdHdoZXJlW3doYXRdID0gbG9hZGVkQ2FjaGU7XG5cblx0XHRcdHJldHVybiBsb2FkZWRDYWNoZTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBsb2FkTGlicmFyeURhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzb24nO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IGRhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKG1hcFVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRTZWN0aW9uRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9zZWN0aW9ucy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IGRhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKG1hcFVybCksIFxuICAgICAgICBcdGRhdGE6IGRhdGEuZ2V0RGF0YShkYXRhVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZEJvb2tEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG4gICAgICAgIHZhciBidW1wTWFwVXJsID0gcGF0aCArICdidW1wX21hcC5qcGcnO1xuICAgICAgICB2YXIgc3BlY3VsYXJNYXBVcmwgPSBwYXRoICsgJ3NwZWN1bGFyX21hcC5qcGcnO1xuXG4gICAgICAgIHZhciBwcm9taXNlID0gJHEuYWxsKHtcbiAgICAgICAgXHRnZW9tZXRyeTogZGF0YS5sb2FkR2VvbWV0cnkobW9kZWxVcmwpLFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRcdCRsb2cuZXJyb3IoJ0NhY2hlOiBFcnJvciBsb2FkaW5nIGJvb2sgbWFwOicsIG1vZGVsKTtcbiAgICAgICAgXHRcdHJldHVybiBudWxsO1xuICAgICAgICBcdH0pLFxuICAgICAgICBcdGJ1bXBNYXBJbWFnZTogZGF0YS5sb2FkSW1hZ2UoYnVtcE1hcFVybCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICBcdFx0JGxvZy5lcnJvcignQ2FjaGU6IEVycm9yIGxvYWRpbmcgYm9vayBidW1wTWFwOicsIG1vZGVsKTtcbiAgICAgICAgXHRcdHJldHVybiBudWxsO1xuICAgICAgICBcdH0pLFxuICAgICAgICBcdHNwZWN1bGFyTWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKHNwZWN1bGFyTWFwVXJsKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0XHQkbG9nLmVycm9yKCdDYWNoZTogRXJyb3IgbG9hZGluZyBib29rIHNwZWN1bGFyTWFwOicsIG1vZGVsKTtcbiAgICAgICAgXHRcdHJldHVybiBudWxsO1xuICAgICAgICBcdH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHJldHVybiBjYWNoZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYW1lcmEnLCBmdW5jdGlvbiAoQ2FtZXJhT2JqZWN0KSB7XG5cdHZhciBjYW1lcmEgPSB7XG5cdFx0SEVJR1RIOiAxLjUsXG5cdFx0b2JqZWN0OiBuZXcgQ2FtZXJhT2JqZWN0KCksXG5cdFx0c2V0UGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdH0sXG5cdFx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdFx0XG5cdFx0Y2FtZXJhLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgd2lkdGggLyBoZWlnaHQsIDAuMDEsIDUwKTtcblx0XHRjYW1lcmEub2JqZWN0LnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgY2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0Y2FtZXJhLm9iamVjdC5yb3RhdGlvbi5vcmRlciA9ICdZWFonO1xuXG5cdFx0dmFyIGNhbmRsZSA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4NjY1NTU1LCAxLjYsIDEwKTtcblx0XHRjYW5kbGUucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuXHRcdGNhbWVyYS5vYmplY3QuYWRkKGNhbmRsZSk7XG5cblx0XHRjYW1lcmEub2JqZWN0LmFkZChjYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRjYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Y2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdGNhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGNhbWVyYTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi8qIFxuICogY29udHJvbHMuanMgaXMgYSBzZXJ2aWNlIGZvciBwcm9jZXNzaW5nIG5vdCBVSShtZW51cykgZXZlbnRzIFxuICogbGlrZSBtb3VzZSwga2V5Ym9hcmQsIHRvdWNoIG9yIGdlc3R1cmVzLlxuICpcbiAqIFRPRE86IHJlbW92ZSBhbGwgYnVzaW5lcyBsb2dpYyBmcm9tIHRoZXJlIGFuZCBsZWF2ZSBvbmx5XG4gKiBldmVudHMgZnVuY3Rpb25hbGl0eSB0byBtYWtlIGl0IG1vcmUgc2ltaWxhciB0byB1c3VhbCBjb250cm9sbGVyXG4gKi9cbi5mYWN0b3J5KCdjb250cm9scycsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHJvb3RTY29wZSwgU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgY2FtZXJhLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCwgbW91c2UsIHNlbGVjdG9yLCBwcmV2aWV3LCBibG9jaywgdG9vbHMpIHtcblx0dmFyIGNvbnRyb2xzID0ge307XG5cblx0Y29udHJvbHMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcblx0fTtcblxuXHRjb250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgY29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgY29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRcdGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZmFsc2U7fTtcblx0fTtcblxuXHRjb250cm9scy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZighcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHRjYW1lcmEucm90YXRlKG1vdXNlLmxvbmdYLCBtb3VzZS5sb25nWSk7XG5cdFx0XHR9XG5cdFx0XHRpZihtb3VzZVsxXSAmJiBtb3VzZVszXSkge1xuXHRcdFx0XHRjYW1lcmEuZ28obmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Y29udHJvbHMub25Nb3VzZURvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdG1vdXNlLmRvd24oZXZlbnQpOyBcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgbW91c2VbMV0gJiYgIW1vdXNlWzNdICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGNvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXG5cdFx0XHRpZihzZWxlY3Rvci5wbGFjaW5nKSB7XG5cdFx0XHRcdHRvb2xzLnBsYWNlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZWxlY3Rvci5zZWxlY3RGb2N1c2VkKCk7XG5cdFx0XHR9XG5cblx0XHRcdCRyb290U2NvcGUuJGFwcGx5KCk7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VVcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UudXAoZXZlbnQpO1xuXHRcdFxuXHRcdGlmKGV2ZW50LndoaWNoID09PSAxICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpKSB7XG5cdFx0XHRcdHZhciBvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXG5cdFx0XHRcdGlmKG9iaiAmJiBvYmouY2hhbmdlZCkge1xuXHRcdFx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0XHRcdG9iai5zYXZlKCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0b2JqLnJvbGxiYWNrKCk7XG5cdFx0XHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5tb3ZlKGV2ZW50KTtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdKSB7XHRcdFxuXHRcdFx0XHRjb250cm9scy5tb3ZlT2JqZWN0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8qKioqXG5cblx0Y29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdG9iamVjdDtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgZW52aXJvbm1lbnQubGlicmFyeSkge1xuXHRcdFx0Ly9UT0RPOiBvcHRpbWl6ZVxuXHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbQm9va09iamVjdF0pO1xuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NoZWxmT2JqZWN0XSk7XG5cdFx0XHR9XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2VjdGlvbk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rvci5mb2N1cyhuZXcgU2VsZWN0b3JNZXRhKG9iamVjdCkpO1xuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5tb3ZlT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1vdXNlVmVjdG9yO1xuXHRcdHZhciBuZXdQb3NpdGlvbjtcblx0XHR2YXIgcGFyZW50O1xuXHRcdHZhciBzZWxlY3RlZE9iamVjdDtcblxuXHRcdGlmKHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSgpKSB7XG5cdFx0XHRzZWxlY3RlZE9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cblx0XHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHRcdG1vdXNlVmVjdG9yID0gY2FtZXJhLmdldFZlY3RvcigpO1x0XG5cdFx0XHRcdG5ld1Bvc2l0aW9uID0gc2VsZWN0ZWRPYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdFx0cGFyZW50ID0gc2VsZWN0ZWRPYmplY3QucGFyZW50O1xuXHRcdFx0XHRwYXJlbnQubG9jYWxUb1dvcmxkKG5ld1Bvc2l0aW9uKTtcblxuXHRcdFx0XHRuZXdQb3NpdGlvbi54IC09IChtb3VzZVZlY3Rvci56ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci54ICogbW91c2UuZFkpICogMC4wMDM7XG5cdFx0XHRcdG5ld1Bvc2l0aW9uLnogLT0gKC1tb3VzZVZlY3Rvci54ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci56ICogbW91c2UuZFkpICogMC4wMDM7XG5cblx0XHRcdFx0cGFyZW50LndvcmxkVG9Mb2NhbChuZXdQb3NpdGlvbik7XG5cdFx0XHRcdHNlbGVjdGVkT2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY29udHJvbHM7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdkYXRhJywgZnVuY3Rpb24gKCRodHRwLCAkcSwgJGxvZykge1xuXHR2YXIgZGF0YSA9IHt9O1xuXG5cdGRhdGEuVEVYVFVSRV9SRVNPTFVUSU9OID0gNTEyO1xuXHRkYXRhLkNPVkVSX01BWF9ZID0gMzk0O1xuXHRkYXRhLkNPVkVSX0ZBQ0VfWCA9IDI5NjtcblxuICAgIGRhdGEubG9hZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIGltZy5jcm9zc09yaWdpbiA9ICcnOyBcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcbiAgICAgICAgXG4gICAgICAgIGlmKGltZy5jb21wbGV0ZSkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfTtcbiAgICAgICAgaW1nLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7IFxuICAgIH07XG5cblx0ZGF0YS5nZXRDb3ZlciA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2NvdmVyLycgKyBpZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cbiAgICBkYXRhLnBvc3RDb3ZlciA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG4gICAgXHR2YXIgZGF0YSA9IHtcbiAgICBcdFx0dXJsOiBleHRlcm5hbFVSTCxcbiAgICBcdFx0dGFnczogdGFnc1xuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9jb3ZlcicsIGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgIFx0XHRyZXR1cm4gcmVzLmRhdGE7XG4gICAgXHR9KTtcbiAgICB9O1xuXG4gICAgZGF0YS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvYXV0aC9sb2dvdXQnKTtcbiAgICB9O1xuXG5cdGRhdGEuZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy91c2VyJykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5wdXRVc2VyID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL3VzZXInLCBkdG8pO1xuXHR9O1xuXG5cdGRhdGEuZGVsZXRlVXNlciA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL3VzZXIvJyArIGlkKTtcblx0fTtcblxuXHRkYXRhLmdldFVzZXJCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9mcmVlQm9va3MvJyArIHVzZXJJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0Qm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2Jvb2snLCBib29rKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZUJvb2sgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0dXJsOiAnL2Jvb2svJyArIGlkXG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5nZXRVSURhdGEgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvb2JqL2RhdGEuanNvbicpO1xuXHR9O1xuXG5cdGRhdGEuZ2V0TGlicmFyaWVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2xpYnJhcmllcycpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJ5LycgKyBsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9saWJyYXJ5LycgKyBsaWJyYXJ5TW9kZWwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHRkYXRhLmdldFNlY3Rpb25zID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZWN0aW9ucy8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0U2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EYXRhKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2VjdGlvbicsIHNlY3Rpb25EYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgXHRyZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEuZGVsZXRlU2VjdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHR1cmw6ICcvc2VjdGlvbnMvJyArIGlkXG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5sb2FkR2VvbWV0cnkgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0dmFyIGpzb25Mb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuXG4gICAgICAgIC8vVE9ETzogZm91bmQgbm8gd2F5IHRvIHJlamVjdFxuXHRcdGpzb25Mb2FkZXIubG9hZChsaW5rLCBmdW5jdGlvbiAoZ2VvbWV0cnkpIHtcblx0XHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdFx0ZGVmZmVyZWQucmVzb2x2ZShnZW9tZXRyeSk7XG5cdFx0fSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XG5cdH07XG5cblx0ZGF0YS5nZXREYXRhID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5wb3N0RmVlZGJhY2sgPSBmdW5jdGlvbihkdG8pIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9mZWVkYmFjaycsIGR0byk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24gPSBkYXRhLmdldFVJRGF0YSgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdHJldHVybiByZXMuZGF0YTtcblx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdCRsb2cuZXJyb3IoJ2RhdGE6IGxvYWRpbmcgY29tbW9uIGVycm9yJyk7XG5cdH0pO1xuXG5cdHJldHVybiBkYXRhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2RpYWxvZycsIGZ1bmN0aW9uIChuZ0RpYWxvZykge1xuXHR2YXIgZGlhbG9nID0ge307XG5cblx0dmFyIFRFTVBMQVRFID0gJ2NvbmZpcm1EaWFsb2cnO1xuXHR2YXIgRVJST1IgPSAxO1xuXHR2YXIgQ09ORklSTSA9IDI7XG5cdHZhciBXQVJOSU5HID0gMztcblx0dmFyIElORk8gPSA0O1xuXG5cdHZhciBpY29uQ2xhc3NNYXAgPSB7fTtcblx0aWNvbkNsYXNzTWFwW0VSUk9SXSA9ICdmYS10aW1lcy1jaXJjbGUnO1xuXHRpY29uQ2xhc3NNYXBbQ09ORklSTV0gPSAnZmEtcXVlc3Rpb24tY2lyY2xlJztcblx0aWNvbkNsYXNzTWFwW1dBUk5JTkddID0gJ2ZhLWV4Y2xhbWF0aW9uLXRyaWFuZ2xlJztcblx0aWNvbkNsYXNzTWFwW0lORk9dID0gJ2ZhLWluZm8tY2lyY2xlJztcblxuXHRkaWFsb2cub3BlbkVycm9yID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBFUlJPUik7XG5cdH07XG5cblx0ZGlhbG9nLm9wZW5Db25maXJtID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBDT05GSVJNLCB0cnVlKTtcblx0fTtcblxuXHRkaWFsb2cub3Blbldhcm5pbmcgPSBmdW5jdGlvbihtc2cpIHtcblx0XHRyZXR1cm4gb3BlbkRpYWxvZyhtc2csIFdBUk5JTkcpO1xuXHR9O1xuXG5cdGRpYWxvZy5vcGVuSW5mbyA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgSU5GTyk7XG5cdH07XG5cblx0dmFyIG9wZW5EaWFsb2cgPSBmdW5jdGlvbihtc2csIHR5cGUsIGNhbmNlbEJ1dHRvbikge1xuXHRcdHJldHVybiBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7XG5cdFx0XHR0ZW1wbGF0ZTogVEVNUExBVEUsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdG1zZzogbXNnLFxuXHRcdFx0XHRpY29uQ2xhc3M6IGdldEljb25DbGFzcyh0eXBlKSxcblx0XHRcdFx0Y2FuY2VsQnV0dG9uOiBjYW5jZWxCdXR0b25cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZ2V0SWNvbkNsYXNzID0gZnVuY3Rpb24odHlwZSkge1xuXHRcdHJldHVybiBpY29uQ2xhc3NNYXBbdHlwZV07XG5cdH07XG5cblx0cmV0dXJuIGRpYWxvZztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdlbnZpcm9ubWVudCcsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHdpbmRvdywgTGlicmFyeU9iamVjdCwgU2VjdGlvbk9iamVjdCwgQm9va09iamVjdCwgQm9va01hdGVyaWFsLCBkYXRhLCBjYW1lcmEsIGNhY2hlKSB7XG5cdHZhciBlbnZpcm9ubWVudCA9IHt9O1xuXG5cdGVudmlyb25tZW50LkNMRUFSQU5DRSA9IDAuMDAxO1xuXHRlbnZpcm9ubWVudC5MSUJSQVJZX0NBTlZBU19JRCA9ICdMSUJSQVJZJztcblx0IFxuXHR2YXIgbGlicmFyeUR0byA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IG51bGw7XG5cdHZhciBib29rcyA9IG51bGw7XG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblxuXHRlbnZpcm9ubWVudC5zY2VuZSA9IG51bGw7XG5cdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXG5cdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0Y2xlYXJTY2VuZSgpOyAvLyBpbml0cyBzb21lIGZpZWxkc1xuXG5cdFx0dmFyIHByb21pc2UgPSBkYXRhLmdldExpYnJhcnkobGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdHZhciBkaWN0ID0gcGFyc2VMaWJyYXJ5RHRvKGR0byk7XG5cdFx0XHRcblx0XHRcdHNlY3Rpb25zID0gZGljdC5zZWN0aW9ucztcblx0XHRcdGJvb2tzID0gZGljdC5ib29rcztcblx0XHRcdGxpYnJhcnlEdG8gPSBkdG87XG5cblx0XHRcdHJldHVybiBpbml0Q2FjaGUobGlicmFyeUR0bywgZGljdC5zZWN0aW9ucywgZGljdC5ib29rcyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRjcmVhdGVMaWJyYXJ5KGxpYnJhcnlEdG8pO1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVNlY3Rpb25zKHNlY3Rpb25zKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjcmVhdGVCb29rcyhib29rcyk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nb1RvTGlicmFyeSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0aWYoaWQpICR3aW5kb3cubG9jYXRpb24gPSAnLycgKyBpZDtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdGxvYWRlZCA9IHZhbHVlO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldExvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsb2FkZWQ7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KGJvb2tzLCBib29rSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChzZWN0aW9ucywgc2VjdGlvbklkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTaGVsZiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgc2hlbGZJZCkge1xuXHRcdHZhciBzZWN0aW9uID0gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihzZWN0aW9uSWQpO1xuXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24gJiYgc2VjdGlvbi5zaGVsdmVzW3NoZWxmSWRdO1xuXG5cdFx0cmV0dXJuIHNoZWxmO1xuXHR9O1xuXG5cdHZhciBnZXREaWN0T2JqZWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqZWN0SWQpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W29iamVjdElkXTtcblx0XHR2YXIgZGljdE9iamVjdCA9IGRpY3RJdGVtICYmIGRpY3RJdGVtLm9iajtcblxuXHRcdHJldHVybiBkaWN0T2JqZWN0O1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdGlmKGR0by5saWJyYXJ5SWQgPT0gZW52aXJvbm1lbnQubGlicmFyeS5pZCkge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbihkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9IGNyZWF0ZVNlY3Rpb24oZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbihkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XHRcblx0fTtcblxuXHRlbnZpcm9ubWVudC51cGRhdGVCb29rID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGR0byk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9IGNyZWF0ZUJvb2soZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KGJvb2tzLCBpZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KHNlY3Rpb25zLCBpZCk7XG5cdH07XG5cblx0dmFyIHJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKGRpY3QsIGtleSkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rba2V5XTtcblx0XHRpZihkaWN0SXRlbSkge1xuXHRcdFx0ZGVsZXRlIGRpY3Rba2V5XTtcblx0XHRcdFxuXHRcdFx0aWYoZGljdEl0ZW0ub2JqKSB7XG5cdFx0XHRcdGRpY3RJdGVtLm9iai5zZXRQYXJlbnQobnVsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0Q2FjaGUgPSBmdW5jdGlvbihsaWJyYXJ5RHRvLCBzZWN0aW9uc0RpY3QsIGJvb2tzRGljdCkge1xuXHRcdHZhciBsaWJyYXJ5TW9kZWwgPSBsaWJyYXJ5RHRvLm1vZGVsO1xuXHRcdHZhciBzZWN0aW9uTW9kZWxzID0ge307XG5cdFx0dmFyIGJvb2tNb2RlbHMgPSB7fTtcblx0XHR2YXIgaW1hZ2VVcmxzID0ge307XG5cblx0XHRmb3IgKHZhciBzZWN0aW9uSWQgaW4gc2VjdGlvbnNEaWN0KSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IHNlY3Rpb25zRGljdFtzZWN0aW9uSWRdLmR0bztcblx0XHRcdHNlY3Rpb25Nb2RlbHNbc2VjdGlvbkR0by5tb2RlbF0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGJvb2tJZCBpbiBib29rc0RpY3QpIHtcblx0XHRcdHZhciBib29rRHRvID0gYm9va3NEaWN0W2Jvb2tJZF0uZHRvO1xuXHRcdFx0Ym9va01vZGVsc1tib29rRHRvLm1vZGVsXSA9IHRydWU7XG5cblx0XHRcdGlmKGJvb2tEdG8uY292ZXIpIHtcblx0XHRcdFx0aW1hZ2VVcmxzW2Jvb2tEdG8uY292ZXIuaWRdID0gYm9va0R0by5jb3Zlcjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGUuaW5pdChsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGltYWdlVXJscyk7XG5cdH07XG5cblx0dmFyIGNsZWFyU2NlbmUgPSBmdW5jdGlvbigpIHtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblx0XHRzZWN0aW9ucyA9IHt9O1xuXHRcdGJvb2tzID0ge307XG5cblx0XHR3aGlsZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZihlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UoKTtcblx0XHRcdH1cblx0XHRcdGVudmlyb25tZW50LnNjZW5lLnJlbW92ZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBwYXJzZUxpYnJhcnlEdG8gPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHNlY3Rpb25zOiB7fSxcblx0XHRcdGJvb2tzOiB7fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblx0XHRcdHJlc3VsdC5zZWN0aW9uc1tzZWN0aW9uRHRvLmlkXSA9IHtkdG86IHNlY3Rpb25EdG99O1xuXG5cdFx0XHRmb3IodmFyIGJvb2tJbmRleCA9IHNlY3Rpb25EdG8uYm9va3MubGVuZ3RoIC0gMTsgYm9va0luZGV4ID49IDA7IGJvb2tJbmRleC0tKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gc2VjdGlvbkR0by5ib29rc1tib29rSW5kZXhdO1xuXHRcdFx0XHRyZXN1bHQuYm9va3NbYm9va0R0by5pZF0gPSB7ZHRvOiBib29rRHRvfTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHNlY3Rpb25EdG8uYm9va3M7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGxpYnJhcnlEdG8uc2VjdGlvbnM7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0XHR2YXIgbGlicmFyeUNhY2hlID0gY2FjaGUuZ2V0TGlicmFyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGxpYnJhcnlDYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0bGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGxpYnJhcnlDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdGNhbWVyYS5zZXRQYXJlbnQobGlicmFyeSk7XG5cblx0XHRlbnZpcm9ubWVudC5zY2VuZS5hZGQobGlicmFyeSk7XG5cdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IGxpYnJhcnk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnNEaWN0KSB7XG5cdFx0cmV0dXJuIGNyZWF0ZU9iamVjdHMoc2VjdGlvbnNEaWN0LCBjcmVhdGVTZWN0aW9uKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlQm9va3MgPSBmdW5jdGlvbihib29rc0RpY3QpIHtcblx0XHRyZXR1cm4gY3JlYXRlT2JqZWN0cyhib29rc0RpY3QsIGNyZWF0ZUJvb2spO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVPYmplY3RzID0gZnVuY3Rpb24oZGljdCwgZmFjdG9yeSkge1xuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvcihrZXkgaW4gZGljdCkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKGZhY3RvcnkoZGljdFtrZXldLmR0bykpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS5hbGwocmVzdWx0cyk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRHRvKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRTZWN0aW9uKHNlY3Rpb25EdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHQgICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoc2VjdGlvbkNhY2hlLm1hcEltYWdlKTtcblx0ICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXHQgICAgICAgIHZhciBzZWN0aW9uO1xuXG5cdCAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdCAgICAgICAgc2VjdGlvbkR0by5kYXRhID0gc2VjdGlvbkNhY2hlLmRhdGE7XG5cblx0ICAgICAgICBzZWN0aW9uID0gbmV3IFNlY3Rpb25PYmplY3Qoc2VjdGlvbkR0bywgc2VjdGlvbkNhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHRcdGVudmlyb25tZW50LmxpYnJhcnkuYWRkKHNlY3Rpb24pO1xuXHRcdFx0YWRkVG9EaWN0KHNlY3Rpb25zLCBzZWN0aW9uKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlcyA9IHt9O1xuXHRcdHZhciBwcm9taXNlO1xuXG5cdFx0cHJvbWlzZXMuYm9va0NhY2hlID0gY2FjaGUuZ2V0Qm9vayhib29rRHRvLm1vZGVsKTtcblx0XHRpZihib29rRHRvLmNvdmVySWQpIHtcblx0XHRcdHByb21pc2VzLmNvdmVyQ2FjaGUgPSBjYWNoZS5nZXRJbWFnZShib29rRHRvLmNvdmVySWQpO1xuXHRcdH1cblxuXHRcdHByb21pc2UgPSAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcblx0XHRcdHZhciBib29rQ2FjaGUgPSByZXN1bHRzLmJvb2tDYWNoZTtcblx0XHRcdHZhciBjb3Zlck1hcEltYWdlID0gcmVzdWx0cy5jb3ZlckNhY2hlICYmIHJlc3VsdHMuY292ZXJDYWNoZS5pbWFnZTtcblx0XHRcdHZhciBtYXRlcmlhbCA9IG5ldyBCb29rTWF0ZXJpYWwoYm9va0NhY2hlLm1hcEltYWdlLCBib29rQ2FjaGUuYnVtcE1hcEltYWdlLCBib29rQ2FjaGUuc3BlY3VsYXJNYXBJbWFnZSwgY292ZXJNYXBJbWFnZSk7XG5cdFx0XHR2YXIgYm9vayA9IG5ldyBCb29rT2JqZWN0KGJvb2tEdG8sIGJvb2tDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0XHRhZGRUb0RpY3QoYm9va3MsIGJvb2spO1xuXHRcdFx0cGxhY2VCb29rT25TaGVsZihib29rKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBhZGRUb0RpY3QgPSBmdW5jdGlvbihkaWN0LCBvYmopIHtcblx0XHR2YXIgZGljdEl0ZW0gPSB7XG5cdFx0XHRkdG86IG9iai5kYXRhT2JqZWN0LFxuXHRcdFx0b2JqOiBvYmpcblx0XHR9O1xuXG5cdFx0ZGljdFtvYmouaWRdID0gZGljdEl0ZW07XG5cdH07XG5cblx0dmFyIGdldEJvb2tTaGVsZiA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0U2hlbGYoYm9va0R0by5zZWN0aW9uSWQsIGJvb2tEdG8uc2hlbGZJZCk7XG5cdH07XG5cblx0dmFyIHBsYWNlQm9va09uU2hlbGYgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGJvb2suZGF0YU9iamVjdCk7XG5cdFx0c2hlbGYuYWRkKGJvb2spO1xuXHR9O1xuXG5cdHJldHVybiBlbnZpcm9ubWVudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtYWluJywgZnVuY3Rpb24gKCRsb2csICRxLCBjYW1lcmEsIGNvbnRyb2xzLCB1c2VyLCBlbnZpcm9ubWVudCwgdG9vbHMsIG5hdmlnYXRpb24sIHVzZXJEYXRhLCBibG9jaywgbG9jYXRvcikge1x0XG5cdHZhciBjYW52YXM7XG5cdHZhciByZW5kZXJlcjtcblx0XG5cdHZhciBtYWluID0ge307XG5cblx0bWFpbi5zdGFydCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKERldGVjdG9yLndlYmdsKSB7XG5cdFx0XHRpbml0KCk7XG5cdFx0XHRjb250cm9scy5pbml0KCk7XG5cblx0XHRcdHN0YXJ0UmVuZGVyTG9vcCgpO1xuXG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRyZXR1cm4gJHEuYWxsKFtlbnZpcm9ubWVudC5sb2FkTGlicmFyeSh1c2VyLmdldExpYnJhcnkoKSB8fCAxKSwgdXNlckRhdGEubG9hZCgpXSk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRsb2NhdG9yLmNlbnRlck9iamVjdChjYW1lcmEub2JqZWN0KTtcblx0XHRcdFx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkKHRydWUpO1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBEZXRlY3Rvci5hZGRHZXRXZWJHTE1lc3NhZ2UoKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2luUmVzaXplO1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbnZpcm9ubWVudC5MSUJSQVJZX0NBTlZBU19JRCk7XG5cdFx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7Y2FudmFzOiBjYW52YXMgPyBjYW52YXMgOiB1bmRlZmluZWQsIGFudGlhbGlhczogdHJ1ZX0pO1xuXHRcdHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0d2luUmVzaXplID0gbmV3IFRIUkVFeC5XaW5kb3dSZXNpemUocmVuZGVyZXIsIGNhbWVyYS5jYW1lcmEpO1xuXG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblx0XHRlbnZpcm9ubWVudC5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKDB4MDAwMDAwLCA0LCA3KTtcblx0fTtcblxuXHR2YXIgc3RhcnRSZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0YXJ0UmVuZGVyTG9vcCk7XG5cblx0XHRjb250cm9scy51cGRhdGUoKTtcblx0XHRuYXZpZ2F0aW9uLnVwZGF0ZSgpO1xuXHRcdHRvb2xzLnVwZGF0ZSgpO1xuXHRcdFxuXHRcdHJlbmRlcmVyLnJlbmRlcihlbnZpcm9ubWVudC5zY2VuZSwgY2FtZXJhLmNhbWVyYSk7XG5cdH07XG5cblx0cmV0dXJuIG1haW47XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbW91c2UnLCBmdW5jdGlvbiAoY2FtZXJhLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgbW91c2UgPSB7fTtcblxuXHR2YXIgZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG5cdH07XG5cblx0dmFyIGdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH07XG5cblx0dmFyIHggPSBudWxsO1xuXHR2YXIgeSA9IG51bGw7XG5cdFxuXHRtb3VzZS50YXJnZXQgPSBudWxsO1xuXHRtb3VzZS5kWCA9IG51bGw7XG5cdG1vdXNlLmRZID0gbnVsbDtcblx0bW91c2UubG9uZ1ggPSBudWxsO1xuXHRtb3VzZS5sb25nWSA9IG51bGw7XG5cblx0bW91c2UuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHR9O1xuXG5cdG1vdXNlLmRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHggPSBldmVudC5jbGllbnRYO1xuXHRcdFx0eSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHRtb3VzZS5sb25nWCA9IGdldFdpZHRoKCkgKiAwLjUgLSB4O1xuXHRcdFx0bW91c2UubG9uZ1kgPSBnZXRIZWlnaHQoKSAqIDAuNSAtIHk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLnVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSBmYWxzZTtcblx0XHRcdC8vIGxpbnV4IGNocm9tZSBidWcgZml4ICh3aGVuIGJvdGgga2V5cyByZWxlYXNlIHRoZW4gYm90aCBldmVudC53aGljaCBlcXVhbCAzKVxuXHRcdFx0dGhpc1sxXSA9IGZhbHNlOyBcblx0XHR9XG5cdH07XG5cblx0bW91c2UubW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0bW91c2UubG9uZ1ggPSBnZXRXaWR0aCgpICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gZ2V0SGVpZ2h0KCkgKiAwLjUgLSB5O1xuXHRcdFx0bW91c2UuZFggPSBldmVudC5jbGllbnRYIC0geDtcblx0XHRcdG1vdXNlLmRZID0gZXZlbnQuY2xpZW50WSAtIHk7XG5cdFx0XHR4ID0gZXZlbnQuY2xpZW50WDtcblx0XHRcdHkgPSBldmVudC5jbGllbnRZO1xuXHRcdH1cblx0fTtcblxuXHRtb3VzZS5pc0NhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRhcmdldC5pZCA9PT0gZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQ7XG5cdH07XG5cblx0bW91c2UuaXNQb2NrZXRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvL1RPRE86IHN0dWJcblx0XHQvLyByZXR1cm4gISEodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQucGFyZW50Tm9kZSA9PSBVSS5tZW51LmludmVudG9yeS5ib29rcyk7XG5cdH07XG5cblx0bW91c2UuZ2V0SW50ZXJzZWN0ZWQgPSBmdW5jdGlvbihvYmplY3RzLCByZWN1cnNpdmUsIHNlYXJjaEZvcikge1xuXHRcdHZhclxuXHRcdFx0dmVjdG9yLFxuXHRcdFx0cmF5Y2FzdGVyLFxuXHRcdFx0aW50ZXJzZWN0cyxcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0aSwgajtcblxuXHRcdHJlc3VsdCA9IG51bGw7XG5cdFx0dmVjdG9yID0gZ2V0VmVjdG9yKCk7XG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcihjYW1lcmEuZ2V0UG9zaXRpb24oKSwgdmVjdG9yKTtcblx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdGlmKHNlYXJjaEZvcikge1xuXHRcdFx0aWYoaW50ZXJzZWN0cy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkID0gaW50ZXJzZWN0c1tpXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0aWYoaW50ZXJzZWN0ZWQub2JqZWN0IGluc3RhbmNlb2Ygc2VhcmNoRm9yW2pdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IGludGVyc2VjdGVkO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBnZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygoeCAvIGdldFdpZHRoKCkpICogMiAtIDEsIC0gKHkgLyBnZXRIZWlnaHQoKSkgKiAyICsgMSwgMC41KTtcblx0XHRwcm9qZWN0b3IudW5wcm9qZWN0VmVjdG9yKHZlY3RvciwgY2FtZXJhLmNhbWVyYSk7XG5cdFxuXHRcdHJldHVybiB2ZWN0b3Iuc3ViKGNhbWVyYS5nZXRQb3NpdGlvbigpKS5ub3JtYWxpemUoKTtcblx0fTtcblxuXHRyZXR1cm4gbW91c2U7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbmF2aWdhdGlvbicsIGZ1bmN0aW9uIChjYW1lcmEpIHtcblx0dmFyIG5hdmlnYXRpb24gPSB7fTtcblxuXHRuYXZpZ2F0aW9uLkJVVFRPTlNfUk9UQVRFX1NQRUVEID0gMTAwO1xuXHRuYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5cdHZhciBzdGF0ZSA9IHtcblx0XHRmb3J3YXJkOiBmYWxzZSxcblx0XHRiYWNrd2FyZDogZmFsc2UsXG5cdFx0bGVmdDogZmFsc2UsXG5cdFx0cmlnaHQ6IGZhbHNlXHRcdFx0XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb1N0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5mb3J3YXJkID0gZmFsc2U7XG5cdFx0c3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0XHRzdGF0ZS5sZWZ0ID0gZmFsc2U7XG5cdFx0c3RhdGUucmlnaHQgPSBmYWxzZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmZvcndhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29CYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmJhY2t3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvTGVmdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLmxlZnQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29SaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0YXRlLnJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHN0YXRlLmZvcndhcmQpIHtcblx0XHRcdGNhbWVyYS5nbyhuYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5iYWNrd2FyZCkge1xuXHRcdFx0Y2FtZXJhLmdvKC1uYXZpZ2F0aW9uLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5sZWZ0KSB7XG5cdFx0XHRjYW1lcmEucm90YXRlKG5hdmlnYXRpb24uQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH0gZWxzZSBpZihzdGF0ZS5yaWdodCkge1xuXHRcdFx0Y2FtZXJhLnJvdGF0ZSgtbmF2aWdhdGlvbi5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBuYXZpZ2F0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3VzZXInLCBmdW5jdGlvbiAoZGF0YSkge1xuXHR2YXIgdXNlciA9IHt9O1xuXG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblx0dmFyIF9kYXRhT2JqZWN0ID0gbnVsbDtcblx0dmFyIF9saWJyYXJ5ID0gbnVsbDtcblxuXHR1c2VyLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIGRhdGEuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChkdG8pO1xuXHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblx0XHR9KTtcblx0fTtcblxuXHR1c2VyLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkYXRhLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHVzZXIubG9hZCgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHVzZXIuc2V0RGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRfZGF0YU9iamVjdCA9IGRhdGFPYmplY3Q7XG5cdH07XG5cblx0dXNlci5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9saWJyYXJ5O1xuXHR9O1xuXG5cdHVzZXIuZ2V0TmFtZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5uYW1lO1xuXHR9O1xuXG5cdHVzZXIuZ2V0RW1haWwgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX2RhdGFPYmplY3QgJiYgX2RhdGFPYmplY3QuZW1haWw7XG5cdH07XG5cblx0dXNlci5zZXRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0X2xpYnJhcnkgPSBsaWJyYXJ5SWQgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnN1YnN0cmluZygxKTtcblx0fTtcblxuXHR1c2VyLmdldElkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LmlkO1xuXHR9O1xuXG5cdHVzZXIuaXNBdXRob3JpemVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmICF1c2VyLmlzVGVtcG9yYXJ5KCk7XG5cdH07XG5cblx0dXNlci5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsb2FkZWQ7XG5cdH07XG5cblx0dXNlci5pc1RlbXBvcmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnRlbXBvcmFyeSk7XG5cdH07XG5cblx0dXNlci5pc0dvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0Lmdvb2dsZUlkKTtcblx0fTtcblxuXHR1c2VyLmlzVHdpdHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnR3aXR0ZXJJZCk7XG5cdH07XG5cblx0dXNlci5pc0ZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIEJvb2xlYW4oX2RhdGFPYmplY3QgJiYgX2RhdGFPYmplY3QuZmFjZWJvb2tJZCk7XG5cdH07XG5cblx0dXNlci5pc1Zrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LnZrb250YWt0ZUlkKTtcblx0fTtcblxuXHRyZXR1cm4gdXNlcjtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tNYXRlcmlhbCcsIGZ1bmN0aW9uICgpIHtcblx0dmFyIEJvb2tNYXRlcmlhbCA9IGZ1bmN0aW9uKG1hcEltYWdlLCBidW1wTWFwSW1hZ2UsIHNwZWN1bGFyTWFwSW1hZ2UsIGNvdmVyTWFwSW1hZ2UpIHtcblx0XHR2YXIgZGVmaW5lcyA9IHt9O1xuXHRcdHZhciB1bmlmb3Jtcztcblx0XHR2YXIgcGFyYW1ldGVycztcblxuICAgICAgICB2YXIgbWFwO1xuICAgICAgICB2YXIgYnVtcE1hcDtcbiAgICAgICAgdmFyIHNwZWN1bGFyTWFwO1xuICAgICAgICB2YXIgY292ZXJNYXA7XG5cdFx0XG5cdFx0dW5pZm9ybXMgPSBUSFJFRS5Vbmlmb3Jtc1V0aWxzLm1lcmdlKFtcblx0XHRcdFRIUkVFLlVuaWZvcm1zTGliLmNvbW1vbixcblx0XHRcdFRIUkVFLlVuaWZvcm1zTGliLmJ1bXAsXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5mb2csXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5saWdodHNcblx0XHRdKTtcblxuXHRcdHVuaWZvcm1zLnNoaW5pbmVzcyA9IHt0eXBlOiAnZicsIHZhbHVlOiAzMH07XG5cdFx0ZGVmaW5lcy5QSE9ORyA9IHRydWU7XG5cblx0XHRpZihtYXBJbWFnZSkge1xuXHRcdFx0bWFwID0gbmV3IFRIUkVFLlRleHR1cmUobWFwSW1hZ2UpO1xuXHRcdFx0bWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRcdHVuaWZvcm1zLm1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBtYXB9O1xuXHRcdFx0dGhpcy5tYXAgPSB0cnVlO1xuXHRcdH1cblx0XHRpZihidW1wTWFwSW1hZ2UpIHtcblx0XHRcdGJ1bXBNYXAgPSBuZXcgVEhSRUUuVGV4dHVyZShidW1wTWFwSW1hZ2UpO1xuXHRcdFx0YnVtcE1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5idW1wTWFwID0ge3R5cGU6ICd0JywgdmFsdWU6IGJ1bXBNYXB9O1xuXHRcdFx0dW5pZm9ybXMuYnVtcFNjYWxlLnZhbHVlID0gMC4wMDU7XG5cdFx0XHR0aGlzLmJ1bXBNYXAgPSB0cnVlO1xuXHRcdH1cblx0XHRpZihzcGVjdWxhck1hcEltYWdlKSB7XG5cdFx0XHRzcGVjdWxhck1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKHNwZWN1bGFyTWFwSW1hZ2UpO1xuXHRcdFx0c3BlY3VsYXJNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuc3BlY3VsYXIgPSB7dHlwZTogJ2MnLCB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKDB4NTU1NTU1KX07XG5cdFx0XHR1bmlmb3Jtcy5zcGVjdWxhck1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBzcGVjdWxhck1hcH07XG5cdFx0XHR0aGlzLnNwZWN1bGFyTWFwID0gdHJ1ZTtcblx0XHR9XG4gICAgICAgIGlmKGNvdmVyTWFwSW1hZ2UpIHtcblx0XHRcdGNvdmVyTWFwID0gbmV3IFRIUkVFLlRleHR1cmUoY292ZXJNYXBJbWFnZSk7XG5cdFx0XHRjb3Zlck1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5jb3Zlck1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBjb3Zlck1hcH07XG5cdFx0XHRkZWZpbmVzLlVTRV9DT1ZFUiA9IHRydWU7XG4gICAgICAgIH1cblxuXHRcdHBhcmFtZXRlcnMgPSB7XG5cdFx0XHR2ZXJ0ZXhTaGFkZXI6IHZlcnRleFNoYWRlcixcdFxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IGZyYWdtZW50U2hhZGVyLFxuXHRcdFx0dW5pZm9ybXM6IHVuaWZvcm1zLFxuXHRcdFx0ZGVmaW5lczogZGVmaW5lcyxcblx0XHRcdGxpZ2h0czogdHJ1ZSxcblx0XHRcdGZvZzogdHJ1ZVxuXHRcdH07XG5cblx0XHRUSFJFRS5TaGFkZXJNYXRlcmlhbC5jYWxsKHRoaXMsIHBhcmFtZXRlcnMpO1xuXHR9O1xuXG5cdEJvb2tNYXRlcmlhbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRIUkVFLlNoYWRlck1hdGVyaWFsLnByb3RvdHlwZSk7XG5cblx0Qm9va01hdGVyaWFsLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRIUkVFLkJvb2tNYXRlcmlhbDtcblxuXHR2YXIgdmVydGV4U2hhZGVyID0gW1xuXHRcdCd2YXJ5aW5nIHZlYzMgdlZpZXdQb3NpdGlvbjsnLFxuXHRcdCd2YXJ5aW5nIHZlYzMgdk5vcm1hbDsnLFxuXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsubWFwX3BhcnNfdmVydGV4LFxuXHRcdFRIUkVFLlNoYWRlckNodW5rLmxpZ2h0c19waG9uZ19wYXJzX3ZlcnRleCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5jb2xvcl9wYXJzX3ZlcnRleCxcblxuXHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLm1hcF92ZXJ0ZXgsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5jb2xvcl92ZXJ0ZXgsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5kZWZhdWx0bm9ybWFsX3ZlcnRleCxcblx0XHRcdCd2Tm9ybWFsID0gbm9ybWFsaXplKHRyYW5zZm9ybWVkTm9ybWFsKTsnLFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuZGVmYXVsdF92ZXJ0ZXgsXG5cdFx0XHQndlZpZXdQb3NpdGlvbiA9IC1tdlBvc2l0aW9uLnh5ejsnLFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsud29ybGRwb3NfdmVydGV4LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsubGlnaHRzX3Bob25nX3ZlcnRleCxcblx0XHQnfSdcblx0XS5qb2luKCdcXG4nKTtcblxuXHR2YXIgZnJhZ21lbnRTaGFkZXIgPSBbXG5cdFx0J3VuaWZvcm0gdmVjMyBkaWZmdXNlOycsXG5cdFx0J3VuaWZvcm0gZmxvYXQgb3BhY2l0eTsnLFxuXG5cdFx0J3VuaWZvcm0gdmVjMyBhbWJpZW50OycsXG5cdFx0J3VuaWZvcm0gdmVjMyBlbWlzc2l2ZTsnLFxuXHRcdCd1bmlmb3JtIHZlYzMgc3BlY3VsYXI7Jyxcblx0XHQndW5pZm9ybSBmbG9hdCBzaGluaW5lc3M7JyxcblxuXHRcdCd1bmlmb3JtIHNhbXBsZXIyRCBjb3Zlck1hcDsnLFxuXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5tYXBfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5mb2dfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5saWdodHNfcGhvbmdfcGFyc19mcmFnbWVudCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5idW1wbWFwX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuc3BlY3VsYXJtYXBfcGFyc19mcmFnbWVudCxcblxuXHRcdCd2b2lkIG1haW4oKSB7Jyxcblx0XHRcdCd2ZWM0IHRlc3Rjb2xvciA9IHZlYzQoMS4wLCAxLjAsIDEuMCwgMS4wKTsnLFxuXHRcdFx0J2Zsb2F0IGVwcyA9IDAuMDA0OycsXG5cdFx0XHQndmVjNCBiYXNlQ29sb3IgID0gdGV4dHVyZTJEKG1hcCwgdlV2KTsnLFxuXG5cdFx0XHQnI2lmZGVmIFVTRV9DT1ZFUicsXG5cdFx0ICAgIFx0J3ZlYzQgY292ZXJDb2xvciA9IHRleHR1cmUyRChjb3Zlck1hcCwgdlV2ICogdmVjMigyLjMsIDEuMykgLSB2ZWMyKDEuMywgMC4zKSk7Jyxcblx0XHRcdCAgICAnaWYodlV2LnkgPiAwLjIzICYmICh2VXYueCA+IDAuNTcgfHwgKGFsbChncmVhdGVyVGhhbkVxdWFsKGJhc2VDb2xvcix0ZXN0Y29sb3ItZXBzKSkgJiYgYWxsKGxlc3NUaGFuRXF1YWwoYmFzZUNvbG9yLHRlc3Rjb2xvcitlcHMpKSkpKScsXG5cdFx0XHQgICAgXHQnZ2xfRnJhZ0NvbG9yID0gY292ZXJDb2xvcjsnLFxuXHRcdFx0ICAgICdlbHNlJyxcblx0XHRcdCAgICBcdCdnbF9GcmFnQ29sb3IgPSBiYXNlQ29sb3I7Jyxcblx0XHRcdCcjZWxzZScsXG5cdFx0ICAgIFx0J2dsX0ZyYWdDb2xvciA9IGJhc2VDb2xvcjsnLFxuXHRcdFx0JyNlbmRpZicsXG5cblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLnNwZWN1bGFybWFwX2ZyYWdtZW50LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsubGlnaHRzX3Bob25nX2ZyYWdtZW50LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfZnJhZ21lbnQsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5mb2dfZnJhZ21lbnQsXG5cdFx0J30nXHRcdFxuXHRdLmpvaW4oJ1xcbicpO1xuXG5cdHJldHVybiBCb29rTWF0ZXJpYWw7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQmFzZU9iamVjdCcsIGZ1bmN0aW9uIChzdWJjbGFzc09mKSB7XG5cdHZhciBCYXNlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QgPSBkYXRhT2JqZWN0IHx8IHt9O1xuXHRcdFxuXHRcdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdFx0dGhpcy5yb3RhdGlvbi5vcmRlciA9ICdYWVonO1xuXG5cdFx0dGhpcy5zZXREdG9UcmFuc2Zvcm1hdGlvbnMoKTtcblx0fTtcblx0XG5cdEJhc2VPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihUSFJFRS5NZXNoKTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudHlwZTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5zZXREdG9UcmFuc2Zvcm1hdGlvbnMgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGhpcy5kYXRhT2JqZWN0LnBvc194LCB0aGlzLmRhdGFPYmplY3QucG9zX3ksIHRoaXMuZGF0YU9iamVjdC5wb3Nfeik7XG5cdFx0aWYodGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uKSB0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1x0XHRcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc091dE9mUGFycmVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLngpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy54IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueCkgfHxcblx0XHRcdFx0TWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci56KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueiAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnopO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmlzQ29sbGlkZWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXJcblx0XHRcdHJlc3VsdCxcblx0XHRcdHRhcmdldHMsXG5cdFx0XHR0YXJnZXQsXG5cdFx0XHRpO1xuXG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmVzdWx0ID0gdGhpcy5pc091dE9mUGFycmVudCgpO1xuXHRcdHRhcmdldHMgPSB0aGlzLnBhcmVudC5jaGlsZHJlbjtcblxuXHRcdGlmKCFyZXN1bHQpIHtcblx0XHRcdGZvcihpID0gdGFyZ2V0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR0YXJnZXQgPSB0YXJnZXRzW2ldLmJvdW5kaW5nQm94O1xuXG5cdFx0XHRcdGlmKHRhcmdldHNbaV0gPT09IHRoaXMgfHxcblx0XHRcdFx0XHQhdGFyZ2V0IHx8IC8vIGNoaWxkcmVuIHdpdGhvdXQgQkJcblx0XHRcdFx0XHQoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueCAtIHRhcmdldC5jZW50ZXIueCkgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueCArIHRhcmdldC5yYWRpdXMueCkpIHx8XG5cdFx0XHRcdFx0KE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnkgLSB0YXJnZXQuY2VudGVyLnkpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkgKyB0YXJnZXQucmFkaXVzLnkpKSB8fFxuXHRcdFx0XHRcdChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGFyZ2V0LmNlbnRlci56KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56ICsgdGFyZ2V0LnJhZGl1cy56KSkpIHtcdFxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgXHRyZXN1bHQgPSB0cnVlO1x0XHRcblx0XHQgICAgXHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbihuZXdQb3NpdGlvbikge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRQb3NpdGlvbixcblx0XHRcdHJlc3VsdDtcblxuXHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdGN1cnJlbnRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcblx0XHRpZihuZXdQb3NpdGlvbi54KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgobmV3UG9zaXRpb24ueCk7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WChjdXJyZW50UG9zaXRpb24ueCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKG5ld1Bvc2l0aW9uLnopIHtcblx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihuZXdQb3NpdGlvbi56KTtcblxuXHRcdFx0aWYodGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRaKGN1cnJlbnRQb3NpdGlvbi56KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8IHJlc3VsdDtcblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKGRYLCBkWSwgaXNEZW1vKSB7XG5cdFx0dmFyIFxuXHRcdFx0Y3VycmVudFJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi5jbG9uZSgpLFxuXHRcdFx0cmVzdWx0ID0gZmFsc2U7IFxuXHRcdFxuXHRcdGlmKGRYKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uLnkgKz0gZFggKiAwLjAxO1xuXG5cdFx0XHRpZighaXNEZW1vICYmIHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucm90YXRpb24ueSA9IGN1cnJlbnRSb3RhdGlvbi55O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihkWSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi54ICs9IGRZICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnggPSBjdXJyZW50Um90YXRpb24ueDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8ICghaXNEZW1vICYmIHJlc3VsdCk7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRib3VuZGluZ0JveCxcblx0XHRcdHJhZGl1cyxcblx0XHRcdGNlbnRlcjtcblxuXHRcdHRoaXMudXBkYXRlTWF0cml4KCk7XG5cdFx0Ym91bmRpbmdCb3ggPSB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94LmNsb25lKCkuYXBwbHlNYXRyaXg0KHRoaXMubWF0cml4KTtcblx0XHRcblx0XHRyYWRpdXMgPSB7XG5cdFx0XHR4OiAoYm91bmRpbmdCb3gubWF4LnggLSBib3VuZGluZ0JveC5taW4ueCkgKiAwLjUsXG5cdFx0XHR5OiAoYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueSkgKiAwLjUsXG5cdFx0XHR6OiAoYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4ueikgKiAwLjVcblx0XHR9O1xuXG5cdFx0Y2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0XHRjZW50ZXIuYWRkVmVjdG9ycyhib3VuZGluZ0JveC5taW4sIGJvdW5kaW5nQm94Lm1heCk7XG5cdFx0Y2VudGVyLm11bHRpcGx5U2NhbGFyKDAuNSk7XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IGNlbnRlclxuXHRcdH07XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUucm9sbGJhY2sgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldER0b1RyYW5zZm9ybWF0aW9ucygpO1xuXHR9O1xuXG5cdHJldHVybiBCYXNlT2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQm9va09iamVjdCcsIGZ1bmN0aW9uICgkbG9nLCBCYXNlT2JqZWN0LCBkYXRhLCBzdWJjbGFzc09mKSB7XHRcblx0dmFyIEJvb2tPYmplY3QgPSBmdW5jdGlvbihkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0fTtcblxuXHRCb29rT2JqZWN0LlRZUEUgPSAnQm9va09iamVjdCc7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS50eXBlID0gQm9va09iamVjdC5UWVBFO1xuXG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5kYXRhT2JqZWN0LmlkLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56XG5cdFx0fTtcblxuXHRcdHJldHVybiBkYXRhLnBvc3RCb29rKGR0bykudGhlbihmdW5jdGlvbiAocmVzcG9uc2VEdG8pIHtcblx0XHRcdHNjb3BlLmRhdGFPYmplY3QgPSByZXNwb25zZUR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRpZih0aGlzLnBhcmVudCAhPSBwYXJlbnQpIHtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQuYWRkKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IHBhcmVudC5pZDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IHBhcmVudC5wYXJlbnQuaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gbnVsbDtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNlY3Rpb25JZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBCb29rT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbWVyYU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBzdWJjbGFzc09mKSB7XG5cdHZhciBDYW1lcmFPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblx0XHRnZW9tZXRyeS5ib3VuZGluZ0JveCA9IG5ldyBUSFJFRS5Cb3gzKG5ldyBUSFJFRS5WZWN0b3IzKC0wLjEsIC0xLCAtMC4xKSwgbmV3IFRIUkVFLlZlY3RvcjMoMC4xLCAxLCAwLjEpKTtcblxuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBudWxsLCBnZW9tZXRyeSk7XG5cdH07XG5cblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZSA9IHN1YmNsYXNzT2YoQmFzZU9iamVjdCk7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhZGl1cyA9IHtcblx0XHRcdHg6IHRoaXMuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LngsIFxuXHRcdFx0eTogdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueSwgXG5cdFx0XHR6OiB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC56XG5cdFx0fTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogdGhpcy5wb3NpdGlvbiAvL1RPRE86IG5lZWRzIGNlbnRlciBvZiBzZWN0aW9uIGluIHBhcmVudCBvciB3b3JsZCBjb29yZGluYXRlc1xuXHRcdH07XG5cdH07XG5cblx0cmV0dXJuIENhbWVyYU9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdMaWJyYXJ5T2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIHN1YmNsYXNzT2YpIHtcblx0dmFyIExpYnJhcnlPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdH07XG5cblx0TGlicmFyeU9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXG5cdHJldHVybiBMaWJyYXJ5T2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2VjdGlvbk9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBTaGVsZk9iamVjdCwgZGF0YSwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2VjdGlvbk9iamVjdCA9IGZ1bmN0aW9uKHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdHRoaXMuc2hlbHZlcyA9IHt9O1xuXHRcdGZvcih2YXIga2V5IGluIHBhcmFtcy5kYXRhLnNoZWx2ZXMpIHtcblx0XHRcdHRoaXMuc2hlbHZlc1trZXldID0gbmV3IFNoZWxmT2JqZWN0KHBhcmFtcy5kYXRhLnNoZWx2ZXNba2V5XSk7IFxuXHRcdFx0dGhpcy5hZGQodGhpcy5zaGVsdmVzW2tleV0pO1xuXHRcdH1cblx0fTtcblxuXHRTZWN0aW9uT2JqZWN0LlRZUEUgPSAnU2VjdGlvbk9iamVjdCc7XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS50eXBlID0gU2VjdGlvbk9iamVjdC5UWVBFO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdHZhciBkdG8gPSB7XG5cdFx0XHRpZDogdGhpcy5kYXRhT2JqZWN0LmlkLFxuXHRcdFx0dXNlcklkOiB0aGlzLmRhdGFPYmplY3QudXNlcklkLFxuXHRcdFx0cG9zX3g6IHRoaXMucG9zaXRpb24ueCxcblx0XHRcdHBvc195OiB0aGlzLnBvc2l0aW9uLnksXG5cdFx0XHRwb3NfejogdGhpcy5wb3NpdGlvbi56LFxuXHRcdFx0cm90YXRpb246IFt0aGlzLnJvdGF0aW9uLngsIHRoaXMucm90YXRpb24ueSwgdGhpcy5yb3RhdGlvbi56XVxuXHRcdH07XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlRHRvKSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzcG9uc2VEdG87XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0aWYodGhpcy5wYXJlbnQgIT0gcGFyZW50KSB7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LmxpYnJhcnlJZCA9IHBhcmVudC5pZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LmxpYnJhcnlJZCA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBTZWN0aW9uT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlbGVjdG9yTWV0YScsIGZ1bmN0aW9uICgpIHtcblx0dmFyIFNlbGVjdG9yTWV0YSA9IGZ1bmN0aW9uKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0aWYoc2VsZWN0ZWRPYmplY3QpIHtcblx0XHRcdHRoaXMuaWQgPSBzZWxlY3RlZE9iamVjdC5pZDtcblx0XHRcdHRoaXMucGFyZW50SWQgPSBzZWxlY3RlZE9iamVjdC5wYXJlbnQuaWQ7XG5cdFx0XHR0aGlzLnR5cGUgPSBzZWxlY3RlZE9iamVjdC5nZXRUeXBlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlbGVjdG9yTWV0YS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5pZDtcblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gISghbWV0YSB8fCBcblx0XHRcdFx0bWV0YS5pZCAhPT0gdGhpcy5pZCB8fCBcblx0XHRcdFx0bWV0YS5wYXJlbnRJZCAhPT0gdGhpcy5wYXJlbnRJZCB8fCBcblx0XHRcdFx0bWV0YS50eXBlICE9PSB0aGlzLnR5cGUpO1xuXHR9O1xuXHRcblx0cmV0dXJuIFNlbGVjdG9yTWV0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGFEdG8nLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBzdWJjbGFzc09mKSB7XG5cdHZhciBTZWxlY3Rvck1ldGFEdG8gPSBmdW5jdGlvbih0eXBlLCBpZCwgcGFyZW50SWQpIHtcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdHRoaXMuaWQgPSBpZDtcblx0XHR0aGlzLnBhcmVudElkID0gcGFyZW50SWQ7XG5cdH07XG5cdFxuXHRTZWxlY3Rvck1ldGFEdG8ucHJvdG90eXBlID0gc3ViY2xhc3NPZihTZWxlY3Rvck1ldGEpO1xuXG5cdHJldHVybiBTZWxlY3Rvck1ldGFEdG87XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplO1x0XG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkN1YmVHZW9tZXRyeShzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKTtcblxuXHRcdGdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5KTtcblxuXHRcdHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyhwYXJhbXMucG9zaXRpb25bMF0sIHBhcmFtcy5wb3NpdGlvblsxXSwgcGFyYW1zLnBvc2l0aW9uWzJdKTtcblx0XHR0aGlzLnNpemUgPSBuZXcgVEhSRUUuVmVjdG9yMyhzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKTtcblx0XHR0aGlzLnZpc2libGUgPSBmYWxzZTtcblx0fTtcblxuXHRTaGVsZk9iamVjdC5UWVBFID0gJ1NoZWxmT2JqZWN0JztcblxuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNoZWxmT2JqZWN0LlRZUEU7XG5cblx0cmV0dXJuIFNoZWxmT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3N1YmNsYXNzT2YnLCBmdW5jdGlvbiAoKSB7XG5cdGZ1bmN0aW9uIF9zdWJjbGFzc09mKCkge31cblxuXHRmdW5jdGlvbiBzdWJjbGFzc09mKGJhc2UpIHtcblx0ICAgIF9zdWJjbGFzc09mLnByb3RvdHlwZSA9IGJhc2UucHJvdG90eXBlO1xuXHQgICAgcmV0dXJuIG5ldyBfc3ViY2xhc3NPZigpO1xuXHR9XG5cblx0cmV0dXJuIHN1YmNsYXNzT2Y7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG5cdHZhciBoaWdobGlnaHQgPSB7fTtcblxuXHR2YXIgUExBTkVfUk9UQVRJT04gPSBNYXRoLlBJICogMC41O1xuXHR2YXIgUExBTkVfTVVMVElQTElFUiA9IDI7XG5cdHZhciBDT0xPUl9TRUxFQ1QgPSAweDAwNTUzMztcblx0dmFyIENPTE9SX0ZPQ1VTID0gMHgwMDMzNTU7XG5cblx0dmFyIHNlbGVjdDtcblx0dmFyIGZvY3VzO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1hdGVyaWFsUHJvcGVydGllcyA9IHtcblx0XHRcdG1hcDogbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoICdpbWcvZ2xvdy5wbmcnICksXG5cdFx0XHR0cmFuc3BhcmVudDogdHJ1ZSwgXG5cdFx0XHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuXHRcdFx0YmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG5cdFx0XHRkZXB0aFRlc3Q6IGZhbHNlXG5cdFx0fTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX1NFTEVDVDtcblx0XHR2YXIgbWF0ZXJpYWxTZWxlY3QgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX0ZPQ1VTO1xuXHRcdHZhciBtYXRlcmlhbEZvY3VzID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKG1hdGVyaWFsUHJvcGVydGllcyk7XG5cblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxLCAxKTtcblxuXHRcdHNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbFNlbGVjdCk7XG5cdFx0c2VsZWN0LnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblxuXHRcdGZvY3VzID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsRm9jdXMpO1xuXHRcdGZvY3VzLnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblx0fTtcblxuXHR2YXIgY29tbW9uSGlnaGxpZ2h0ID0gZnVuY3Rpb24od2hpY2gsIG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dmFyIHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54ICogUExBTkVfTVVMVElQTElFUjtcblx0XHRcdHZhciBoZWlnaHQgPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGJvdHRvbSA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0XHRcdFxuXHRcdFx0d2hpY2gucG9zaXRpb24ueSA9IGJvdHRvbTtcblx0XHRcdHdoaWNoLnNjYWxlLnNldCh3aWR0aCwgaGVpZ2h0LCAxKTtcblx0XHRcdG9iai5hZGQod2hpY2gpO1xuXG5cdFx0XHR3aGljaC52aXNpYmxlID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2hpY2gudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fTtcblxuXHRoaWdobGlnaHQuZW5hYmxlID0gZnVuY3Rpb24oZW5hYmxlKSB7XG5cdFx0Zm9jdXMudmlzaWJsZSA9IHNlbGVjdC52aXNpYmxlID0gZW5hYmxlO1xuXHR9O1xuXG5cdGhpZ2hsaWdodC5mb2N1cyA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGNvbW1vbkhpZ2hsaWdodChmb2N1cywgb2JqKTtcblx0fTtcblxuXHRoaWdobGlnaHQuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KHNlbGVjdCwgb2JqKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGhpZ2hsaWdodDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsb2NhdG9yJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBCYXNlT2JqZWN0LCBkYXRhLCBzZWxlY3RvciwgZW52aXJvbm1lbnQsIGNhY2hlKSB7XG5cdHZhciBsb2NhdG9yID0ge307XG5cblx0dmFyIGRlYnVnRW5hYmxlZCA9IGZhbHNlO1xuXG5cdGxvY2F0b3IuY2VudGVyT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIHRhcmdldEJCID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdHZhciBzcGFjZUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblxuXHRcdHZhciBtYXRyaXhQcmVjaXNpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRCQi5tYXgueCAtIHRhcmdldEJCLm1pbi54ICsgMC4wMSwgMCwgdGFyZ2V0QkIubWF4LnogLSB0YXJnZXRCQi5taW4ueiArIDAuMDEpO1xuXHRcdHZhciBvY2N1cGllZE1hdHJpeCA9IGdldE9jY3VwaWVkTWF0cml4KGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIG1hdHJpeFByZWNpc2lvbiwgb2JqKTtcblx0XHR2YXIgZnJlZVBvc2l0aW9uID0gZ2V0RnJlZU1hdHJpeChvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbik7XHRcdFxuXG5cdFx0b2JqLnBvc2l0aW9uLnNldFgoZnJlZVBvc2l0aW9uLngpO1xuXHRcdG9iai5wb3NpdGlvbi5zZXRaKGZyZWVQb3NpdGlvbi56KTtcblx0fTtcblxuXHRsb2NhdG9yLnBsYWNlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EdG8pIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldFNlY3Rpb24oc2VjdGlvbkR0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkJCID0gc2VjdGlvbkNhY2hlLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGxpYnJhcnlCQiA9IGVudmlyb25tZW50LmxpYnJhcnkuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgZnJlZVBsYWNlID0gZ2V0RnJlZVBsYWNlKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIGxpYnJhcnlCQiwgc2VjdGlvbkJCKTtcblxuXHRcdFx0cmV0dXJuIGZyZWVQbGFjZSA/XG5cdFx0XHRcdHNhdmVTZWN0aW9uKHNlY3Rpb25EdG8sIGZyZWVQbGFjZSkgOlxuXHRcdFx0XHQkcS5yZWplY3QoJ3RoZXJlIGlzIG5vIGZyZWUgc3BhY2UnKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uIChuZXdEdG8pIHtcblx0XHRcdHJldHVybiBlbnZpcm9ubWVudC51cGRhdGVTZWN0aW9uKG5ld0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgc2F2ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8sIHBvc2l0aW9uKSB7XG5cdFx0ZHRvLmxpYnJhcnlJZCA9IGVudmlyb25tZW50LmxpYnJhcnkuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bywgc2hlbGYpIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHR2YXIgc2hlbGZCQiA9IHNoZWxmLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGJvb2tCQiA9IGJvb2tDYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdHJldHVybiBmcmVlUGxhY2UgPyBcblx0XHRcdFx0c2F2ZUJvb2soYm9va0R0bywgZnJlZVBsYWNlLCBzaGVsZikgOiBcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAobmV3RHRvKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhuZXdEdG8pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVCb29rID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbiwgc2hlbGYpIHtcblx0XHRkdG8uc2hlbGZJZCA9IHNoZWxmLmlkO1xuXHRcdGR0by5zZWN0aW9uSWQgPSBzaGVsZi5wYXJlbnQuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0Qm9vayhkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IudW5wbGFjZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0Ym9va0R0by5zZWN0aW9uSWQgPSBudWxsO1xuXG5cdFx0cHJvbWlzZSA9IGRhdGEucG9zdEJvb2soYm9va0R0bykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhib29rRHRvKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBnZXRGcmVlUGxhY2UgPSBmdW5jdGlvbihvYmplY3RzLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBtYXRyaXhQcmVjaXNpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRCQi5tYXgueCAtIHRhcmdldEJCLm1pbi54ICsgMC4wMSwgMCwgdGFyZ2V0QkIubWF4LnogLSB0YXJnZXRCQi5taW4ueiArIDAuMDEpO1xuXHRcdHZhciBvY2N1cGllZE1hdHJpeCA9IGdldE9jY3VwaWVkTWF0cml4KG9iamVjdHMsIG1hdHJpeFByZWNpc2lvbik7XG5cdFx0dmFyIGZyZWVQb3NpdGlvbiA9IGdldEZyZWVNYXRyaXhDZWxscyhvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbik7XG5cdFx0XG5cdFx0aWYgKGRlYnVnRW5hYmxlZCkge1xuXHRcdFx0ZGVidWdTaG93RnJlZShmcmVlUG9zaXRpb24sIG1hdHJpeFByZWNpc2lvbiwgZW52aXJvbm1lbnQubGlicmFyeSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZyZWVQb3NpdGlvbjtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZU1hdHJpeCA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIERJU1RBTkNFID0gMS4zO1xuXG5cdFx0dmFyIHhJbmRleDtcblx0XHR2YXIgekluZGV4O1xuXHRcdHZhciBwb3NpdGlvbiA9IHt9O1xuXHRcdHZhciBtaW5Qb3NpdGlvbiA9IHt9O1xuXG5cdFx0dmFyIG1pblhDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi54IC8gbWF0cml4UHJlY2lzaW9uLngpICsgMTtcblx0XHR2YXIgbWF4WENlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWF4LnggLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0dmFyIG1pblpDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi56IC8gbWF0cml4UHJlY2lzaW9uLnopICsgMTtcblx0XHR2YXIgbWF4WkNlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWF4LnogLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRmb3IgKHpJbmRleCA9IG1pblpDZWxsOyB6SW5kZXggPD0gbWF4WkNlbGw7IHpJbmRleCsrKSB7XG5cdFx0XHRmb3IgKHhJbmRleCA9IG1pblhDZWxsOyB4SW5kZXggPD0gbWF4WENlbGw7IHhJbmRleCsrKSB7XG5cdFx0XHRcdGlmICghb2NjdXBpZWRNYXRyaXhbekluZGV4XSB8fCAhb2NjdXBpZWRNYXRyaXhbekluZGV4XVt4SW5kZXhdKSB7XG5cdFx0XHRcdFx0cG9zaXRpb24ucG9zID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoW3hJbmRleF0sIHpJbmRleCwgbWF0cml4UHJlY2lzaW9uLCBzcGFjZUJCLCB0YXJnZXRCQik7XG5cdFx0XHRcdFx0cG9zaXRpb24ubGVuZ3RoID0gcG9zaXRpb24ucG9zLmxlbmd0aCgpO1xuXG5cdFx0XHRcdFx0aWYoIW1pblBvc2l0aW9uLnBvcyB8fCBwb3NpdGlvbi5sZW5ndGggPCBtaW5Qb3NpdGlvbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdG1pblBvc2l0aW9uLnBvcyA9IHBvc2l0aW9uLnBvcztcblx0XHRcdFx0XHRcdG1pblBvc2l0aW9uLmxlbmd0aCA9IHBvc2l0aW9uLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihtaW5Qb3NpdGlvbi5wb3MgJiYgbWluUG9zaXRpb24ubGVuZ3RoIDwgRElTVEFOQ0UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBtaW5Qb3NpdGlvbi5wb3M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1pblBvc2l0aW9uLnBvcztcblx0fTtcblxuXHR2YXIgZ2V0RnJlZU1hdHJpeENlbGxzID0gZnVuY3Rpb24ob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pIHtcblx0XHR2YXIgdGFyZ2V0Q2VsbHNTaXplID0gMTtcblx0XHR2YXIgZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdHZhciBmcmVlQ2VsbHNTdGFydDtcblx0XHR2YXIgeEluZGV4O1xuXHRcdHZhciB6SW5kZXg7XG5cdFx0dmFyIGNlbGxzO1xuXG5cdFx0dmFyIG1pblhDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi54IC8gbWF0cml4UHJlY2lzaW9uLngpICsgMTtcblx0XHR2YXIgbWF4WENlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWF4LnggLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0dmFyIG1pblpDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1pbi56IC8gbWF0cml4UHJlY2lzaW9uLnopICsgMTtcblx0XHR2YXIgbWF4WkNlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWF4LnogLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRmb3IgKHpJbmRleCA9IG1pblpDZWxsOyB6SW5kZXggPD0gbWF4WkNlbGw7IHpJbmRleCsrKSB7XG5cdFx0XHRmb3IgKHhJbmRleCA9IG1pblhDZWxsOyB4SW5kZXggPD0gbWF4WENlbGw7IHhJbmRleCsrKSB7XG5cdFx0XHRcdGlmICghb2NjdXBpZWRNYXRyaXhbekluZGV4XSB8fCAhb2NjdXBpZWRNYXRyaXhbekluZGV4XVt4SW5kZXhdKSB7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzU3RhcnQgPSBmcmVlQ2VsbHNTdGFydCB8fCB4SW5kZXg7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQrKztcblxuXHRcdFx0XHRcdGlmIChmcmVlQ2VsbHNDb3VudCA9PT0gdGFyZ2V0Q2VsbHNTaXplKSB7XG5cdFx0XHRcdFx0XHRjZWxscyA9IF8ucmFuZ2UoZnJlZUNlbGxzU3RhcnQsIGZyZWVDZWxsc1N0YXJ0ICsgZnJlZUNlbGxzQ291bnQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGdldFBvc2l0aW9uRnJvbUNlbGxzKGNlbGxzLCB6SW5kZXgsIG1hdHJpeFByZWNpc2lvbiwgc3BhY2VCQiwgdGFyZ2V0QkIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNDb3VudCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHR2YXIgZ2V0UG9zaXRpb25Gcm9tQ2VsbHMgPSBmdW5jdGlvbihjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0dmFyIGZyZWVYID0gY2VsbHNbMF0gKiBtYXRyaXhQcmVjaXNpb24ueDtcblx0XHR2YXIgZnJlZVogPVx0ekluZGV4ICogbWF0cml4UHJlY2lzaW9uLno7XG5cblx0XHR2YXIgb2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblx0XHRvZmZzZXQuYWRkVmVjdG9ycyh0YXJnZXRCQi5taW4sIHRhcmdldEJCLm1heCk7XG5cdFx0b2Zmc2V0Lm11bHRpcGx5U2NhbGFyKC0wLjUpO1xuXG5cdFx0cmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKGZyZWVYICsgb2Zmc2V0LngsIGdldEJvdHRvbVkoc3BhY2VCQiwgdGFyZ2V0QkIpLCBmcmVlWiArIG9mZnNldC56KTtcblx0fTtcblxuXHR2YXIgZ2V0Qm90dG9tWSA9IGZ1bmN0aW9uKHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0cmV0dXJuIHNwYWNlQkIubWluLnkgLSB0YXJnZXRCQi5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24sIG9iaikge1xuXHRcdHZhciByZXN1bHQgPSB7fTtcblx0XHR2YXIgb2JqZWN0QkI7XG5cdFx0dmFyIG1pbktleVg7XG5cdFx0dmFyIG1heEtleVg7XG5cdFx0dmFyIG1pbktleVo7XG5cdFx0dmFyIG1heEtleVo7XHRcdFxuXHRcdHZhciB6LCB4O1xuXG5cdFx0b2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0aWYoY2hpbGQgaW5zdGFuY2VvZiBCYXNlT2JqZWN0ICYmIGNoaWxkICE9PSBvYmopIHtcblx0XHRcdFx0b2JqZWN0QkIgPSBjaGlsZC5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRtaW5LZXlYID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnggLSBvYmplY3RCQi5yYWRpdXMueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0XHRcdG1heEtleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCArIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWluS2V5WiA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci56IC0gb2JqZWN0QkIucmFkaXVzLnopIC8gbWF0cml4UHJlY2lzaW9uLnopO1xuXHRcdFx0XHRtYXhLZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogKyBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRcdFx0Zm9yKHogPSBtaW5LZXlaOyB6IDw9IG1heEtleVo7IHorKykge1xuXHRcdFx0XHRcdHJlc3VsdFt6XSA9IHJlc3VsdFt6XSB8fCB7fTtcblx0XHRcdFx0XHR2YXIgZGVidWdDZWxscyA9IFtdO1xuXG5cdFx0XHRcdFx0Zm9yKHggPSBtaW5LZXlYOyB4IDw9IG1heEtleVg7IHgrKykge1xuXHRcdFx0XHRcdFx0cmVzdWx0W3pdW3hdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGRlYnVnQ2VsbHMucHVzaCh4KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihkZWJ1Z0VuYWJsZWQpIHtcblx0XHRcdFx0XHRcdGRlYnVnU2hvd0JCKGNoaWxkKTtcblx0XHRcdFx0XHRcdGRlYnVnQWRkT2NjdXBpZWQoZGVidWdDZWxscywgbWF0cml4UHJlY2lzaW9uLCBjaGlsZCwgeik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdGxvY2F0b3IuZGVidWcgPSBmdW5jdGlvbigpIHtcblx0XHRjYWNoZS5nZXRTZWN0aW9uKCdib29rc2hlbGZfMDAwMScpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHRcdFx0ZGVidWdFbmFibGVkID0gdHJ1ZTtcblx0XHRcdHZhciBzZWN0aW9uQkIgPSBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgbGlicmFyeUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdGdldEZyZWVQbGFjZShlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCBsaWJyYXJ5QkIsIHNlY3Rpb25CQik7XG5cdFx0XHRkZWJ1Z0VuYWJsZWQgPSBmYWxzZTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgZGVidWdTaG93QkIgPSBmdW5jdGlvbihvYmopIHtcblx0XHR2YXIgb2JqZWN0QkIgPSBvYmouYm91bmRpbmdCb3g7XG5cdFx0dmFyIG9iakJveCA9IG5ldyBUSFJFRS5NZXNoKFxuXHRcdFx0bmV3IFRIUkVFLkN1YmVHZW9tZXRyeShcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnggKiAyLCBcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnkgKiAyICsgMC4xLCBcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnogKiAyXG5cdFx0XHQpLCBcblx0XHRcdG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcblx0XHRcdFx0Y29sb3I6IDB4YmJiYmZmLFxuXHRcdFx0XHRvcGFjaXR5OiAwLjIsXG5cdFx0XHRcdHRyYW5zcGFyZW50OiB0cnVlXG5cdFx0XHR9KVxuXHRcdCk7XG5cdFx0XG5cdFx0b2JqQm94LnBvc2l0aW9uLnggPSBvYmplY3RCQi5jZW50ZXIueDtcblx0XHRvYmpCb3gucG9zaXRpb24ueSA9IG9iamVjdEJCLmNlbnRlci55O1xuXHRcdG9iakJveC5wb3NpdGlvbi56ID0gb2JqZWN0QkIuY2VudGVyLno7XG5cblx0XHRvYmoucGFyZW50LmFkZChvYmpCb3gpO1xuXHR9O1xuXG5cdHZhciBkZWJ1Z0FkZE9jY3VwaWVkID0gZnVuY3Rpb24oY2VsbHMsIG1hdHJpeFByZWNpc2lvbiwgb2JqLCB6S2V5KSB7XG5cdFx0Y2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCkge1xuXHRcdFx0dmFyIHBvcyA9IGdldFBvc2l0aW9uRnJvbUNlbGxzKFtjZWxsXSwgektleSwgbWF0cml4UHJlY2lzaW9uLCBvYmoucGFyZW50Lmdlb21ldHJ5LmJvdW5kaW5nQm94LCBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gpO1xuXHRcdFx0dmFyIGNlbGxCb3ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQ3ViZUdlb21ldHJ5KG1hdHJpeFByZWNpc2lvbi54IC0gMC4wMSwgMC4wMSwgbWF0cml4UHJlY2lzaW9uLnogLSAwLjAxKSwgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweGZmMDAwMH0pKTtcblx0XHRcdFxuXHRcdFx0Y2VsbEJveC5wb3NpdGlvbiA9IHBvcztcblx0XHRcdG9iai5wYXJlbnQuYWRkKGNlbGxCb3gpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBkZWJ1Z1Nob3dGcmVlID0gZnVuY3Rpb24ocG9zaXRpb24sIG1hdHJpeFByZWNpc2lvbiwgb2JqKSB7XG5cdFx0aWYgKHBvc2l0aW9uKSB7XG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkobWF0cml4UHJlY2lzaW9uLngsIDAuNSwgbWF0cml4UHJlY2lzaW9uLnopLCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwfSkpO1xuXHRcdFx0Y2VsbEJveC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgncHJldmlldycsIGZ1bmN0aW9uIChjYW1lcmEsIGhpZ2hsaWdodCkge1xuXHR2YXIgcHJldmlldyA9IHt9O1xuXG5cdHZhciBhY3RpdmUgPSBmYWxzZTtcblx0dmFyIGNvbnRhaW5lcjtcblxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lciA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXHRcdGNvbnRhaW5lci5wb3NpdGlvbi5zZXQoMCwgMCwgLTAuNSk7XG5cdFx0Y29udGFpbmVyLnJvdGF0aW9uLnkgPSAtMjtcblx0XHRjYW1lcmEuY2FtZXJhLmFkZChjb250YWluZXIpO1xuXHR9O1xuXG5cdHZhciBhY3RpdmF0ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0YWN0aXZlID0gdmFsdWU7XG5cdFx0aGlnaGxpZ2h0LmVuYWJsZSghYWN0aXZlKTtcblx0fTtcblxuXHRwcmV2aWV3LmlzQWN0aXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFjdGl2ZTtcblx0fTtcblxuXHRwcmV2aWV3LmVuYWJsZSA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciBvYmpDbG9uZTtcblxuXHRcdGlmKG9iaikge1xuXHRcdFx0YWN0aXZhdGUodHJ1ZSk7XG5cblx0XHRcdG9iakNsb25lID0gb2JqLmNsb25lKCk7XG5cdFx0XHRvYmpDbG9uZS5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG5cdFx0XHRjb250YWluZXIuYWRkKG9iakNsb25lKTtcblx0XHR9XG5cdH07XG5cblx0cHJldmlldy5kaXNhYmxlID0gZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFyQ29udGFpbmVyKCk7XG5cdFx0YWN0aXZhdGUoZmFsc2UpO1xuXHR9O1xuXG5cdHZhciBjbGVhckNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuXHRcdFx0Y29udGFpbmVyLnJlbW92ZShjaGlsZCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cHJldmlldy5yb3RhdGUgPSBmdW5jdGlvbihkWCkge1xuXHRcdGNvbnRhaW5lci5yb3RhdGlvbi55ICs9IGRYID8gZFggKiAwLjA1IDogMDtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIHByZXZpZXc7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgZW52aXJvbm1lbnQsIGhpZ2hsaWdodCwgcHJldmlldywgdG9vbHRpcCwgY2F0YWxvZykge1xuXHR2YXIgc2VsZWN0b3IgPSB7fTtcblx0XG5cdHZhciBzZWxlY3RlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblx0dmFyIGZvY3VzZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cblx0c2VsZWN0b3IucGxhY2luZyA9IGZhbHNlO1xuXG5cdHNlbGVjdG9yLmZvY3VzID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHZhciBvYmo7XG5cblx0XHRpZighbWV0YS5lcXVhbHMoZm9jdXNlZCkpIHtcblx0XHRcdGZvY3VzZWQgPSBtZXRhO1xuXG5cdFx0XHRpZighZm9jdXNlZC5pc0VtcHR5KCkpIHtcblx0XHRcdFx0b2JqID0gc2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCgpO1xuXHRcdFx0XHRoaWdobGlnaHQuZm9jdXMob2JqKTtcblx0XHRcdH1cblxuXHRcdFx0dG9vbHRpcC5zZXQob2JqKTtcblx0XHR9XG5cdH07XG5cblx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHNlbGVjdG9yLnNlbGVjdChmb2N1c2VkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iaiA9IGdldE9iamVjdChtZXRhKTtcblx0XHRcblx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdHNlbGVjdGVkID0gbWV0YTtcblxuXHRcdGhpZ2hsaWdodC5zZWxlY3Qob2JqKTtcblx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cblx0XHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cdH07XG5cblx0c2VsZWN0b3IudW5zZWxlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRpZighc2VsZWN0ZWQuaXNFbXB0eSgpKSB7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG51bGwpO1xuXHRcdFx0c2VsZWN0ZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cdFx0fVxuXG5cdFx0cHJldmlldy5kaXNhYmxlKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSA/IGNhdGFsb2cuZ2V0Qm9vayhzZWxlY3RlZC5pZCkgOiBcblx0XHRcdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCkgPyBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKHNlbGVjdGVkLmlkKSA6XG5cdFx0XHRudWxsO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldE9iamVjdChzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3QoZm9jdXNlZCk7XG5cdH07XG5cblx0dmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqZWN0O1xuXG5cdFx0aWYoIW1ldGEuaXNFbXB0eSgpKSB7XG5cdFx0XHRvYmplY3QgPSBpc1NoZWxmKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2hlbGYobWV0YS5wYXJlbnRJZCwgbWV0YS5pZClcblx0XHRcdFx0OiBpc0Jvb2sobWV0YSkgPyBlbnZpcm9ubWVudC5nZXRCb29rKG1ldGEuaWQpXG5cdFx0XHRcdDogaXNTZWN0aW9uKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihtZXRhLmlkKVxuXHRcdFx0XHQ6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcdFxuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRFZGl0YWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpIHx8IHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uKCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNCb29rU2VsZWN0ZWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpICYmIHNlbGVjdGVkLmlkID09PSBpZDtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2hlbGYgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNTaGVsZihzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNCb29rKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NlY3Rpb24oc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBpc1NoZWxmID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNoZWxmT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzQm9vayA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBCb29rT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0dmFyIGlzU2VjdGlvbiA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBTZWN0aW9uT2JqZWN0LlRZUEU7XG5cdH07XG5cblx0cmV0dXJuIHNlbGVjdG9yO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2F1dGhvcml6YXRpb24nLCBmdW5jdGlvbiAoJGxvZywgJHEsICR3aW5kb3csICRpbnRlcnZhbCwgdXNlciwgZW52aXJvbm1lbnQsIHJlZ2lzdHJhdGlvbiwgdXNlckRhdGEsIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgYXV0aG9yaXphdGlvbiA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdsb2dpbkRpYWxvZyc7XG5cblx0YXV0aG9yaXphdGlvbi5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNBdXRob3JpemVkKCkgJiYgdXNlci5pc0xvYWRlZCgpO1xuXHR9O1xuXG5cdHZhciBsb2dpbiA9IGZ1bmN0aW9uKGxpbmspIHtcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHR2YXIgd2luID0gJHdpbmRvdy5vcGVuKGxpbmssICcnLCAnd2lkdGg9ODAwLGhlaWdodD02MDAsbW9kYWw9eWVzLGFsd2F5c1JhaXNlZD15ZXMnKTtcblx0ICAgIHZhciBjaGVja0F1dGhXaW5kb3cgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGlmICh3aW4gJiYgd2luLmNsb3NlZCkge1xuXHQgICAgICAgIFx0JGludGVydmFsLmNhbmNlbChjaGVja0F1dGhXaW5kb3cpO1xuXG5cdCAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQoZmFsc2UpO1xuXHQgICAgICAgIFx0dXNlci5sb2FkKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdHJldHVybiB1c2VyLmlzVGVtcG9yYXJ5KCkgPyByZWdpc3RyYXRpb24uc2hvdygpIDogdXNlckRhdGEubG9hZCgpO1xuXHQgICAgICAgIFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgXHRcdGVudmlyb25tZW50LnNldExvYWRlZCh0cnVlKTtcblx0ICAgICAgICBcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0ICAgICAgICBcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBcdFx0JGxvZy5sb2coJ1VzZXIgbG9hZGluZCBlcnJvcicpO1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0ICAgICAgICBcdH0pO1xuXHQgICAgICAgIH1cblx0ICAgIH0sIDEwMCk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5nb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvZ29vZ2xlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi50d2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL3R3aXR0ZXInKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0bG9naW4oJy9hdXRoL2ZhY2Vib29rJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi52a29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvdmtvbnRha3RlJyk7XG5cdH07XG5cblx0YXV0aG9yaXphdGlvbi5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICBcdGVudmlyb25tZW50LnNldExvYWRlZChmYWxzZSk7XG5cdFx0dXNlci5sb2dvdXQoKS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0cmV0dXJuIHVzZXJEYXRhLmxvYWQoKTtcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRlbnZpcm9ubWVudC5zZXRMb2FkZWQodHJ1ZSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignTG9nb3V0IGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHR9KTtcblx0fTtcblx0XG5cdHJldHVybiBhdXRob3JpemF0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jsb2NrJywgZnVuY3Rpb24gKGJsb2NrVUkpIHtcblx0dmFyIGJsb2NrID0ge307XG5cblx0dmFyIElOVkVOVE9SWSA9ICdpbnZlbnRvcnknO1xuXHR2YXIgTUFJTl9NRU5VID0gJ21haW5fbWVudSc7XG5cdHZhciBHTE9CQUwgPSAnZ2xvYmFsJztcblxuXHRibG9jay5pbnZlbnRvcnkgPSBibG9ja1VJLmluc3RhbmNlcy5nZXQoSU5WRU5UT1JZKTtcblx0XG5cdGJsb2NrLm1haW5NZW51ID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KE1BSU5fTUVOVSk7XG5cblx0YmxvY2suZ2xvYmFsID0gYmxvY2tVSS5pbnN0YW5jZXMuZ2V0KEdMT0JBTCk7XG5cblx0cmV0dXJuIGJsb2NrO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Jvb2tFZGl0JywgZnVuY3Rpb24gKCRsb2csIGRhdGEsIGVudmlyb25tZW50LCBibG9jaywgZGlhbG9nLCBhcmNoaXZlLCBjYXRhbG9nLCBzZWxlY3RvciwgdXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIGJvb2tFZGl0ID0ge307XG5cdHZhciBib29rRGlhbG9nO1xuXG5cdHZhciBCT09LX0lNQUdFX1VSTCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vaW1nLmpwZyc7XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEUgPSAnZWRpdEJvb2tEaWFsb2cnO1xuXHRcblx0Ym9va0VkaXQuYm9vayA9IHt9O1xuXG5cdGJvb2tFZGl0LnNob3cgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0c2V0Qm9vayhib29rKTtcblx0XHRib29rRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0dmFyIHNldEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vaykge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5pZCA9IGJvb2suaWQ7XG5cdFx0XHRib29rRWRpdC5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5tb2RlbCA9IGJvb2subW9kZWw7XG5cdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gYm9vay5jb3Zlcjtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXJJZCA9IGJvb2suY292ZXJJZDtcblx0XHRcdGJvb2tFZGl0LmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5hdXRob3IgPSBib29rLmF1dGhvcjtcblx0XHR9XG5cdH07XG5cblx0Ym9va0VkaXQuZ2V0SW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5tb2RlbCA/IEJPT0tfSU1BR0VfVVJMLnJlcGxhY2UoJ3ttb2RlbH0nLCB0aGlzLmJvb2subW9kZWwpIDogRU1QVFlfSU1BR0VfVVJMO1xuXHR9O1xuXG5cdGJvb2tFZGl0LmdldENvdmVySW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuYm9vay5jb3ZlciA/IHRoaXMuYm9vay5jb3Zlci51cmwgOiBFTVBUWV9JTUFHRV9VUkw7XG5cdH07XG5cblx0Ym9va0VkaXQuYXBwbHlDb3ZlciA9IGZ1bmN0aW9uKGNvdmVySW5wdXRVUkwpIHtcblx0XHRpZihjb3ZlcklucHV0VVJMKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdGFyY2hpdmUuc2VuZEV4dGVybmFsVVJMKGNvdmVySW5wdXRVUkwsIFt0aGlzLmJvb2sudGl0bGUsIHRoaXMuYm9vay5hdXRob3JdKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlciA9IHJlc3VsdDtcblx0XHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gcmVzdWx0LmlkO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVySWQgPSBudWxsO1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gbnVsbDtcblx0XHRcdFx0XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgYXBwbHkgdGhpcyBjb3Zlci4gVHJ5IGFub3RoZXIgb25lLCBwbGVhc2UuJyk7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Y292ZXJJbnB1dFVSTCA9IG51bGw7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gbnVsbDtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXIgPSBudWxsO1xuXHRcdH1cblx0fTtcblxuXHRib29rRWRpdC5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRkYXRhLnBvc3RCb29rKHRoaXMuYm9vaykudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHRpZihzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZChkdG8uaWQpKSB7XG5cdFx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR9XG5cblx0XHRcdGVudmlyb25tZW50LnVwZGF0ZUJvb2soZHRvKTtcblx0XHRcdHNjb3BlLmNhbmNlbCgpO1xuXHRcdFx0cmV0dXJuIGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0JGxvZy5lcnJvcignQm9vayBzYXZlIGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgZXJyb3Jcblx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0Ym9va0VkaXQuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0Ym9va0RpYWxvZy5jbG9zZSgpO1xuXHR9O1xuXG5cdHJldHVybiBib29rRWRpdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYXRhbG9nJywgZnVuY3Rpb24gKCRxLCBkYXRhLCBibG9jaykge1xuXHR2YXIgY2F0YWxvZyA9IHt9O1xuXG5cdGNhdGFsb2cuYm9va3MgPSBudWxsO1xuXG5cdGNhdGFsb2cubG9hZEJvb2tzID0gZnVuY3Rpb24odXNlcklkKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZih1c2VySWQpIHtcblx0XHRcdGJsb2NrLmludmVudG9yeS5zdGFydCgpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odXNlcklkID8gZGF0YS5nZXRVc2VyQm9va3ModXNlcklkKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRjYXRhbG9nLmJvb2tzID0gcmVzdWx0O1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmludmVudG9yeS5zdG9wKCk7XHRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdGNhdGFsb2cuZ2V0Qm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIF8uZmluZChjYXRhbG9nLmJvb2tzLCB7aWQ6IGlkfSk7XG5cdH07XG5cblx0cmV0dXJuIGNhdGFsb2c7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY3JlYXRlTGlicmFyeScsIGZ1bmN0aW9uIChkYXRhLCBlbnZpcm9ubWVudCwgZGlhbG9nLCBibG9jaywgbmdEaWFsb2cpIHtcblx0dmFyIGNyZWF0ZUxpYnJhcnkgPSB7fTtcblx0XG5cdHZhciBFTVBUWV9JTUFHRV9VUkwgPSAnL2ltZy9lbXB0eV9jb3Zlci5qcGcnO1xuXHR2YXIgVEVNUExBVEVfSUQgPSAnY3JlYXRlTGlicmFyeURpYWxvZyc7XG5cdFxuXHR2YXIgY3JlYXRlTGlicmFyeURpYWxvZztcblxuXHRjcmVhdGVMaWJyYXJ5LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVMaWJyYXJ5RGlhbG9nID0gbmdEaWFsb2cub3Blbih7XG5cdFx0XHR0ZW1wbGF0ZTogVEVNUExBVEVfSURcblx0XHR9KTtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmdldEltZyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIG1vZGVsID8gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVMaWJyYXJ5LmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0ZGF0YS5wb3N0TGlicmFyeShtb2RlbCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRcdGVudmlyb25tZW50LmdvVG9MaWJyYXJ5KHJlc3VsdC5pZCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgY3JlYXRlIGxpYnJhcnkgYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGNyZWF0ZUxpYnJhcnlEaWFsb2cuY2xvc2UoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5XYXJuaW5nKCdTZWxlY3QgbGlicmFyeSwgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gY3JlYXRlTGlicmFyeTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjcmVhdGVTZWN0aW9uJywgZnVuY3Rpb24gKCRsb2csIHVzZXIsIGVudmlyb25tZW50LCBsb2NhdG9yLCBkaWFsb2csIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgY3JlYXRlU2VjdGlvbiA9IHt9O1xuXHRcblx0dmFyIEVNUFRZX0lNQUdFX1VSTCA9ICcvaW1nL2VtcHR5X2NvdmVyLmpwZyc7XG5cdHZhciBURU1QTEFURSA9ICdjcmVhdGVTZWN0aW9uRGlhbG9nJztcblxuXHR2YXIgY3JlYXRlU2VjdGlvbkRpYWxvZztcblxuXHRjcmVhdGVTZWN0aW9uLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVTZWN0aW9uRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0Y3JlYXRlU2VjdGlvbi5nZXRJbWcgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBtb2RlbCA/ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKSA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRjcmVhdGVTZWN0aW9uLmNyZWF0ZSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0aWYobW9kZWwpIHtcblx0XHRcdHZhciBzZWN0aW9uRGF0YSA9IHtcblx0XHRcdFx0bW9kZWw6IG1vZGVsLFxuXHRcdFx0XHRsaWJyYXJ5SWQ6IGVudmlyb25tZW50LmxpYnJhcnkuaWQsXG5cdFx0XHRcdHVzZXJJZDogdXNlci5nZXRJZCgpXG5cdFx0XHR9O1xuXG5cdFx0XHRwbGFjZShzZWN0aW9uRGF0YSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuV2FybmluZygnU2VsZWN0IG1vZGVsLCBwbGVhc2UuJyk7XG5cdFx0fVx0XG5cdH07XG5cblx0dmFyIHBsYWNlID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0bG9jYXRvci5wbGFjZVNlY3Rpb24oZHRvKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0NhbiBub3QgY3JlYXRlIHNlY3Rpb24gYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHR9KTtcdFxuXG5cdFx0Y3JlYXRlU2VjdGlvbkRpYWxvZy5jbG9zZSgpO1xuXHR9O1xuXG5cdHJldHVybiBjcmVhdGVTZWN0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2ZlZWRiYWNrJywgZnVuY3Rpb24gKGRhdGEsIGRpYWxvZywgbmdEaWFsb2cpIHtcblx0dmFyIGZlZWRiYWNrID0ge307XG5cdHZhciBmZWVkYmFja0RpYWxvZztcblxuXHR2YXIgVEVNUExBVEUgPSAnZmVlZGJhY2tEaWFsb2cnO1xuXG5cdGZlZWRiYWNrLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRmZWVkYmFja0RpYWxvZyA9IG5nRGlhbG9nLm9wZW4oe3RlbXBsYXRlOiBURU1QTEFURX0pO1xuXHR9O1xuXG5cdGZlZWRiYWNrLnNlbmQgPSBmdW5jdGlvbihkdG8pIHtcblx0XHRkaWFsb2cub3BlbkNvbmZpcm0oJ1NlbmQgZmVlZGJhY2s/JykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YS5wb3N0RmVlZGJhY2soZHRvKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZmVlZGJhY2tEaWFsb2cuY2xvc2UoKTtcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBzZW5kIGZlZWRiYWNrIGJlY2F1c2Ugb2YgYW4gZXJyb3IuJyk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gZmVlZGJhY2s7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbGlua0FjY291bnQnLCBmdW5jdGlvbiAodXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIGxpbmtBY2NvdW50ID0ge307XG5cblx0dmFyIFRFTVBMQVRFID0gJ2xpbmtBY2NvdW50RGlhbG9nJztcblxuXHRsaW5rQWNjb3VudC5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNHb29nbGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzR29vZ2xlKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNUd2l0dGVyU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdXNlci5pc1R3aXR0ZXIoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0ZhY2Vib29rU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdXNlci5pc0ZhY2Vib29rKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNWa29udGFrdGVTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzVmtvbnRha3RlKCk7XG5cdH07XG5cblx0bGlua0FjY291bnQuaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5pc0dvb2dsZVNob3coKSB8fCBcblx0XHRcdHRoaXMuaXNUd2l0dGVyU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc0ZhY2Vib29rU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc1Zrb250YWt0ZVNob3coKTtcblx0fTtcblxuXHRyZXR1cm4gbGlua0FjY291bnQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbWFpbk1lbnUnLCBmdW5jdGlvbiAoJGxvZywgZGF0YSwgYm9va0VkaXQsIGZlZWRiYWNrLCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBjcmVhdGVTZWN0aW9uLCBsaW5rQWNjb3VudCwgYXV0aG9yaXphdGlvbikge1xuXHR2YXIgbWFpbk1lbnUgPSB7fTtcblx0XG5cdHZhciBzaG93ID0gZmFsc2U7XG5cdHZhciBjcmVhdGVMaXN0U2hvdyA9IGZhbHNlO1xuXG5cdG1haW5NZW51LmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzaG93O1xuXHR9O1xuXG5cdG1haW5NZW51LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0c2hvdyA9IHRydWU7XG5cdH07XG5cblx0bWFpbk1lbnUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHNob3cgPSBmYWxzZTtcblx0fTtcblxuXHRtYWluTWVudS5pc0NyZWF0ZUxpc3RTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZUxpc3RTaG93O1xuXHR9O1xuXG5cdG1haW5NZW51LmNyZWF0ZUxpc3RTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGNyZWF0ZUxpc3RTaG93ID0gdHJ1ZTtcblx0fTtcblxuXHRtYWluTWVudS5jcmVhdGVMaXN0SGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpc3RTaG93ID0gZmFsc2U7XG5cdH07XG5cblx0bWFpbk1lbnUuaGlkZUFsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGUoKTtcblx0XHRtYWluTWVudS5jcmVhdGVMaXN0SGlkZSgpO1xuXHR9O1xuXG5cdG1haW5NZW51LnRyaWdnZXIgPSBmdW5jdGlvbigpIHtcblx0XHRpZihtYWluTWVudS5pc1Nob3coKSkge1xuXHRcdFx0bWFpbk1lbnUuaGlkZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYWluTWVudS5zaG93KCk7XG5cdFx0fVxuXHR9O1xuXG5cdG1haW5NZW51LnNob3dGZWVkYmFjayA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRmZWVkYmFjay5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd1NlbGVjdExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0c2VsZWN0TGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0NyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlTGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0NyZWF0ZVNlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlU2VjdGlvbi5zaG93KCk7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0xpbmtBY2NvdW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGxpbmtBY2NvdW50LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5pc0xpbmtBY2NvdW50QXZhaWxhYmxlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICFhdXRob3JpemF0aW9uLmlzU2hvdygpICYmIGxpbmtBY2NvdW50LmlzQXZhaWxhYmxlKCk7XG5cdH07XG5cblx0cmV0dXJuIG1haW5NZW51O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3JlZ2lzdHJhdGlvbicsIGZ1bmN0aW9uICgkbG9nLCB1c2VyLCBkYXRhLCBkaWFsb2csIHVzZXJEYXRhLCBuZ0RpYWxvZykge1xuXHR2YXIgcmVnaXN0cmF0aW9uID0ge307XG5cblx0dmFyIEZPUk1fVkFMSURBVElPTl9FUlJPUiA9ICdFbnRlciBhIHZhbGlkIGRhdGEsIHBsZWFzZS4nO1xuXHR2YXIgU0FWRV9VU0VSX0VSUk9SID0gJ0Vycm9yIHNhdmluZyB1c2VyLiBUcnkgYWdhaW4sIHBsZWFzZS4nO1xuXHR2YXIgVEVNUExBVEUgPSAncmVnaXN0cmF0aW9uRGlhbG9nJztcblxuXHRyZWdpc3RyYXRpb24udXNlciA9IHtcblx0XHRpZDogbnVsbCxcblx0XHRuYW1lOiBudWxsLFxuXHRcdGVtYWlsOiBudWxsLFxuXHRcdHRlbXBvcmFyeTogZmFsc2Vcblx0fTtcblxuXHRyZWdpc3RyYXRpb24uc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLmlkID0gdXNlci5nZXRJZCgpO1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLm5hbWUgPSB1c2VyLmdldE5hbWUoKTtcblx0XHRyZWdpc3RyYXRpb24udXNlci5lbWFpbCA9IHVzZXIuZ2V0RW1haWwoKTtcblxuXHRcdHJldHVybiBuZ0RpYWxvZy5vcGVuQ29uZmlybSh7dGVtcGxhdGU6IFRFTVBMQVRFfSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gc2F2ZVVzZXIoKTtcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGVsZXRlVXNlcigpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJlZ2lzdHJhdGlvbi5zaG93VmFsaWRhdGlvbkVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0ZGlhbG9nLm9wZW5FcnJvcihGT1JNX1ZBTElEQVRJT05fRVJST1IpO1xuXHR9O1xuXG5cdHZhciBzYXZlVXNlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkYXRhLnB1dFVzZXIocmVnaXN0cmF0aW9uLnVzZXIpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBcdHJldHVybiB1c2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICBcdFx0XHRyZXR1cm4gdXNlckRhdGEubG9hZCgpO1xuICAgICAgICBcdH0pO1x0XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcihTQVZFX1VTRVJfRVJST1IpO1xuXHRcdFx0JGxvZy5sb2coJ1JlZ2lzdHJhdGlvbjogRXJyb3Igc2F2aW5nIHVzZXI6JywgcmVnaXN0cmF0aW9uLnVzZXIuaWQpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBkZWxldGVVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRhdGEuZGVsZXRlVXNlcihyZWdpc3RyYXRpb24udXNlci5pZCk7XG5cdH07XG5cblx0cmV0dXJuIHJlZ2lzdHJhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdzZWxlY3RMaWJyYXJ5JywgZnVuY3Rpb24gKCRxLCBkYXRhLCBlbnZpcm9ubWVudCwgdXNlciwgbmdEaWFsb2cpIHtcblx0dmFyIHNlbGVjdExpYnJhcnkgPSB7fTtcblxuXHR2YXIgVEVNUExBVEUgPSAnc2VsZWN0TGlicmFyeURpYWxvZyc7XG5cblx0c2VsZWN0TGlicmFyeS5saXN0ID0gW107XG5cblx0c2VsZWN0TGlicmFyeS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0bmdEaWFsb2cub3BlbkNvbmZpcm0oe3RlbXBsYXRlOiBURU1QTEFURX0pO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkuaXNBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5saXN0Lmxlbmd0aCA+IDA7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS5pc1VzZXJMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50LmxpYnJhcnkgJiYgZW52aXJvbm1lbnQubGlicmFyeS5kYXRhT2JqZWN0LnVzZXJJZCA9PT0gdXNlci5nZXRJZCgpO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZih1c2VyLmlzQXV0aG9yaXplZCgpKSB7XG5cdFx0ICAgIHByb21pc2UgPSBkYXRhLmdldExpYnJhcmllcygpLnRoZW4oZnVuY3Rpb24gKGxpYnJhcmllcykge1xuXHQgICAgICAgICAgICBzY29wZS5saXN0ID0gbGlicmFyaWVzO1xuXHQgICAgXHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2NvcGUubGlzdCA9IFtdO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4oc2NvcGUubGlzdCk7XG5cdFx0fVxuXG4gICAgXHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRzZWxlY3RMaWJyYXJ5LmdvID0gZW52aXJvbm1lbnQuZ29Ub0xpYnJhcnk7XG5cblx0cmV0dXJuIHNlbGVjdExpYnJhcnk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgndG9vbHMnLCBmdW5jdGlvbiAoJHEsICRsb2csIEJvb2tPYmplY3QsIFNlY3Rpb25PYmplY3QsIFNoZWxmT2JqZWN0LCBTZWxlY3Rvck1ldGFEdG8sIGRhdGEsIHNlbGVjdG9yLCBkaWFsb2csIGJsb2NrLCBjYXRhbG9nLCBlbnZpcm9ubWVudCwgcHJldmlldywgdXNlciwgbG9jYXRvciwgZ3Jvd2wpIHtcblx0dmFyIHRvb2xzID0ge307XG5cblx0dmFyIFJPVEFUSU9OX1NDQUxFID0gMTtcblxuXHR2YXIgc3RhdGVzID0ge1xuXHRcdHJvdGF0ZUxlZnQ6IGZhbHNlLFxuXHRcdHJvdGF0ZVJpZ2h0OiBmYWxzZVxuXHR9O1xuXG5cdHRvb2xzLnBsYWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGVjdGVkRHRvO1xuXHRcdHZhciBmb2N1c2VkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0Rm9jdXNlZE9iamVjdCgpO1xuXG5cdFx0aWYoZm9jdXNlZE9iamVjdCBpbnN0YW5jZW9mIFNoZWxmT2JqZWN0KSB7XG5cdFx0XHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cdFx0XHRzZWxlY3RlZER0byA9IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCk7XG5cblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0bG9jYXRvci5wbGFjZUJvb2soc2VsZWN0ZWREdG8sIGZvY3VzZWRPYmplY3QpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2YXIgYm9va0R0byA9IGNhdGFsb2cuZ2V0Qm9vayhzZWxlY3RlZER0by5pZCk7XG5cdFx0XHRcdHNlbGVjdG9yLnNlbGVjdChuZXcgU2VsZWN0b3JNZXRhRHRvKEJvb2tPYmplY3QuVFlQRSwgYm9va0R0by5pZCwgYm9va0R0by5zaGVsZklkKSk7XG5cdFx0XHRcdGdyb3dsLnN1Y2Nlc3MoJ0Jvb2sgcGxhY2VkJyk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Z3Jvd2wuZXJyb3IoZXJyb3IpO1xuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGdyb3dsLmVycm9yKCdTaGVsZiBpcyBub3Qgc2VsZWN0ZWQnKTtcblx0XHR9XG5cdH07XG5cblx0dG9vbHMudW5wbGFjZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBib29rRHRvID0gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSA/IHNlbGVjdG9yLmdldFNlbGVjdGVkRHRvKCkgOiBudWxsO1xuXG5cdFx0aWYoYm9va0R0bykge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHRsb2NhdG9yLnVucGxhY2VCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRncm93bC5zdWNjZXNzKCdCb29rIHVucGxhY2VkJyk7XG5cdFx0XHRcdHJldHVybiBjYXRhbG9nLmxvYWRCb29rcyh1c2VyLmdldElkKCkpO1x0XHRcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRncm93bC5lcnJvcihlcnJvcik7XG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0dG9vbHMuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGRhdGEuZGVsZXRlQm9vayhpZCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhpZCk7XG5cdFx0XHRyZXR1cm4gY2F0YWxvZy5sb2FkQm9va3ModXNlci5nZXRJZCgpKTtcblx0XHR9KTtcblx0fTtcblxuXHR0b29scy5kZWxldGVTZWN0aW9uID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVTZWN0aW9uKGlkKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVTZWN0aW9uKGlkKTtcblx0XHR9KTtcblx0fTtcblxuXHR0b29scy5yb3RhdGVMZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZUxlZnQgPSB0cnVlO1xuXHR9O1xuXG5cdHRvb2xzLnJvdGF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZVJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHR0b29scy5zdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGVzLnJvdGF0ZUxlZnQgPSBmYWxzZTtcblx0XHRzdGF0ZXMucm90YXRlUmlnaHQgPSBmYWxzZTtcblx0fTtcblxuXHR0b29scy51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZihzdGF0ZXMucm90YXRlTGVmdCkge1xuXHRcdFx0cm90YXRlKFJPVEFUSU9OX1NDQUxFKTtcblx0XHR9IGVsc2UgaWYoc3RhdGVzLnJvdGF0ZVJpZ2h0KSB7XG5cdFx0XHRyb3RhdGUoLVJPVEFUSU9OX1NDQUxFKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHJvdGF0ZSA9IGZ1bmN0aW9uKHNjYWxlKSB7XG5cdFx0dmFyIG9iajtcblxuXHRcdGlmKHByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0cHJldmlldy5yb3RhdGUoc2NhbGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvYmogPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXHRcdFx0aWYob2JqKSBvYmoucm90YXRlKHNjYWxlKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHRvb2xzO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3Rvb2x0aXAnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciB0b29sdGlwID0ge307XG5cblx0dG9vbHRpcC5vYmogPSB7fTtcblxuXHR0b29sdGlwLnNldCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dGhpcy5vYmoudHlwZSA9IG9iai50eXBlO1xuXHRcdFx0dGhpcy5vYmoudGl0bGUgPSBvYmouZGF0YU9iamVjdC50aXRsZTtcblx0XHRcdHRoaXMub2JqLmF1dGhvciA9IG9iai5kYXRhT2JqZWN0LmF1dGhvcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5vYmoudHlwZSA9IG51bGw7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiB0b29sdGlwO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3VzZXJEYXRhJywgZnVuY3Rpb24gKCRxLCBzZWxlY3RMaWJyYXJ5LCBjYXRhbG9nLCB1c2VyKSB7XG5cdHZhciB1c2VyRGF0YSA9IHt9O1xuXG5cdHVzZXJEYXRhLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJHEuYWxsKFtcblx0XHRcdHNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpLCBcblx0XHRcdGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSlcblx0XHRdKTtcblx0fTtcblxuXHRyZXR1cm4gdXNlckRhdGE7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=