var userDao = require('../dao/userDao');

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
    userDao.findOrCreate(profile, function(err, user) {
		done(err, user);
    });
}