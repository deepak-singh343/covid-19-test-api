//include mongoose
const mongoose = require('mongoose');
const config = require('config');

//connect to the covid database mongodb
mongoose.connect(config.DBHost, {useNewUrlParser: true});

//check if connected
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error mongodb'));
db.once('open', function() {
  // if connected
  console.log("Successfully connected to the database");
});

//export the db
module.exports = db;