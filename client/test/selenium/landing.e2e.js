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

describe('Landing Page', function(){

    before(function(done) {
        this.timeout(10000);
        driver.get('http://localhost:3000/').should.be.fulfilled.notify(done);
    });

    it('should have the correct title', function(done) {
        driver.getTitle().should.eventually.equal('Emissary').notify(done);
    });

    describe('Main Menu', function(done) {
        var menuInnerHTML;
        before(function(done) {
            driver.findElement(By.css('#main-menu')).getAttribute('innerHTML').then((html) => {menuInnerHTML = html; done();});
        });

        it('should contain link to Home', function() {
            menuInnerHTML.should.contain('Home');
        });
        it('should contain link to Features', function() {
            menuInnerHTML.should.contain('Features');
        });
        it('should contain link to Pricing', function() {
            menuInnerHTML.should.contain('Pricing');
        });
        it('should contain link to Login', function() {
            menuInnerHTML.should.contain('Login');
        });
        it('should contain link to Sign-Up', function() {
            menuInnerHTML.should.contain('Sign-Up');
        });
    });

    it('should have the correct copyright info', function(done) {
        const footerInnerHTML = driver.findElement(By.css('footer')).getAttribute("innerHTML");
        footerInnerHTML.should.eventually.contain('Copyright © Emissary - All Rights Reserved.').notify(done);
    });

    after(function() {
      driver.quit();
    });
});