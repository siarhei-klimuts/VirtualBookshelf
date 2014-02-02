var models = require('../models');
var Sequelize = require('sequelize');

exports.getSectionObjects = function(req, res) {
	models.SectionObject.findAll({}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE getSectionObjects: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE getSectionObjects error: ', error);
	});
}

exports.putSection = function(req, res) {	
	models.Section.create({
		userId: req.user.id, 
		sectionObjectId: req.params.sectionObjectId, 
		libraryId: req.params.libraryId
	}, {raw: true})
	.success(function(result) {
		res.json(result);
		console.log('ROUTE putSection: ', result);
	})
	.failure(function(error) {
		res.send(500);
		console.log('ROUTE putSection error: ', error);
	});
}

exports.sectionsGet = function(req, res){
	models.Section.findAll({
		where: {libraryId: req.params.libraryId}, 
		include: [{
			model: models.SectionObject
		}]
	}, {raw: true})
	.success(function(result) {
  		res.json(result);
		console.log('ROUTE: sections GET: ', result);
	})
	.failure(function(err){
		res.send(500);
		console.log('ROUTE: sections: ', err);
	});
};

exports.sectionsPost = function(req, res){
	var sections = req.body;
	var map = {};

	if(sections && sections.length > 0) {
		sections.forEach(function(item) {
		    map[item.id] = item;
		});

		models.Section.findAll({where: {id:Object.keys(map)}})
		.success(function(result){
			if(result && result.length > 0) {
			    var chainer = new Sequelize.Utils.QueryChainer;

			    result.forEach(function(item) {
			        item.pos_x = map[item.id].pos_x;
			        item.pos_y = map[item.id].pos_y;
			        item.pos_z = map[item.id].pos_z;

			        chainer.add(item.save());
			    });

			    chainer.run()
			    .success(function(result){
			        res.send(200);
					console.log('ROUTE: sections POST: OK.');
			    })    
			    .failure(function(err){
			        res.send(500);
					console.log('ROUTE: sections POST save error: ', err);
			    });
			} else {
				res.send(500);
				console.log('ROUTE: sections POST search result: ', result);
			}
		})
		.failure(function(err){
			res.send(500);
			console.log('ROUTE: sections POST search eror: ', err);
		});
	} else {
 		res.send(500);
		console.log('ROUTE: sections POST req.body: ', sections);
 	}
};