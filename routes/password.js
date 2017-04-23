var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('password', { title: 'Enter your password:' });
});

module.exports = router;
