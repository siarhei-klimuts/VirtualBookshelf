var GoogleStrategy = require('passport-google-oauth2').Strategy;
var models = require('../models');

exports.authGoogle = function(host) {
	var result = new GoogleStrategy({
	    clientID: process.env.GOOGLE_CLIENT_ID,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL: host + '/auth/google/return'
	}, authCallback);

	return result;
};

function authCallback(accessToken, refreshToken, profile, done) {
    var email = profile && profile.emails[0] && profile.emails[0].value;

	models.User.findOrCreate({email: email}, {}, {raw: true})
	.success(function(result) {
		done(null, result);
	})
	.failure(function(err) {
		done(err, null);
	});
}