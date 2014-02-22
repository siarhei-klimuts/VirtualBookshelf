var request = require('request');

exports.index = function(req, res){
	var user = req.user;
  	res.render('index', {user: user});
};

exports.getOutside = function(req, res) {
	var link = req.query.link;
	try {
		request(link).pipe(res);
	} catch(exception) {
		res.send(304);
		console.log('catch link',exception);
	}
}

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');