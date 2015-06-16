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