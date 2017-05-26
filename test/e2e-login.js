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

describe('Login page', function(){

    beforeEach(function() {
        this.timeout(10000);
        return driver.get('http://localhost:3000/login');
    });

    it('should have email field', function() {
        driver.findElements(By.id('email')).should.not.equal(0);        
    });

    it('should have password field', function() {
        driver.findElements(By.id('password')).should.not.equal(0);
    });
});