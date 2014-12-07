'use strict';
exports.list = function (req, res) {
  res.send('respond with a resource');
};

exports.login = function (req, res, next) {
  res.render('login');
};

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

exports.authenticate = function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.render('login', {
      error: 'Please enter your email and password'
    });
  }

  // TODO: crypto
  req.models.User.findOne({
    email: req.body.email,
    password: req.body.password
  }, function (error, user) {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.render('login', {
        error: 'Incorrect email&password combination'
      });
    }
    req.session.user = user;
    req.session.admin = user.admin;
    res.redirect('/admin');
  });
};
