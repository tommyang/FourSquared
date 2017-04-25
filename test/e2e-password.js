'use strict';

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should;
const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
const server = require('../bin/www').server;
const driver = new webdriver.Builder().forBrowser('phantomjs').build();

describe('Password Validator', function(){

    beforeEach(function() {
        this.timeout(10000);
        return driver.get('http://localhost:3000/password');
    });

    it('should have the correct title', function() {
        return driver.getTitle().should.eventually.equal("Password Validator");
    });

    it('should validate valid passwords based on the password scheme specified', function() {
        driver.findElement(By.id('lowercaseBox')).click().should.be.fulfilled;
        driver.findElement(By.id('uppercaseBox')).click().should.be.fulfilled;
        driver.findElement(By.id('numberBox')).click().should.be.fulfilled;
        driver.findElement(By.id('specialBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('aaaA1!').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('Valid');
    });

    it('should show length error for passwords too short when length check is enabled', function() {
        driver.findElement(By.id('lengthval')).clear().should.be.fulfilled;
        driver.findElement(By.id('lengthval')).sendKeys('7').should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('aaaaaa').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('length');
    });

    it('should show not length error when length check is disabled', function() {
        driver.findElement(By.id('lengthBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('aaa').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.not.contain('length');
    });

    it('should show lowercase letter error for passwords without any when this check is enabled', function() {
        driver.findElement(By.id('lowercaseBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('AAAAAA').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('lowercase');
    });

    it('should show uppercase letter error for passwords without any when this check is enabled', function() {
        driver.findElement(By.id('uppercaseBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('aaaaaa').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('uppercase');
    });

    it('should show number error for passwords without any when this check is enabled', function() {
        driver.findElement(By.id('numberBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('abcdef').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('number');
    });

    it('should show special character error for passwords without any when this check is enabled', function() {
        driver.findElement(By.id('specialBox')).click().should.be.fulfilled;
        driver.findElement(By.id('password')).sendKeys('abcdef').should.be.fulfilled;
        driver.findElement(By.id('validate')).click().should.be.fulfilled;
        return driver.findElement(By.id('errors')).getText().should.eventually.contain('special character');
    });

    after(function() {
      driver.quit();
    })
});