'use strict';

var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');

// Load the twilio module
var twilio = require('twilio');

// Twilio Credentials
var accountSid = 'ACf113d725057e2d7ebc614c6136c536f3';
var authToken = 'eab9968c82b15c9bcaa17490716571fa';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var exports = module.exports;
var vicky = 'vicky was here';

// sendText: Send text message to employees when visitorList is checked in.
exports.sendText = function(patientName, employees, done) {
  if(employees === null || (employees.length <= 0)) {
    if(done) return done();
  }

  var len = employees.length;
  var callback = function(i) {
    return function(error, message) {
      if(error) {
        console.log(error);
        console.log("Error occurred sending text");
        //res.json({message : "Error occurred sending text"});
      } else {
        //res.json({message: "Text was sent."});
        console.log("Text was sent.");
      }
      if(done && len-1 == i) done();
    };
  };
  // iterate through all employees
  for (var index = 0; index < employees.length; index++) {
    // create text message object that will be sent
    client.messages.create({
      to: employees[index].phone_number,
      from: "+16266711727",
      body:'Your visitorList ' + patientName + ' is ready.'
    }, callback(index));
  }
};

exports.sendReminderText = function(firstName, phoneNumber, apptTime) {
  var bodyMessage = "Hi " + firstName + ", this is a friendly reminder that you have an ";
  bodyMessage += "appointment at " + apptTime + " tomorrow.\n";
  bodyMessage += "We look forward seeing you! Thank you!";
  client.messages.create({
    to: phoneNumber,
    from: "+14158013238",
    body: bodyMessage,
}, function(err, message) {
    if(err){
      console.log("error");
      console.log(err);
    } else {
      console.log("message.sid");
      console.log(message.sid);
    }
});
};
