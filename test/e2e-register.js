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

describe('Register page', function(){

    beforeEach(function() {
        this.timeout(10000);
        return driver.get('http://localhost:3000/register');
    });

    it('should have company name field', function() {
        driver.findElements(By.name('companyName')).should.not.equal(0);        
    });

    it('should have first name field', function() {
        driver.findElements(By.name('fname')).should.not.equal(0);        
    });

    it('should have last name field', function() {
        driver.findElements(By.name('lname')).should.not.equal(0);        
    });

    it('should have email field', function() {
        driver.findElements(By.name('email')).should.not.equal(0);        
    });

    it('should have phone number field', function() {
        driver.findElements(By.name('phone')).should.not.equal(0);        
    });

    it('should have password field', function() {
        driver.findElements(By.name('password')).should.not.equal(0);        
    });
});