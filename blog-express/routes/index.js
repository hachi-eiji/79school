'use strict';
exports.article = require('./article');
exports.user = require('./user');

exports.index = function (req, res, next) {
  req.collections.articles.find({published: true}, {sort: {_id: -1}}).toArray(function (error, articles) {
    if (error) {
      return next(error);
    }
    res.render('index', {articles: articles});
  });
};