'use strict';
var express = require('express'),
  http = require('http'),
  mongoskin = require('mongoskin'),
  bodyParser = require('body-parser'),
  logger = require('morgan');


var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(logger());

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe: true});
var id = mongoskin.helper.toObjectID;

// :collectionNameの時に事前処理でDBと突き合わせる
app.param('collectionName', function (req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function (req, res, next) {
  res.send('select a collection. e.g., /collections/messages');
});

app.get('/collections/:collectionName', function (req, res, next) {
  req.collection.find({}, {limit: 10, sort: [['_id', -1]]}).toArray(function (e, results) {
    if (e) {
      return next(e);
    }
    res.send(results);
  });
});

app.post('/collections/:collectionName', function (req, res, next) {
  req.collection.insert(req.body, {}, function (e, results) {
    if (e) {
      return next(e);
    }
    res.send(results);
  });
});

app.get('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.findOne({_id: id(req.params.id)}, function (e, results) {
    if (e) {
      return next(e);
    }
    res.send(results);
  });
});

app.put('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.update({_id: id(req.params.id)}, {$set: req.body}, {safe: true}, function (e, result) {
    if (e) {
      return next(e);
    }
    res.send((result === 1) ? {msg: 'success'} : {msg: 'error'});
  });
});

app.delete('/collections/:collectionName/:id', function (req, res, next) {
  req.collection.remove({_id: id(req.params.id)}, function (e, result) {
    if (e) {
      return next(e);
    }
    res.send((result === 1) ? {msg: 'success'} : {msg: 'error'});
  });
});


var server = http.createServer(app);
server.listen(3000, function () {
  console.log('Server is running.');
});
