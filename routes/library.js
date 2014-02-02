var models = require('../models');

exports.getLibraries = function(req, res) {
	models.Library.findAll({where: {userId: req.user.id}}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE getLibraries: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE getLibraries error: ', error);
	});
}

exports.getLibraryObjects = function(req, res) {
	models.LibraryObject.findAll({}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE getLibraryObjects: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE getLibraryObjects error: ', error);
	});
}

exports.postLibrary = function(req, res) {
	models.Library.create({userId: req.user.id, libraryObjectId: req.params.libraryObjectId}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE postLibrary: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE postLibrary error: ', error);
	});
}

exports.getLibrary = function(req, res) {
	models.Library.find({
		where: {userId: req.user.id, id: req.params.libraryId}, 
		include: [{
			model: models.LibraryObject
		}]
	}, {raw: true})
	.success(function(result) {
  		res.json(result);
		console.log('ROUTE: library: ', result);
	})
	.failure(function(err) {
		res.send(500);
		console.log('ROUTE: library: ', err);
	});
}

exports.getShelves = function(req, res){
	models.Shelf.findAll({where: {sectionObjectId: req.params.sectionObjectId}}, {raw: true})
	.success(function(result) {
  		res.json(result);
		console.log('ROUTE: shelves GET: ', result);
	})
	.failure(function(err){
		res.send(500);
		console.log('ROUTE: shelves: ', err);
	});
};