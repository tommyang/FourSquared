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
const driver = new webdriver.Builder().forBrowser('phantomjs').build();
const app = require('../../../server/app.js');

describe('Login Page', function(){

    before(function(done) {
        this.timeout(10000);
        driver.get('http://localhost:3000/login').should.be.fulfilled.notify(done);
    });

    it('should have the correct title', function(done) {
        driver.getTitle().should.eventually.equal('Emissary | Login').notify(done);
    });

    it('should have the username input field', function(done) {
        driver.findElement(By.name('username')).should.be.fulfilled.notify(done);
    });

    it('should have the password input field', function(done) {
        driver.findElement(By.name('password')).should.be.fulfilled.notify(done);
    });

    it('should have the login button', function(done) {
        driver.findElement(By.css('button')).should.be.fulfilled.notify(done);
    });

    after(function() {
      driver.quit();
    })
});