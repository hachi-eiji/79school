'use strict';
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  everyauth = require('everyauth'),
  mongoskin = require('mongoskin'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
  db = mongoskin.db(dbUrl, {safe: true}),
  collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
  },
  TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
  ;


// middleware module
var session = require('express-session'),
  logger = require('morgan'), // express4から独立したlogger
  errorHandler = require('errorhandler'), // development only error handler
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverrider = require('method-override')
  ;


everyauth.debug = true;
everyauth.twitter
  .consumerKey(TWITTER_CONSUMER_KEY)
  .consumerSecret(TWITTER_CONSUMER_SECRET)
  .findOrCreateUser(function (session, accessToken, accessTokenSecret, twitterUserMetadata) {
    var promise = this.Promise();
    process.nextTick(function () {
      // 実際はDBなどから検索/DBへ保存したいので処理が重くなるので,
      // process.nextTickを使っている
      if (twitterUserMetadata.screen_name === 'hachi_eiji') {
        session.user = twitterUserMetadata;
        session.admin = true;
      }
      promise.fulfill(twitterUserMetadata);
    });
    return promise;
  }).redirectPath('/admin');
everyauth.everymodule.handleLogout(routes.user.logout);
everyauth.everymodule.findUserById(function (user, callback) {
  callback(user);
});

var app = express();
app.locals.appTitle = 'blog-express';

app.use(function (req, res, next) {
  if (!collections.articles || !collections.users) {
    return next(new Error('No collections'));
  }
  req.collections = collections;
  return next(); // do not forget !!
});


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('hogehoge'));
app.use(session({secret: 'fugafuga'}));
app.use(everyauth.middleware());
app.use(methodOverrider());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if (req.session && req.session.admin) {
    // res.locals はリクエストスコープのオブジェクト
    res.locals.admin = true;
  }
  next();
});

var authorize = function (req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.send(401);
};

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.article.admin);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API
app.all('/api', authorize); // authorize /api/*
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);

app.all('*', function (req, res) {
  res.send(404);
});

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
  });
};


var shutdown = function () {
  server.close();
};

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
