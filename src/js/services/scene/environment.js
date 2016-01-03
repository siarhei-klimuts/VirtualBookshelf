import THREE from 'three';

import BookMaterial from '../materials/BookMaterial';
import LibraryObject from '../models/LibraryObject';
import BookObject from '../models/BookObject';
import SectionObject from '../models/SectionObject';

import camera from './camera';
import {locator} from './locator';
import * as cache from './cache';
import * as repository from './repository';

var environment = {};

environment.CLEARANCE = 0.001;
 
var libraryDto = null;
var sections = {};
var books = {};

environment.scene = null;
environment.library = null;

environment.loadLibrary = function(dto) {
	clearScene(); // inits some fields

	var dict = parseLibraryDto(dto);
		
	sections = dict.sections;
	books = dict.books;
	libraryDto = dto;

	return initCache(libraryDto, dict.sections, dict.books)
	.then(function () {
		createLibrary(libraryDto);
		return createSections(sections);
	})
	.then(function () {
		return locator.centerObject(camera.object);
	})
	.then(function () {
		return createBooks(books);
	});
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

environment.updateSection = function(dto) {
	if(dto.libraryId == environment.library.getId()) {
		environment.removeSection(dto.id);
		return createSection(dto);
	} else {
		environment.removeSection(dto.id);
		return Promise.resolve(dto);
	}
};

environment.updateBook = function(dto) {
	if(getBookShelf(dto)) {
		environment.removeBook(dto.id);
		return createBook(dto);
	} else {
		environment.removeBook(dto.id);
		return Promise.resolve(true);
	}
};

environment.removeBook = function(id) {
	removeObject(books, id);
};

environment.removeSection = function(id) {
	removeObject(sections, id);
};

function removeObject(dict, key) {
	var dictItem = dict[key];
	if(dictItem) {
		delete dict[key];
		
		if(dictItem.obj) {
			dictItem.obj.setParent(null);
		}
	}
}

function initCache(libraryDto, sectionsDict, booksDict) {
	var libraryModel = libraryDto.model;
	var sectionModels = {};
	var bookModels = {};

	for (var sectionId in sectionsDict) {
		var sectionDto = sectionsDict[sectionId].dto;
		sectionModels[sectionDto.model] = true;
	}

	for (var bookId in booksDict) {
		var bookDto = booksDict[bookId].dto;
		bookModels[bookDto.model] = true;
	}

	return cache.init(libraryModel, sectionModels, bookModels);
}

function clearScene() {
	environment.library = null;
	sections = {};
	books = {};

	while(environment.scene.children.length > 0) {
		if(environment.scene.children[0].dispose) {
			environment.scene.children[0].dispose();
		}
		environment.scene.remove(environment.scene.children[0]);
	}
}

function parseLibraryDto(libraryDto) {
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
}

function createLibrary(libraryDto) {
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
}

function createSections(sectionsDict) {
	return createObjects(sectionsDict, createSection);
}

function createBooks(booksDict) {
	return createObjects(booksDict, createBook);
}

function createObjects(dict, factory) {
	var results = [];
	var key;

	for(key in dict) {
		results.push(factory(dict[key].dto));
	}

	return Promise.all(results);
}

function createSection(sectionDto) {
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
}

function createBook(bookDto) {
	return Promise.all([
		cache.getBook(bookDto.model),
		bookDto.cover ? repository.loadImage(bookDto.cover.url) : Promise.resolve(null)
	]).then(function (results) {
		var bookCache = results[0];
		var coverMapImage = results[1];
		var material = new BookMaterial(bookCache.mapImage, bookCache.bumpMapImage, bookCache.specularMapImage, coverMapImage);
		var book = new BookObject(bookDto, bookCache.geometry, material);

		addToDict(books, book);
		placeBookOnShelf(book);
	});
}

function addToDict(dict, obj) {
	var dictItem = {
		dto: obj.dataObject,
		obj: obj
	};

	dict[obj.getId()] = dictItem;
}

function getDictObject(dict, objectId) {
	var dictItem = dict[objectId];
	var dictObject = dictItem && dictItem.obj;

	return dictObject;
}

function getBookShelf(bookDto) {
	return environment.getShelf(bookDto.sectionId, bookDto.shelfId);
}

function placeBookOnShelf(book) {
	var shelf = getBookShelf(book.dataObject);
	shelf.add(book);
}

export default environment;