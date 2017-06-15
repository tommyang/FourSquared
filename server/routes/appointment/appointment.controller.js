'use strict';

/*This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Appointment = require('../../models/Appointment');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

module.exports.template.create = function(req, res) {
    var appointment = new Appointment();
    var param = req.body;

    //require provided info
    appointment.first_name = param.first_name;
    appointment.last_name = param.last_name;
    appointment.phone_number = param.phone_number;
    appointment.date = param.date;
    appointment.company_id = param.company_id;
    appointment.provider_name = param.provider_name;
    appointment.email = param.email;

    Appointment.find(
        {
            company_id:param.company_id,
            date:param.date
        }, function(err, appointments){
            if(err) return res.status(404).json({error: "Could Not Find"});
            if(appointments.length==0) {
                appointment.save(function (err, a) {
                    if (err)
                        return res.status(404).json({error: "Could Not Save"});
                    return res.status(200).json(a);
                });
            }else{
                return res.status(400).json({error: "Already Created"});
            }
        });

    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs

    var helper = require('sendgrid').mail;
    var sg = require('sendgrid')("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");
    var fs = require('fs');
    
    var mail = new helper.Mail();
    //from email
    var email = new helper.Email('tshih18@4sqd.group', 'Four Squared');
    mail.setFrom(email);
    
    mail.setSubject('Appointment Confirmation');
    
    var personalization = new helper.Personalization();
    //to email
    email = new helper.Email(appointment.email, appointment.first_name + " " + appointment.last_name);
    personalization.addTo(email);
    mail.addPersonalization(personalization);
    
    var content = new helper.Content('text/plain', "Hi! " + appointment.first_name + " " + appointment.last_name + ", thank you for making an appointment with us! Your appointment is scheduled on " + appointment.date);
    mail.addContent(content);
    
    var attachment = new helper.Attachment();
    //weird thing. File has to be in subdir and use the following format
    //var file = fs.readFileSync(__dirname + '/derp/my_file.txt');
    var file = fs.readFileSync(__dirname + '/files/test.ics');
    var base64File = new Buffer(file).toString('base64');
    attachment.setContent(base64File);
    attachment.setType('text/calendar');
    attachment.setFilename('test.ics');
    attachment.setDisposition('attachment');
    mail.addAttachment(attachment);
    
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    
    sg.API(request, function(err, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });

    ///////////////////////////////////////////////////////////////////

    /*

    var helper = require('sendgrid').mail;
    //var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var sg = require('sendgrid')("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");
    var fs = require('fs');
    
    var mail = new helper.Mail();
    var email = new helper.Email('jasonageneste@gmail.com', 'Jason Geneste');
    mail.setFrom(email);
    
    mail.setSubject('Appointment Confirmation');
    
    var personalization = new helper.Personalization();
    email = new helper.Email('jasonageneste@gmail.com', 'Jason Geneste');
    personalization.addTo(email);
    mail.addPersonalization(personalization);
    
    var content = new helper.Content('text/html', '<html><body>Thank you for making an appointment</body></html>')
    mail.addContent(content);
    
    var attachment = new helper.Attachment();
    //var file = fs.readFileSync('my_file.txt');
    //var base64File = new Buffer(file).toString('base64');
    //var base64File = new Buffer('BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:me1@google.com\nDTSTAMP:20170614T170000Z\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\nORGANIZER;CN=Me:MAILTO::me@gmail.com\nDTSTART:" + datetime1 +"\nDTEND:" + datetime2 +"\nLOCATION:" + location + "\nSUMMARY:Our Meeting Office\nEND:VEVENT\nEND:VCALENDAR').toString('base64');
    //attachment.setContent(base64File);
    attachment.setContent("BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:me1@google.com\nDTSTAMP:20170614T170000Z\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\nORGANIZER;CN=Me:MAILTO::me@gmail.com\nDTSTART:" + "20170614T120000" +"\nDTEND:" + "20170614T130000" +"\nLOCATION:" + "wherever" + "\nSUMMARY:Our Meeting Office\nEND:VEVENT\nEND:VCALENDAR");
    attachment.setType('application/text');
    attachment.setFilename('my_file.txt');
    attachment.setDisposition('attachment');
    mail.addAttachment(attachment);
    
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
    
    sg.API(request, function(err, response) {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });

    */

};

module.exports.template.getAll = function(req, res) {
    Appointment.find({company_id: req.params.id}, function(err, result){
            if(err){
                return res.status(400).json(err);
            }
            return res.status(200).json(result);
        });
};

module.exports.template.get = function(req, res) {
    Appointment.findOne({_id: req.params.id}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could Not Find"});
        return res.status(200).json(a);
    });
};

module.exports.template.update = function(req, res){
    Appointment.findOne({_id: req.params.id}, function (err, a) {
        if(err || !a)
            return res.status(401).json({error: "Could Not Find"});

        if (req.body.first_name !== undefined)
            a.first_name = req.body.first_name;

        if (req.body.last_name !== undefined)
            a.last_name = req.body.last_name;

        if (req.body.phone_number !== undefined)
            a.phone_number  = req.body.phone_number ;

        if (req.body.date!== undefined)
            a.date = req.body.date;
        if (req.body.provider_name!== undefined)
            a.provider_name = req.body.provider_name;
        //TODO check if the date is taken already
        a.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save"});
            }
            return res.status(200).json(a);
        });
    });
};

module.exports.template.delete = function(req, res){
    Appointment.findById(req.params.id, function(err, a) {
        if(err)
            res.status(400).json({error: "Could Not Find"});
        a.remove(function(err) {
            if(err) {
                res.status(400).json({error: "Could Not Save"});
            } else {
                return res.status(200).json(a);
            }
        });
    });
};
