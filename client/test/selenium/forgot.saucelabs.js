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
//const driver = new webdriver.Builder().forBrowser('phantomjs').build();
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
    describe('Forgot Password Page', function(){

        before(function(done) {
            this.timeout(60000);
            driver.get('http://4sqd.group/forgot-password').should.be.fulfilled.notify(done);
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
});