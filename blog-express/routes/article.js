'use strict';

/**
 * get article.
 *
 */
exports.show = function (req, res, next) {
  if (!req.params.slug) {
    return next(new Error('No article slug'));
  }

  req.models.Article.findOne({slug: req.params.slug}, function (error, article) {
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
  req.models.Article.find({}).toArray(function (error, articles) {
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

  req.models.Article.create(article, function (error, articleResponse) {
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

  req.models.Article.findById(req.params.id, function (error, article) {
    if (error) {
      return next(error);
    }

    article.update({$set: {text: req.body.article}}, function (error, count, raw) {
      if (error) {
        return next(error);
      }
      res.send({affectedCount: count});
    });
  });
};

exports.del = function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('No article ID'));
  }
  req.models.Article.findById(req.params.id, function (error, article) {
    if (error) {
      return next(error);
    }
    if (!article) {
      return next(new Error('article not found'));
    }
    article.remove(function (error, doc) {
      if (error) {
        return next(error);
      }
      res.send(doc);
    });
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

  req.models.Article.create(article, function (error, articlesResponse) {
    if (error) {
      return next(error);
    }
    res.render('post', {error: 'Article was added. publish it on Admin page'});
  });
};

exports.admin = function (req, res, next) {
  req.models.Article.list(function (error, articles) {
    if (error) {
      return next(error);
    }
    res.render('admin', {articles: articles});
  });
};
