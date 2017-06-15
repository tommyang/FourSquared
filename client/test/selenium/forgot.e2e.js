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

describe('Forgot Password Page', function(){

    before(function(done) {
        this.timeout(10000);
        driver.get('http://localhost:3000/forgot-password').should.be.fulfilled.notify(done);
    });

    it('should have the correct title', function(done) {
        driver.getTitle().should.eventually.equal('Emissary | Forgot Password').notify(done);
    });

    it('should have the email input field', function(done) {
        driver.findElement(By.name('email')).should.be.fulfilled.notify(done);
    });

    it('should have the submit button', function(done) {
        driver.findElement(By.css('button')).should.be.fulfilled.notify(done);
    });

    after(function() {
      driver.quit();
    })
});