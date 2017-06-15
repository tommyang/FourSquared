'use strict';

var express = require('express');
var controller = require('./formBuilder.controller');

var router = express.Router();

router.post('/',            controller.template.create);
router.get('/:id',          controller.template.get);
router.put('/:id',          controller.template.update);

module.exports = router;