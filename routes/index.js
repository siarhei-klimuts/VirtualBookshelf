var request = require('request');
var cloudinary = require('cloudinary');

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

exports.postArchive = function(req, res) {
	var externalURL = req.body.url;
	var tags = req.body.tags;

	if(externalURL && externalURL.match(/^https?:|^s3:|^data:[^;]*;base64,([a-zA-Z0-9\/+\n=]+)$/)) {
		cloudinary.uploader.upload(externalURL, function (result) {
			res.send(result.error ? result.error.http_code : result);
		}, {
			tags: tags,
			format: 'jpg',
			width: 256,
			height: 256,
			colors: true,
			folder: 'vb/books/covers'
		});
	} else {
		res.send(500);
	}
};

exports.getOutside = function(req, res) {
	try {
		console.log('getOutside', req.query.link);
		request(req.query.link).pipe(res);
	} catch(exception) {
		console.error('getOutside', exception);
		res.send(404);
	}
};

exports.library = require('./library');
exports.section = require('./section');
exports.book = require('./book');
exports.feedback = require('./feedback');
exports.user = require('./user');