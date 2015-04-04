var User = require('../models').User;

exports.getUser = function(req, res, next) {
	User.getUser(req.user.id, function(err, result) {
		res.result = result;
		next(err);
	});
};

exports.putUser = function(req, res) {
	var dto = req.body;

	if(dto.id == req.user.id) {
		User.saveUser(dto).then(function () {
			res.send(204);
		}).catch(function () {
			res.send(500);
		});
	} else {
		res.send(403);
	}
};

exports.deleteUser = function(req, res) {
	if(req.params.id == req.user.id && req.user.temporary) {
		User.find(req.params.id).then(function (user) {
			return user.destroy();
		}).then(function () {
			res.send(204);
		}).catch(function () {
			res.send(500);
		});
	} else {
		res.send(403);
	}
};