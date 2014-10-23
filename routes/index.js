var request = require('request');

exports.index = function(req, res) {
  	res.render('index');
};

exports.getOutside = function(req, res) {
	try {
		console.log('getOutside', req.query.link);
		request(req.query.link).pipe(res);
	} catch(exception) {
		console.error('getOutside', exception);
		res.send(404);
	}
}

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');
exports.feedback = require('./feedback');
exports.user = require('./user');