var models = require('../models');

exports.getUser = function(req, res, next) {
	models.User.getUser(req.user.id, function(err, result) {
		res.result = result;
		next(err);
	});
};

exports.putUser = function(req, res, next) {
	var dataObject = req.body;
	dataObject.id = req.user.id;

	models.User.saveUser(dataObject, function(err, result) {
		res.result = result;
		next(err);
	});
};