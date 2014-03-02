exports.index = function(req, res){
	var user = req.user;
  	res.render('index', {user: user});
};

exports.getOutside = function(req, res) {
	res.redirect(req.query.link);
}

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');