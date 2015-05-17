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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL0F1dGhDdHJsLmpzIiwiY29udHJvbGxlcnMvQm9va0VkaXRDdHJsLmpzIiwiY29udHJvbGxlcnMvQ3JlYXRlTGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9DcmVhdGVTZWN0aW9uQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ZlZWRiYWNrQ3RybC5qcyIsImNvbnRyb2xsZXJzL0ludmVudG9yeUN0cmwuanMiLCJjb250cm9sbGVycy9MaW5rQWNjb3VudEN0cmwuanMiLCJjb250cm9sbGVycy9SZWdpc3RyYXRpb25DdHJsLmpzIiwiY29udHJvbGxlcnMvU2VsZWN0TGlicmFyeUN0cmwuanMiLCJjb250cm9sbGVycy9Ub29sc0N0cmwuanMiLCJjb250cm9sbGVycy9Ub29sdGlwQ3RybC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImNvbnRyb2xsZXJzL1dlbGNvbWVDdHJsLmpzIiwiZGlyZWN0aXZlcy9zZWxlY3QuanMiLCJzZXJ2aWNlcy9hcmNoaXZlLmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9kaWFsb2cuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwic2VydmljZXMvbWF0ZXJpYWxzL0Jvb2tNYXRlcmlhbC5qcyIsInNlcnZpY2VzL21vZGVscy9CYXNlT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0Jvb2tPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FtZXJhT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VsZWN0b3JNZXRhRHRvLmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL3N1YmNsYXNzT2YuanMiLCJzZXJ2aWNlcy9zY2VuZS9ncmlkQ2FsY3VsYXRvci5qcyIsInNlcnZpY2VzL3NjZW5lL2hpZ2hsaWdodC5qcyIsInNlcnZpY2VzL3NjZW5lL2xvY2F0b3IuanMiLCJzZXJ2aWNlcy9zY2VuZS9wcmV2aWV3LmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiLCJzZXJ2aWNlcy91aS9hdXRob3JpemF0aW9uLmpzIiwic2VydmljZXMvdWkvYmxvY2suanMiLCJzZXJ2aWNlcy91aS9ib29rRWRpdC5qcyIsInNlcnZpY2VzL3VpL2NhdGFsb2cuanMiLCJzZXJ2aWNlcy91aS9jcmVhdGVMaWJyYXJ5LmpzIiwic2VydmljZXMvdWkvY3JlYXRlU2VjdGlvbi5qcyIsInNlcnZpY2VzL3VpL2ZlZWRiYWNrLmpzIiwic2VydmljZXMvdWkvbGlua0FjY291bnQuanMiLCJzZXJ2aWNlcy91aS9tYWluTWVudS5qcyIsInNlcnZpY2VzL3VpL3JlZ2lzdHJhdGlvbi5qcyIsInNlcnZpY2VzL3VpL3NlbGVjdExpYnJhcnkuanMiLCJzZXJ2aWNlcy91aS90b29scy5qcyIsInNlcnZpY2VzL3VpL3Rvb2x0aXAuanMiLCJzZXJ2aWNlcy91aS91c2VyRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJywgWydhbmd1bGFyLWdyb3dsJywgJ2Jsb2NrVUknLCAnbmdEaWFsb2cnLCAnYW5ndWxhclV0aWxzLmRpcmVjdGl2ZXMuZGlyUGFnaW5hdGlvbiddKVxuLmNvbmZpZyhmdW5jdGlvbiAoZ3Jvd2xQcm92aWRlciwgYmxvY2tVSUNvbmZpZywgcGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIpIHtcbiAgICBncm93bFByb3ZpZGVyLmdsb2JhbFRpbWVUb0xpdmUoMjAwMCk7XG4gICAgZ3Jvd2xQcm92aWRlci5nbG9iYWxQb3NpdGlvbigndG9wLWxlZnQnKTtcbiAgICBncm93bFByb3ZpZGVyLmdsb2JhbERpc2FibGVDb3VudERvd24odHJ1ZSk7XG5cblx0YmxvY2tVSUNvbmZpZy5kZWxheSA9IDA7XG5cdGJsb2NrVUlDb25maWcuYXV0b0Jsb2NrID0gZmFsc2U7XG5cdGJsb2NrVUlDb25maWcuYXV0b0luamVjdEJvZHlCbG9jayA9IGZhbHNlO1xuXHRcbiAgICBwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlci5zZXRQYXRoKCcvdWkvZGlyUGFnaW5hdGlvbicpO1xufSkucnVuKGZ1bmN0aW9uIChtYWluKSB7XG5cdG1haW4uc3RhcnQoKTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdBdXRoQ3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uKSB7XG5cdHRoaXMubG9naW5Hb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLmdvb2dsZSgpO1xuXHR9O1xuXG5cdHRoaXMubG9naW5Ud2l0dGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi50d2l0dGVyKCk7XG5cdH07XG5cblx0dGhpcy5sb2dpbkZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5mYWNlYm9vaygpO1xuXHR9O1xuXG5cdHRoaXMubG9naW5Wa29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnZrb250YWt0ZSgpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0Jvb2tFZGl0Q3RybCcsIGZ1bmN0aW9uIChib29rRWRpdCwgZGlhbG9nLCBkYXRhKSB7XG5cdHZhciBzY29wZSA9IHRoaXM7XG5cblx0dGhpcy5ib29rID0gYm9va0VkaXQuYm9vaztcblx0dGhpcy5jb3ZlcklucHV0VVJMID0gbnVsbDtcblxuXHR0aGlzLmFwcGx5Q292ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRpZighaXNDb3ZlckRpc2FibGVkKCkpIHtcblx0XHRcdGJvb2tFZGl0LmFwcGx5Q292ZXIodGhpcy5jb3ZlcklucHV0VVJMKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignRmlsbCBhdXRob3IgYW5kIHRpdGxlIGZpZWxkcywgcGxlYXNlLicpO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLmdldENvdmVySW1nID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGJvb2tFZGl0LmdldENvdmVySW1nKCk7XG5cdH07XG5cblx0dGhpcy5nZXRJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYm9va0VkaXQuZ2V0SW1nKCk7XG5cdH07XG5cblx0dGhpcy5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHRib29rRWRpdC5jYW5jZWwoKTtcblx0fTtcblxuXHR0aGlzLnN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuZm9ybS4kdmFsaWQpIHtcblx0XHRcdGJvb2tFZGl0LnNhdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignRmlsbCBhbGwgcmVxdWlyZWQgZmllbGRzLCBwbGVhc2UuJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpc0NvdmVyRGlzYWJsZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2NvcGUuY292ZXJJbnB1dFVSTCAmJiAoc2NvcGUuZm9ybS50aXRsZS4kaW52YWxpZCB8fCBzY29wZS5mb3JtLmF1dGhvci4kaW52YWxpZCk7XG5cdH07XG5cblx0ZGF0YS5jb21tb24udGhlbihmdW5jdGlvbiAoY29tbW9uRGF0YSkge1xuXHRcdHNjb3BlLmxpc3QgPSBjb21tb25EYXRhLmJvb2tzO1xuXHR9KTtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0NyZWF0ZUxpYnJhcnlDdHJsJywgZnVuY3Rpb24gKGNyZWF0ZUxpYnJhcnksIGRhdGEpIHtcblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR0aGlzLmxpc3QgPSBudWxsO1xuXHR0aGlzLm1vZGVsID0gbnVsbDtcblxuXHR0aGlzLmdldEltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjcmVhdGVMaWJyYXJ5LmdldEltZyh0aGlzLm1vZGVsKTtcblx0fTtcblxuXHR0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnkuY3JlYXRlKHRoaXMubW9kZWwpO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uLnRoZW4oZnVuY3Rpb24gKGNvbW1vbkRhdGEpIHtcblx0XHRzY29wZS5saXN0ID0gY29tbW9uRGF0YS5saWJyYXJpZXM7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0NyZWF0ZVNlY3Rpb25DdHJsJywgZnVuY3Rpb24gKGNyZWF0ZVNlY3Rpb24sIGRhdGEpIHtcblx0dmFyIHNjb3BlID0gdGhpcztcblxuXHR0aGlzLm1vZGVsID0gbnVsbDtcblx0dGhpcy5saXN0ID0gbnVsbDtcblxuXHR0aGlzLmdldEltZyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjcmVhdGVTZWN0aW9uLmdldEltZyh0aGlzLm1vZGVsKTtcblx0fTtcblx0XHRcblx0dGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRjcmVhdGVTZWN0aW9uLmNyZWF0ZSh0aGlzLm1vZGVsKTtcblx0fTtcblxuXHRkYXRhLmNvbW1vbi50aGVuKGZ1bmN0aW9uIChjb21tb25EYXRhKSB7XG5cdFx0c2NvcGUubGlzdCA9IGNvbW1vbkRhdGEuYm9va3NoZWx2ZXM7XG5cdH0pO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ0ZlZWRiYWNrQ3RybCcsIGZ1bmN0aW9uIChmZWVkYmFjaywgdXNlciwgZGlhbG9nKSB7XG5cdHRoaXMuc3VibWl0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYodGhpcy5mb3JtLm1lc3NhZ2UuJHZhbGlkKSB7XG5cdFx0XHRmZWVkYmFjay5zZW5kKHtcblx0XHRcdFx0bWVzc2FnZTogdGhpcy5tZXNzYWdlLFxuXHRcdFx0XHR1c2VySWQ6IHVzZXIuZ2V0SWQoKVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRpYWxvZy5vcGVuRXJyb3IoJ0ZlZWRiYWNrIGZpZWxkIGlzIHJlcXVpcmVkLicpO1xuXHRcdH1cblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdJbnZlbnRvcnlDdHJsJywgZnVuY3Rpb24gKFNlbGVjdG9yTWV0YUR0bywgQm9va09iamVjdCwgdXNlciwgYm9va0VkaXQsIHNlbGVjdG9yKSB7XG5cdHRoaXMuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHVzZXIuaXNBdXRob3JpemVkKCk7XG5cdH07XG5cblx0dGhpcy5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkKGlkKTtcblx0fTtcblxuXHR0aGlzLnNlbGVjdCA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHZhciBtZXRhID0gbmV3IFNlbGVjdG9yTWV0YUR0byhCb29rT2JqZWN0LlRZUEUsIGR0by5pZCk7XG5cdFx0c2VsZWN0b3Iuc2VsZWN0KG1ldGEpO1xuXHR9O1xuXG5cdHRoaXMuYWRkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdGJvb2tFZGl0LnNob3coe3VzZXJJZDogdXNlci5nZXRJZCgpfSk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignTGlua0FjY291bnRDdHJsJywgZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIGxpbmtBY2NvdW50KSB7XG5cdHRoaXMubGlua0dvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24uZ29vZ2xlKCk7XG5cdH07XG5cblx0dGhpcy5saW5rVHdpdHRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udHdpdHRlcigpO1xuXHR9O1xuXG5cdHRoaXMubGlua0ZhY2Vib29rID0gZnVuY3Rpb24oKSB7XG5cdFx0YXV0aG9yaXphdGlvbi5mYWNlYm9vaygpO1xuXHR9O1xuXG5cdHRoaXMubGlua1Zrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGF1dGhvcml6YXRpb24udmtvbnRha3RlKCk7XG5cdH07XG5cblx0dGhpcy5pc0dvb2dsZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNHb29nbGVTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc1R3aXR0ZXJTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzVHdpdHRlclNob3coKTtcblx0fTtcblxuXHR0aGlzLmlzRmFjZWJvb2tTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpbmtBY2NvdW50LmlzRmFjZWJvb2tTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc1Zrb250YWt0ZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbGlua0FjY291bnQuaXNWa29udGFrdGVTaG93KCk7XG5cdH07XG5cblx0dGhpcy5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaW5rQWNjb3VudC5pc0F2YWlsYWJsZSgpO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1JlZ2lzdHJhdGlvbkN0cmwnLCBmdW5jdGlvbiAocmVnaXN0cmF0aW9uKSB7XG5cdHRoaXMudXNlciA9IHJlZ2lzdHJhdGlvbi51c2VyO1xuXG5cdHRoaXMuc2hvd1ZhbGlkYXRpb25FcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlZ2lzdHJhdGlvbi5zaG93VmFsaWRhdGlvbkVycm9yKCk7XG5cdH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignU2VsZWN0TGlicmFyeUN0cmwnLCBmdW5jdGlvbiAoc2VsZWN0TGlicmFyeSkge1xuXHR0aGlzLmdvID0gc2VsZWN0TGlicmFyeS5nbztcblxuXHR0aGlzLmdldExpc3QgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5saXN0O1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1Rvb2xzQ3RybCcsIGZ1bmN0aW9uICh1c2VyLCBzZWxlY3RvciwgdG9vbHMsIHByZXZpZXcsIGJvb2tFZGl0LCBkaWFsb2csIGJsb2NrLCBncm93bCkge1xuICAgIHZhciBERUxFVEVfQ09ORklSTSA9ICdEZWxldGUgezB9OiB7MX0/JztcbiAgICB2YXIgREVMRVRFX1NVQ0NFU1MgPSAnezB9OiB7MX0gZGVsZXRlZC4nO1xuICAgIHZhciBERUxFVEVfRVJST1IgPSAnQ2FuIG5vdCBkZWxldGUgezB9OiB7MX0uJztcbiAgICB2YXIgQk9PSyA9ICdib29rJztcbiAgICB2YXIgU0VDVElPTiA9ICdzZWN0aW9uJztcblxuICAgIHRoaXMuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSB8fCBwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNCb29rID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1JvdGF0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKSB8fCBwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNFZGl0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Jvb2soKSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzRGVsZXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSAmJiB1c2VyLmlzQXV0aG9yaXplZCgpICYmICFwcmV2aWV3LmlzQWN0aXZlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNXYXRjaGFibGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKSAmJiAhdGhpcy5pc1BsYWNlYmxlKCk7XG4gICAgfTtcblxuICAgIHRoaXMuaXNQbGFjZWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcmV0dXJuICFvYmogJiYgc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKSAmJiB1c2VyLmlzQXV0aG9yaXplZCgpO1xuICAgIH07XG5cbiAgICB0aGlzLmlzVW5wbGFjZWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpICYmIHVzZXIuaXNBdXRob3JpemVkKCkgJiYgIXByZXZpZXcuaXNBY3RpdmUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc1BsYWNpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yLnBsYWNpbmc7XG4gICAgfTtcblxuICAgIHRoaXMucGxhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2VsZWN0b3IucGxhY2luZyA9ICFzZWxlY3Rvci5wbGFjaW5nO1xuICAgIH07XG5cbiAgICB0aGlzLnVucGxhY2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdG9vbHMudW5wbGFjZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLndhdGNoID0gZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcbiAgICAgICAgcHJldmlldy5lbmFibGUob2JqKTtcbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUaXRsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIHRoaXMuaXNCb29rKCkgPyBzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpLnRpdGxlIDpcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2VjdGlvbigpID8gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKS5pZCA6XG4gICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuXG4gICAgdGhpcy5lZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGJvb2tFZGl0LnNob3coc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKSk7XG4gICAgfTtcblxuICAgIHRoaXMuZGVsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkdG8gPSBzZWxlY3Rvci5nZXRTZWxlY3RlZER0bygpO1xuICAgICAgICB2YXIgY29uZmlybU1zZztcbiAgICAgICAgdmFyIHN1Y2Nlc3NNc2c7XG4gICAgICAgIHZhciBlcnJvck1zZztcbiAgICAgICAgdmFyIGRlbGV0ZUZuYztcblxuICAgICAgICBpZihzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVCb29rO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgQk9PSykucmVwbGFjZSgnezF9JywgZHRvLnRpdGxlKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIEJPT0spLnJlcGxhY2UoJ3sxfScsIGR0by50aXRsZSk7XG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pc1NlbGVjdGVkU2VjdGlvbigpKSB7XG4gICAgICAgICAgICBkZWxldGVGbmMgPSB0b29scy5kZWxldGVTZWN0aW9uO1xuICAgICAgICAgICAgY29uZmlybU1zZyA9IERFTEVURV9DT05GSVJNLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgICAgICBzdWNjZXNzTXNnID0gREVMRVRFX1NVQ0NFU1MucmVwbGFjZSgnezB9JywgU0VDVElPTikucmVwbGFjZSgnezF9JywgZHRvLmlkKTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gREVMRVRFX0VSUk9SLnJlcGxhY2UoJ3swfScsIFNFQ1RJT04pLnJlcGxhY2UoJ3sxfScsIGR0by5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2cub3BlbkNvbmZpcm0oY29uZmlybU1zZykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBibG9jay5nbG9iYWwuc3RhcnQoKTtcbiAgICAgICAgICAgIGRlbGV0ZUZuYyhkdG8uaWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGdyb3dsLnN1Y2Nlc3Moc3VjY2Vzc01zZyk7XG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZ3Jvd2wuZXJyb3IoZXJyb3JNc2cpO1xuICAgICAgICAgICAgfSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suZ2xvYmFsLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy51bndhdGNoID0gcHJldmlldy5kaXNhYmxlO1xuICAgIHRoaXMuaXNXYXRjaEFjdGl2ZSA9IHByZXZpZXcuaXNBY3RpdmU7XG5cbiAgICB0aGlzLnJvdGF0ZUxlZnQgPSB0b29scy5yb3RhdGVMZWZ0O1xuICAgIHRoaXMucm90YXRlUmlnaHQgPSB0b29scy5yb3RhdGVSaWdodDtcbiAgICB0aGlzLnN0b3AgPSB0b29scy5zdG9wO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1Rvb2x0aXBDdHJsJywgZnVuY3Rpb24gKHRvb2x0aXAsIEJvb2tPYmplY3QpIHtcbiAgICB0aGlzLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdG9vbHRpcC5vYmoudHlwZSA9PT0gQm9va09iamVjdC5UWVBFO1xuICAgIH07XG5cbiAgICB0aGlzLm9iaiA9IHRvb2x0aXAub2JqO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1VpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIG1haW5NZW51LCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBjcmVhdGVTZWN0aW9uLCBmZWVkYmFjaywgYXV0aG9yaXphdGlvbiwgbmF2aWdhdGlvbiwgYm9va0VkaXQsIGNhdGFsb2cpIHtcbiAgICAkc2NvcGUubWFpbk1lbnUgPSBtYWluTWVudTtcblxuICAgICRzY29wZS5zZWxlY3RMaWJyYXJ5ID0gc2VsZWN0TGlicmFyeTtcbiAgICAkc2NvcGUuY3JlYXRlTGlicmFyeSA9IGNyZWF0ZUxpYnJhcnk7XG4gICAgJHNjb3BlLmNyZWF0ZVNlY3Rpb24gPSBjcmVhdGVTZWN0aW9uO1xuICAgICRzY29wZS5mZWVkYmFjayA9IGZlZWRiYWNrO1xuICAgICRzY29wZS5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcblxuICAgICRzY29wZS5ib29rRWRpdCA9IGJvb2tFZGl0O1xuICAgICRzY29wZS5jYXRhbG9nID0gY2F0YWxvZztcblxuXHQkc2NvcGUubmF2aWdhdGlvbiA9IHtcblx0XHRzdG9wOiBuYXZpZ2F0aW9uLmdvU3RvcCxcblx0XHRmb3J3YXJkOiBuYXZpZ2F0aW9uLmdvRm9yd2FyZCxcblx0XHRiYWNrd2FyZDogbmF2aWdhdGlvbi5nb0JhY2t3YXJkLFxuXHRcdGxlZnQ6IG5hdmlnYXRpb24uZ29MZWZ0LFxuXHRcdHJpZ2h0OiBuYXZpZ2F0aW9uLmdvUmlnaHRcblx0fTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5jb250cm9sbGVyKCdXZWxjb21lQ3RybCcsIGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCBzZWxlY3RMaWJyYXJ5LCBjcmVhdGVMaWJyYXJ5LCBlbnZpcm9ubWVudCwgdXNlcikge1xuXHR2YXIgY2xvc2VkID0gZmFsc2U7XG5cblx0dGhpcy5pc1Nob3dBdXRob3JpemF0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGF1dGhvcml6YXRpb24uaXNTaG93KCk7XG5cdH07XG5cdFxuXHR0aGlzLmlzU2hvd1NlbGVjdExpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gc2VsZWN0TGlicmFyeS5pc0F2YWlsYWJsZSgpICYmICFzZWxlY3RMaWJyYXJ5LmlzVXNlckxpYnJhcnkodXNlci5nZXRJZCgpKTtcblx0fTtcblxuXHR0aGlzLmlzU2hvd0NyZWF0ZUxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNTaG93QXV0aG9yaXphdGlvbigpICYmICFzZWxlY3RMaWJyYXJ5LmlzQXZhaWxhYmxlKCk7XG5cdH07XG5cblx0dGhpcy5pc1Nob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIWNsb3NlZCAmJiAodGhpcy5pc1Nob3dBdXRob3JpemF0aW9uKCkgfHwgdGhpcy5pc1Nob3dDcmVhdGVMaWJyYXJ5KCkgfHwgdGhpcy5pc1Nob3dTZWxlY3RMaWJyYXJ5KCkpO1xuXHR9O1xuXG5cdHRoaXMuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0TG9hZGVkKCk7XG5cdH07XG5cblx0dGhpcy5zaG93TG9naW5EaWFsb2cgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRob3JpemF0aW9uLnNob3coKTtcblx0fTtcblxuXHR0aGlzLnNob3dTZWxlY3RMaWJyYXJ5RGlhbG9nID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VsZWN0TGlicmFyeS5zaG93KCk7XG5cdH07XG5cblx0dGhpcy5zaG93Q3JlYXRlTGlicmFyeURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnkuc2hvdygpO1xuXHR9O1xuXG5cdHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcblx0XHRjbG9zZWQgPSB0cnVlO1xuXHR9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmRpcmVjdGl2ZSgndmJTZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXF1aXJlOiAnbmdNb2RlbCcsXG5cdFx0cmVzdHJpY3Q6ICdFJyxcbiAgICBcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0dGVtcGxhdGVVcmw6ICcvdWkvc2VsZWN0LmVqcycsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG9wdGlvbnM6ICc9Jyxcblx0XHRcdHZhbHVlOiAnQCcsXG5cdFx0XHRsYWJlbDogJ0AnXG5cdFx0fSxcblxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlcikge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRjb250cm9sbGVyLiRzZXRWaWV3VmFsdWUoaXRlbVtzY29wZS52YWx1ZV0pO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRyb2xsZXIuJG1vZGVsVmFsdWUgPT09IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdhcmNoaXZlJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIGFyY2hpdmUgPSB7fTtcblxuXHRhcmNoaXZlLnNlbmRFeHRlcm5hbFVSTCA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG5cdFx0cmV0dXJuIGRhdGEucG9zdENvdmVyKGV4dGVybmFsVVJMLCB0YWdzKTtcblx0fTtcblxuXHRyZXR1cm4gYXJjaGl2ZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjYWNoZScsIGZ1bmN0aW9uICgkcSwgJGxvZywgZGF0YSkge1xuXHR2YXIgY2FjaGUgPSB7fTtcblxuXHR2YXIgbGlicmFyeSA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IHt9O1xuXHR2YXIgYm9va3MgPSB7fTtcblx0dmFyIGltYWdlcyA9IHt9O1xuXG5cdGNhY2hlLmluaXQgPSBmdW5jdGlvbihsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGNvdmVycykge1xuXHRcdHZhciBsaWJyYXJ5TG9hZCA9IGxvYWRMaWJyYXJ5RGF0YShsaWJyYXJ5TW9kZWwpO1xuXHRcdHZhciBzZWN0aW9uc0xvYWQgPSBbXTtcblx0XHR2YXIgYm9va3NMb2FkID0gW107XG5cdFx0dmFyIGltYWdlc0xvYWQgPSBbXTtcblx0XHR2YXIgbW9kZWwsIGNvdmVySWQ7IC8vIGl0ZXJhdG9yc1xuXG5cdFx0Zm9yIChtb2RlbCBpbiBzZWN0aW9uTW9kZWxzKSB7XG5cdFx0XHRzZWN0aW9uc0xvYWQucHVzaChhZGRTZWN0aW9uKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChtb2RlbCBpbiBib29rTW9kZWxzKSB7XG5cdFx0XHRib29rc0xvYWQucHVzaChhZGRCb29rKG1vZGVsKSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb3ZlcklkIGluIGNvdmVycykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlQnlEdG8oY292ZXJzW2NvdmVySWRdKSk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb21pc2UgPSAkcS5hbGwoe1xuXHRcdFx0bGlicmFyeUNhY2hlOiBsaWJyYXJ5TG9hZCwgXG5cdFx0XHRzZWN0aW9uc0xvYWQ6ICRxLmFsbChzZWN0aW9uc0xvYWQpLCBcblx0XHRcdGJvb2tzTG9hZDogJHEuYWxsKGJvb2tzTG9hZCksXG5cdFx0XHRpbWFnZXNMb2FkOiAkcS5hbGwoaW1hZ2VzTG9hZClcblx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cdFx0XHRsaWJyYXJ5ID0gcmVzdWx0cy5saWJyYXJ5Q2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRjYWNoZS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpYnJhcnk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0U2VjdGlvbiA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihzZWN0aW9ucywgbW9kZWwsIGFkZFNlY3Rpb24pO1xuXHR9O1xuXG5cdGNhY2hlLmdldEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoYm9va3MsIG1vZGVsLCBhZGRCb29rKTtcblx0fTtcblxuXHRjYWNoZS5nZXRJbWFnZSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkdldHRlcihpbWFnZXMsIGlkLCBhZGRJbWFnZUJ5SWQpO1xuXHR9O1xuXG5cdHZhciBhZGRTZWN0aW9uID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoc2VjdGlvbnMsIG1vZGVsLCBsb2FkU2VjdGlvbkRhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uQWRkZXIoYm9va3MsIG1vZGVsLCBsb2FkQm9va0RhdGEpO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZUJ5SWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkYXRhLmdldENvdmVyKGlkKS50aGVuKGZ1bmN0aW9uIChjb3ZlckR0bykge1xuXHRcdFx0cmV0dXJuIGRhdGEubG9hZEltYWdlKGNvdmVyRHRvLnVybCkudGhlbihmdW5jdGlvbiAoaW1hZ2UpIHtcblx0XHRcdFx0cmV0dXJuIGFkZEltYWdlKGNvdmVyRHRvLCBpbWFnZSk7XG5cdFx0XHR9KTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgaWQ6JywgaWQpO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlQnlEdG8gPSBmdW5jdGlvbihjb3ZlckR0bykge1xuXHRcdHJldHVybiBkYXRhLmxvYWRJbWFnZShjb3ZlckR0by51cmwpLnRoZW4oZnVuY3Rpb24gKGltYWdlKSB7XG5cdFx0XHRyZXR1cm4gYWRkSW1hZ2UoY292ZXJEdG8sIGltYWdlKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2UgYnkgZHRvOicsIGNvdmVyRHRvLmlkKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBhZGRJbWFnZSA9IGZ1bmN0aW9uKGR0bywgaW1hZ2UpIHtcblx0XHR2YXIgbG9hZGVkQ2FjaGUgPSB7XG5cdFx0XHRkdG86IGR0byxcblx0XHRcdGltYWdlOiBpbWFnZVxuXHRcdH07XG5cblx0XHRpbWFnZXNbZHRvLmlkXSA9IGxvYWRlZENhY2hlO1xuXHRcdHJldHVybiBsb2FkZWRDYWNoZTtcblx0fTtcblxuXHR2YXIgY29tbW9uR2V0dGVyID0gZnVuY3Rpb24oZnJvbSwga2V5LCBhZGRGdW5jdGlvbikge1xuXHRcdHZhciByZXN1bHQgPSBmcm9tW2tleV07XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRyZXN1bHQgPSBhZGRGdW5jdGlvbihrZXkpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS53aGVuKHJlc3VsdCk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkFkZGVyID0gZnVuY3Rpb24od2hlcmUsIHdoYXQsIGxvYWRlcikge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVt3aGF0XSA9IGxvYWRlZENhY2hlO1xuXG5cdFx0XHRyZXR1cm4gbG9hZGVkQ2FjaGU7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZExpYnJhcnlEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2xpYnJhcmllcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qc29uJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBsb2FkU2VjdGlvbkRhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovc2VjdGlvbnMve21vZGVsfS8nLnJlcGxhY2UoJ3ttb2RlbH0nLCBtb2RlbCk7XG4gICAgICAgIHZhciBtb2RlbFVybCA9IHBhdGggKyAnbW9kZWwuanMnO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcbiAgICAgICAgdmFyIGRhdGFVcmwgPSBwYXRoICsgJ2RhdGEuanNvbic7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBkYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksIFxuICAgICAgICBcdG1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShtYXBVcmwpLCBcbiAgICAgICAgXHRkYXRhOiBkYXRhLmdldERhdGEoZGF0YVVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRCb29rRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9ib29rcy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgYnVtcE1hcFVybCA9IHBhdGggKyAnYnVtcF9tYXAuanBnJztcbiAgICAgICAgdmFyIHNwZWN1bGFyTWFwVXJsID0gcGF0aCArICdzcGVjdWxhcl9tYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IGRhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSxcbiAgICAgICAgXHRtYXBJbWFnZTogZGF0YS5sb2FkSW1hZ2UobWFwVXJsKS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0XHQkbG9nLmVycm9yKCdDYWNoZTogRXJyb3IgbG9hZGluZyBib29rIG1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRidW1wTWFwSW1hZ2U6IGRhdGEubG9hZEltYWdlKGJ1bXBNYXBVcmwpLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXHRcdCRsb2cuZXJyb3IoJ0NhY2hlOiBFcnJvciBsb2FkaW5nIGJvb2sgYnVtcE1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KSxcbiAgICAgICAgXHRzcGVjdWxhck1hcEltYWdlOiBkYXRhLmxvYWRJbWFnZShzcGVjdWxhck1hcFVybCkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICBcdFx0JGxvZy5lcnJvcignQ2FjaGU6IEVycm9yIGxvYWRpbmcgYm9vayBzcGVjdWxhck1hcDonLCBtb2RlbCk7XG4gICAgICAgIFx0XHRyZXR1cm4gbnVsbDtcbiAgICAgICAgXHR9KVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRyZXR1cm4gY2FjaGU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnY2FtZXJhJywgZnVuY3Rpb24gKENhbWVyYU9iamVjdCkge1xuXHR2YXIgY2FtZXJhID0ge1xuXHRcdEhFSUdUSDogMS41LFxuXHRcdG9iamVjdDogbmV3IENhbWVyYU9iamVjdCgpLFxuXHRcdHNldFBhcmVudDogZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0XHRwYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHR9LFxuXHRcdGdldFBvc2l0aW9uOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm9iamVjdC5wb3NpdGlvbjtcblx0XHR9XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHRcdFxuXHRcdGNhbWVyYS5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIHdpZHRoIC8gaGVpZ2h0LCAwLjAxLCA1MCk7XG5cdFx0Y2FtZXJhLm9iamVjdC5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIGNhbWVyYS5IRUlHVEgsIDApO1xuXHRcdGNhbWVyYS5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHRjYW1lcmEub2JqZWN0LmFkZChjYW5kbGUpO1xuXG5cdFx0Y2FtZXJhLm9iamVjdC5hZGQoY2FtZXJhLmNhbWVyYSk7XG5cdH07XG5cblx0Y2FtZXJhLnJvdGF0ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0XHR2YXIgbmV3WCA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnggKyB5ICogMC4wMDAxIHx8IDA7XG5cdFx0dmFyIG5ld1kgPSB0aGlzLm9iamVjdC5yb3RhdGlvbi55ICsgeCAqIDAuMDAwMSB8fCAwO1xuXG5cdFx0aWYobmV3WCA8IDEuNTcgJiYgbmV3WCA+IC0xLjU3KSB7XHRcblx0XHRcdHRoaXMub2JqZWN0LnJvdGF0aW9uLnggPSBuZXdYO1xuXHRcdH1cblxuXHRcdHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgPSBuZXdZO1xuXHR9O1xuXG5cdGNhbWVyYS5nbyA9IGZ1bmN0aW9uKHNwZWVkKSB7XG5cdFx0dmFyIGRpcmVjdGlvbiA9IHRoaXMuZ2V0VmVjdG9yKCk7XG5cdFx0dmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5vYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRuZXdQb3NpdGlvbi5hZGQoZGlyZWN0aW9uLm11bHRpcGx5U2NhbGFyKHNwZWVkKSk7XG5cblx0XHR0aGlzLm9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKTtcblx0fTtcblxuXHRjYW1lcmEuZ2V0VmVjdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIC0xKTtcblxuXHRcdHJldHVybiB2ZWN0b3IuYXBwbHlFdWxlcih0aGlzLm9iamVjdC5yb3RhdGlvbik7XG5cdH07XG5cblx0aW5pdCgpO1xuXG5cdHJldHVybiBjYW1lcmE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4vKiBcbiAqIGNvbnRyb2xzLmpzIGlzIGEgc2VydmljZSBmb3IgcHJvY2Vzc2luZyBub3QgVUkobWVudXMpIGV2ZW50cyBcbiAqIGxpa2UgbW91c2UsIGtleWJvYXJkLCB0b3VjaCBvciBnZXN0dXJlcy5cbiAqXG4gKiBUT0RPOiByZW1vdmUgYWxsIGJ1c2luZXMgbG9naWMgZnJvbSB0aGVyZSBhbmQgbGVhdmUgb25seVxuICogZXZlbnRzIGZ1bmN0aW9uYWxpdHkgdG8gbWFrZSBpdCBtb3JlIHNpbWlsYXIgdG8gdXN1YWwgY29udHJvbGxlclxuICovXG4uZmFjdG9yeSgnY29udHJvbHMnLCBmdW5jdGlvbiAoJHEsICRsb2csICRyb290U2NvcGUsIFNlbGVjdG9yTWV0YSwgQm9va09iamVjdCwgU2hlbGZPYmplY3QsIFNlY3Rpb25PYmplY3QsIGNhbWVyYSwgbmF2aWdhdGlvbiwgZW52aXJvbm1lbnQsIG1vdXNlLCBzZWxlY3RvciwgcHJldmlldywgYmxvY2ssIHRvb2xzKSB7XG5cdHZhciBjb250cm9scyA9IHt9O1xuXG5cdGNvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRjb250cm9scy5pbml0TGlzdGVuZXJzKCk7XG5cdH07XG5cblx0Y29udHJvbHMuaW5pdExpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGNvbnRyb2xzLm9uTW91c2VEb3duLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGNvbnRyb2xzLm9uTW91c2VVcCwgZmFsc2UpO1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGNvbnRyb2xzLm9uTW91c2VNb3ZlLCBmYWxzZSk7XHRcblx0XHRkb2N1bWVudC5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24oKSB7cmV0dXJuIGZhbHNlO307XG5cdH07XG5cblx0Y29udHJvbHMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIXByZXZpZXcuaXNBY3RpdmUoKSkge1xuXHRcdFx0aWYobW91c2VbM10pIHtcblx0XHRcdFx0Y2FtZXJhLnJvdGF0ZShtb3VzZS5sb25nWCwgbW91c2UubG9uZ1kpO1xuXHRcdFx0fVxuXHRcdFx0aWYobW91c2VbMV0gJiYgbW91c2VbM10pIHtcblx0XHRcdFx0Y2FtZXJhLmdvKG5hdmlnYXRpb24uQlVUVE9OU19HT19TUEVFRCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnRyb2xzLm9uTW91c2VEb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS5kb3duKGV2ZW50KTsgXG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmIG1vdXNlWzFdICYmICFtb3VzZVszXSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRjb250cm9scy5zZWxlY3RPYmplY3QoKTtcblxuXHRcdFx0aWYoc2VsZWN0b3IucGxhY2luZykge1xuXHRcdFx0XHR0b29scy5wbGFjZSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCgpO1xuXHRcdFx0fVxuXG5cdFx0XHQkcm9vdFNjb3BlLiRhcHBseSgpO1xuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5vbk1vdXNlVXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdG1vdXNlLnVwKGV2ZW50KTtcblx0XHRcblx0XHRpZihldmVudC53aGljaCA9PT0gMSAmJiAhcHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRpZihzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSkge1xuXHRcdFx0XHR2YXIgb2JqID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblxuXHRcdFx0XHRpZihvYmogJiYgb2JqLmNoYW5nZWQpIHtcblx0XHRcdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdFx0XHRvYmouc2F2ZSgpLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdG9iai5yb2xsYmFjaygpO1xuXHRcdFx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRjb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UubW92ZShldmVudCk7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmICFwcmV2aWV3LmlzQWN0aXZlKCkpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmKG1vdXNlWzFdICYmICFtb3VzZVszXSkge1x0XHRcblx0XHRcdFx0Y29udHJvbHMubW92ZU9iamVjdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29udHJvbHMuc2VsZWN0T2JqZWN0KCk7XG5cdFx0XHRcdCRyb290U2NvcGUuJGFwcGx5KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vKioqKlxuXG5cdGNvbnRyb2xzLnNlbGVjdE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRvYmplY3Q7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpICYmIGVudmlyb25tZW50LmxpYnJhcnkpIHtcblx0XHRcdC8vVE9ETzogb3B0aW1pemVcblx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW0Jvb2tPYmplY3RdKTtcblx0XHRcdGlmKCFpbnRlcnNlY3RlZCkge1xuXHRcdFx0XHRpbnRlcnNlY3RlZCA9IG1vdXNlLmdldEludGVyc2VjdGVkKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIHRydWUsIFtTaGVsZk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NlY3Rpb25PYmplY3RdKTtcblx0XHRcdH1cblx0XHRcdGlmKGludGVyc2VjdGVkKSB7XG5cdFx0XHRcdG9iamVjdCA9IGludGVyc2VjdGVkLm9iamVjdDtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0b3IuZm9jdXMobmV3IFNlbGVjdG9yTWV0YShvYmplY3QpKTtcblx0XHR9XG5cdH07XG5cblx0Y29udHJvbHMubW92ZU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtb3VzZVZlY3Rvcjtcblx0XHR2YXIgbmV3UG9zaXRpb247XG5cdFx0dmFyIHBhcmVudDtcblx0XHR2YXIgc2VsZWN0ZWRPYmplY3Q7XG5cblx0XHRpZihzZWxlY3Rvci5pc1NlbGVjdGVkRWRpdGFibGUoKSkge1xuXHRcdFx0c2VsZWN0ZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCgpO1xuXG5cdFx0XHRpZihzZWxlY3RlZE9iamVjdCkge1xuXHRcdFx0XHRtb3VzZVZlY3RvciA9IGNhbWVyYS5nZXRWZWN0b3IoKTtcdFxuXHRcdFx0XHRuZXdQb3NpdGlvbiA9IHNlbGVjdGVkT2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XHRcdHBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblx0XHRcdFx0cGFyZW50LmxvY2FsVG9Xb3JsZChuZXdQb3NpdGlvbik7XG5cblx0XHRcdFx0bmV3UG9zaXRpb24ueCAtPSAobW91c2VWZWN0b3IueiAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueCAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXHRcdFx0XHRuZXdQb3NpdGlvbi56IC09ICgtbW91c2VWZWN0b3IueCAqIG1vdXNlLmRYICsgbW91c2VWZWN0b3IueiAqIG1vdXNlLmRZKSAqIDAuMDAzO1xuXG5cdFx0XHRcdHBhcmVudC53b3JsZFRvTG9jYWwobmV3UG9zaXRpb24pO1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGNvbnRyb2xzO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZGF0YScsIGZ1bmN0aW9uICgkaHR0cCwgJHEsICRsb2cpIHtcblx0dmFyIGRhdGEgPSB7fTtcblxuXHRkYXRhLlRFWFRVUkVfUkVTT0xVVElPTiA9IDUxMjtcblx0ZGF0YS5DT1ZFUl9NQVhfWSA9IDM5NDtcblx0ZGF0YS5DT1ZFUl9GQUNFX1ggPSAyOTY7XG5cbiAgICBkYXRhLmxvYWRJbWFnZSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIFxuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSAnJzsgXG4gICAgICAgIGltZy5zcmMgPSB1cmw7XG4gICAgICAgIFxuICAgICAgICBpZihpbWcuY29tcGxldGUpIHtcbiAgICAgICAgICAgIGRlZmZlcmVkLnJlc29sdmUoaW1nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlOyBcbiAgICB9O1xuXG5cdGRhdGEuZ2V0Q292ZXIgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9jb3Zlci8nICsgaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG4gICAgZGF0YS5wb3N0Q292ZXIgPSBmdW5jdGlvbihleHRlcm5hbFVSTCwgdGFncykge1xuICAgIFx0dmFyIGRhdGEgPSB7XG4gICAgXHRcdHVybDogZXh0ZXJuYWxVUkwsXG4gICAgXHRcdHRhZ3M6IHRhZ3NcbiAgICBcdH07XG5cbiAgICBcdHJldHVybiAkaHR0cC5wb3N0KCcvY292ZXInLCBkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICBcdFx0cmV0dXJuIHJlcy5kYXRhO1xuICAgIFx0fSk7XG4gICAgfTtcblxuICAgIGRhdGEubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2F1dGgvbG9nb3V0Jyk7XG4gICAgfTtcblxuXHRkYXRhLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcicpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucHV0VXNlciA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy91c2VyJywgZHRvKTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZVVzZXIgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5kZWxldGUoJy91c2VyLycgKyBpZCk7XG5cdH07XG5cblx0ZGF0YS5nZXRVc2VyQm9va3MgPSBmdW5jdGlvbih1c2VySWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvZnJlZUJvb2tzLycgKyB1c2VySWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0cmV0dXJuIHJlcy5kYXRhO1xuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdEJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwLnBvc3QoJy9ib29rJywgYm9vaykudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0ZGF0YS5kZWxldGVCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAoe1xuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdHVybDogJy9ib29rLycgKyBpZFxuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEuZ2V0VUlEYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL29iai9kYXRhLmpzb24nKTtcblx0fTtcblxuXHRkYXRhLmdldExpYnJhcmllcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJpZXMnKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLmdldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyeS8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHRkYXRhLnBvc3RMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeU1vZGVsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbGlicmFyeS8nICsgbGlicmFyeU1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0ZGF0YS5nZXRTZWN0aW9ucyA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2VjdGlvbnMvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRGF0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NlY3Rpb24nLCBzZWN0aW9uRGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIFx0cmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHRkYXRhLmRlbGV0ZVNlY3Rpb24gPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cCh7XG5cdFx0XHRtZXRob2Q6ICdERUxFVEUnLFxuXHRcdFx0dXJsOiAnL3NlY3Rpb25zLycgKyBpZFxuXHRcdH0pO1xuXHR9O1xuXG5cdGRhdGEubG9hZEdlb21ldHJ5ID0gZnVuY3Rpb24obGluaykge1xuICAgICAgICB2YXIgZGVmZmVyZWQgPSAkcS5kZWZlcigpO1xuXHRcdHZhciBqc29uTG9hZGVyID0gbmV3IFRIUkVFLkpTT05Mb2FkZXIoKTtcblxuICAgICAgICAvL1RPRE86IGZvdW5kIG5vIHdheSB0byByZWplY3Rcblx0XHRqc29uTG9hZGVyLmxvYWQobGluaywgZnVuY3Rpb24gKGdlb21ldHJ5KSB7XG5cdFx0XHRnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcblx0XHRcdGRlZmZlcmVkLnJlc29sdmUoZ2VvbWV0cnkpO1xuXHRcdH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXG5cdGRhdGEuZ2V0RGF0YSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdGRhdGEucG9zdEZlZWRiYWNrID0gZnVuY3Rpb24oZHRvKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvZmVlZGJhY2snLCBkdG8pO1xuXHR9O1xuXG5cdGRhdGEuY29tbW9uID0gZGF0YS5nZXRVSURhdGEoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHQkbG9nLmVycm9yKCdkYXRhOiBsb2FkaW5nIGNvbW1vbiBlcnJvcicpO1xuXHR9KTtcblxuXHRyZXR1cm4gZGF0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdkaWFsb2cnLCBmdW5jdGlvbiAobmdEaWFsb2cpIHtcblx0dmFyIGRpYWxvZyA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdjb25maXJtRGlhbG9nJztcblx0dmFyIEVSUk9SID0gMTtcblx0dmFyIENPTkZJUk0gPSAyO1xuXHR2YXIgV0FSTklORyA9IDM7XG5cdHZhciBJTkZPID0gNDtcblxuXHR2YXIgaWNvbkNsYXNzTWFwID0ge307XG5cdGljb25DbGFzc01hcFtFUlJPUl0gPSAnZmEtdGltZXMtY2lyY2xlJztcblx0aWNvbkNsYXNzTWFwW0NPTkZJUk1dID0gJ2ZhLXF1ZXN0aW9uLWNpcmNsZSc7XG5cdGljb25DbGFzc01hcFtXQVJOSU5HXSA9ICdmYS1leGNsYW1hdGlvbi10cmlhbmdsZSc7XG5cdGljb25DbGFzc01hcFtJTkZPXSA9ICdmYS1pbmZvLWNpcmNsZSc7XG5cblx0ZGlhbG9nLm9wZW5FcnJvciA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgRVJST1IpO1xuXHR9O1xuXG5cdGRpYWxvZy5vcGVuQ29uZmlybSA9IGZ1bmN0aW9uKG1zZykge1xuXHRcdHJldHVybiBvcGVuRGlhbG9nKG1zZywgQ09ORklSTSwgdHJ1ZSk7XG5cdH07XG5cblx0ZGlhbG9nLm9wZW5XYXJuaW5nID0gZnVuY3Rpb24obXNnKSB7XG5cdFx0cmV0dXJuIG9wZW5EaWFsb2cobXNnLCBXQVJOSU5HKTtcblx0fTtcblxuXHRkaWFsb2cub3BlbkluZm8gPSBmdW5jdGlvbihtc2cpIHtcblx0XHRyZXR1cm4gb3BlbkRpYWxvZyhtc2csIElORk8pO1xuXHR9O1xuXG5cdHZhciBvcGVuRGlhbG9nID0gZnVuY3Rpb24obXNnLCB0eXBlLCBjYW5jZWxCdXR0b24pIHtcblx0XHRyZXR1cm4gbmdEaWFsb2cub3BlbkNvbmZpcm0oe1xuXHRcdFx0dGVtcGxhdGU6IFRFTVBMQVRFLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRtc2c6IG1zZyxcblx0XHRcdFx0aWNvbkNsYXNzOiBnZXRJY29uQ2xhc3ModHlwZSksXG5cdFx0XHRcdGNhbmNlbEJ1dHRvbjogY2FuY2VsQnV0dG9uXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGdldEljb25DbGFzcyA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRyZXR1cm4gaWNvbkNsYXNzTWFwW3R5cGVdO1xuXHR9O1xuXG5cdHJldHVybiBkaWFsb2c7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZW52aXJvbm1lbnQnLCBmdW5jdGlvbiAoJHEsICRsb2csICR3aW5kb3csIExpYnJhcnlPYmplY3QsIFNlY3Rpb25PYmplY3QsIEJvb2tPYmplY3QsIEJvb2tNYXRlcmlhbCwgZGF0YSwgY2FtZXJhLCBjYWNoZSkge1xuXHR2YXIgZW52aXJvbm1lbnQgPSB7fTtcblxuXHRlbnZpcm9ubWVudC5DTEVBUkFOQ0UgPSAwLjAwMTtcblx0ZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQgPSAnTElCUkFSWSc7XG5cdCBcblx0dmFyIGxpYnJhcnlEdG8gPSBudWxsO1xuXHR2YXIgc2VjdGlvbnMgPSBudWxsO1xuXHR2YXIgYm9va3MgPSBudWxsO1xuXHR2YXIgbG9hZGVkID0gZmFsc2U7XG5cblx0ZW52aXJvbm1lbnQuc2NlbmUgPSBudWxsO1xuXHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdGNsZWFyU2NlbmUoKTsgLy8gaW5pdHMgc29tZSBmaWVsZHNcblxuXHRcdHZhciBwcm9taXNlID0gZGF0YS5nZXRMaWJyYXJ5KGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHR2YXIgZGljdCA9IHBhcnNlTGlicmFyeUR0byhkdG8pO1xuXHRcdFx0XG5cdFx0XHRzZWN0aW9ucyA9IGRpY3Quc2VjdGlvbnM7XG5cdFx0XHRib29rcyA9IGRpY3QuYm9va3M7XG5cdFx0XHRsaWJyYXJ5RHRvID0gZHRvO1xuXG5cdFx0XHRyZXR1cm4gaW5pdENhY2hlKGxpYnJhcnlEdG8sIGRpY3Quc2VjdGlvbnMsIGRpY3QuYm9va3MpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0Y3JlYXRlTGlicmFyeShsaWJyYXJ5RHRvKTtcblx0XHRcdHJldHVybiBjcmVhdGVTZWN0aW9ucyhzZWN0aW9ucyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY3JlYXRlQm9va3MoYm9va3MpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ29Ub0xpYnJhcnkgPSBmdW5jdGlvbihpZCkge1xuXHRcdGlmKGlkKSAkd2luZG93LmxvY2F0aW9uID0gJy8nICsgaWQ7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRsb2FkZWQgPSB2YWx1ZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbG9hZGVkO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldEJvb2sgPSBmdW5jdGlvbihib29rSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChib29rcywgYm9va0lkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbklkKSB7XG5cdFx0cmV0dXJuIGdldERpY3RPYmplY3Qoc2VjdGlvbnMsIHNlY3Rpb25JZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0U2hlbGYgPSBmdW5jdGlvbihzZWN0aW9uSWQsIHNoZWxmSWQpIHtcblx0XHR2YXIgc2VjdGlvbiA9IGVudmlyb25tZW50LmdldFNlY3Rpb24oc2VjdGlvbklkKTtcblx0XHR2YXIgc2hlbGYgPSBzZWN0aW9uICYmIHNlY3Rpb24uc2hlbHZlc1tzaGVsZklkXTtcblxuXHRcdHJldHVybiBzaGVsZjtcblx0fTtcblxuXHR2YXIgZ2V0RGljdE9iamVjdCA9IGZ1bmN0aW9uKGRpY3QsIG9iamVjdElkKSB7XG5cdFx0dmFyIGRpY3RJdGVtID0gZGljdFtvYmplY3RJZF07XG5cdFx0dmFyIGRpY3RPYmplY3QgPSBkaWN0SXRlbSAmJiBkaWN0SXRlbS5vYmo7XG5cblx0XHRyZXR1cm4gZGljdE9iamVjdDtcblx0fTtcblxuXHRlbnZpcm9ubWVudC51cGRhdGVTZWN0aW9uID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cblx0XHRpZihkdG8ubGlicmFyeUlkID09IGVudmlyb25tZW50LmxpYnJhcnkuaWQpIHtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oZHRvLmlkKTtcblx0XHRcdHByb21pc2UgPSBjcmVhdGVTZWN0aW9uKGR0byk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oZHRvLmlkKTtcblx0XHRcdHByb21pc2UgPSAkcS53aGVuKGR0byk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XHRcblx0fTtcblxuXHRlbnZpcm9ubWVudC51cGRhdGVCb29rID0gZnVuY3Rpb24oZHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGR0byk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9IGNyZWF0ZUJvb2soZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayhkdG8uaWQpO1xuXHRcdFx0cHJvbWlzZSA9ICRxLndoZW4odHJ1ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KGJvb2tzLCBpZCk7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlU2VjdGlvbiA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmVtb3ZlT2JqZWN0KHNlY3Rpb25zLCBpZCk7XG5cdH07XG5cblx0dmFyIHJlbW92ZU9iamVjdCA9IGZ1bmN0aW9uKGRpY3QsIGtleSkge1xuXHRcdHZhciBkaWN0SXRlbSA9IGRpY3Rba2V5XTtcblx0XHRpZihkaWN0SXRlbSkge1xuXHRcdFx0ZGVsZXRlIGRpY3Rba2V5XTtcblx0XHRcdFxuXHRcdFx0aWYoZGljdEl0ZW0ub2JqKSB7XG5cdFx0XHRcdGRpY3RJdGVtLm9iai5zZXRQYXJlbnQobnVsbCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0Q2FjaGUgPSBmdW5jdGlvbihsaWJyYXJ5RHRvLCBzZWN0aW9uc0RpY3QsIGJvb2tzRGljdCkge1xuXHRcdHZhciBsaWJyYXJ5TW9kZWwgPSBsaWJyYXJ5RHRvLm1vZGVsO1xuXHRcdHZhciBzZWN0aW9uTW9kZWxzID0ge307XG5cdFx0dmFyIGJvb2tNb2RlbHMgPSB7fTtcblx0XHR2YXIgaW1hZ2VVcmxzID0ge307XG5cblx0XHRmb3IgKHZhciBzZWN0aW9uSWQgaW4gc2VjdGlvbnNEaWN0KSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IHNlY3Rpb25zRGljdFtzZWN0aW9uSWRdLmR0bztcblx0XHRcdHNlY3Rpb25Nb2RlbHNbc2VjdGlvbkR0by5tb2RlbF0gPSB0cnVlO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGJvb2tJZCBpbiBib29rc0RpY3QpIHtcblx0XHRcdHZhciBib29rRHRvID0gYm9va3NEaWN0W2Jvb2tJZF0uZHRvO1xuXHRcdFx0Ym9va01vZGVsc1tib29rRHRvLm1vZGVsXSA9IHRydWU7XG5cblx0XHRcdGlmKGJvb2tEdG8uY292ZXIpIHtcblx0XHRcdFx0aW1hZ2VVcmxzW2Jvb2tEdG8uY292ZXIuaWRdID0gYm9va0R0by5jb3Zlcjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2FjaGUuaW5pdChsaWJyYXJ5TW9kZWwsIHNlY3Rpb25Nb2RlbHMsIGJvb2tNb2RlbHMsIGltYWdlVXJscyk7XG5cdH07XG5cblx0dmFyIGNsZWFyU2NlbmUgPSBmdW5jdGlvbigpIHtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblx0XHRzZWN0aW9ucyA9IHt9O1xuXHRcdGJvb2tzID0ge307XG5cblx0XHR3aGlsZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZihlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UoKTtcblx0XHRcdH1cblx0XHRcdGVudmlyb25tZW50LnNjZW5lLnJlbW92ZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBwYXJzZUxpYnJhcnlEdG8gPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHNlY3Rpb25zOiB7fSxcblx0XHRcdGJvb2tzOiB7fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblx0XHRcdHJlc3VsdC5zZWN0aW9uc1tzZWN0aW9uRHRvLmlkXSA9IHtkdG86IHNlY3Rpb25EdG99O1xuXG5cdFx0XHRmb3IodmFyIGJvb2tJbmRleCA9IHNlY3Rpb25EdG8uYm9va3MubGVuZ3RoIC0gMTsgYm9va0luZGV4ID49IDA7IGJvb2tJbmRleC0tKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gc2VjdGlvbkR0by5ib29rc1tib29rSW5kZXhdO1xuXHRcdFx0XHRyZXN1bHQuYm9va3NbYm9va0R0by5pZF0gPSB7ZHRvOiBib29rRHRvfTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHNlY3Rpb25EdG8uYm9va3M7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGxpYnJhcnlEdG8uc2VjdGlvbnM7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0XHR2YXIgbGlicmFyeUNhY2hlID0gY2FjaGUuZ2V0TGlicmFyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGxpYnJhcnlDYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0bGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGxpYnJhcnlDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdGNhbWVyYS5zZXRQYXJlbnQobGlicmFyeSk7XG5cblx0XHRlbnZpcm9ubWVudC5zY2VuZS5hZGQobGlicmFyeSk7XG5cdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IGxpYnJhcnk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnNEaWN0KSB7XG5cdFx0cmV0dXJuIGNyZWF0ZU9iamVjdHMoc2VjdGlvbnNEaWN0LCBjcmVhdGVTZWN0aW9uKTtcblx0fTtcblxuXHR2YXIgY3JlYXRlQm9va3MgPSBmdW5jdGlvbihib29rc0RpY3QpIHtcblx0XHRyZXR1cm4gY3JlYXRlT2JqZWN0cyhib29rc0RpY3QsIGNyZWF0ZUJvb2spO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVPYmplY3RzID0gZnVuY3Rpb24oZGljdCwgZmFjdG9yeSkge1xuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvcihrZXkgaW4gZGljdCkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKGZhY3RvcnkoZGljdFtrZXldLmR0bykpO1xuXHRcdH1cblxuXHRcdHJldHVybiAkcS5hbGwocmVzdWx0cyk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRHRvKSB7XG5cdFx0dmFyIHByb21pc2UgPSBjYWNoZS5nZXRTZWN0aW9uKHNlY3Rpb25EdG8ubW9kZWwpLnRoZW4oZnVuY3Rpb24gKHNlY3Rpb25DYWNoZSkge1xuXHQgICAgICAgIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoc2VjdGlvbkNhY2hlLm1hcEltYWdlKTtcblx0ICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe21hcDogdGV4dHVyZX0pO1xuXHQgICAgICAgIHZhciBzZWN0aW9uO1xuXG5cdCAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdCAgICAgICAgc2VjdGlvbkR0by5kYXRhID0gc2VjdGlvbkNhY2hlLmRhdGE7XG5cblx0ICAgICAgICBzZWN0aW9uID0gbmV3IFNlY3Rpb25PYmplY3Qoc2VjdGlvbkR0bywgc2VjdGlvbkNhY2hlLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHRcdGVudmlyb25tZW50LmxpYnJhcnkuYWRkKHNlY3Rpb24pO1xuXHRcdFx0YWRkVG9EaWN0KHNlY3Rpb25zLCBzZWN0aW9uKTtcblxuXHRcdFx0cmV0dXJuIHNlY3Rpb25EdG87XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgY3JlYXRlQm9vayA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHR2YXIgcHJvbWlzZXMgPSB7fTtcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdHByb21pc2VzLmJvb2tDYWNoZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCk7XG5cdFx0aWYoYm9va0R0by5jb3ZlcklkKSB7XG5cdFx0XHRwcm9taXNlcy5jb3ZlckNhY2hlID0gY2FjaGUuZ2V0SW1hZ2UoYm9va0R0by5jb3ZlcklkKTtcblx0XHR9XG5cblx0XHRwcm9taXNlID0gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uIChyZXN1bHRzKSB7XG5cdFx0XHR2YXIgYm9va0NhY2hlID0gcmVzdWx0cy5ib29rQ2FjaGU7XG5cdFx0XHR2YXIgY292ZXJNYXBJbWFnZSA9IHJlc3VsdHMuY292ZXJDYWNoZSAmJiByZXN1bHRzLmNvdmVyQ2FjaGUuaW1hZ2U7XG5cdFx0XHR2YXIgbWF0ZXJpYWwgPSBuZXcgQm9va01hdGVyaWFsKGJvb2tDYWNoZS5tYXBJbWFnZSwgYm9va0NhY2hlLmJ1bXBNYXBJbWFnZSwgYm9va0NhY2hlLnNwZWN1bGFyTWFwSW1hZ2UsIGNvdmVyTWFwSW1hZ2UpO1xuXHRcdFx0dmFyIGJvb2sgPSBuZXcgQm9va09iamVjdChib29rRHRvLCBib29rQ2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuXHRcdFx0YWRkVG9EaWN0KGJvb2tzLCBib29rKTtcblx0XHRcdHBsYWNlQm9va09uU2hlbGYoYm9vayk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgYWRkVG9EaWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqKSB7XG5cdFx0dmFyIGRpY3RJdGVtID0ge1xuXHRcdFx0ZHRvOiBvYmouZGF0YU9iamVjdCxcblx0XHRcdG9iajogb2JqXG5cdFx0fTtcblxuXHRcdGRpY3Rbb2JqLmlkXSA9IGRpY3RJdGVtO1xuXHR9O1xuXG5cdHZhciBnZXRCb29rU2hlbGYgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0cmV0dXJuIGVudmlyb25tZW50LmdldFNoZWxmKGJvb2tEdG8uc2VjdGlvbklkLCBib29rRHRvLnNoZWxmSWQpO1xuXHR9O1xuXG5cdHZhciBwbGFjZUJvb2tPblNoZWxmID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHZhciBzaGVsZiA9IGdldEJvb2tTaGVsZihib29rLmRhdGFPYmplY3QpO1xuXHRcdHNoZWxmLmFkZChib29rKTtcblx0fTtcblxuXHRyZXR1cm4gZW52aXJvbm1lbnQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnbWFpbicsIGZ1bmN0aW9uICgkbG9nLCAkcSwgY2FtZXJhLCBjb250cm9scywgdXNlciwgZW52aXJvbm1lbnQsIHRvb2xzLCBuYXZpZ2F0aW9uLCB1c2VyRGF0YSwgYmxvY2ssIGxvY2F0b3IpIHtcdFxuXHR2YXIgY2FudmFzO1xuXHR2YXIgcmVuZGVyZXI7XG5cdFxuXHR2YXIgbWFpbiA9IHt9O1xuXG5cdG1haW4uc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHRpZihEZXRlY3Rvci53ZWJnbCkge1xuXHRcdFx0aW5pdCgpO1xuXHRcdFx0Y29udHJvbHMuaW5pdCgpO1xuXG5cdFx0XHRzdGFydFJlbmRlckxvb3AoKTtcblxuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHR1c2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuICRxLmFsbChbZW52aXJvbm1lbnQubG9hZExpYnJhcnkodXNlci5nZXRMaWJyYXJ5KCkgfHwgMSksIHVzZXJEYXRhLmxvYWQoKV0pO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0XHQvL1RPRE86IHNob3cgZXJyb3IgbWVzc2FnZSAgXG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0bG9jYXRvci5jZW50ZXJPYmplY3QoY2FtZXJhLm9iamVjdCk7XG5cdFx0XHRcdGVudmlyb25tZW50LnNldExvYWRlZCh0cnVlKTtcblx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdH0pO1x0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHdpblJlc2l6ZTtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZW52aXJvbm1lbnQuTElCUkFSWV9DQU5WQVNfSUQpO1xuXHRcdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2NhbnZhczogY2FudmFzID8gY2FudmFzIDogdW5kZWZpbmVkLCBhbnRpYWxpYXM6IHRydWV9KTtcblx0XHRyZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdHdpblJlc2l6ZSA9IG5ldyBUSFJFRXguV2luZG93UmVzaXplKHJlbmRlcmVyLCBjYW1lcmEuY2FtZXJhKTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZygweDAwMDAwMCwgNCwgNyk7XG5cdH07XG5cblx0dmFyIHN0YXJ0UmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGFydFJlbmRlckxvb3ApO1xuXG5cdFx0Y29udHJvbHMudXBkYXRlKCk7XG5cdFx0bmF2aWdhdGlvbi51cGRhdGUoKTtcblx0XHR0b29scy51cGRhdGUoKTtcblx0XHRcblx0XHRyZW5kZXJlci5yZW5kZXIoZW52aXJvbm1lbnQuc2NlbmUsIGNhbWVyYS5jYW1lcmEpO1xuXHR9O1xuXG5cdHJldHVybiBtYWluO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ21vdXNlJywgZnVuY3Rpb24gKGNhbWVyYSwgZW52aXJvbm1lbnQpIHtcblx0dmFyIG1vdXNlID0ge307XG5cblx0dmFyIGdldFdpZHRoID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuXHR9O1xuXG5cdHZhciBnZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9O1xuXG5cdHZhciB4ID0gbnVsbDtcblx0dmFyIHkgPSBudWxsO1xuXHRcblx0bW91c2UudGFyZ2V0ID0gbnVsbDtcblx0bW91c2UuZFggPSBudWxsO1xuXHRtb3VzZS5kWSA9IG51bGw7XG5cdG1vdXNlLmxvbmdYID0gbnVsbDtcblx0bW91c2UubG9uZ1kgPSBudWxsO1xuXG5cdG1vdXNlLmdldFRhcmdldCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRhcmdldDtcblx0fTtcblxuXHRtb3VzZS5kb3duID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSB0cnVlO1xuXHRcdFx0dGhpcy50YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cdFx0XHR4ID0gZXZlbnQuY2xpZW50WDtcblx0XHRcdHkgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0bW91c2UubG9uZ1ggPSBnZXRXaWR0aCgpICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gZ2V0SGVpZ2h0KCkgKiAwLjUgLSB5O1xuXHRcdH1cblx0fTtcblxuXHRtb3VzZS51cCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXNbZXZlbnQud2hpY2hdID0gZmFsc2U7XG5cdFx0XHQvLyBsaW51eCBjaHJvbWUgYnVnIGZpeCAod2hlbiBib3RoIGtleXMgcmVsZWFzZSB0aGVuIGJvdGggZXZlbnQud2hpY2ggZXF1YWwgMylcblx0XHRcdHRoaXNbMV0gPSBmYWxzZTsgXG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLm1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdG1vdXNlLmxvbmdYID0gZ2V0V2lkdGgoKSAqIDAuNSAtIHg7XG5cdFx0XHRtb3VzZS5sb25nWSA9IGdldEhlaWdodCgpICogMC41IC0geTtcblx0XHRcdG1vdXNlLmRYID0gZXZlbnQuY2xpZW50WCAtIHg7XG5cdFx0XHRtb3VzZS5kWSA9IGV2ZW50LmNsaWVudFkgLSB5O1xuXHRcdFx0eCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHR5ID0gZXZlbnQuY2xpZW50WTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UuaXNDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQuaWQgPT09IGVudmlyb25tZW50LkxJQlJBUllfQ0FOVkFTX0lEO1xuXHR9O1xuXG5cdG1vdXNlLmlzUG9ja2V0Qm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBmYWxzZTsgLy9UT0RPOiBzdHViXG5cdFx0Ly8gcmV0dXJuICEhKHRoaXMudGFyZ2V0ICYmIHRoaXMudGFyZ2V0LnBhcmVudE5vZGUgPT0gVUkubWVudS5pbnZlbnRvcnkuYm9va3MpO1xuXHR9O1xuXG5cdG1vdXNlLmdldEludGVyc2VjdGVkID0gZnVuY3Rpb24ob2JqZWN0cywgcmVjdXJzaXZlLCBzZWFyY2hGb3IpIHtcblx0XHR2YXJcblx0XHRcdHZlY3Rvcixcblx0XHRcdHJheWNhc3Rlcixcblx0XHRcdGludGVyc2VjdHMsXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdHJlc3VsdCxcblx0XHRcdGksIGo7XG5cblx0XHRyZXN1bHQgPSBudWxsO1xuXHRcdHZlY3RvciA9IGdldFZlY3RvcigpO1xuXHRcdHJheWNhc3RlciA9IG5ldyBUSFJFRS5SYXljYXN0ZXIoY2FtZXJhLmdldFBvc2l0aW9uKCksIHZlY3Rvcik7XG5cdFx0aW50ZXJzZWN0cyA9IHJheWNhc3Rlci5pbnRlcnNlY3RPYmplY3RzKG9iamVjdHMsIHJlY3Vyc2l2ZSk7XG5cblx0XHRpZihzZWFyY2hGb3IpIHtcblx0XHRcdGlmKGludGVyc2VjdHMubGVuZ3RoKSB7XG5cdFx0XHRcdGZvcihpID0gMDsgaSA8IGludGVyc2VjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpbnRlcnNlY3RlZCA9IGludGVyc2VjdHNbaV07XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Zm9yKGogPSBzZWFyY2hGb3IubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcblx0XHRcdFx0XHRcdGlmKGludGVyc2VjdGVkLm9iamVjdCBpbnN0YW5jZW9mIHNlYXJjaEZvcltqXSkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBpbnRlcnNlY3RlZDtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYocmVzdWx0KSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IGludGVyc2VjdHM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgZ2V0VmVjdG9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHByb2plY3RvciA9IG5ldyBUSFJFRS5Qcm9qZWN0b3IoKTtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKHggLyBnZXRXaWR0aCgpKSAqIDIgLSAxLCAtICh5IC8gZ2V0SGVpZ2h0KCkpICogMiArIDEsIDAuNSk7XG5cdFx0cHJvamVjdG9yLnVucHJvamVjdFZlY3Rvcih2ZWN0b3IsIGNhbWVyYS5jYW1lcmEpO1xuXHRcblx0XHRyZXR1cm4gdmVjdG9yLnN1YihjYW1lcmEuZ2V0UG9zaXRpb24oKSkubm9ybWFsaXplKCk7XG5cdH07XG5cblx0cmV0dXJuIG1vdXNlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ25hdmlnYXRpb24nLCBmdW5jdGlvbiAoY2FtZXJhKSB7XG5cdHZhciBuYXZpZ2F0aW9uID0ge307XG5cblx0bmF2aWdhdGlvbi5CVVRUT05TX1JPVEFURV9TUEVFRCA9IDEwMDtcblx0bmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEID0gMC4wMjtcblxuXHR2YXIgc3RhdGUgPSB7XG5cdFx0Zm9yd2FyZDogZmFsc2UsXG5cdFx0YmFja3dhcmQ6IGZhbHNlLFxuXHRcdGxlZnQ6IGZhbHNlLFxuXHRcdHJpZ2h0OiBmYWxzZVx0XHRcdFxuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29TdG9wID0gZnVuY3Rpb24oKSB7XG5cdFx0c3RhdGUuZm9yd2FyZCA9IGZhbHNlO1xuXHRcdHN0YXRlLmJhY2t3YXJkID0gZmFsc2U7XG5cdFx0c3RhdGUubGVmdCA9IGZhbHNlO1xuXHRcdHN0YXRlLnJpZ2h0ID0gZmFsc2U7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5mb3J3YXJkID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvQmFja3dhcmQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5iYWNrd2FyZCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0xlZnQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5sZWZ0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZS5yaWdodCA9IHRydWU7XG5cdH07XG5cblx0bmF2aWdhdGlvbi51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRpZihzdGF0ZS5mb3J3YXJkKSB7XG5cdFx0XHRjYW1lcmEuZ28obmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUuYmFja3dhcmQpIHtcblx0XHRcdGNhbWVyYS5nbygtbmF2aWdhdGlvbi5CVVRUT05TX0dPX1NQRUVEKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUubGVmdCkge1xuXHRcdFx0Y2FtZXJhLnJvdGF0ZShuYXZpZ2F0aW9uLkJVVFRPTlNfUk9UQVRFX1NQRUVELCAwKTtcblx0XHR9IGVsc2UgaWYoc3RhdGUucmlnaHQpIHtcblx0XHRcdGNhbWVyYS5yb3RhdGUoLW5hdmlnYXRpb24uQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCd1c2VyJywgZnVuY3Rpb24gKGRhdGEpIHtcblx0dmFyIHVzZXIgPSB7fTtcblxuXHR2YXIgbG9hZGVkID0gZmFsc2U7XG5cdHZhciBfZGF0YU9iamVjdCA9IG51bGw7XG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblxuXHR1c2VyLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIGRhdGEuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChkdG8pO1xuXHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblx0XHR9KTtcblx0fTtcblxuXHR1c2VyLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBkYXRhLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHVzZXIubG9hZCgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHVzZXIuc2V0RGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRfZGF0YU9iamVjdCA9IGRhdGFPYmplY3Q7XG5cdH07XG5cblx0dXNlci5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxpYnJhcnk7XG5cdH07XG5cblx0dXNlci5nZXROYW1lID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0Lm5hbWU7XG5cdH07XG5cblx0dXNlci5nZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5lbWFpbDtcblx0fTtcblxuXHR1c2VyLnNldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRsaWJyYXJ5SWQgPSBsaWJyYXJ5SWQgfHwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnN1YnN0cmluZygxKTtcblx0XHRsaWJyYXJ5ID0gTnVtYmVyKGxpYnJhcnlJZCk7XG5cdH07XG5cblx0dXNlci5nZXRJZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5pZDtcblx0fTtcblxuXHR1c2VyLmlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiAhdXNlci5pc1RlbXBvcmFyeSgpO1xuXHR9O1xuXG5cdHVzZXIuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gbG9hZGVkO1xuXHR9O1xuXG5cdHVzZXIuaXNUZW1wb3JhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC50ZW1wb3JhcnkpO1xuXHR9O1xuXG5cdHVzZXIuaXNHb29nbGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5nb29nbGVJZCk7XG5cdH07XG5cblx0dXNlci5pc1R3aXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC50d2l0dGVySWQpO1xuXHR9O1xuXG5cdHVzZXIuaXNGYWNlYm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0ICYmIF9kYXRhT2JqZWN0LmZhY2Vib29rSWQpO1xuXHR9O1xuXG5cdHVzZXIuaXNWa29udGFrdGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC52a29udGFrdGVJZCk7XG5cdH07XG5cblx0cmV0dXJuIHVzZXI7XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCb29rTWF0ZXJpYWwnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBCb29rTWF0ZXJpYWwgPSBmdW5jdGlvbihtYXBJbWFnZSwgYnVtcE1hcEltYWdlLCBzcGVjdWxhck1hcEltYWdlLCBjb3Zlck1hcEltYWdlKSB7XG5cdFx0dmFyIGRlZmluZXMgPSB7fTtcblx0XHR2YXIgdW5pZm9ybXM7XG5cdFx0dmFyIHBhcmFtZXRlcnM7XG5cbiAgICAgICAgdmFyIG1hcDtcbiAgICAgICAgdmFyIGJ1bXBNYXA7XG4gICAgICAgIHZhciBzcGVjdWxhck1hcDtcbiAgICAgICAgdmFyIGNvdmVyTWFwO1xuXHRcdFxuXHRcdHVuaWZvcm1zID0gVEhSRUUuVW5pZm9ybXNVdGlscy5tZXJnZShbXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5jb21tb24sXG5cdFx0XHRUSFJFRS5Vbmlmb3Jtc0xpYi5idW1wLFxuXHRcdFx0VEhSRUUuVW5pZm9ybXNMaWIuZm9nLFxuXHRcdFx0VEhSRUUuVW5pZm9ybXNMaWIubGlnaHRzXG5cdFx0XSk7XG5cblx0XHR1bmlmb3Jtcy5zaGluaW5lc3MgPSB7dHlwZTogJ2YnLCB2YWx1ZTogMzB9O1xuXHRcdGRlZmluZXMuUEhPTkcgPSB0cnVlO1xuXG5cdFx0aWYobWFwSW1hZ2UpIHtcblx0XHRcdG1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKG1hcEltYWdlKTtcblx0XHRcdG1hcC5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHR1bmlmb3Jtcy5tYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogbWFwfTtcblx0XHRcdHRoaXMubWFwID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYoYnVtcE1hcEltYWdlKSB7XG5cdFx0XHRidW1wTWFwID0gbmV3IFRIUkVFLlRleHR1cmUoYnVtcE1hcEltYWdlKTtcblx0XHRcdGJ1bXBNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuYnVtcE1hcCA9IHt0eXBlOiAndCcsIHZhbHVlOiBidW1wTWFwfTtcblx0XHRcdHVuaWZvcm1zLmJ1bXBTY2FsZS52YWx1ZSA9IDAuMDA1O1xuXHRcdFx0dGhpcy5idW1wTWFwID0gdHJ1ZTtcblx0XHR9XG5cdFx0aWYoc3BlY3VsYXJNYXBJbWFnZSkge1xuXHRcdFx0c3BlY3VsYXJNYXAgPSBuZXcgVEhSRUUuVGV4dHVyZShzcGVjdWxhck1hcEltYWdlKTtcblx0XHRcdHNwZWN1bGFyTWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRcdHVuaWZvcm1zLnNwZWN1bGFyID0ge3R5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigweDU1NTU1NSl9O1xuXHRcdFx0dW5pZm9ybXMuc3BlY3VsYXJNYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogc3BlY3VsYXJNYXB9O1xuXHRcdFx0dGhpcy5zcGVjdWxhck1hcCA9IHRydWU7XG5cdFx0fVxuICAgICAgICBpZihjb3Zlck1hcEltYWdlKSB7XG5cdFx0XHRjb3Zlck1hcCA9IG5ldyBUSFJFRS5UZXh0dXJlKGNvdmVyTWFwSW1hZ2UpO1xuXHRcdFx0Y292ZXJNYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0dW5pZm9ybXMuY292ZXJNYXAgPSB7dHlwZTogJ3QnLCB2YWx1ZTogY292ZXJNYXB9O1xuXHRcdFx0ZGVmaW5lcy5VU0VfQ09WRVIgPSB0cnVlO1xuICAgICAgICB9XG5cblx0XHRwYXJhbWV0ZXJzID0ge1xuXHRcdFx0dmVydGV4U2hhZGVyOiB2ZXJ0ZXhTaGFkZXIsXHRcblx0XHRcdGZyYWdtZW50U2hhZGVyOiBmcmFnbWVudFNoYWRlcixcblx0XHRcdHVuaWZvcm1zOiB1bmlmb3Jtcyxcblx0XHRcdGRlZmluZXM6IGRlZmluZXMsXG5cdFx0XHRsaWdodHM6IHRydWUsXG5cdFx0XHRmb2c6IHRydWVcblx0XHR9O1xuXG5cdFx0VEhSRUUuU2hhZGVyTWF0ZXJpYWwuY2FsbCh0aGlzLCBwYXJhbWV0ZXJzKTtcblx0fTtcblxuXHRCb29rTWF0ZXJpYWwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUSFJFRS5TaGFkZXJNYXRlcmlhbC5wcm90b3R5cGUpO1xuXG5cdEJvb2tNYXRlcmlhbC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUSFJFRS5Cb29rTWF0ZXJpYWw7XG5cblx0dmFyIHZlcnRleFNoYWRlciA9IFtcblx0XHQndmFyeWluZyB2ZWMzIHZWaWV3UG9zaXRpb247Jyxcblx0XHQndmFyeWluZyB2ZWMzIHZOb3JtYWw7JyxcblxuXHRcdFRIUkVFLlNoYWRlckNodW5rLm1hcF9wYXJzX3ZlcnRleCxcblx0XHRUSFJFRS5TaGFkZXJDaHVuay5saWdodHNfcGhvbmdfcGFyc192ZXJ0ZXgsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfcGFyc192ZXJ0ZXgsXG5cblx0XHQndm9pZCBtYWluKCkgeycsXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5tYXBfdmVydGV4LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuY29sb3JfdmVydGV4LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuZGVmYXVsdG5vcm1hbF92ZXJ0ZXgsXG5cdFx0XHQndk5vcm1hbCA9IG5vcm1hbGl6ZSh0cmFuc2Zvcm1lZE5vcm1hbCk7Jyxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLmRlZmF1bHRfdmVydGV4LFxuXHRcdFx0J3ZWaWV3UG9zaXRpb24gPSAtbXZQb3NpdGlvbi54eXo7Jyxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLndvcmxkcG9zX3ZlcnRleCxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLmxpZ2h0c19waG9uZ192ZXJ0ZXgsXG5cdFx0J30nXG5cdF0uam9pbignXFxuJyk7XG5cblx0dmFyIGZyYWdtZW50U2hhZGVyID0gW1xuXHRcdCd1bmlmb3JtIHZlYzMgZGlmZnVzZTsnLFxuXHRcdCd1bmlmb3JtIGZsb2F0IG9wYWNpdHk7JyxcblxuXHRcdCd1bmlmb3JtIHZlYzMgYW1iaWVudDsnLFxuXHRcdCd1bmlmb3JtIHZlYzMgZW1pc3NpdmU7Jyxcblx0XHQndW5pZm9ybSB2ZWMzIHNwZWN1bGFyOycsXG5cdFx0J3VuaWZvcm0gZmxvYXQgc2hpbmluZXNzOycsXG5cblx0XHQndW5pZm9ybSBzYW1wbGVyMkQgY292ZXJNYXA7JyxcblxuXHRcdFRIUkVFLlNoYWRlckNodW5rLmNvbG9yX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsubWFwX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuZm9nX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsubGlnaHRzX3Bob25nX3BhcnNfZnJhZ21lbnQsXG5cdFx0VEhSRUUuU2hhZGVyQ2h1bmsuYnVtcG1hcF9wYXJzX2ZyYWdtZW50LFxuXHRcdFRIUkVFLlNoYWRlckNodW5rLnNwZWN1bGFybWFwX3BhcnNfZnJhZ21lbnQsXG5cblx0XHQndm9pZCBtYWluKCkgeycsXG5cdFx0XHQndmVjNCB0ZXN0Y29sb3IgPSB2ZWM0KDEuMCwgMS4wLCAxLjAsIDEuMCk7Jyxcblx0XHRcdCdmbG9hdCBlcHMgPSAwLjAwNDsnLFxuXHRcdFx0J3ZlYzQgYmFzZUNvbG9yICA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcblxuXHRcdFx0JyNpZmRlZiBVU0VfQ09WRVInLFxuXHRcdCAgICBcdCd2ZWM0IGNvdmVyQ29sb3IgPSB0ZXh0dXJlMkQoY292ZXJNYXAsIHZVdiAqIHZlYzIoMi4zLCAxLjMpIC0gdmVjMigxLjMsIDAuMykpOycsXG5cdFx0XHQgICAgJ2lmKHZVdi55ID4gMC4yMyAmJiAodlV2LnggPiAwLjU3IHx8IChhbGwoZ3JlYXRlclRoYW5FcXVhbChiYXNlQ29sb3IsdGVzdGNvbG9yLWVwcykpICYmIGFsbChsZXNzVGhhbkVxdWFsKGJhc2VDb2xvcix0ZXN0Y29sb3IrZXBzKSkpKSknLFxuXHRcdFx0ICAgIFx0J2dsX0ZyYWdDb2xvciA9IGNvdmVyQ29sb3I7Jyxcblx0XHRcdCAgICAnZWxzZScsXG5cdFx0XHQgICAgXHQnZ2xfRnJhZ0NvbG9yID0gYmFzZUNvbG9yOycsXG5cdFx0XHQnI2Vsc2UnLFxuXHRcdCAgICBcdCdnbF9GcmFnQ29sb3IgPSBiYXNlQ29sb3I7Jyxcblx0XHRcdCcjZW5kaWYnLFxuXG5cdFx0XHRUSFJFRS5TaGFkZXJDaHVuay5zcGVjdWxhcm1hcF9mcmFnbWVudCxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLmxpZ2h0c19waG9uZ19mcmFnbWVudCxcblx0XHRcdFRIUkVFLlNoYWRlckNodW5rLmNvbG9yX2ZyYWdtZW50LFxuXHRcdFx0VEhSRUUuU2hhZGVyQ2h1bmsuZm9nX2ZyYWdtZW50LFxuXHRcdCd9J1x0XHRcblx0XS5qb2luKCdcXG4nKTtcblxuXHRyZXR1cm4gQm9va01hdGVyaWFsO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jhc2VPYmplY3QnLCBmdW5jdGlvbiAoc3ViY2xhc3NPZikge1xuXHR2YXIgQmFzZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdFRIUkVFLk1lc2guY2FsbCh0aGlzLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0ID0gZGF0YU9iamVjdCB8fCB7fTtcblx0XHRcblx0XHR0aGlzLmlkID0gdGhpcy5kYXRhT2JqZWN0LmlkO1xuXHRcdHRoaXMucm90YXRpb24ub3JkZXIgPSAnWFlaJztcblxuXHRcdHRoaXMuc2V0RHRvVHJhbnNmb3JtYXRpb25zKCk7XG5cdH07XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZSA9IHN1YmNsYXNzT2YoVEhSRUUuTWVzaCk7XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuZ2V0VHlwZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnR5cGU7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuc2V0RHRvVHJhbnNmb3JtYXRpb25zID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMuZGF0YU9iamVjdC5wb3NfeCwgdGhpcy5kYXRhT2JqZWN0LnBvc195LCB0aGlzLmRhdGFPYmplY3QucG9zX3opO1xuXHRcdGlmKHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbikgdGhpcy5yb3RhdGlvbi5mcm9tQXJyYXkodGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uLm1hcChOdW1iZXIpKTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuaXNPdXRPZlBhcnJlbnQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueCAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci54KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueCAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLngpIHx8XG5cdFx0XHRcdE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnogLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueikgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnogLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56KTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc0NvbGxpZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHR0YXJnZXRzLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0aTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRcdHJlc3VsdCA9IHRoaXMuaXNPdXRPZlBhcnJlbnQoKTtcblx0XHR0YXJnZXRzID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRmb3IoaSA9IHRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0c1tpXS5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRpZih0YXJnZXRzW2ldID09PSB0aGlzIHx8XG5cdFx0XHRcdFx0IXRhcmdldCB8fCAvLyBjaGlsZHJlbiB3aXRob3V0IEJCXG5cdFx0XHRcdFx0KE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0YXJnZXQuY2VudGVyLngpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnggKyB0YXJnZXQucmFkaXVzLngpKSB8fFxuXHRcdFx0XHRcdChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGFyZ2V0LmNlbnRlci55KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy55ICsgdGFyZ2V0LnJhZGl1cy55KSkgfHxcblx0XHRcdFx0XHQoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRhcmdldC5jZW50ZXIueikgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueiArIHRhcmdldC5yYWRpdXMueikpKSB7XHRcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIFx0cmVzdWx0ID0gdHJ1ZTtcdFx0XG5cdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24obmV3UG9zaXRpb24pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0XHRyZXN1bHQ7XG5cblx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XG5cdFx0aWYobmV3UG9zaXRpb24ueCkge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgoY3VycmVudFBvc2l0aW9uLngpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihuZXdQb3NpdGlvbi56KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFoobmV3UG9zaXRpb24ueik7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihjdXJyZW50UG9zaXRpb24ueik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihkWCwgZFksIGlzRGVtbykge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKSxcblx0XHRcdHJlc3VsdCA9IGZhbHNlOyBcblx0XHRcblx0XHRpZihkWCkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ICs9IGRYICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnkgPSBjdXJyZW50Um90YXRpb24ueTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZFkpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueCArPSBkWSAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCAoIWlzRGVtbyAmJiByZXN1bHQpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0Ym91bmRpbmdCb3gsXG5cdFx0XHRyYWRpdXMsXG5cdFx0XHRjZW50ZXI7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXHRcdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFx0XG5cdFx0cmFkaXVzID0ge1xuXHRcdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdFx0eTogKGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnkpICogMC41LFxuXHRcdFx0ejogKGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLnopICogMC41XG5cdFx0fTtcblxuXHRcdGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG5cdFx0Y2VudGVyLmFkZFZlY3RvcnMoYm91bmRpbmdCb3gubWluLCBib3VuZGluZ0JveC5tYXgpO1xuXHRcdGNlbnRlci5tdWx0aXBseVNjYWxhcigwLjUpO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiBjZW50ZXJcblx0XHR9O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJvbGxiYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zZXREdG9UcmFuc2Zvcm1hdGlvbnMoKTtcblx0fTtcblxuXHRyZXR1cm4gQmFzZU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tPYmplY3QnLCBmdW5jdGlvbiAoJGxvZywgQmFzZU9iamVjdCwgZGF0YSwgc3ViY2xhc3NPZikge1x0XG5cdHZhciBCb29rT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdH07XG5cblx0Qm9va09iamVjdC5UWVBFID0gJ0Jvb2tPYmplY3QnO1xuXG5cdEJvb2tPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUudHlwZSA9IEJvb2tPYmplY3QuVFlQRTtcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHR2YXIgZHRvID0ge1xuXHRcdFx0aWQ6IHRoaXMuZGF0YU9iamVjdC5pZCxcblx0XHRcdHVzZXJJZDogdGhpcy5kYXRhT2JqZWN0LnVzZXJJZCxcblx0XHRcdHBvc194OiB0aGlzLnBvc2l0aW9uLngsXG5cdFx0XHRwb3NfeTogdGhpcy5wb3NpdGlvbi55LFxuXHRcdFx0cG9zX3o6IHRoaXMucG9zaXRpb24uelxuXHRcdH07XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0Qm9vayhkdG8pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlRHRvKSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzcG9uc2VEdG87XG5cdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0fSk7XG5cdH07XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0aWYodGhpcy5wYXJlbnQgIT0gcGFyZW50KSB7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNoZWxmSWQgPSBwYXJlbnQuaWQ7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBwYXJlbnQucGFyZW50LmlkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQucmVtb3ZlKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gQm9va09iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmFPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgc3ViY2xhc3NPZikge1xuXHR2YXIgQ2FtZXJhT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cdFx0Z2VvbWV0cnkuYm91bmRpbmdCb3ggPSBuZXcgVEhSRUUuQm94MyhuZXcgVEhSRUUuVmVjdG9yMygtMC4xLCAtMSwgLTAuMSksIG5ldyBUSFJFRS5WZWN0b3IzKDAuMSwgMSwgMC4xKSk7XG5cblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgbnVsbCwgZ2VvbWV0cnkpO1xuXHR9O1xuXG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUgPSBzdWJjbGFzc09mKEJhc2VPYmplY3QpO1xuXHRcblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciByYWRpdXMgPSB7XG5cdFx0XHR4OiB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54LCBcblx0XHRcdHk6IHRoaXMuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnksIFxuXHRcdFx0ejogdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXguelxuXHRcdH07XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IHRoaXMucG9zaXRpb24gLy9UT0RPOiBuZWVkcyBjZW50ZXIgb2Ygc2VjdGlvbiBpbiBwYXJlbnQgb3Igd29ybGQgY29vcmRpbmF0ZXNcblx0XHR9O1xuXHR9O1xuXG5cdHJldHVybiBDYW1lcmFPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBzdWJjbGFzc09mKSB7XG5cdHZhciBMaWJyYXJ5T2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHR9O1xuXG5cdExpYnJhcnlPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblxuXHRyZXR1cm4gTGlicmFyeU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlY3Rpb25PYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgU2hlbGZPYmplY3QsIGRhdGEsIHN1YmNsYXNzT2YpIHtcblx0dmFyIFNlY3Rpb25PYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLnNoZWx2ZXMgPSB7fTtcblx0XHRmb3IodmFyIGtleSBpbiBwYXJhbXMuZGF0YS5zaGVsdmVzKSB7XG5cdFx0XHR0aGlzLnNoZWx2ZXNba2V5XSA9IG5ldyBTaGVsZk9iamVjdChwYXJhbXMuZGF0YS5zaGVsdmVzW2tleV0pOyBcblx0XHRcdHRoaXMuYWRkKHRoaXMuc2hlbHZlc1trZXldKTtcblx0XHR9XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5UWVBFID0gJ1NlY3Rpb25PYmplY3QnO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNlY3Rpb25PYmplY3QuVFlQRTtcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHR2YXIgZHRvID0ge1xuXHRcdFx0aWQ6IHRoaXMuZGF0YU9iamVjdC5pZCxcblx0XHRcdHVzZXJJZDogdGhpcy5kYXRhT2JqZWN0LnVzZXJJZCxcblx0XHRcdHBvc194OiB0aGlzLnBvc2l0aW9uLngsXG5cdFx0XHRwb3NfeTogdGhpcy5wb3NpdGlvbi55LFxuXHRcdFx0cG9zX3o6IHRoaXMucG9zaXRpb24ueixcblx0XHRcdHJvdGF0aW9uOiBbdGhpcy5yb3RhdGlvbi54LCB0aGlzLnJvdGF0aW9uLnksIHRoaXMucm90YXRpb24uel1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGRhdGEucG9zdFNlY3Rpb24oZHRvKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZUR0bykge1xuXHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IHJlc3BvbnNlRHRvO1xuXHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdGlmKHRoaXMucGFyZW50ICE9IHBhcmVudCkge1xuXHRcdFx0aWYocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5saWJyYXJ5SWQgPSBwYXJlbnQuaWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBhcmVudC5yZW1vdmUodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5saWJyYXJ5SWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gU2VjdGlvbk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGEnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBTZWxlY3Rvck1ldGEgPSBmdW5jdGlvbihzZWxlY3RlZE9iamVjdCkge1xuXHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHR0aGlzLmlkID0gc2VsZWN0ZWRPYmplY3QuaWQ7XG5cdFx0XHR0aGlzLnBhcmVudElkID0gc2VsZWN0ZWRPYmplY3QucGFyZW50LmlkO1xuXHRcdFx0dGhpcy50eXBlID0gc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpO1xuXHRcdH1cblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaWQ7XG5cdH07XG5cblx0U2VsZWN0b3JNZXRhLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuICEoIW1ldGEgfHwgXG5cdFx0XHRcdG1ldGEuaWQgIT09IHRoaXMuaWQgfHwgXG5cdFx0XHRcdG1ldGEucGFyZW50SWQgIT09IHRoaXMucGFyZW50SWQgfHwgXG5cdFx0XHRcdG1ldGEudHlwZSAhPT0gdGhpcy50eXBlKTtcblx0fTtcblx0XG5cdHJldHVybiBTZWxlY3Rvck1ldGE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2VsZWN0b3JNZXRhRHRvJywgZnVuY3Rpb24gKFNlbGVjdG9yTWV0YSwgc3ViY2xhc3NPZikge1xuXHR2YXIgU2VsZWN0b3JNZXRhRHRvID0gZnVuY3Rpb24odHlwZSwgaWQsIHBhcmVudElkKSB7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5wYXJlbnRJZCA9IHBhcmVudElkO1xuXHR9O1xuXHRcblx0U2VsZWN0b3JNZXRhRHRvLnByb3RvdHlwZSA9IHN1YmNsYXNzT2YoU2VsZWN0b3JNZXRhKTtcblxuXHRyZXR1cm4gU2VsZWN0b3JNZXRhRHRvO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NoZWxmT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIHN1YmNsYXNzT2YpIHtcblx0dmFyIFNoZWxmT2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0dmFyIHNpemUgPSBwYXJhbXMuc2l6ZTtcdFxuXHRcdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cblx0XHRnZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSk7XG5cblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMocGFyYW1zLnBvc2l0aW9uWzBdLCBwYXJhbXMucG9zaXRpb25bMV0sIHBhcmFtcy5wb3NpdGlvblsyXSk7XG5cdFx0dGhpcy5zaXplID0gbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG5cdH07XG5cblx0U2hlbGZPYmplY3QuVFlQRSA9ICdTaGVsZk9iamVjdCc7XG5cblx0U2hlbGZPYmplY3QucHJvdG90eXBlID0gc3ViY2xhc3NPZihCYXNlT2JqZWN0KTtcblx0U2hlbGZPYmplY3QucHJvdG90eXBlLnR5cGUgPSBTaGVsZk9iamVjdC5UWVBFO1xuXG5cdHJldHVybiBTaGVsZk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdzdWJjbGFzc09mJywgZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBfc3ViY2xhc3NPZigpIHt9XG5cblx0ZnVuY3Rpb24gc3ViY2xhc3NPZihiYXNlKSB7XG5cdCAgICBfc3ViY2xhc3NPZi5wcm90b3R5cGUgPSBiYXNlLnByb3RvdHlwZTtcblx0ICAgIHJldHVybiBuZXcgX3N1YmNsYXNzT2YoKTtcblx0fVxuXG5cdHJldHVybiBzdWJjbGFzc09mO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2dyaWRDYWxjdWxhdG9yJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgZ3JpZENhbGN1bGF0b3IgPSB7fTtcblxuXHRncmlkQ2FsY3VsYXRvci5nZXRFZGdlcyA9IGZ1bmN0aW9uKHNwYWNlQkIsIHByZWNpc2lvbikge1xuXHRcdHZhciBwb3NNaW4gPSB0aGlzLnBvc1RvQ2VsbChzcGFjZUJCLm1pbiwgcHJlY2lzaW9uKTtcblx0XHR2YXIgcG9zTWF4ID0gdGhpcy5wb3NUb0NlbGwoc3BhY2VCQi5tYXgsIHByZWNpc2lvbik7XG5cdFx0XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1pblhDZWxsOiBwb3NNaW4ueCArIDEsXG5cdFx0XHRtYXhYQ2VsbDogcG9zTWF4LnggLSAxLFxuXHRcdFx0bWluWkNlbGw6IHBvc01pbi56ICsgMSxcblx0XHRcdG1heFpDZWxsOiBwb3NNYXgueiAtIDFcblx0XHR9O1xuXHR9O1xuXG5cdGdyaWRDYWxjdWxhdG9yLnBvc1RvQ2VsbCA9IGZ1bmN0aW9uKHBvcywgcHJlY2lzaW9uKSB7XG5cdFx0cmV0dXJuIHBvcy5jbG9uZSgpLmRpdmlkZShwcmVjaXNpb24pLnJvdW5kKCk7XG5cdH07XG5cblx0Z3JpZENhbGN1bGF0b3IuY2VsbFRvUG9zID0gZnVuY3Rpb24oY2VsbCwgcHJlY2lzaW9uKSB7XG5cdFx0cmV0dXJuIGNlbGwuY2xvbmUoKS5tdWx0aXBseShwcmVjaXNpb24pO1xuXHR9O1xuXG5cdHJldHVybiBncmlkQ2FsY3VsYXRvcjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdoaWdobGlnaHQnLCBmdW5jdGlvbiAoZW52aXJvbm1lbnQpIHtcblx0dmFyIGhpZ2hsaWdodCA9IHt9O1xuXG5cdHZhciBQTEFORV9ST1RBVElPTiA9IE1hdGguUEkgKiAwLjU7XG5cdHZhciBQTEFORV9NVUxUSVBMSUVSID0gMjtcblx0dmFyIENPTE9SX1NFTEVDVCA9IDB4MDA1NTMzO1xuXHR2YXIgQ09MT1JfRk9DVVMgPSAweDAwMzM1NTtcblxuXHR2YXIgc2VsZWN0O1xuXHR2YXIgZm9jdXM7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWF0ZXJpYWxQcm9wZXJ0aWVzID0ge1xuXHRcdFx0bWFwOiBuZXcgVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSggJ2ltZy9nbG93LnBuZycgKSxcblx0XHRcdHRyYW5zcGFyZW50OiB0cnVlLCBcblx0XHRcdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG5cdFx0XHRibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcblx0XHRcdGRlcHRoVGVzdDogZmFsc2Vcblx0XHR9O1xuXG5cdFx0bWF0ZXJpYWxQcm9wZXJ0aWVzLmNvbG9yID0gQ09MT1JfU0VMRUNUO1xuXHRcdHZhciBtYXRlcmlhbFNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbChtYXRlcmlhbFByb3BlcnRpZXMpO1xuXG5cdFx0bWF0ZXJpYWxQcm9wZXJ0aWVzLmNvbG9yID0gQ09MT1JfRk9DVVM7XG5cdFx0dmFyIG1hdGVyaWFsRm9jdXMgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEsIDEsIDEpO1xuXG5cdFx0c2VsZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsU2VsZWN0KTtcblx0XHRzZWxlY3Qucm90YXRpb24ueCA9IFBMQU5FX1JPVEFUSU9OO1xuXG5cdFx0Zm9jdXMgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxGb2N1cyk7XG5cdFx0Zm9jdXMucm90YXRpb24ueCA9IFBMQU5FX1JPVEFUSU9OO1xuXHR9O1xuXG5cdHZhciBjb21tb25IaWdobGlnaHQgPSBmdW5jdGlvbih3aGljaCwgb2JqKSB7XG5cdFx0aWYob2JqKSB7XG5cdFx0XHR2YXIgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGhlaWdodCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueiAqIFBMQU5FX01VTFRJUExJRVI7XG5cdFx0XHR2YXIgYm90dG9tID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1pbi55ICsgZW52aXJvbm1lbnQuQ0xFQVJBTkNFO1xuXHRcdFx0XG5cdFx0XHR3aGljaC5wb3NpdGlvbi55ID0gYm90dG9tO1xuXHRcdFx0d2hpY2guc2NhbGUuc2V0KHdpZHRoLCBoZWlnaHQsIDEpO1xuXHRcdFx0b2JqLmFkZCh3aGljaCk7XG5cblx0XHRcdHdoaWNoLnZpc2libGUgPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aGljaC52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHR9O1xuXG5cdGhpZ2hsaWdodC5lbmFibGUgPSBmdW5jdGlvbihlbmFibGUpIHtcblx0XHRmb2N1cy52aXNpYmxlID0gc2VsZWN0LnZpc2libGUgPSBlbmFibGU7XG5cdH07XG5cblx0aGlnaGxpZ2h0LmZvY3VzID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KGZvY3VzLCBvYmopO1xuXHR9O1xuXG5cdGhpZ2hsaWdodC5zZWxlY3QgPSBmdW5jdGlvbihvYmopIHtcblx0XHRjb21tb25IaWdobGlnaHQoc2VsZWN0LCBvYmopO1xuXHR9O1xuXG5cdGluaXQoKTtcblxuXHRyZXR1cm4gaGlnaGxpZ2h0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2xvY2F0b3InLCBmdW5jdGlvbiAoJHEsICRsb2csIEJhc2VPYmplY3QsIGRhdGEsIHNlbGVjdG9yLCBlbnZpcm9ubWVudCwgY2FjaGUsIGdyaWRDYWxjdWxhdG9yKSB7XG5cdHZhciBsb2NhdG9yID0ge307XG5cblx0dmFyIGRlYnVnRW5hYmxlZCA9IGZhbHNlO1xuXG5cdGxvY2F0b3IuY2VudGVyT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIHRhcmdldEJCID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdHZhciBzcGFjZUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblxuXHRcdHZhciBtYXRyaXhQcmVjaXNpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRCQi5tYXgueCAtIHRhcmdldEJCLm1pbi54ICsgMC4wMSwgMCwgdGFyZ2V0QkIubWF4LnogLSB0YXJnZXRCQi5taW4ueiArIDAuMDEpO1xuXHRcdHZhciBvY2N1cGllZE1hdHJpeCA9IGdldE9jY3VwaWVkTWF0cml4KGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIG1hdHJpeFByZWNpc2lvbiwgb2JqKTtcblx0XHR2YXIgZnJlZVBvc2l0aW9uID0gZ2V0RnJlZU1hdHJpeChvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbik7XHRcdFxuXG5cdFx0b2JqLnBvc2l0aW9uLnNldFgoZnJlZVBvc2l0aW9uLngpO1xuXHRcdG9iai5wb3NpdGlvbi5zZXRaKGZyZWVQb3NpdGlvbi56KTtcblx0fTtcblxuXHRsb2NhdG9yLnBsYWNlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EdG8pIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldFNlY3Rpb24oc2VjdGlvbkR0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkJCID0gc2VjdGlvbkNhY2hlLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGxpYnJhcnlCQiA9IGVudmlyb25tZW50LmxpYnJhcnkuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgZnJlZVBsYWNlID0gZ2V0RnJlZVBsYWNlKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIGxpYnJhcnlCQiwgc2VjdGlvbkJCKTtcblxuXHRcdFx0cmV0dXJuIGZyZWVQbGFjZSA/XG5cdFx0XHRcdHNhdmVTZWN0aW9uKHNlY3Rpb25EdG8sIGZyZWVQbGFjZSkgOlxuXHRcdFx0XHQkcS5yZWplY3QoJ3RoZXJlIGlzIG5vIGZyZWUgc3BhY2UnKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uIChuZXdEdG8pIHtcblx0XHRcdHJldHVybiBlbnZpcm9ubWVudC51cGRhdGVTZWN0aW9uKG5ld0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgc2F2ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8sIHBvc2l0aW9uKSB7XG5cdFx0ZHRvLmxpYnJhcnlJZCA9IGVudmlyb25tZW50LmxpYnJhcnkuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0U2VjdGlvbihkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bywgc2hlbGYpIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHR2YXIgc2hlbGZCQiA9IHNoZWxmLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGJvb2tCQiA9IGJvb2tDYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdHJldHVybiBmcmVlUGxhY2UgPyBcblx0XHRcdFx0c2F2ZUJvb2soYm9va0R0bywgZnJlZVBsYWNlLCBzaGVsZikgOiBcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAobmV3RHRvKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhuZXdEdG8pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVCb29rID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbiwgc2hlbGYpIHtcblx0XHRkdG8uc2hlbGZJZCA9IHNoZWxmLmlkO1xuXHRcdGR0by5zZWN0aW9uSWQgPSBzaGVsZi5wYXJlbnQuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gZGF0YS5wb3N0Qm9vayhkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IudW5wbGFjZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0Ym9va0R0by5zZWN0aW9uSWQgPSBudWxsO1xuXG5cdFx0cHJvbWlzZSA9IGRhdGEucG9zdEJvb2soYm9va0R0bykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhib29rRHRvKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBnZXRGcmVlUGxhY2UgPSBmdW5jdGlvbihvYmplY3RzLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBtYXRyaXhQcmVjaXNpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRCQi5tYXgueCAtIHRhcmdldEJCLm1pbi54ICsgMC4wMSwgMCwgdGFyZ2V0QkIubWF4LnogLSB0YXJnZXRCQi5taW4ueiArIDAuMDEpO1xuXHRcdHZhciBvY2N1cGllZE1hdHJpeCA9IGdldE9jY3VwaWVkTWF0cml4KG9iamVjdHMsIG1hdHJpeFByZWNpc2lvbik7XG5cdFx0dmFyIGZyZWVQb3NpdGlvbiA9IGdldEZyZWVNYXRyaXhDZWxscyhvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbik7XG5cdFx0XG5cdFx0aWYgKGRlYnVnRW5hYmxlZCkge1xuXHRcdFx0ZGVidWdTaG93RnJlZShmcmVlUG9zaXRpb24sIG1hdHJpeFByZWNpc2lvbiwgZW52aXJvbm1lbnQubGlicmFyeSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZyZWVQb3NpdGlvbjtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZU1hdHJpeCA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIERJU1RBTkNFID0gMS4zO1xuXG5cdFx0dmFyIHhJbmRleDtcblx0XHR2YXIgekluZGV4O1xuXHRcdHZhciBwb3NpdGlvbiA9IHt9O1xuXHRcdHZhciBtaW5Qb3NpdGlvbiA9IHt9O1xuXHRcdHZhciBlZGdlcyA9IGdyaWRDYWxjdWxhdG9yLmdldEVkZ2VzKHNwYWNlQkIsIG1hdHJpeFByZWNpc2lvbik7XG5cblx0XHRmb3IgKHpJbmRleCA9IGVkZ2VzLm1pblpDZWxsOyB6SW5kZXggPD0gZWRnZXMubWF4WkNlbGw7IHpJbmRleCsrKSB7XG5cdFx0XHRmb3IgKHhJbmRleCA9IGVkZ2VzLm1pblhDZWxsOyB4SW5kZXggPD0gZWRnZXMubWF4WENlbGw7IHhJbmRleCsrKSB7XG5cdFx0XHRcdGlmICghb2NjdXBpZWRNYXRyaXhbekluZGV4XSB8fCAhb2NjdXBpZWRNYXRyaXhbekluZGV4XVt4SW5kZXhdKSB7XG5cdFx0XHRcdFx0cG9zaXRpb24ucG9zID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoW3hJbmRleF0sIHpJbmRleCwgbWF0cml4UHJlY2lzaW9uLCBzcGFjZUJCLCB0YXJnZXRCQik7XG5cdFx0XHRcdFx0cG9zaXRpb24ubGVuZ3RoID0gcG9zaXRpb24ucG9zLmxlbmd0aCgpO1xuXG5cdFx0XHRcdFx0aWYoIW1pblBvc2l0aW9uLnBvcyB8fCBwb3NpdGlvbi5sZW5ndGggPCBtaW5Qb3NpdGlvbi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdG1pblBvc2l0aW9uLnBvcyA9IHBvc2l0aW9uLnBvcztcblx0XHRcdFx0XHRcdG1pblBvc2l0aW9uLmxlbmd0aCA9IHBvc2l0aW9uLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihtaW5Qb3NpdGlvbi5wb3MgJiYgbWluUG9zaXRpb24ubGVuZ3RoIDwgRElTVEFOQ0UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBtaW5Qb3NpdGlvbi5wb3M7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1pblBvc2l0aW9uLnBvcztcblx0fTtcblxuXHR2YXIgZ2V0RnJlZU1hdHJpeENlbGxzID0gZnVuY3Rpb24ob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pIHtcblx0XHR2YXIgdGFyZ2V0Q2VsbHNTaXplID0gMTtcblx0XHR2YXIgZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdHZhciBmcmVlQ2VsbHNTdGFydDtcblx0XHR2YXIgeEluZGV4O1xuXHRcdHZhciB6SW5kZXg7XG5cdFx0dmFyIGNlbGxzO1xuXHRcdHZhciBlZGdlcyA9IGdyaWRDYWxjdWxhdG9yLmdldEVkZ2VzKHNwYWNlQkIsIG1hdHJpeFByZWNpc2lvbik7XG5cblx0XHRmb3IgKHpJbmRleCA9IGVkZ2VzLm1pblpDZWxsOyB6SW5kZXggPD0gZWRnZXMubWF4WkNlbGw7IHpJbmRleCsrKSB7XG5cdFx0XHRmb3IgKHhJbmRleCA9IGVkZ2VzLm1pblhDZWxsOyB4SW5kZXggPD0gZWRnZXMubWF4WENlbGw7IHhJbmRleCsrKSB7XG5cdFx0XHRcdGlmICghb2NjdXBpZWRNYXRyaXhbekluZGV4XSB8fCAhb2NjdXBpZWRNYXRyaXhbekluZGV4XVt4SW5kZXhdKSB7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzU3RhcnQgPSBmcmVlQ2VsbHNTdGFydCB8fCB4SW5kZXg7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQrKztcblxuXHRcdFx0XHRcdGlmIChmcmVlQ2VsbHNDb3VudCA9PT0gdGFyZ2V0Q2VsbHNTaXplKSB7XG5cdFx0XHRcdFx0XHRjZWxscyA9IF8ucmFuZ2UoZnJlZUNlbGxzU3RhcnQsIGZyZWVDZWxsc1N0YXJ0ICsgZnJlZUNlbGxzQ291bnQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGdldFBvc2l0aW9uRnJvbUNlbGxzKGNlbGxzLCB6SW5kZXgsIG1hdHJpeFByZWNpc2lvbiwgc3BhY2VCQiwgdGFyZ2V0QkIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNDb3VudCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHR2YXIgZ2V0UG9zaXRpb25Gcm9tQ2VsbHMgPSBmdW5jdGlvbihjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0dmFyIGNlbnRlciA9IGdyaWRDYWxjdWxhdG9yLmNlbGxUb1BvcyhuZXcgVEhSRUUuVmVjdG9yMyhjZWxsc1swXSwgMCwgekluZGV4KSwgbWF0cml4UHJlY2lzaW9uKTtcblxuXHRcdHZhciBvZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXHRcdG9mZnNldC5hZGRWZWN0b3JzKHRhcmdldEJCLm1pbiwgdGFyZ2V0QkIubWF4KTtcblx0XHRvZmZzZXQubXVsdGlwbHlTY2FsYXIoLTAuNSk7XG5cblx0XHRyZXR1cm4gY2VudGVyLmFkZChvZmZzZXQpLnNldFkoZ2V0Qm90dG9tWShzcGFjZUJCLCB0YXJnZXRCQikpO1xuXHR9O1xuXG5cdHZhciBnZXRCb3R0b21ZID0gZnVuY3Rpb24oc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHRyZXR1cm4gc3BhY2VCQi5taW4ueSAtIHRhcmdldEJCLm1pbi55ICsgZW52aXJvbm1lbnQuQ0xFQVJBTkNFO1xuXHR9O1xuXG5cdHZhciBnZXRPY2N1cGllZE1hdHJpeCA9IGZ1bmN0aW9uKG9iamVjdHMsIG1hdHJpeFByZWNpc2lvbiwgb2JqKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdHZhciBvYmplY3RCQjtcblx0XHR2YXIgbWluS2V5WDtcblx0XHR2YXIgbWF4S2V5WDtcblx0XHR2YXIgbWluS2V5Wjtcblx0XHR2YXIgbWF4S2V5WjtcdFx0XG5cdFx0dmFyIHosIHg7XG5cblx0XHRvYmplY3RzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRpZihjaGlsZCBpbnN0YW5jZW9mIEJhc2VPYmplY3QgJiYgY2hpbGQgIT09IG9iaikge1xuXHRcdFx0XHRvYmplY3RCQiA9IGNoaWxkLmJvdW5kaW5nQm94O1xuXG5cdFx0XHRcdG1pbktleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCAtIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWF4S2V5WCA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci54ICsgb2JqZWN0QkIucmFkaXVzLngpIC8gbWF0cml4UHJlY2lzaW9uLngpO1xuXHRcdFx0XHRtaW5LZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogLSBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cdFx0XHRcdG1heEtleVogPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueiArIG9iamVjdEJCLnJhZGl1cy56KSAvIG1hdHJpeFByZWNpc2lvbi56KTtcblxuXHRcdFx0XHRmb3IoeiA9IG1pbktleVo7IHogPD0gbWF4S2V5WjsgeisrKSB7XG5cdFx0XHRcdFx0cmVzdWx0W3pdID0gcmVzdWx0W3pdIHx8IHt9O1xuXHRcdFx0XHRcdHZhciBkZWJ1Z0NlbGxzID0gW107XG5cblx0XHRcdFx0XHRmb3IoeCA9IG1pbktleVg7IHggPD0gbWF4S2V5WDsgeCsrKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbel1beF0gPSB0cnVlO1xuXHRcdFx0XHRcdFx0ZGVidWdDZWxscy5wdXNoKHgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKGRlYnVnRW5hYmxlZCkge1xuXHRcdFx0XHRcdFx0ZGVidWdTaG93QkIoY2hpbGQpO1xuXHRcdFx0XHRcdFx0ZGVidWdBZGRPY2N1cGllZChkZWJ1Z0NlbGxzLCBtYXRyaXhQcmVjaXNpb24sIGNoaWxkLCB6KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0bG9jYXRvci5kZWJ1ZyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNhY2hlLmdldFNlY3Rpb24oJ2Jvb2tzaGVsZl8wMDAxJykudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdFx0XHRkZWJ1Z0VuYWJsZWQgPSB0cnVlO1xuXHRcdFx0dmFyIHNlY3Rpb25CQiA9IHNlY3Rpb25DYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBsaWJyYXJ5QkIgPSBlbnZpcm9ubWVudC5saWJyYXJ5Lmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0Z2V0RnJlZVBsYWNlKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIGxpYnJhcnlCQiwgc2VjdGlvbkJCKTtcblx0XHRcdGRlYnVnRW5hYmxlZCA9IGZhbHNlO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBkZWJ1Z1Nob3dCQiA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdHZhciBvYmplY3RCQiA9IG9iai5ib3VuZGluZ0JveDtcblx0XHR2YXIgb2JqQm94ID0gbmV3IFRIUkVFLk1lc2goXG5cdFx0XHRuZXcgVEhSRUUuQ3ViZUdlb21ldHJ5KFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueCAqIDIsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueSAqIDIgKyAwLjEsIFxuXHRcdFx0XHRvYmplY3RCQi5yYWRpdXMueiAqIDJcblx0XHRcdCksIFxuXHRcdFx0bmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuXHRcdFx0XHRjb2xvcjogMHhiYmJiZmYsXG5cdFx0XHRcdG9wYWNpdHk6IDAuMixcblx0XHRcdFx0dHJhbnNwYXJlbnQ6IHRydWVcblx0XHRcdH0pXG5cdFx0KTtcblx0XHRcblx0XHRvYmpCb3gucG9zaXRpb24ueCA9IG9iamVjdEJCLmNlbnRlci54O1xuXHRcdG9iakJveC5wb3NpdGlvbi55ID0gb2JqZWN0QkIuY2VudGVyLnk7XG5cdFx0b2JqQm94LnBvc2l0aW9uLnogPSBvYmplY3RCQi5jZW50ZXIuejtcblxuXHRcdG9iai5wYXJlbnQuYWRkKG9iakJveCk7XG5cdH07XG5cblx0dmFyIGRlYnVnQWRkT2NjdXBpZWQgPSBmdW5jdGlvbihjZWxscywgbWF0cml4UHJlY2lzaW9uLCBvYmosIHpLZXkpIHtcblx0XHRjZWxscy5mb3JFYWNoKGZ1bmN0aW9uIChjZWxsKSB7XG5cdFx0XHR2YXIgcG9zID0gZ2V0UG9zaXRpb25Gcm9tQ2VsbHMoW2NlbGxdLCB6S2V5LCBtYXRyaXhQcmVjaXNpb24sIG9iai5wYXJlbnQuZ2VvbWV0cnkuYm91bmRpbmdCb3gsIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveCk7XG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkobWF0cml4UHJlY2lzaW9uLnggLSAwLjAxLCAwLjAxLCBtYXRyaXhQcmVjaXNpb24ueiAtIDAuMDEpLCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4ZmYwMDAwfSkpO1xuXHRcdFx0XG5cdFx0XHRjZWxsQm94LnBvc2l0aW9uID0gcG9zO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGRlYnVnU2hvd0ZyZWUgPSBmdW5jdGlvbihwb3NpdGlvbiwgbWF0cml4UHJlY2lzaW9uLCBvYmopIHtcblx0XHRpZiAocG9zaXRpb24pIHtcblx0XHRcdHZhciBjZWxsQm94ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN1YmVHZW9tZXRyeShtYXRyaXhQcmVjaXNpb24ueCwgMC41LCBtYXRyaXhQcmVjaXNpb24ueiksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHgwMGZmMDB9KSk7XG5cdFx0XHRjZWxsQm94LnBvc2l0aW9uID0gcG9zaXRpb247XG5cdFx0XHRvYmoucGFyZW50LmFkZChjZWxsQm94KTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGxvY2F0b3I7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdwcmV2aWV3JywgZnVuY3Rpb24gKGNhbWVyYSwgaGlnaGxpZ2h0KSB7XG5cdHZhciBwcmV2aWV3ID0ge307XG5cblx0dmFyIGFjdGl2ZSA9IGZhbHNlO1xuXHR2YXIgY29udGFpbmVyO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29udGFpbmVyID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cdFx0Y29udGFpbmVyLnBvc2l0aW9uLnNldCgwLCAwLCAtMC41KTtcblx0XHRjb250YWluZXIucm90YXRpb24ueSA9IC0yO1xuXHRcdGNhbWVyYS5jYW1lcmEuYWRkKGNvbnRhaW5lcik7XG5cdH07XG5cblx0dmFyIGFjdGl2YXRlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRhY3RpdmUgPSB2YWx1ZTtcblx0XHRoaWdobGlnaHQuZW5hYmxlKCFhY3RpdmUpO1xuXHR9O1xuXG5cdHByZXZpZXcuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYWN0aXZlO1xuXHR9O1xuXG5cdHByZXZpZXcuZW5hYmxlID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIG9iakNsb25lO1xuXG5cdFx0aWYob2JqKSB7XG5cdFx0XHRhY3RpdmF0ZSh0cnVlKTtcblxuXHRcdFx0b2JqQ2xvbmUgPSBvYmouY2xvbmUoKTtcblx0XHRcdG9iakNsb25lLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHRcdGNvbnRhaW5lci5hZGQob2JqQ2xvbmUpO1xuXHRcdH1cblx0fTtcblxuXHRwcmV2aWV3LmRpc2FibGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0Y2xlYXJDb250YWluZXIoKTtcblx0XHRhY3RpdmF0ZShmYWxzZSk7XG5cdH07XG5cblx0dmFyIGNsZWFyQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdFx0Y29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlKGNoaWxkKTtcblx0XHR9KTtcblx0fTtcblxuXHRwcmV2aWV3LnJvdGF0ZSA9IGZ1bmN0aW9uKGRYKSB7XG5cdFx0Y29udGFpbmVyLnJvdGF0aW9uLnkgKz0gZFggPyBkWCAqIDAuMDUgOiAwO1xuXHR9O1xuXG5cdGluaXQoKTtcblxuXHRyZXR1cm4gcHJldmlldztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdzZWxlY3RvcicsIGZ1bmN0aW9uIChTZWxlY3Rvck1ldGEsIEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBlbnZpcm9ubWVudCwgaGlnaGxpZ2h0LCBwcmV2aWV3LCB0b29sdGlwLCBjYXRhbG9nKSB7XG5cdHZhciBzZWxlY3RvciA9IHt9O1xuXHRcblx0dmFyIHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHR2YXIgZm9jdXNlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblxuXHRzZWxlY3Rvci5wbGFjaW5nID0gZmFsc2U7XG5cblx0c2VsZWN0b3IuZm9jdXMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iajtcblxuXHRcdGlmKCFtZXRhLmVxdWFscyhmb2N1c2VkKSkge1xuXHRcdFx0Zm9jdXNlZCA9IG1ldGE7XG5cblx0XHRcdGlmKCFmb2N1c2VkLmlzRW1wdHkoKSkge1xuXHRcdFx0XHRvYmogPSBzZWxlY3Rvci5nZXRGb2N1c2VkT2JqZWN0KCk7XG5cdFx0XHRcdGhpZ2hsaWdodC5mb2N1cyhvYmopO1xuXHRcdFx0fVxuXG5cdFx0XHR0b29sdGlwLnNldChvYmopO1xuXHRcdH1cblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3RGb2N1c2VkID0gZnVuY3Rpb24oKSB7XG5cdFx0c2VsZWN0b3Iuc2VsZWN0KGZvY3VzZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLnNlbGVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqID0gZ2V0T2JqZWN0KG1ldGEpO1xuXHRcdFxuXHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0c2VsZWN0ZWQgPSBtZXRhO1xuXG5cdFx0aGlnaGxpZ2h0LnNlbGVjdChvYmopO1xuXHRcdGhpZ2hsaWdodC5mb2N1cyhudWxsKTtcblxuXHRcdHNlbGVjdG9yLnBsYWNpbmcgPSBmYWxzZTtcblx0fTtcblxuXHRzZWxlY3Rvci51bnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFzZWxlY3RlZC5pc0VtcHR5KCkpIHtcblx0XHRcdGhpZ2hsaWdodC5zZWxlY3QobnVsbCk7XG5cdFx0XHRzZWxlY3RlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblx0XHR9XG5cblx0XHRwcmV2aWV3LmRpc2FibGUoKTtcblx0fTtcblxuXHRzZWxlY3Rvci5nZXRTZWxlY3RlZER0byA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpID8gY2F0YWxvZy5nZXRCb29rKHNlbGVjdGVkLmlkKSA6IFxuXHRcdFx0c2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKSA/IGVudmlyb25tZW50LmdldFNlY3Rpb24oc2VsZWN0ZWQuaWQpIDpcblx0XHRcdG51bGw7XG5cdH07XG5cblx0c2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZ2V0T2JqZWN0KHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5nZXRGb2N1c2VkT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldE9iamVjdChmb2N1c2VkKTtcblx0fTtcblxuXHR2YXIgZ2V0T2JqZWN0ID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHZhciBvYmplY3Q7XG5cblx0XHRpZighbWV0YS5pc0VtcHR5KCkpIHtcblx0XHRcdG9iamVjdCA9IGlzU2hlbGYobWV0YSkgPyBlbnZpcm9ubWVudC5nZXRTaGVsZihtZXRhLnBhcmVudElkLCBtZXRhLmlkKVxuXHRcdFx0XHQ6IGlzQm9vayhtZXRhKSA/IGVudmlyb25tZW50LmdldEJvb2sobWV0YS5pZClcblx0XHRcdFx0OiBpc1NlY3Rpb24obWV0YSkgPyBlbnZpcm9ubWVudC5nZXRTZWN0aW9uKG1ldGEuaWQpXG5cdFx0XHRcdDogbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1x0XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZEVkaXRhYmxlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rKCkgfHwgc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGlzQm9vayhzZWxlY3RlZCkgJiYgc2VsZWN0ZWQuaWQgPT09IGlkO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NoZWxmKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzU2VjdGlvbihzZWxlY3RlZCk7XG5cdH07XG5cblx0dmFyIGlzU2hlbGYgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gU2hlbGZPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNCb29rID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IEJvb2tPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNTZWN0aW9uID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNlY3Rpb25PYmplY3QuVFlQRTtcblx0fTtcblxuXHRyZXR1cm4gc2VsZWN0b3I7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnYXV0aG9yaXphdGlvbicsIGZ1bmN0aW9uICgkbG9nLCAkcSwgJHdpbmRvdywgJGludGVydmFsLCB1c2VyLCBlbnZpcm9ubWVudCwgcmVnaXN0cmF0aW9uLCB1c2VyRGF0YSwgYmxvY2ssIG5nRGlhbG9nKSB7XG5cdHZhciBhdXRob3JpemF0aW9uID0ge307XG5cblx0dmFyIFRFTVBMQVRFID0gJ2xvZ2luRGlhbG9nJztcblxuXHRhdXRob3JpemF0aW9uLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRuZ0RpYWxvZy5vcGVuKHt0ZW1wbGF0ZTogVEVNUExBVEV9KTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmlzU2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdXNlci5pc0F1dGhvcml6ZWQoKSAmJiB1c2VyLmlzTG9hZGVkKCk7XG5cdH07XG5cblx0dmFyIGxvZ2luID0gZnVuY3Rpb24obGluaykge1xuXHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdHZhciB3aW4gPSAkd2luZG93Lm9wZW4obGluaywgJycsICd3aWR0aD04MDAsaGVpZ2h0PTYwMCxtb2RhbD15ZXMsYWx3YXlzUmFpc2VkPXllcycpO1xuXHQgICAgdmFyIGNoZWNrQXV0aFdpbmRvdyA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgaWYgKHdpbiAmJiB3aW4uY2xvc2VkKSB7XG5cdCAgICAgICAgXHQkaW50ZXJ2YWwuY2FuY2VsKGNoZWNrQXV0aFdpbmRvdyk7XG5cblx0ICAgICAgICBcdGVudmlyb25tZW50LnNldExvYWRlZChmYWxzZSk7XG5cdCAgICAgICAgXHR1c2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBcdFx0cmV0dXJuIHVzZXIuaXNUZW1wb3JhcnkoKSA/IHJlZ2lzdHJhdGlvbi5zaG93KCkgOiB1c2VyRGF0YS5sb2FkKCk7XG5cdCAgICAgICAgXHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBcdFx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkKHRydWUpO1xuXHQgICAgICAgIFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHQgICAgICAgIFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIFx0XHQkbG9nLmxvZygnVXNlciBsb2FkaW5kIGVycm9yJyk7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGVycm9yIG1lc3NhZ2UgIFxuXHQgICAgICAgIFx0fSk7XG5cdCAgICAgICAgfVxuXHQgICAgfSwgMTAwKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmdvb2dsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxvZ2luKCcvYXV0aC9nb29nbGUnKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLnR3aXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvdHdpdHRlcicpO1xuXHR9O1xuXG5cdGF1dGhvcml6YXRpb24uZmFjZWJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRsb2dpbignL2F1dGgvZmFjZWJvb2snKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLnZrb250YWt0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxvZ2luKCcvYXV0aC92a29udGFrdGUnKTtcblx0fTtcblxuXHRhdXRob3JpemF0aW9uLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgIFx0ZW52aXJvbm1lbnQuc2V0TG9hZGVkKGZhbHNlKTtcblx0XHR1c2VyLmxvZ291dCgpLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgIFx0XHRyZXR1cm4gdXNlckRhdGEubG9hZCgpO1xuXHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICBcdGVudmlyb25tZW50LnNldExvYWRlZCh0cnVlKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdMb2dvdXQgZXJyb3InKTtcblx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdH0pO1xuXHR9O1xuXHRcblx0cmV0dXJuIGF1dGhvcml6YXRpb247XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnYmxvY2snLCBmdW5jdGlvbiAoYmxvY2tVSSkge1xuXHR2YXIgYmxvY2sgPSB7fTtcblxuXHR2YXIgSU5WRU5UT1JZID0gJ2ludmVudG9yeSc7XG5cdHZhciBNQUlOX01FTlUgPSAnbWFpbl9tZW51Jztcblx0dmFyIEdMT0JBTCA9ICdnbG9iYWwnO1xuXG5cdGJsb2NrLmludmVudG9yeSA9IGJsb2NrVUkuaW5zdGFuY2VzLmdldChJTlZFTlRPUlkpO1xuXHRcblx0YmxvY2subWFpbk1lbnUgPSBibG9ja1VJLmluc3RhbmNlcy5nZXQoTUFJTl9NRU5VKTtcblxuXHRibG9jay5nbG9iYWwgPSBibG9ja1VJLmluc3RhbmNlcy5nZXQoR0xPQkFMKTtcblxuXHRyZXR1cm4gYmxvY2s7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnYm9va0VkaXQnLCBmdW5jdGlvbiAoJGxvZywgZGF0YSwgZW52aXJvbm1lbnQsIGJsb2NrLCBkaWFsb2csIGFyY2hpdmUsIGNhdGFsb2csIHNlbGVjdG9yLCB1c2VyLCBuZ0RpYWxvZykge1xuXHR2YXIgYm9va0VkaXQgPSB7fTtcblx0dmFyIGJvb2tEaWFsb2c7XG5cblx0dmFyIEJPT0tfSU1BR0VfVVJMID0gJy9vYmovYm9va3Mve21vZGVsfS9pbWcuanBnJztcblx0dmFyIEVNUFRZX0lNQUdFX1VSTCA9ICcvaW1nL2VtcHR5X2NvdmVyLmpwZyc7XG5cdHZhciBURU1QTEFURSA9ICdlZGl0Qm9va0RpYWxvZyc7XG5cdFxuXHRib29rRWRpdC5ib29rID0ge307XG5cblx0Ym9va0VkaXQuc2hvdyA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRzZXRCb29rKGJvb2spO1xuXHRcdGJvb2tEaWFsb2cgPSBuZ0RpYWxvZy5vcGVuKHt0ZW1wbGF0ZTogVEVNUExBVEV9KTtcblx0fTtcblxuXHR2YXIgc2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRpZihib29rKSB7XG5cdFx0XHRib29rRWRpdC5ib29rLmlkID0gYm9vay5pZDtcblx0XHRcdGJvb2tFZGl0LmJvb2sudXNlcklkID0gYm9vay51c2VySWQ7XG5cdFx0XHRib29rRWRpdC5ib29rLm1vZGVsID0gYm9vay5tb2RlbDtcblx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXIgPSBib29rLmNvdmVyO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlcklkID0gYm9vay5jb3ZlcklkO1xuXHRcdFx0Ym9va0VkaXQuYm9vay50aXRsZSA9IGJvb2sudGl0bGU7XG5cdFx0XHRib29rRWRpdC5ib29rLmF1dGhvciA9IGJvb2suYXV0aG9yO1xuXHRcdH1cblx0fTtcblxuXHRib29rRWRpdC5nZXRJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5ib29rLm1vZGVsID8gQk9PS19JTUFHRV9VUkwucmVwbGFjZSgne21vZGVsfScsIHRoaXMuYm9vay5tb2RlbCkgOiBFTVBUWV9JTUFHRV9VUkw7XG5cdH07XG5cblx0Ym9va0VkaXQuZ2V0Q292ZXJJbWcgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy5ib29rLmNvdmVyID8gdGhpcy5ib29rLmNvdmVyLnVybCA6IEVNUFRZX0lNQUdFX1VSTDtcblx0fTtcblxuXHRib29rRWRpdC5hcHBseUNvdmVyID0gZnVuY3Rpb24oY292ZXJJbnB1dFVSTCkge1xuXHRcdGlmKGNvdmVySW5wdXRVUkwpIHtcblx0XHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdFx0YXJjaGl2ZS5zZW5kRXh0ZXJuYWxVUkwoY292ZXJJbnB1dFVSTCwgW3RoaXMuYm9vay50aXRsZSwgdGhpcy5ib29rLmF1dGhvcl0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVyID0gcmVzdWx0O1xuXHRcdFx0XHRib29rRWRpdC5ib29rLmNvdmVySWQgPSByZXN1bHQuaWQ7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXJJZCA9IG51bGw7XG5cdFx0XHRcdGJvb2tFZGl0LmJvb2suY292ZXIgPSBudWxsO1xuXHRcdFx0XHRcblx0XHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBhcHBseSB0aGlzIGNvdmVyLiBUcnkgYW5vdGhlciBvbmUsIHBsZWFzZS4nKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjb3ZlcklucHV0VVJMID0gbnVsbDtcblx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRib29rRWRpdC5ib29rLmNvdmVySWQgPSBudWxsO1xuXHRcdFx0Ym9va0VkaXQuYm9vay5jb3ZlciA9IG51bGw7XG5cdFx0fVxuXHR9O1xuXG5cdGJvb2tFZGl0LnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFxuXHRcdGJsb2NrLmdsb2JhbC5zdGFydCgpO1xuXHRcdGRhdGEucG9zdEJvb2sodGhpcy5ib29rKS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdGlmKHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkKGR0by5pZCkpIHtcblx0XHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdH1cblxuXHRcdFx0ZW52aXJvbm1lbnQudXBkYXRlQm9vayhkdG8pO1xuXHRcdFx0c2NvcGUuY2FuY2VsKCk7XG5cdFx0XHRyZXR1cm4gY2F0YWxvZy5sb2FkQm9va3ModXNlci5nZXRJZCgpKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdCb29rIHNhdmUgZXJyb3InKTtcblx0XHRcdC8vVE9ETzogc2hvdyBlcnJvclxuXHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHR9KTtcblx0fTtcblxuXHRib29rRWRpdC5jYW5jZWwgPSBmdW5jdGlvbigpIHtcblx0XHRib29rRGlhbG9nLmNsb3NlKCk7XG5cdH07XG5cblx0cmV0dXJuIGJvb2tFZGl0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhdGFsb2cnLCBmdW5jdGlvbiAoJHEsIGRhdGEsIGJsb2NrKSB7XG5cdHZhciBjYXRhbG9nID0ge307XG5cblx0Y2F0YWxvZy5ib29rcyA9IG51bGw7XG5cblx0Y2F0YWxvZy5sb2FkQm9va3MgPSBmdW5jdGlvbih1c2VySWQpIHtcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdGlmKHVzZXJJZCkge1xuXHRcdFx0YmxvY2suaW52ZW50b3J5LnN0YXJ0KCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih1c2VySWQgPyBkYXRhLmdldFVzZXJCb29rcyh1c2VySWQpIDogbnVsbCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG5cdFx0XHRcdGNhdGFsb2cuYm9va3MgPSByZXN1bHQ7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YmxvY2suaW52ZW50b3J5LnN0b3AoKTtcdFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Y2F0YWxvZy5nZXRCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gXy5maW5kKGNhdGFsb2cuYm9va3MsIHtpZDogaWR9KTtcblx0fTtcblxuXHRyZXR1cm4gY2F0YWxvZztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdjcmVhdGVMaWJyYXJ5JywgZnVuY3Rpb24gKGRhdGEsIGVudmlyb25tZW50LCBkaWFsb2csIGJsb2NrLCBuZ0RpYWxvZykge1xuXHR2YXIgY3JlYXRlTGlicmFyeSA9IHt9O1xuXHRcblx0dmFyIEVNUFRZX0lNQUdFX1VSTCA9ICcvaW1nL2VtcHR5X2NvdmVyLmpwZyc7XG5cdHZhciBURU1QTEFURV9JRCA9ICdjcmVhdGVMaWJyYXJ5RGlhbG9nJztcblx0XG5cdHZhciBjcmVhdGVMaWJyYXJ5RGlhbG9nO1xuXG5cdGNyZWF0ZUxpYnJhcnkuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZUxpYnJhcnlEaWFsb2cgPSBuZ0RpYWxvZy5vcGVuKHtcblx0XHRcdHRlbXBsYXRlOiBURU1QTEFURV9JRFxuXHRcdH0pO1xuXHR9O1xuXG5cdGNyZWF0ZUxpYnJhcnkuZ2V0SW1nID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gbW9kZWwgPyAnL29iai9saWJyYXJpZXMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpIDogRU1QVFlfSU1BR0VfVVJMO1xuXHR9O1xuXG5cdGNyZWF0ZUxpYnJhcnkuY3JlYXRlID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRpZihtb2RlbCkge1xuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHRkYXRhLnBvc3RMaWJyYXJ5KG1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0ZW52aXJvbm1lbnQuZ29Ub0xpYnJhcnkocmVzdWx0LmlkKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBjcmVhdGUgbGlicmFyeSBiZWNhdXNlIG9mIGFuIGVycm9yLicpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Y3JlYXRlTGlicmFyeURpYWxvZy5jbG9zZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkaWFsb2cub3Blbldhcm5pbmcoJ1NlbGVjdCBsaWJyYXJ5LCBwbGVhc2UuJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBjcmVhdGVMaWJyYXJ5O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NyZWF0ZVNlY3Rpb24nLCBmdW5jdGlvbiAoJGxvZywgdXNlciwgZW52aXJvbm1lbnQsIGxvY2F0b3IsIGRpYWxvZywgYmxvY2ssIG5nRGlhbG9nKSB7XG5cdHZhciBjcmVhdGVTZWN0aW9uID0ge307XG5cdFxuXHR2YXIgRU1QVFlfSU1BR0VfVVJMID0gJy9pbWcvZW1wdHlfY292ZXIuanBnJztcblx0dmFyIFRFTVBMQVRFID0gJ2NyZWF0ZVNlY3Rpb25EaWFsb2cnO1xuXG5cdHZhciBjcmVhdGVTZWN0aW9uRGlhbG9nO1xuXG5cdGNyZWF0ZVNlY3Rpb24uc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGNyZWF0ZVNlY3Rpb25EaWFsb2cgPSBuZ0RpYWxvZy5vcGVuKHt0ZW1wbGF0ZTogVEVNUExBVEV9KTtcblx0fTtcblxuXHRjcmVhdGVTZWN0aW9uLmdldEltZyA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0cmV0dXJuIG1vZGVsID8gJy9vYmovc2VjdGlvbnMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpIDogRU1QVFlfSU1BR0VfVVJMO1xuXHR9O1xuXG5cdGNyZWF0ZVNlY3Rpb24uY3JlYXRlID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRpZihtb2RlbCkge1xuXHRcdFx0dmFyIHNlY3Rpb25EYXRhID0ge1xuXHRcdFx0XHRtb2RlbDogbW9kZWwsXG5cdFx0XHRcdGxpYnJhcnlJZDogZW52aXJvbm1lbnQubGlicmFyeS5pZCxcblx0XHRcdFx0dXNlcklkOiB1c2VyLmdldElkKClcblx0XHRcdH07XG5cblx0XHRcdHBsYWNlKHNlY3Rpb25EYXRhKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlhbG9nLm9wZW5XYXJuaW5nKCdTZWxlY3QgbW9kZWwsIHBsZWFzZS4nKTtcblx0XHR9XHRcblx0fTtcblxuXHR2YXIgcGxhY2UgPSBmdW5jdGlvbihkdG8pIHtcblx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRsb2NhdG9yLnBsYWNlU2VjdGlvbihkdG8pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0ZGlhbG9nLm9wZW5FcnJvcignQ2FuIG5vdCBjcmVhdGUgc2VjdGlvbiBiZWNhdXNlIG9mIGFuIGVycm9yLicpO1xuXHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RvcCgpO1xuXHRcdH0pO1x0XG5cblx0XHRjcmVhdGVTZWN0aW9uRGlhbG9nLmNsb3NlKCk7XG5cdH07XG5cblx0cmV0dXJuIGNyZWF0ZVNlY3Rpb247XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnZmVlZGJhY2snLCBmdW5jdGlvbiAoZGF0YSwgZGlhbG9nLCBuZ0RpYWxvZykge1xuXHR2YXIgZmVlZGJhY2sgPSB7fTtcblx0dmFyIGZlZWRiYWNrRGlhbG9nO1xuXG5cdHZhciBURU1QTEFURSA9ICdmZWVkYmFja0RpYWxvZyc7XG5cblx0ZmVlZGJhY2suc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdGZlZWRiYWNrRGlhbG9nID0gbmdEaWFsb2cub3Blbih7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0ZmVlZGJhY2suc2VuZCA9IGZ1bmN0aW9uKGR0bykge1xuXHRcdGRpYWxvZy5vcGVuQ29uZmlybSgnU2VuZCBmZWVkYmFjaz8nKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBkYXRhLnBvc3RGZWVkYmFjayhkdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmZWVkYmFja0RpYWxvZy5jbG9zZSgpO1xuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkaWFsb2cub3BlbkVycm9yKCdDYW4gbm90IHNlbmQgZmVlZGJhY2sgYmVjYXVzZSBvZiBhbiBlcnJvci4nKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiBmZWVkYmFjaztcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsaW5rQWNjb3VudCcsIGZ1bmN0aW9uICh1c2VyLCBuZ0RpYWxvZykge1xuXHR2YXIgbGlua0FjY291bnQgPSB7fTtcblxuXHR2YXIgVEVNUExBVEUgPSAnbGlua0FjY291bnREaWFsb2cnO1xuXG5cdGxpbmtBY2NvdW50LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRuZ0RpYWxvZy5vcGVuKHt0ZW1wbGF0ZTogVEVNUExBVEV9KTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0dvb2dsZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNHb29nbGUoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc1R3aXR0ZXJTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzVHdpdHRlcigpO1xuXHR9O1xuXG5cdGxpbmtBY2NvdW50LmlzRmFjZWJvb2tTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICF1c2VyLmlzRmFjZWJvb2soKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc1Zrb250YWt0ZVNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXVzZXIuaXNWa29udGFrdGUoKTtcblx0fTtcblxuXHRsaW5rQWNjb3VudC5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLmlzR29vZ2xlU2hvdygpIHx8IFxuXHRcdFx0dGhpcy5pc1R3aXR0ZXJTaG93KCkgfHwgXG5cdFx0XHR0aGlzLmlzRmFjZWJvb2tTaG93KCkgfHwgXG5cdFx0XHR0aGlzLmlzVmtvbnRha3RlU2hvdygpO1xuXHR9O1xuXG5cdHJldHVybiBsaW5rQWNjb3VudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtYWluTWVudScsIGZ1bmN0aW9uICgkbG9nLCBkYXRhLCBib29rRWRpdCwgZmVlZGJhY2ssIHNlbGVjdExpYnJhcnksIGNyZWF0ZUxpYnJhcnksIGNyZWF0ZVNlY3Rpb24sIGxpbmtBY2NvdW50LCBhdXRob3JpemF0aW9uKSB7XG5cdHZhciBtYWluTWVudSA9IHt9O1xuXHRcblx0dmFyIHNob3cgPSBmYWxzZTtcblx0dmFyIGNyZWF0ZUxpc3RTaG93ID0gZmFsc2U7XG5cblx0bWFpbk1lbnUuaXNTaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHNob3c7XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRzaG93ID0gdHJ1ZTtcblx0fTtcblxuXHRtYWluTWVudS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0c2hvdyA9IGZhbHNlO1xuXHR9O1xuXG5cdG1haW5NZW51LmlzQ3JlYXRlTGlzdFNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3JlYXRlTGlzdFNob3c7XG5cdH07XG5cblx0bWFpbk1lbnUuY3JlYXRlTGlzdFNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0Y3JlYXRlTGlzdFNob3cgPSB0cnVlO1xuXHR9O1xuXG5cdG1haW5NZW51LmNyZWF0ZUxpc3RIaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0Y3JlYXRlTGlzdFNob3cgPSBmYWxzZTtcblx0fTtcblxuXHRtYWluTWVudS5oaWRlQWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZSgpO1xuXHRcdG1haW5NZW51LmNyZWF0ZUxpc3RIaWRlKCk7XG5cdH07XG5cblx0bWFpbk1lbnUudHJpZ2dlciA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKG1haW5NZW51LmlzU2hvdygpKSB7XG5cdFx0XHRtYWluTWVudS5oaWRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1haW5NZW51LnNob3coKTtcblx0XHR9XG5cdH07XG5cblx0bWFpbk1lbnUuc2hvd0ZlZWRiYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0bWFpbk1lbnUuaGlkZUFsbCgpO1xuXHRcdGZlZWRiYWNrLnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93U2VsZWN0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRzZWxlY3RMaWJyYXJ5LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93Q3JlYXRlTGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRjcmVhdGVMaWJyYXJ5LnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93Q3JlYXRlU2VjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRcdG1haW5NZW51LmhpZGVBbGwoKTtcblx0XHRjcmVhdGVTZWN0aW9uLnNob3coKTtcblx0fTtcblxuXHRtYWluTWVudS5zaG93TGlua0FjY291bnQgPSBmdW5jdGlvbigpIHtcblx0XHRtYWluTWVudS5oaWRlQWxsKCk7XG5cdFx0bGlua0FjY291bnQuc2hvdygpO1xuXHR9O1xuXG5cdG1haW5NZW51LmlzTGlua0FjY291bnRBdmFpbGFibGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIWF1dGhvcml6YXRpb24uaXNTaG93KCkgJiYgbGlua0FjY291bnQuaXNBdmFpbGFibGUoKTtcblx0fTtcblxuXHRyZXR1cm4gbWFpbk1lbnU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgncmVnaXN0cmF0aW9uJywgZnVuY3Rpb24gKCRsb2csIHVzZXIsIGRhdGEsIGRpYWxvZywgdXNlckRhdGEsIG5nRGlhbG9nKSB7XG5cdHZhciByZWdpc3RyYXRpb24gPSB7fTtcblxuXHR2YXIgRk9STV9WQUxJREFUSU9OX0VSUk9SID0gJ0VudGVyIGEgdmFsaWQgZGF0YSwgcGxlYXNlLic7XG5cdHZhciBTQVZFX1VTRVJfRVJST1IgPSAnRXJyb3Igc2F2aW5nIHVzZXIuIFRyeSBhZ2FpbiwgcGxlYXNlLic7XG5cdHZhciBURU1QTEFURSA9ICdyZWdpc3RyYXRpb25EaWFsb2cnO1xuXG5cdHJlZ2lzdHJhdGlvbi51c2VyID0ge1xuXHRcdGlkOiBudWxsLFxuXHRcdG5hbWU6IG51bGwsXG5cdFx0ZW1haWw6IG51bGwsXG5cdFx0dGVtcG9yYXJ5OiBmYWxzZVxuXHR9O1xuXG5cdHJlZ2lzdHJhdGlvbi5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVnaXN0cmF0aW9uLnVzZXIuaWQgPSB1c2VyLmdldElkKCk7XG5cdFx0cmVnaXN0cmF0aW9uLnVzZXIubmFtZSA9IHVzZXIuZ2V0TmFtZSgpO1xuXHRcdHJlZ2lzdHJhdGlvbi51c2VyLmVtYWlsID0gdXNlci5nZXRFbWFpbCgpO1xuXG5cdFx0cmV0dXJuIG5nRGlhbG9nLm9wZW5Db25maXJtKHt0ZW1wbGF0ZTogVEVNUExBVEV9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBzYXZlVXNlcigpO1xuXHRcdH0sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBkZWxldGVVc2VyKCk7XG5cdFx0fSk7XG5cdH07XG5cblx0cmVnaXN0cmF0aW9uLnNob3dWYWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHRkaWFsb2cub3BlbkVycm9yKEZPUk1fVkFMSURBVElPTl9FUlJPUik7XG5cdH07XG5cblx0dmFyIHNhdmVVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGRhdGEucHV0VXNlcihyZWdpc3RyYXRpb24udXNlcikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0cmV0dXJuIHVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgIFx0XHRcdHJldHVybiB1c2VyRGF0YS5sb2FkKCk7XG4gICAgICAgIFx0fSk7XHRcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRkaWFsb2cub3BlbkVycm9yKFNBVkVfVVNFUl9FUlJPUik7XG5cdFx0XHQkbG9nLmxvZygnUmVnaXN0cmF0aW9uOiBFcnJvciBzYXZpbmcgdXNlcjonLCByZWdpc3RyYXRpb24udXNlci5pZCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGRlbGV0ZVVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVVc2VyKHJlZ2lzdHJhdGlvbi51c2VyLmlkKTtcblx0fTtcblxuXHRyZXR1cm4gcmVnaXN0cmF0aW9uO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ3NlbGVjdExpYnJhcnknLCBmdW5jdGlvbiAoJHEsIGRhdGEsIGVudmlyb25tZW50LCB1c2VyLCBuZ0RpYWxvZykge1xuXHR2YXIgc2VsZWN0TGlicmFyeSA9IHt9O1xuXG5cdHZhciBURU1QTEFURSA9ICdzZWxlY3RMaWJyYXJ5RGlhbG9nJztcblxuXHRzZWxlY3RMaWJyYXJ5Lmxpc3QgPSBbXTtcblxuXHRzZWxlY3RMaWJyYXJ5LnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRuZ0RpYWxvZy5vcGVuQ29uZmlybSh7dGVtcGxhdGU6IFRFTVBMQVRFfSk7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBzZWxlY3RMaWJyYXJ5Lmxpc3QubGVuZ3RoID4gMDtcblx0fTtcblxuXHRzZWxlY3RMaWJyYXJ5LmlzVXNlckxpYnJhcnkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQubGlicmFyeSAmJiBlbnZpcm9ubWVudC5saWJyYXJ5LmRhdGFPYmplY3QudXNlcklkID09PSB1c2VyLmdldElkKCk7XG5cdH07XG5cblx0c2VsZWN0TGlicmFyeS51cGRhdGVMaXN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHR2YXIgcHJvbWlzZTtcblxuXHRcdGlmKHVzZXIuaXNBdXRob3JpemVkKCkpIHtcblx0XHQgICAgcHJvbWlzZSA9IGRhdGEuZ2V0TGlicmFyaWVzKCkudGhlbihmdW5jdGlvbiAobGlicmFyaWVzKSB7XG5cdCAgICAgICAgICAgIHNjb3BlLmxpc3QgPSBsaWJyYXJpZXM7XG5cdCAgICBcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzY29wZS5saXN0ID0gW107XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbihzY29wZS5saXN0KTtcblx0XHR9XG5cbiAgICBcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHNlbGVjdExpYnJhcnkuZ28gPSBlbnZpcm9ubWVudC5nb1RvTGlicmFyeTtcblxuXHRyZXR1cm4gc2VsZWN0TGlicmFyeTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCd0b29scycsIGZ1bmN0aW9uICgkcSwgJGxvZywgQm9va09iamVjdCwgU2VjdGlvbk9iamVjdCwgU2hlbGZPYmplY3QsIFNlbGVjdG9yTWV0YUR0bywgZGF0YSwgc2VsZWN0b3IsIGRpYWxvZywgYmxvY2ssIGNhdGFsb2csIGVudmlyb25tZW50LCBwcmV2aWV3LCB1c2VyLCBsb2NhdG9yLCBncm93bCkge1xuXHR2YXIgdG9vbHMgPSB7fTtcblxuXHR2YXIgUk9UQVRJT05fU0NBTEUgPSAxO1xuXG5cdHZhciBzdGF0ZXMgPSB7XG5cdFx0cm90YXRlTGVmdDogZmFsc2UsXG5cdFx0cm90YXRlUmlnaHQ6IGZhbHNlXG5cdH07XG5cblx0dG9vbHMucGxhY2UgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZWN0ZWREdG87XG5cdFx0dmFyIGZvY3VzZWRPYmplY3QgPSBzZWxlY3Rvci5nZXRGb2N1c2VkT2JqZWN0KCk7XG5cblx0XHRpZihmb2N1c2VkT2JqZWN0IGluc3RhbmNlb2YgU2hlbGZPYmplY3QpIHtcblx0XHRcdHNlbGVjdG9yLnBsYWNpbmcgPSBmYWxzZTtcblx0XHRcdHNlbGVjdGVkRHRvID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKTtcblxuXHRcdFx0YmxvY2suZ2xvYmFsLnN0YXJ0KCk7XG5cdFx0XHRsb2NhdG9yLnBsYWNlQm9vayhzZWxlY3RlZER0bywgZm9jdXNlZE9iamVjdCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gY2F0YWxvZy5nZXRCb29rKHNlbGVjdGVkRHRvLmlkKTtcblx0XHRcdFx0c2VsZWN0b3Iuc2VsZWN0KG5ldyBTZWxlY3Rvck1ldGFEdG8oQm9va09iamVjdC5UWVBFLCBib29rRHRvLmlkLCBib29rRHRvLnNoZWxmSWQpKTtcblx0XHRcdFx0Z3Jvd2wuc3VjY2VzcygnQm9vayBwbGFjZWQnKTtcblx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHRncm93bC5lcnJvcihlcnJvcik7XG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGJsb2NrLmdsb2JhbC5zdG9wKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Z3Jvd2wuZXJyb3IoJ1NoZWxmIGlzIG5vdCBzZWxlY3RlZCcpO1xuXHRcdH1cblx0fTtcblxuXHR0b29scy51bnBsYWNlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGJvb2tEdG8gPSBzZWxlY3Rvci5pc1NlbGVjdGVkQm9vaygpID8gc2VsZWN0b3IuZ2V0U2VsZWN0ZWREdG8oKSA6IG51bGw7XG5cblx0XHRpZihib29rRHRvKSB7XG5cdFx0XHRibG9jay5nbG9iYWwuc3RhcnQoKTtcblx0XHRcdGxvY2F0b3IudW5wbGFjZUJvb2soYm9va0R0bykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGdyb3dsLnN1Y2Nlc3MoJ0Jvb2sgdW5wbGFjZWQnKTtcblx0XHRcdFx0cmV0dXJuIGNhdGFsb2cubG9hZEJvb2tzKHVzZXIuZ2V0SWQoKSk7XHRcdFxuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdGdyb3dsLmVycm9yKGVycm9yKTtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0YmxvY2suZ2xvYmFsLnN0b3AoKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHR0b29scy5kZWxldGVCb29rID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gZGF0YS5kZWxldGVCb29rKGlkKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKGlkKTtcblx0XHRcdHJldHVybiBjYXRhbG9nLmxvYWRCb29rcyh1c2VyLmdldElkKCkpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHRvb2xzLmRlbGV0ZVNlY3Rpb24gPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiBkYXRhLmRlbGV0ZVNlY3Rpb24oaWQpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdGVudmlyb25tZW50LnJlbW92ZVNlY3Rpb24oaWQpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHRvb2xzLnJvdGF0ZUxlZnQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlTGVmdCA9IHRydWU7XG5cdH07XG5cblx0dG9vbHMucm90YXRlUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlUmlnaHQgPSB0cnVlO1xuXHR9O1xuXG5cdHRvb2xzLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRzdGF0ZXMucm90YXRlTGVmdCA9IGZhbHNlO1xuXHRcdHN0YXRlcy5yb3RhdGVSaWdodCA9IGZhbHNlO1xuXHR9O1xuXG5cdHRvb2xzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKHN0YXRlcy5yb3RhdGVMZWZ0KSB7XG5cdFx0XHRyb3RhdGUoUk9UQVRJT05fU0NBTEUpO1xuXHRcdH0gZWxzZSBpZihzdGF0ZXMucm90YXRlUmlnaHQpIHtcblx0XHRcdHJvdGF0ZSgtUk9UQVRJT05fU0NBTEUpO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgcm90YXRlID0gZnVuY3Rpb24oc2NhbGUpIHtcblx0XHR2YXIgb2JqO1xuXG5cdFx0aWYocHJldmlldy5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRwcmV2aWV3LnJvdGF0ZShzY2FsZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9iaiA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHRpZihvYmopIG9iai5yb3RhdGUoc2NhbGUpO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gdG9vbHM7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgndG9vbHRpcCcsIGZ1bmN0aW9uICgpIHtcblx0dmFyIHRvb2x0aXAgPSB7fTtcblxuXHR0b29sdGlwLm9iaiA9IHt9O1xuXG5cdHRvb2x0aXAuc2V0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0aWYob2JqKSB7XG5cdFx0XHR0aGlzLm9iai50eXBlID0gb2JqLnR5cGU7XG5cdFx0XHR0aGlzLm9iai50aXRsZSA9IG9iai5kYXRhT2JqZWN0LnRpdGxlO1xuXHRcdFx0dGhpcy5vYmouYXV0aG9yID0gb2JqLmRhdGFPYmplY3QuYXV0aG9yO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm9iai50eXBlID0gbnVsbDtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIHRvb2x0aXA7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgndXNlckRhdGEnLCBmdW5jdGlvbiAoJHEsIHNlbGVjdExpYnJhcnksIGNhdGFsb2csIHVzZXIpIHtcblx0dmFyIHVzZXJEYXRhID0ge307XG5cblx0dXNlckRhdGEubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkcS5hbGwoW1xuXHRcdFx0c2VsZWN0TGlicmFyeS51cGRhdGVMaXN0KCksIFxuXHRcdFx0Y2F0YWxvZy5sb2FkQm9va3ModXNlci5nZXRJZCgpKVxuXHRcdF0pO1xuXHR9O1xuXG5cdHJldHVybiB1c2VyRGF0YTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==