//var userDao = require('../dao/userDao');
var models = require('../models');

exports.authGoogle = function(host) {
	var GoogleStrategy = require('passport-google').Strategy;
	var host = host || 'http://127.0.0.1:3000';
	var result = new GoogleStrategy({
	    returnURL: host + '/auth/google/return',
	    realm: host + '/'}, authCallback  		
	);

	return result;
}

function authCallback(identifier, profile, done) {
    var email = profile && profile.emails[0] && profile.emails[0].value;

	models.User.findOrCreate({email: email}, {}, {raw: true})
	.success(function(result) {
		done(null, result);
		console.log('AUTH user:', result);
	})
	.failure(function(err) {
		done(error, null);
		console.log('AUTH error:', err);
	});

}