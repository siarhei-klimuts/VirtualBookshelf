var Book = require('../models').Book;
var Cover = require('../models').Cover;

exports.postBook = function(req, res) {
	var dto = req.body;
	var newTags = [dto.title, dto.author];

	Book.saveBook(dto, req.user.id).then(function (result) {
		res.json(result);
		return Cover.updateTags(dto.coverId, newTags);
	}).catch(function (err) {
		res.send(500);	
		console.log('ROUTE postBook: ', err);		
	});
};

exports.getBooks = function(req, res){
	Book.findAll({
		where: {sectionId: req.params.sectionId}
	}, {raw: true})
	.success(function (result) {
  		res.json(result);
	})
	.failure(function (err){
		res.send(500);
		console.log('ROUTE getBooks: ', err);
	});
};

exports.getFreeBooks = function(req, res) {
	if(req.params.userId == req.user.id) {
		Book.getFreeBooks(req.params.userId, function(err, result) {
			if(!err && result) {
	  			res.json(result);
			} else {
				res.send(500);
				console.error('ROUTE getFreeBooks: ', result);
			}
		});
	} else {
		res.send(500);
	}
};

exports.deleteBook = function(req, res) {
	var bookId = req.params.id;

	Book.deleteBook(bookId, req.user.id).then(function () {
		res.send(200);
	}).catch(function (err) {
		console.error('ROUTE deleteBook: ', err);
		res.send(500);
	});
};