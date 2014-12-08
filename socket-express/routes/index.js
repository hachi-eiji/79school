var express = require('express');
var domain = require('domain');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {title: 'Express'});
});

router.get('/e', function (req, res, next) {
  var d = domain.create();
  d.on('error', function (error) {
    console.error(error.stack);
    res.send(500, {'error': error.message});
  });
  d.run(function () {
    throw new Error('Database is down');
  });
});

router.get('/e2', function (req, res, next) {
  throw new Error('cache server is down');
});

router.get('/e3', function (req, res, next) {
  var d = domain.create();
  d.on('error', function (error) {
    console.error(error.stack);
    res.status(500);
    res.render('error', {
      message: error.message,
      error: error
    });
  });
  d.run(function () {
    next(Error('other server is down'));
  });
});

module.exports = router;
