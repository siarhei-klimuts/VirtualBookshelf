exports.index = function(req, res){
	var user = req.user;
  	res.render('index', {user: user});
};

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');