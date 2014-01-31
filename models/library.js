module.exports = function(sequelize, DataTypes) {
	return sequelize.define('library', {
	}, {timestamps: false});
}
// //*****
// var libraryDao = require('../dao/libraryDao');

// exports.getLibrary = function(userId, done) {
// 	libraryDao.getLibraryByUser(userId, function(err, library) {
// 		done(err, library);
// 	});
// }

// exports.getSections = function(libraryId, done) {
// 	libraryDao.getLibrarySections(libraryId, function(err, sections) {
// 		done(err, sections);
// 	});
// }

// exports.saveSections = function(sections, done) {
// 	libraryDao.saveLibrarySections(sections, function(err, result) {
// 		done(err, result);
// 	});
// }

// exports.getShelves = function(sectionId, done) {
// 	libraryDao.getSectionShelves(sectionId, function(err, shelves) {
// 		done(err, shelves);
// 	});
// }

// exports.getBooks = function(shelfId, done) {
// 	libraryDao.getShelfBooks(shelfId, function(err, books) {
// 		done(err, books);
// 	});
// }