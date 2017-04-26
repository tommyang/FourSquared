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

describe('Homepage', function(){

    beforeEach(function() {
        this.timeout(10000);
        return driver.get('http://localhost:3000/');
    });

    it('should have the correct title', function() {
        return driver.getTitle().should.eventually.equal("Foursquared");
    });

    after(function() {
      driver.quit();
    })
});