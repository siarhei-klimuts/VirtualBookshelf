var Book = require('../models').Book;
var Cover = require('../models').Cover;

exports.postBook = function(req, res) {
	var dto = req.body;
	var newTags = [];

	Book.saveBook(dto, req.user.id).then(function (result) {
		res.json(result);

		if(dto.title) newTags.push(dto.title);
		if(dto.author) newTags.push(dto.author);
		
		return newTags.length > 0 ? Cover.updateTags(result.coverId, newTags) : null;
	}).catch(function (err) {
		res.send(500);	
		console.log('ROUTE postBook: ', err);		
	});
};

exports.getFreeBooks = function(req, res) {
	if(req.params.userId == req.user.id) {
		getFreeBooks(req.params.userId).then(function (books) {
  			res.json(books);
		}).catch(function (err) {
			res.send(500);
			console.error('ROUTE getFreeBooks: ', err);
		});
	} else {
		res.send(500);
	}
};

function getFreeBooks(userId) {
	return Book.findAll({
		where: {userId: userId},
		include: [Cover]
	}, {raw: false});
}

exports.deleteBook = function(req, res) {
	var bookId = req.params.id;

	Book.deleteBook(bookId, req.user.id).then(function () {
		res.send(200);
	}).catch(function (err) {
		console.error('ROUTE deleteBook: ', err);
		res.send(500);
	});
};