//var assert = require('assert');
//var assert = require('chai').assert;
var assert = require('power-assert');
var expected, current;

before(function(){
  expected = ['a','b','c'];
});

describe('String#split', function(){
  beforeEach(function(){
    current = 'a,b,c'.split(',');
  });

  it('should return an array', function(){
    assert.ok(Array.isArray(current));
    //assert(Array.isArray(current));
  });

  it('should return the same array', function(){
    assert.equal(expected.length, current.length, 'Arrays have equal length');
    for(var i = 0; i < expected.length; i++){
      assert.strictEqual(expected[i], current[i], i + 'element is equal');
      assert.notEqual(expected[i], current[i], i + 'element is equal');
    }
  });
});
