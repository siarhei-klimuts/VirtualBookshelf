var cloudinary = require('cloudinary').v2;
var Cover = require('../models').Cover;

exports.getCover = function(req, res) {
	Cover.find(req.params.id).then(function (cover) {
		res.send(cover);
	}).catch(function (error) {
		res.send(500);
		console.error('getCover: ', error);
	});
};

exports.postCover = function(req, res) {
	var externalURL = req.body.url;
	var tags = req.body.tags;

	if(isValidURL(externalURL)) {
		uploadCover(externalURL, tags).then(function (uploadResult) {
			return saveCover(uploadResult, tags);
		}).then(function (savedCover) {
			res.send(savedCover);
		}).catch(function () {
			res.send(500);
		});
	} else {
		res.send(500);
	}
};

function uploadCover(externalURL, tags) {
	return cloudinary.uploader.upload(externalURL, {
		tags: tags,
		format: 'jpg',
		width: 512,
		height: 512,
		colors: true,
		folder: 'vb/books/covers'
	});
}

function saveCover(uploadResult, tags) {
	var cover = {
		url: uploadResult.url,
		tags: Cover.mergeTags(null, tags),
		color: uploadResult.colors ? uploadResult.colors[0][0] : null
	};

	return Cover.create(cover);
}

function isValidURL(url) {
	return url && url.match(/^https?:|^s3:|^data:[^;]*;base64,([a-zA-Z0-9\/+\n=]+)$/);
}