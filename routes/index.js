var request = require('request');

exports.index = function(req, res){
	var user = req.user;
  	res.render('index', {user: user});
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