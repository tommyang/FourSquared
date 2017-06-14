'use strict';

/*
 * Module dependencies.
 */
var express = require('express');
var router = express.Router();
var cors = require('cors');
var session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var errorHandler = require('errorhandler');
var path = require('path');
var mongoose = require('mongoose');
var socketIO = require('./socket/socket');
var MY_STRIPE_TEST_KEY = 'sk_test_dqzYJJ6xWGgg6U1hgQr3hNye';
var stripe = require ('stripe')(MY_STRIPE_TEST_KEY);
var MY_SLACK_WEBHOOK_URL ='https://hooks.slack.com/services/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';
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
//var oauthserver = require('oauth2-server');
var newrelic = require('newrelic');
/*'use strict';
// Load the twilio module
var twilio = require('twilio');

// Twilio Credentials 
var accountSid = 'ACb70bc33c96bfc11985cbd1cf76a239ef'; 
var authToken = '452f1f1d86c183097a96db390ca55590'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
var exports = module.exports;*/
var twilio= require('./notification/text');
/*
 * App configs
 */
var config = require('./config/config');
var validate = require('./config/validation');
var winstonConfig = require("./config/winston");

/*
 * Create Express server.
 */
var app = express();
app.use(function(req, res, next) {
    if (req.path.substr(-5) == '.html' && req.path.length > 1) {
        var query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -5) + query);
        //res.sendFile(path.join(__dirname,'../dist/assets/views/checkin.html'))
    } else {
        next();
    }
});
app.use(morgan('dev', {"stream": winstonConfig.stream}));

/*
 * setting up oath
 */
/*app.oauth = oauthserver({
    model: require('./models/Employee'),
    grants: ['password'],
    debug: true
});

app.all('/oauth/token', app.oauth.grant());
app.get('/secret', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
});
app.use(app.oauth.errorHandler());
*/

/*
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Connected to mongolab");
});

var Appointment = require('./models/Appointment');
//Get todays date
var date =new Date();
//Get tomorrow's date by adding 24 hours onto today's date
var tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);

var schedule = require('node-schedule');

//At a certain time everyday execute the function to get all the next day's appointments
var j = schedule.scheduleJob('19 * * * *', function(){//Execute on the 57th minute of each hour
 
  var cursor=Appointment.find().cursor();
  cursor.on('data',function(doc){
	  if(doc.date.getFullYear()==tomorrow.getFullYear() && 
			doc.date.getMonth()==tomorrow.getMonth() &&
			doc.date.getDate()==tomorrow.getDate()){
				console.log(doc);//Print out all appointments for tomorrow
				//Add code here for sending reminder texts
				twilio.sendReminderText(doc.phone_number);
			}
 });
  
  cursor.on('close',function(){
	  console.log('Finished');
  });
});

/*
 * Express configuration.
 */
app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));
app.set('view engine', 'html');

app.use(cors());
require('./routes')(app);

/*
 * Disable api auth if were are in dev mode
 */
if(app.get('env') !== 'development') {
  app.use('/api/*', validate);
}

app.get('/settings', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/settings.html'))
});
app.get('/admin-companies', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/admin-companies.html'))
});
app.get('/admin-dashboard', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/admin-dashboard.html'))
});
app.get('/analytics_raw', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/analytics_raw.html'))
});
app.get('/appointments', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/appointments.html'))
});
app.get('/checkin', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/checkin.html'))
});
app.get('/employees', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/employees.html'))
});
app.get('/forgot-password', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/forgot-password.html'))
});
app.get('/form-builder', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/form-builder.html'))
});
app.get('/login', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/login.html'))
});
app.get('/signup', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/signup.html'))
});
app.get('/visitors', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/visitors.html'))
});
app.get('/404', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/404.html'))
});
app.get('/admin-settings', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/admin-settings.html'))
});
app.get('/index', function(req,res){
  res.sendFile(path.join(__dirname,'../client/assets/views/index.html'))
});   
/*
 * Error Handler.
 */
app.use(errorHandler());

var server = require('http').createServer(app);

var io = require('socket.io')(server)
server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env'));
});

/*
 * Create Socket.io server.
 */
var server = socketIO.createServer(io);

module.exports = app;
