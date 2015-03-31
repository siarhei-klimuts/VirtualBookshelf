var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models').User;

exports.authGoogle = function(host) {
	var result = new GoogleStrategy({
	    clientID: process.env.GOOGLE_CLIENT_ID,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL: host + '/auth/google/return'
	}, authCallback);

	return result;
};

exports.authTwitter = function(host) {
	var result = new TwitterStrategy({
	    consumerKey: process.env.TWITTER_CONSUMER_KEY,
	    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	    callbackURL: host + '/auth/twitter/return'
	}, authCallback);

	return result;
};

function authCallback(accessToken, refreshToken, profile, done) {
	console.log(profile);
    var email = profile && profile.emails[0] && profile.emails[0].value;

	User.findOrCreate({email: email}, {}, {raw: true}).then(function (result) {
    process.nextTick(function () {
		done(null, result);
	});
	}).catch(function (error) {
		done(error, null);
	});
}