//include express
const express = require('express');

//create a router
const router = express.Router();

//redirect all the routes to corresponding files
router.use('/doctors', require('./doctors'));
router.use('/patients', require('./patients'));
router.use('/reports', require('./reports'));

//export router
module.exports = router;