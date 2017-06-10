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

describe('Sign Up Page', function(){

    before(function(done) {
        this.timeout(10000);
        driver.get('http://localhost:3000/signup').should.be.fulfilled.notify(done);
    });

    describe('Step 1', function() {
        it('should have the correct title', function(done) {
             driver.getTitle().should.eventually.equal('Emissary | Sign Up').notify(done);
        });

        it('should have the company name input field', function(done) {
            driver.findElement(By.name('name')).should.be.fulfilled.notify(done);
        });

        it('should have the company email input field', function(done) {
            driver.findElement(By.name('email')).should.be.fulfilled.notify(done);
        });

        it('should have the company phone number input field', function(done) {
            driver.findElement(By.name('phone_number')).should.be.fulfilled.notify(done);
        });

        it('should have the next button', function(done) {
            driver.findElement(By.css('button')).should.be.fulfilled.notify(done);
        });
    });

    describe('Step 2', function() {
        before(function(done) {
            const randomPhone = Math.floor(1000000000 + Math.random() * 9000000000);
            driver.findElement(By.name('name')).sendKeys('Test' + randomPhone).should.be.fulfilled;
            driver.findElement(By.name('email')).sendKeys(randomPhone+'@example.com').should.be.fulfilled;
            driver.findElement(By.name('phone_number')).sendKeys(randomPhone).should.be.fulfilled;
            driver.findElement(By.css('button')).click().should.be.fulfilled.notify(done);
        });

        it('should have the correct title', function(done) {
            // driver.getTitle().should.eventually.equal('Emissary | Sign Up').notify(done);
        });

        it('should have the first name input field', function(done) {
            driver.findElement(By.name('first')).should.be.fulfilled.notify(done);
        });

        it('should have the last name input field', function(done) {
            driver.findElement(By.name('last')).should.be.fulfilled.notify(done);
        });

        it('should have the user email input field', function(done) {
            driver.findElement(By.name('email')).should.be.fulfilled.notify(done);
        });

        it('should have the user number input field', function(done) {
            driver.findElement(By.name('phone_number')).should.be.fulfilled.notify(done);
        });

        it('should have the password input field', function(done) {
            driver.findElement(By.name('form-password')).should.be.fulfilled.notify(done);
        });

        it('should have the confirm password input field', function(done) {
            driver.findElement(By.name('form-repeat-password')).should.be.fulfilled.notify(done);
        });

        it('should have the next button', function(done) {
            driver.findElement(By.css('button')).should.be.fulfilled.notify(done);
        });
    });

    after(function() {
      driver.quit();
    })
});
