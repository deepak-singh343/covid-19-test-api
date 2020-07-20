//include express
const express = require('express');

//create a router
const router = express.Router();

//redirect all the v1 routes to v1 index.js
router.use('/v1', require('./v1'));

//export the router
module.exports = router;