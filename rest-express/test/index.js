'use strict';
var superagent = require('superagent');
var expect = require('expect.js');

describe('express rest api server', function () {
  var id;
  it('post object', function (done) {
    superagent.post('http://localhost:3000/collections/test')
      .send({name: 'hachi', email: 'test@example.com'})
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(res.body.length).to.eql(1);
        expect(res.body[0]._id.length).to.eql(24);
        id = res.body[0]._id;
        done();
      });
  });

  it("retrieves an object", function (done) {
    superagent.get('http://localhost:3000/collections/test/' + id)
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(typeof res.body).to.be.eql('object');
        expect(res.body._id.length).to.eql(24);
        expect(res.body._id).to.eql(id);
        done();
      });
  });

  it("retrieves a collection", function (done) {
    superagent.get('http://localhost:3000/collections/test')
      .end(function (e, res) {
        expect(e).to.be.eql(null);
        expect(res.body.length).to.be.above(0);
        expect(res.body.map(function (item) {
          return item._id;
        })).to.contain(id);
        done();
      });
  });

  it("updates an object", function (done) {
    superagent.put('http://localhost:3000/collections/test/' + id)
      .send({name: "peter", email: 'peter@example.com'})
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.msg).to.eql('success');
        done();
      });
  });

  it("checks an object", function (done) {
    superagent.get('http://localhost:3000/collections/test/' + id)
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(res.body._id.length).to.eql(24);
        expect(res.body.name).to.eql('peter');
        done();
      });
  });

  it("removes an object", function (done) {
    superagent.del('http://localhost:3000/collections/test/' + id)
      .end(function (e, res) {
        expect(e).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.msg).to.eql('success');
        done();
      });
  });
});
