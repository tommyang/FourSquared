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
    var fromEmail = new helper.Email('tshih18@4sqd.group');
    var toEmail = new helper.Email(appointment.email);
    var subject = 'Appointment Confirmation';
    var content = new helper.Content('text/plain', "Hi! " + appointment.first_name + " " + appointment.last_name + " Thank you for making an appointment with us! Your appointment is scheudled on " + appointment.date);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
                                            //process.env.SENDGRID_API_KEY
    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
    console.log(response);
    if (error) {
        console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    });


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
