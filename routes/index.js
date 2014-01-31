exports.index = function(req, res){
	var user = req.user || {email: 'Guest'};
  	res.render('index', {user: user});
};

exports.library = library = require('./library');