'use strict';
var boot = require('../app').boot,
  shutdown = require('../app').shutdown,
  port = require('../app').port,
  superagent = require('superagent'),
  expect = require('expect.js'),
  seedArticles = require('../db/articles.json');

describe('server', function () {
  before(function () {
    boot();
  });

  describe('homepage', function () {
    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should contain posts', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          seedArticles.forEach(function (item, index, list) {
            if (item.published) {
              expect(res.text).to.be.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
            } else {
              expect(res.text).not.to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
            }
          });
          done();
        });
    });

  });

  // new article page suite
  describe('article page', function () {
    it('should display text', function (done) {
      var n = seedArticles.length;
      seedArticles.forEach(function (item, index, list) {
        superagent
          .get('http://localhost:' + port + '/articles/' + seedArticles[index].slug)
          .end(function (res) {
            if (item.published) {
              expect(res.text).to.be.contain(seedArticles[index].text);
            } else {
              expect(res.status).to.be(401);
            }
            if (index + 1 === n) {
              done();
            }
          });
      });
    });
  });

  after(function () {
    shutdown();
  });
});
