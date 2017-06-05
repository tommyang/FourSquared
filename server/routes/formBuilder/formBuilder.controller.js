'use strict';

/*This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


var config = require('../../config/config');

/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var FormBuilder = require('../../models/form/FormBuilder');
var jwt = require('jwt-simple');

module.exports.template = {};

module.exports.template.create = function(req, res) {
    var theme = new FormBuilder();
    theme.color = req.body.color;
    theme.first_name = req.body.first_name;
    theme.last_name = req.body.last_name;
    theme.phone_number = req.body.phone_number;
    theme.optional_1 = req.body.optional_1;
    theme.optional_2 = req.body.optional_2;
    theme.company_id = req.body.company_id;

    //require provided info
    theme.save(function(err, c) {
        if(err) {
            return res.status(400).json({error: "Could Not Save"});
        }
        return res.status(200).json(showTheme(c));
    });
};

module.exports.template.get = function(req, res) {
    FormBuilder.find({company_id: req.params.id}, function(err, company) {
        if(err || !company.length)
            return res.status(400).json({error: "Not Found"});
        return res.status(200).json(showTheme(company));
    });
};

module.exports.template.update = function(req, res) {
    FormBuilder.findOne({company_id: req.params.id}, function (err, c) {
        if(err || !c) 
            return res.status(401).json({error: "Could Not Find"});

        //update email
        if (req.body.color !== undefined)
            c.color = req.body.color;

        if (req.body.first_name !== undefined)
            c.first_name = req.body.first_name;

        //update company name
        if (req.body.last_name !== undefined)
            c.last_name = req.body.last_name;

        //update company's phone number
        if (req.body.phone_number !== undefined)
            c.phone_number = req.body.phone_number;

        if (req.body.optional_1 !== undefined)
            c.optional_1 = req.body.optional_1

        if (req.body.optional_2 !== undefined)
            c.optional_2 = req.body.optional_2

        c.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save"});
            }
            return res.status(200).json(showTheme(c));
        });
    });
};

function showTheme(c){
    return {
        company_id: c.company_id,
        color: c.color,
        first_name: c.first_name,
        last_name: c.last_name,
        phone_number: c.phone_number,
        optional_1: c.optional_1,
        optional_2: c.optional_2
    }
}