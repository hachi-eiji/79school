'use strict';
var express = require('express');
var http = require('http');
var path = require('path');


var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/login', function(req, res) {
  res.render('login', {
    appTitle: "blog-express"
  });
});
app.get('/post', function(req, res) {
  res.render('post', {
    appTitle: "blog-express"
  });
});
app.get('/admin', function(req, res) {
  var articles = [{
    _id: "aaaaa",
    title: "article title",
    text: "article content",
    slug: "article-title",
    published: true
  }, {
    _id: "bbbbbb",
    title: "article title2",
    text: "article content2",
    slug: "article-title2",
    published: false
  }];
  var data = {
    appTitle: "blog-express",
    articles: articles
  };
  res.render('admin', data);
});


app.all('*', function(req, res) {
  var articles = [{
    title: "article title",
    text: "article content",
    slug: "article-title"
  }, {
    title: "article title2",
    text: "article content2",
    slug: "article-title2"
  }];
  var data = {
    articles: articles,
    appTitle: "blog-express"
  };
  res.render('index', data);
});

var server = http.createServer(app);
var boot = function() {
  server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
};


var shutdown = function() {
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
