//include mongoose
const mongoose = require('mongoose');

//create doctors schema
const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

//create a model and export
const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;