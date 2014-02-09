var models = require('../models');
var Sequelize = require('sequelize');

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
		where: {sectionId: req.params.sectionId}, 
		include: [{
			model: models.BookObject
		}]
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

exports.putBooks = function(req, res) {
	var books = req.body;
	var map = {};

	if(books && books.length) {
		books.forEach(function(item) {
		    map[item.id] = item;
		});

		models.Book.findAll({where: {id: Object.keys(map)}})
		.success(function (result) {
			if(result && result.length) {
			    var chainer = new Sequelize.Utils.QueryChainer;

			    result.forEach(function (item) {
			        item.pos_x = map[item.id].pos_x;
			        item.pos_y = map[item.id].pos_y;
			        item.pos_z = map[item.id].pos_z;

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