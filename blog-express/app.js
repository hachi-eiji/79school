'use strict';
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoskin = require('mongoskin'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog',
  db = mongoskin.db(dbUrl, {safe: true}),
  collections = {
    articles: db.collection('articles'),
    users: db.collection('users')
  };

// middleware module
var session = require('express-session'),
  logger = require('morgan'), // express4から独立したlogger
  errorHandler = require('errorhandler'), // development only error handler
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverrider = require('method-override')
  ;

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
app.use(methodOverrider());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', routes.article.admin);
app.get('/post', routes.article.post);
app.post('/post', routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// REST API
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.del('/api/articles/:id', routes.article.del);

app.all('*', function (req, res) {
  res.send(404);
});

//app.get('/login', function (req, res) {
//  res.render('login', {
//    appTitle: "blog-express"
//  });
//});
//app.get('/post', function (req, res) {
//  res.render('post', {
//    appTitle: "blog-express"
//  });
//});
//app.get('/admin', function (req, res) {
//  var articles = [{
//    _id: "aaaaa",
//    title: "article title",
//    text: "article content",
//    slug: "article-title",
//    published: true
//  }, {
//    _id: "bbbbbb",
//    title: "article title2",
//    text: "article content2",
//    slug: "article-title2",
//    published: false
//  }];
//  var data = {
//    appTitle: "blog-express",
//    articles: articles
//  };
//  res.render('admin', data);
//});
//
//
//app.all('*', function (req, res) {
//  var articles = [{
//    title: "article title",
//    text: "article content",
//    slug: "article-title"
//  }, {
//    title: "article title2",
//    text: "article content2",
//    slug: "article-title2"
//  }];
//  var data = {
//    articles: articles,
//    appTitle: "blog-express"
//  };
//  res.render('index', data);
//});

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
