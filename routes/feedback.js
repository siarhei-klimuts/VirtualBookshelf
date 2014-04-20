var models = require('../models');

exports.postFeedback = function(req, res) {
	var dataObject = req.body;
	dataObject.userId = req.user && req.user.id;

	models.Feedback.saveFeedback(dataObject, function(err, result) {
		if(!err && result) {
			res.json(result);
		} else {
			res.send(500);	
			console.log('ROUTE postBook: ', err);		
		}
	});
};