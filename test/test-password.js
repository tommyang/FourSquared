'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;

describe('isValidPassword', function() {
  const setPasswordScheme = require('../public/javascript/password_validator.js').setPasswordScheme;
  const isValidPassword = require('../public/javascript/password_validator.js').isValidPassword;
  before(function() {
    let scheme = {};
    scheme["length"] = 6;
    scheme["lowercase"] = true;
    scheme["uppercase"] = true;
    scheme["number"] = true;
    scheme["special"] = true;
    console.log(typeof setPasswordScheme);
    setPasswordScheme(scheme);
  });
  it('should return empty error for valid passwords', function() {
    expect(isValidPassword("UnitedOnlyOffered$800!!!")).to.be.empty;
  });
  it('should return some error for empty passwords', function() {
    expect(isValidPassword("")).to.not.equal('');
  });
  it('should return length error for passwords too short', function() {
    expect(isValidPassword("Bug#1")).to.contain('length');
  });
  it('should return false for passwords with too few character types', function() {
    expect(isValidPassword("loremipsum1loremipsum2?")).to.contain('uppercase');
    expect(isValidPassword("EMERGENCY#01189998819991197253")).to.contain('lowercase');
    expect(isValidPassword("OMGIwon!")).to.contain('number');
    expect(isValidPassword("JohnDoe123")).to.contain('special');
  });
});

describe('setPasswordScheme', function() {
  const setPasswordScheme = require('../public/javascript/password_validator.js').setPasswordScheme;
  const isValidPassword = require('../public/javascript/password_validator.js').isValidPassword;
  it('should set length requirement correctly', function() {
    let scheme = {};
    setPasswordScheme(scheme);
    expect(isValidPassword("1")).to.be.empty;
    expect(isValidPassword("123456")).to.be.empty;
    scheme["length"] = 6;
    setPasswordScheme(scheme);
    expect(isValidPassword("1")).to.contain('length');
    expect(isValidPassword("123456")).to.be.empty;
  });
  it('should set character types requirement correctly', function() {
    let scheme = {};
    setPasswordScheme(scheme);
    expect(isValidPassword("abcdef")).to.be.empty;
    expect(isValidPassword("Abcdef")).to.be.empty;
    scheme["uppercase"] = true;
    setPasswordScheme(scheme);
    expect(isValidPassword("abcdef")).to.contain('uppercase');
    expect(isValidPassword("Abcdef")).to.be.empty;
  });
});



