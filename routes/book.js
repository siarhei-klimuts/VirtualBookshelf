var models = require('../models');

exports.getBookObjects = function(req, res) {
	models.BookObject.findAll({}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE getBookObjects: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE getBookObjects error: ', error);
	});
}

exports.postBook = function(req, res) {
	var book = req.body;
	if(book && book.bookObjectId) {
		book.userId = req.user.id;
		models.Book.create(book)
		.success(function(result) {
			res.json(result);
			console.log('ROUTE postBook: ', result);
		})
		.failure(function(error) {
			res.send(500);
			console.log('ROUTE postBook error: ', error);
		});
	}
}

exports.getBooks = function(req, res){
	models.Book.findAll({
		where: {sectionId: req.params.sectionId, shelfId: req.params.shelfId}
	}, {raw: true})
	.success(function(result) {
  		res.json(result);
		console.log('ROUTE getBooks: ', result);
	})
	.failure(function(err){
		res.send(500);
		console.log('ROUTE getBooks: ', err);
	});
};