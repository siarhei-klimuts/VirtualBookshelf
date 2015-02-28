var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var i18n = require('i18n');
var models = require('./models');

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
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, {id: id});
});

app.disable('x-powered-by');
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/:libraryId([0-9]+)?', routes.index);
app.get('/ui/:page', routes.ui);
app.get('/auth/close', routes.page);
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/auth/close', successRedirect: '/auth/close'}));
app.post('/auth/logout', routes.logout);

app.post('/cover', isAuthorized, routes.cover.postCover);

app.get('/library/:libraryId', isAuthorized, routes.library.getLibrary);
app.get('/libraries', isAuthorized, routes.library.getLibraries);
app.post('/library/:libraryModel', isAuthorized, routes.library.postLibrary);

app.post('/section', isAuthorized, routes.section.postSection);
app.get('/sections/:libraryId', isAuthorized, routes.section.getSections);
app.put('/sections', isAuthorized, routes.section.putSections);
app.delete('/sections/:id', isAuthorized, routes.section.deleteSection);

app.post('/book', isAuthorized, routes.book.postBook);
app.get('/freeBooks/:userId', isAuthorized, routes.book.getFreeBooks);
app.delete('/book/:id', isAuthorized, routes.book.deleteBook);

app.post('/feedback', routes.feedback.postFeedback);

app.get('/user', isAuthorized, routes.user.getUser, respondJSON);
app.put('/user', isAuthorized, routes.user.putUser, respondJSON);

models.init(function(err) {
    if(!err) {
        http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    } else {
        console.log('DAO init error: ', err);        
    }
});

function requireRole(role) {
    return function(req, res, next) {
        if(req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.send(403);
        }
    };
}

function isAuthorized(req, res, next) {
    if(req.user) {
        next();
    } else {
        req.user = {};//galiaf by default
        next();
    }
}

function respondJSON(req, res) {
    res.json(res.result);
}