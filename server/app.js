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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
/*
 * App configs
 */
var config = require('./config/config');
var validate = require('./config/validation');
var winstonConfig = require("./config/winston");

// Importing IBM Watson
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var contexts = [];

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


// Importing Appointment module
var twilio = require('./notification/text')
var Appointment = require('./models/Appointment');
var schedule = require('node-schedule');

// function to format the time
function formatTime(hour, minutes) {
  hour = hour%12;
  var AMorPM = "AM";

  if (hour > 12) {
    AMorPM = "PM";
  }
  if (hour == 0) {
    hour = 12;
  }
  minutes = formatMinutes(minutes);

  return hour + ":" + minutes + " " + AMorPM;
}

function formatZero(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}

//At 10AM, send a reminder through SMS to remind customers who have appts the next day
var j = schedule.scheduleJob({hour: 10, minute: 00}, function() {
  var date = new Date(); // today's date
  var tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000); // tomorrow's date
  var AMorPM = "AM";

  var cursor = Appointment.find().cursor();
  cursor.on('data',function(doc){
    var hour = doc.date.getHours()%12;
    var minutes = doc.date.getMinutes();

	  if(doc.date.getFullYear()==tomorrow.getFullYear() &&
			doc.date.getMonth()==tomorrow.getMonth() &&
			doc.date.getDate()==tomorrow.getDate()){
        var apptTime = formatTime(doc.date.getHours(), doc.date.getMinutes());
				twilio.sendReminderText(doc.first_name, doc.phone_number, apptTime);
			}
 });

  cursor.on('close',function(){
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

// TODO: Make appt through SMS & TODO: Cancel appt through SMS

app.get('/smssent', function (req, res) {
  var message = req.query.Body;
  var number = req.query.From;
  //var twilioNumber = req.query.To;
  var twilioNumber = "+14158013238";

  // context logic for continuous conversations history
  var context = null;
  var index = 0;
  var contextIndex = 0;
  contexts.forEach(function(value) {
    if (value.from == number) {
      context = value.context;
      contextIndex = index;
    }
    index = index + 1;
  });

  var conversation = new ConversationV1({
    username: '4b8a71ba-1a46-4c71-b24b-ab6f7de00131',
    password: 'X55ahuQdqD11',
    version_date: ConversationV1.VERSION_DATE_2016_09_20
  });

  conversation.message({
    input: { text: message },
    workspace_id: '32f7b331-009a-4044-9a4a-fe02bbb6305d',
    context: context
   }, function(err, response) {
       if (err) {
       } else {
         if (context == null) {
           contexts.push({'from': number, 'context': response.context});
         } else {
           contexts[contextIndex].context = response.context;
         }

         var intent = response.intents[response.intents.length-1].intent;

         if (intent == "cancel_appt") {
           var str = response.output.text[0];
           var arr = str.split(" ");
           var name = arr[1];
           var date = arr[6];
           var time = arr[8];

           var cursor = Appointment.find().cursor();
           cursor.on('data',function(doc){

             var formattedDocDate = doc.date.getFullYear() + "-" + formatZero(doc.date.getMonth()+1) + "-" + formatZero(doc.date.getDate()+1);
             if (doc.first_name == name && formattedDocDate == date) {

              var id = doc._id;
              var xmlHttp = new XMLHttpRequest();
              var url = "http://4sqd.group/api/appointments/" + id;
              xmlHttp.open('DELETE', url, false);
              xmlHttp.send();
             }
           });

           // make_appt not implemented
         } else if (intent == "make_appt") {
           var str = response.output.text[0];
           var arr = str.split(" ");
           var name = arr[1];
           var date = arr[6];
           var time = arr[8];
         }


         if (intent == "done") {
           //contexts.splice(contexts.indexOf({'from': number, 'context': response.context}),1);
           contexts.splice(contextIndex,1);
           // Call REST API here (order pizza, etc.)
         }

         // Twilio Credentials
         var accountSid = 'ACf113d725057e2d7ebc614c6136c536f3';
         var authToken = 'eab9968c82b15c9bcaa17490716571fa';

         //require the Twilio module and create a REST client
         var client = require('twilio')(accountSid, authToken);

         client.messages.create({
           from: twilioNumber,
           to: number,
           body: response.output.text[0]
         }, function(err, message) {
           if(err) {
             console.error(err.message);
           }
         });
       }
  });

  res.send('');
});
// end of SMS function

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
