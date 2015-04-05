var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var Sequelize = require('sequelize');
var User = require('../models').User;

var PROVIDERS = {
	google: {
		field: 'googleId',
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/return'
	},
	twitter: {
		field: 'twitterId',
		clientID: process.env.TWITTER_CONSUMER_KEY,
		clientSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: '/auth/twitter/return'
	},
	facebook: {
		field: 'facebookId',
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: '/auth/facebook/return'
	}
};

exports.PROVIDERS = PROVIDERS;

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
	    clientID: PROVIDERS.google.clientID,
	    clientSecret: PROVIDERS.google.clientSecret,
	    callbackURL: host + PROVIDERS.google.callbackURL,
    	passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
		var params = {};
		params.name = profile.displayName;
		params.email = profile.email;
		params[PROVIDERS.google.field] = profile.id;

		auth(params, req, done);
	});

	return result;
};

exports.authTwitter = function(host) {
	var result = new TwitterStrategy({
	    consumerKey: PROVIDERS.twitter.clientID,
	    consumerSecret: PROVIDERS.twitter.clientSecret,
	    callbackURL: host + PROVIDERS.twitter.callbackURL,
    	passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
		var params = {};
		params.name = profile.displayName;
		params[PROVIDERS.twitter.field] = profile.id;

		auth(params, req, done);
	});

	return result;
};

exports.authFacebook = function(host) {
	var result = new FacebookStrategy({
	    clientID: PROVIDERS.facebook.clientID,
	    clientSecret: PROVIDERS.facebook.clientSecret,
	    callbackURL: host + PROVIDERS.facebook.callbackURL,
    	passReqToCallback: true
	}, function (req, accessToken, refreshToken, profile, done) {
		var params = {};
		params.name = profile.displayName;
		params[PROVIDERS.facebook.field] = profile.id;

		auth(params, req, done);
	});

	return result;
};

function auth(params, req, done) {
	if(!req.user || req.user.temporary) params.temporary = true;
	
	(!params.temporary ? link(req.user, params) : authorize(params)).then(function (user) {
		done(null, user);
	}).catch(function (error) {
		done(error, null);
	});
}

function getConditionFromParams(params) {
	var result = {};
	var key;
	var field;

	for(key in PROVIDERS) {
		field = PROVIDERS[key].field;

		if(params[field]) {
			result[field] = params[field];
			break;
		}
	}

	return result;
}

function authorize(params) {
	var condition =	params.googleId ? 
		Sequelize.or(
			{email: params.email},
			{googleId: params.googleId}
		) :	getConditionFromParams(params);

	return User.findOrCreate(condition, params).then(function (user) {
		if(params.googleId && !user.googleId) {
			user.googleId = params.googleId;
			if(!user.name) user.name = params.name;

			return user.save(); 
		} else {
			return user;
		}
	});
}

/*
 * Links a provider from params to an already authorized user.
 * To avoid dublication, method searches all accounts with
 * provider id from params included account with authorized
 * user id. And if it returns more than one user, then not
 * link provider to account
 */
function link(sessionUser, params) {
	var condition = {where: Sequelize.or(
		{id: sessionUser.id},
		getConditionFromParams(params)
	)};

	return User.findAll(condition).then(function (users) {
		var user = users.length === 1 ? users[0] : null;

		if(user && user.id === sessionUser.id) {
			mergeUser(user, params);
			return user.save();
		} else {
			return sessionUser;
		}
	});
}

function mergeUser(user, params) {
	var field;

	for(field in params) {
		if(!user[field]) user[field] = params[field];
	}
}