var models = require('../models');
var Sequelize = require('sequelize');

exports.postSection = function(req, res) {	
	var sectionData = req.body;

	if(sectionData && req.user && sectionData.userId === req.user.id) {
		models.Section.saveSection(sectionData, function(err, result) {
			if(!err && result) {
				res.json(result);
			} else {
				res.send(500);
				console.error('ROUTE: section POST: ', err);
			}
		});
	} else {
		res.send(500);			
		console.error('ROUTE: section POST: ', 'wrong data');
	}
};

exports.getSections = function(req, res){
	models.Section.findAll({
		where: {libraryId: req.params.libraryId}
	}, {raw: true})
	.success(function (result) {
  		res.json(result);
		console.log('ROUTE: sections GET: ', result);
	})
	.failure(function (err) {
		res.send(500);
		console.log('ROUTE: sections: ', err);
	});
};

exports.putSections = function(req, res){
	var sections = req.body;
	var map = {};

	if(sections && sections.length > 0) {
		sections.forEach(function (item) {
		    map[item.id] = item;
		});

		models.Section.findAll({where: {id: Object.keys(map)}})
		.success(function (result) {
			if(result && result.length > 0) {
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
					console.log('ROUTE putSections: OK.');
			    })    
			    .failure(function (err) {
			        res.send(500);
					console.log('ROUTE putSections save error: ', err);
			    });
			} else {
				res.send(500);
				console.log('ROUTE putSections search result: ', result);
			}
		})
		.failure(function (err) {
			res.send(500);
			console.log('ROUTE putSections search eror: ', err);
		});
	} else {
 		res.send(500);
		console.log('ROUTE putSections req.body: ', sections);
 	}
};

exports.deleteSection = function(req, res) {
	var id = req.params.id;

	models.Section.deleteSection(id, req.user.id).then(function () {
		res.send(200);
	}).catch(function (err) {
		console.error('ROUTE deleteSection: ', err);
		res.send(500);
	});
};