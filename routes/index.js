var library = require('./library');

exports.index = function(req, res){
	var user = req.user || {email: 'Guest'};
  	res.render('index', { user: user });
};

exports.library = library.library;
exports.sections = library.sections;
exports.shelves = library.shelves;
exports.books = library.books;