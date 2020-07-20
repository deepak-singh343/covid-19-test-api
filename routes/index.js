//include express
const express = require('express');

//create a router
const router = express.Router();

//redirect all the api routes to api index.js
router.use('/api', require('./api'));

//export the router
module.exports = router;