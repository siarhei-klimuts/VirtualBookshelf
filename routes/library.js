var models = require('../models');

exports.getLibraries = function(req, res) {
	models.Library.findAll({where: {userId: req.user.id}}, {raw: true})
	.success(function (result) {
		res.json(result);
		console.log('ROUTE getLibraries: ', result);
	})
	.failure(function (error) {
		res.send(500);
		console.log('ROUTE getLibraries error: ', error);
	});
}

exports.postLibrary = function(req, res) {
	models.Library.create({userId: req.user.id, model: req.params.libraryModel})
	.success(function (result) {
		res.json(result);
		console.log('ROUTE postLibrary: ', result);
	})
	.failure(function (error) {
		res.send(500);
		console.log('ROUTE postLibrary error: ', error);
	});
}

exports.getLibrary = function(req, res) {
	models.Library.find({
		where: {id: req.params.libraryId}
	}, {raw: true})
	.success(function (result) {
  		res.json(result);
		console.log('ROUTE: library: ', result);
	})
	.failure(function (err) {
		res.send(500);
		console.log('ROUTE: library: ', err);
	});
}