/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var i18n = require('i18n');
var userDao = require('./dao/userDao');

var auth = require('./security/auth');
var passport = require('passport');

var app = express();

i18n.configure({
  locales: ['en', 'ru'],
  cookie: 'locale',
  directory: __dirname + '/locales'
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.NODE_HOST || ('http://127.0.0.1' + ':' + app.get('port')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use(auth.authGoogle(app.get('host')));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    userDao.getById(id, function(err, user) {
        done(err, user);
    });
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// development only
console.log();
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', requireRole('user'), user.list);
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', { 
  	successRedirect: '/',
    failureRedirect: '/'
}));
app.get('/library', isAuthorized, routes.library);
app.get('/sections/:libraryId', isAuthorized, routes.sections);
app.get('/shelves/:sectionId', isAuthorized, routes.shelves);
app.get('/books/:shelfId', isAuthorized, routes.books);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function requireRole(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.role === role)
            next();
        else
            res.send(403);
    }
}

function isAuthorized(req, res, next) {
    if(req.user) {
        next();
    } else {
        res.send(403);
    }
}