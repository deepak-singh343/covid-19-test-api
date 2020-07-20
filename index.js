//include express
const express = require('express');
const port = 8000;

//include database
const db = require('./config/mongoose');

//include passport library
const passport = require('passport');

//include passport jwt config file
const passportJWT = require('./config/passport-jwt-strategy');

const app = express();

const bodyParser = require('body-parser');
const config = require('config');
const morgan = require('morgan');

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));

//redirect all urls to routes index.js
app.use('/', require('./routes'));

//start the express on specefied port
app.listen(port, function(err){
  if(err){
    console.log(`Error in running the server ${err}`);
  }
  console.log(`Express is running on the port: ${port}`);
});

// for testing
module.exports = app;
