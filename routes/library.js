var library = require('../models/library');

exports.library = function(req, res){
	library.getLibrary(req.user.id, function(err, library) {
  		res.json(library);
	});
}

exports.sections = function(req, res){
	library.getSections(req.params.libraryId, function(err, sections) {
  		res.json(sections);
	});
};

exports.shelves = function(req, res){
	library.getShelves(req.params.sectionId, function(err, shelves) {
  		res.json(shelves);
	});
};

exports.books = function(req, res){
	library.getBooks(req.params.shelfId, function(err, books) {
  		res.json(books);
	});
};