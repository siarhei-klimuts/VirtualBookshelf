exports.index = function(req, res) {
  	res.render('index');
};

exports.ui = function(req, res) {
	res.render('ui/' + req.params.page);
};

exports.page = function(req, res) {
	res.render('auth');
};

exports.logout = function(req, res) {
	req.logout();
	res.send(200);
};

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');
exports.feedback = require('./feedback');
exports.user = require('./user');
exports.cover = require('./cover');