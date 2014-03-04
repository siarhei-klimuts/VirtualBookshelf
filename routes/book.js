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
}

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

exports.putBooks = function(req, res) {
	var books = req.body;
	var map = {};

	if(books && books.length) {
		books.forEach(function (item) {
		    map[item.id] = item;
		});

		models.Book.findAll({where: {id: Object.keys(map)}})
		.success(function (result) {
			if(result && result.length) {
			    var chainer = new Sequelize.Utils.QueryChainer;

			    result.forEach(function (item) {
			    	['model', 'texture', 'cover', 'coverPos', 'author', 'title', 'authorFont', 'titleFont', 'pos_x', 'pos_y', 'pos_z', 'shelfId', 'sectionId'].forEach(function (field) {
			    		item[field] = map[item.id][field];
			    	});
			        chainer.add(item.save());
			    });

			    chainer.run()
			    .success(function (result) {
			        res.json(result);
					console.log('ROUTE putBooks: OK.');
			    })    
			    .failure(function (err) {
			        res.send(500);
					console.log('ROUTE putBooks save error: ', err);
			    });
			} else {
				res.send(500);
				console.log('ROUTE putBooks search result: ', result);
			}
		})
		.failure(function (err) {
			res.send(500);
			console.log('ROUTE putBooks search eror: ', err);
		});
	} else {
 		res.send(500);
		console.log('ROUTE putBooks req.body: ', books);
 	}
};