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
    console.log('PAS:',id);
    done(null, {id: id});
});

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.methodOverride()); // поддержка put и delete
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
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/outside', isAuthorized, routes.getOutside);
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/', successRedirect: '/'}));

app.get('/library/:libraryId', isAuthorized, routes.library.getLibrary);
app.get('/libraries', isAuthorized, routes.library.getLibraries);
app.post('/library/:libraryModel', isAuthorized, routes.library.postLibrary);

app.post('/section', isAuthorized, routes.section.postSection);
app.get('/sections/:libraryId', isAuthorized, routes.section.getSections);
app.put('/sections', isAuthorized, routes.section.putSections);

app.post('/book', isAuthorized, routes.book.postBook);
app.get('/books/:sectionId', isAuthorized, routes.book.getBooks);

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
    }
}

function isAuthorized(req, res, next) {
    if(req.user) {
        next();
    } else {
        req.user = {id: 1};//galiaf by default
        next();
    }
}