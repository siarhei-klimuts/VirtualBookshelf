var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var Sequelize = require('sequelize');
var User = require('../models').User;

var CALLBACK_PATH_GOOGLE = '/auth/google/return';
var CALLBACK_PATH_TWITTER = '/auth/twitter/return';

exports.CALLBACK_PATH_GOOGLE = CALLBACK_PATH_GOOGLE;
exports.CALLBACK_PATH_TWITTER = CALLBACK_PATH_TWITTER;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUser(id, function (error, user) {
    	done(error, user);
    });
});

exports.isAuthenticated = function(allowTemporary) {
	return function(req, res, next) {
	    if(req.isAuthenticated() && (allowTemporary || !req.user.temporary)) {
	        next();
	    } else {
	    	res.send(401);
	    }
	};
};

exports.authGoogle = function(host) {
	var result = new GoogleStrategy({
	    clientID: process.env.GOOGLE_CLIENT_ID,
	    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL: host + CALLBACK_PATH_GOOGLE
	}, function (accessToken, refreshToken, profile, done) {
		auth(profile.id, null, profile.displayName, profile.email, done);
	});

	return result;
};

exports.authTwitter = function(host) {
	var result = new TwitterStrategy({
	    consumerKey: process.env.TWITTER_CONSUMER_KEY,
	    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
	    callbackURL: host + CALLBACK_PATH_TWITTER
	}, function (accessToken, refreshToken, profile, done) {
		auth(null, profile.id, profile.displayName, null, done);
	});

	return result;
};

function auth(googleId, twitterId, name, email, done) {
	var defaults = {
		name: name,
		email: email,
		googleId: googleId,
		twitterId: twitterId,
		temporary: true
	};

	var condition =	googleId ? 
		Sequelize.or(
			{email: email},
			{googleId: googleId}
		) :	
		{twitterId: twitterId};

	User.findOrCreate(condition, defaults).then(function (user) {
		if(googleId && !user.googleId) {
			user.googleId = googleId;
			if(!user.name) user.name = name;

			return user.save(); 
		} else {
			return user;
		}
	}).then(function (user) {
		done(null, user);
	}).catch(function (error) {
		done(error, null);
	});
}