'use strict';
exports.list = function (req, res) {
  res.send('respond with a resource');
};

exports.login = function (req, res, next) {
  res.render('login');
};

exports.logout = function (req, res, next) {
  res.redirect('/');
};

exports.authenticate = function (req, res, next) {
  res.redirect('/admin');
};
