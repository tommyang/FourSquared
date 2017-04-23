var express = require('express');
var router = express.Router();

router.get('/password', function(req, res, next) {
  res.render('password', { password: 'Enter your password:' });
});

module.exports = router;
