var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('password', {
      title: 'Password Validator'
  });
});

module.exports = router;
