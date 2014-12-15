var Library = require('../models').Library;

exports.getLibraries = function(req, res) {
	Library.findAll({where: {userId: req.user.id}}, {raw: true}).success(function (result) {
		res.json(result);
		console.log('ROUTE getLibraries: ', result);
	}).failure(function (error) {
		res.send(500);
		console.log('ROUTE getLibraries error: ', error);
	});
};

exports.postLibrary = function(req, res) {
	Library.create({userId: req.user.id, model: req.params.libraryModel}).success(function (result) {
		res.json(result);
		console.log('ROUTE postLibrary: ', result);
	}).failure(function (error) {
		res.send(500);
		console.log('ROUTE postLibrary error: ', error);
	});
};

exports.getLibrary = function(req, res) {
	Library.getWholeLibrary(req.params.libraryId).then(function (result) {
  		res.json(result);
		// console.log('ROUTE getLibrary:', result);
	}, function (error) {
		res.send(500);
		console.log('ROUTE getLibrary:', error);
	});
};