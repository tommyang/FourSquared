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
// const driver = new webdriver.Builder().forBrowser('phantomjs').build();
const sauceLabUsername = process.env.SAUCE_USERNAME;
const sauceLabAccessKey = process.env.SAUCE_ACCESS_KEY;
const chromeDriver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'chrome',
    'username': sauceLabUsername,
    'accessKey': sauceLabAccessKey
  }).
  usingServer("http://" + sauceLabUsername + ":" + sauceLabAccessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();
const firefoxDriver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'firefox',
    'username': sauceLabUsername,
    'accessKey': sauceLabAccessKey
  }).
  usingServer("http://" + sauceLabUsername + ":" + sauceLabAccessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();
const ieDriver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'internet explorer',
    'username': sauceLabUsername,
    'accessKey': sauceLabAccessKey
  }).
  usingServer("http://" + sauceLabUsername + ":" + sauceLabAccessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();
const edgeDriver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'MicrosoftEdge',
    'username': sauceLabUsername,
    'accessKey': sauceLabAccessKey
  }).
  usingServer("http://" + sauceLabUsername + ":" + sauceLabAccessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();
const safariDriver = new webdriver.Builder().
  withCapabilities({
    'browserName': 'safari',
    'platform': 'macOS 10.12',
    'username': sauceLabUsername,
    'accessKey': sauceLabAccessKey
  }).
  usingServer("http://" + sauceLabUsername + ":" + sauceLabAccessKey +
              "@ondemand.saucelabs.com:80/wd/hub").
  build();
const drivers = [chromeDriver, safariDriver, firefoxDriver, ieDriver, edgeDriver];

drivers.forEach((driver) => {
    describe('Landing Page', function(){

        before(function(done) {
            this.timeout(60000);
            driver.get('http://4sqd.group/').should.be.fulfilled.notify(done);
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
});