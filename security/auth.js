var userDao = require('../dao/userDao');

exports.authGoogle = function() {
	var GoogleStrategy = require('passport-google').Strategy;

	var result = new GoogleStrategy({
		// TODO:
	    returnURL: 'http://127.0.0.1:3000/auth/google/return',
	    realm: 'http://127.0.0.1:3000/'}, authCallback  		
	);

	return result;
}

function authCallback(identifier, profile, done) {
    userDao.findOrCreate(profile, function(err, user) {
		done(err, user);
    });
}