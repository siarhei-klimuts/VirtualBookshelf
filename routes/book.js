var models = require('../models');
var Sequelize = require('sequelize');

exports.postBook = function(req, res) {
	var book = req.body;
	if(book.userId == req.user.id) {
		models.Book.saveBook(book, function(err, result) {
			if(!err && result) {
				res.json(result);
			} else {
				res.send(500);			
			}
		});
	}
};

exports.getBooks = function(req, res){
	models.Book.findAll({
		where: {sectionId: req.params.sectionId}
	}, {raw: true})
	.success(function (result) {
  		res.json(result);
		console.log('ROUTE getBooks: ', result);
	})
	.failure(function (err){
		res.send(500);
		console.log('ROUTE getBooks: ', err);
	});
};