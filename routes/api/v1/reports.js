//include express
const express = require('express');
//create a router
const router = express.Router();

//include passport
const passport = require('passport');

//include reports controller to process the correspondinga actions
const reportsController = require('../../../controllers/api/v1/reportsController');

router.get('/:status', passport.authenticate('jwt', {session:false}), reportsController.allReportsWithStatus);

//export router
module.exports = router;