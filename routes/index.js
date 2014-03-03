var request = require('request');
exports.index = function(req, res){
	var user = req.user;
  	res.render('index', {user: user});
};

exports.getOutside = function(req, res) {
	// res.proxy(req.query.link);
	//**
	try {
		console.log('try link',req.query.link);
		request(req.query.link).pipe(res);
	} catch(exception) {
		res.send(404);
		console.log('catch link',exception);
	}
  //****
}

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');