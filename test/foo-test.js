'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;

describe('foo', function() {
  const foo = require('../foo.js').foo;
  it('should return true for input "baz"', function() {
    expect(foo("baz")).to.be.true;
  });
  it('should return false for other inputs', function() {
    expect(foo("bar")).to.be.false;
    expect(foo("")).to.be.false;
  });
});



