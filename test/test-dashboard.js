'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;

describe('Dashboard', function() {
  const dashboard = require('../public/javascripts/dashboard');

  it('should append 0 to 1 digit number', function() {
    expect(checkTime(1)).to.equal('01');
  });

  it('should append 0 to 1 digit number', function() {
    expect(checkTime(9)).to.equal('09');
  });

  it('should not append 0 to 2 digit number', function() {
    expect(checkTime(10)).to.equal('10');
  });

  it('should not append 0 to 2 digit number', function() {
    expect(checkTime(10)).to.equal('12');
  });
});
