import * as repository from './scene/repository';

angular.module('VirtualBookshelf')
.factory('cache', function () {
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

		return Promise.all([
			libraryLoad, 
			Promise.all(sectionsLoad), 
			Promise.all(booksLoad)
		]).then(results => {
			library = results[0];
		});
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

		return Promise.resolve(result);
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