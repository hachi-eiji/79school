'use strict';

/**
 * get article.
 *
 */
exports.show = function (req, res, next) {
  if (!req.params.slug) {
    return next(new Error('No article slug'));
  }

  req.collections.articles.findOne({slug: req.params.slug}, function (error, article) {
    if (error) {
      return next(error);
    }
    if (!article.published) {
      return res.send(401);
    }
    res.render('article', article);
  });
};

/**
 * get article list
 */
exports.list = function (req, res, next) {
  req.collections.articles.find({}).toArray(function (error, articles) {
    if (error) {
      return next(error);
    }
    res.send({articles: articles});
  });
};

/**
 * add article.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.add = function (req, res, next) {
  if (!req.body.article) {
    return next(new Error('No article, payload'));
  }
  var article = req.body.article;
  article.published = false;

  req.collections.articles.insert(article, function (error, articleResponse) {
    if (error) {
      return next(error);
    }
    res.send(articleResponse);
  });
};

exports.edit = function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('No article ID'));
  }

  req.collections.articles.updateById(req.params.id, {$set: {text: req.body.article}}, function (error, count) {
    if (error) {
      return next(error);
    }
    res.send({affectedCount: count});
  });
};

exports.del = function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('No article ID'));
  }
  req.collections.articles.removeById(req.params.id, function (error, count) {
    if (error) {
      return next(error);
    }
    res.send({affectedCount: count});
  });
};

exports.post = function (req, res, next) {
  if (!req.body.title) {
    res.render('post');
  }
};

exports.postArticle = function (req, res, next) {
  if (!req.body.title || !req.body.slug || !req.body.text) {
    return res.render('post', {error: 'Fill tile, slug and text.'});
  }
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  };

  req.collections.articles.insert(article, function (error, ariclesResponse) {
    if (error) {
      return next(error);
    }
    res.render('post', {error: 'Article was added. publish it on Admin page'});
  });
};

exports.admin = function (req, res, next) {
  req.collections.articles.find({}, {sort: {_id: -1}}).toArray(function (error, articles) {
    if (error) {
      return next(error);
    }
    res.render('admin', {articles: articles});
  });
};
