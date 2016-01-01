import * as repository from './scene/repository';

angular.module('VirtualBookshelf')
.factory('cache', function ($q) {
	var cache = {};

	var library = null;
	var sections = {};
	var books = {};

	cache.init = function(libraryModel, sectionModels, bookModels) {
		var libraryLoad = repository.loadLibraryData(libraryModel);
		var sectionsLoad = [];
		var booksLoad = [];
		var model; // iterators

		for (model in sectionModels) {
			sectionsLoad.push(addSection(model));
		}

		for (model in bookModels) {
			booksLoad.push(addBook(model));
		}

		var promise = $q.all({
			libraryCache: libraryLoad, 
			sectionsLoad: $q.all(sectionsLoad), 
			booksLoad: $q.all(booksLoad)
		}).then(function (results) {
			library = {
				geometry: results.libraryCache[0],
				mapImage: results.libraryCache[1]
			};
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

	var addSection = function(model) {
		return commonAdder(sections, model, repository.loadSectionData);
	};

	var addBook = function(model) {
		return commonAdder(books, model, repository.loadBookData);
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

	return cache;
});