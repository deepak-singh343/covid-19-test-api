//include doctor model
const Doctor = require('../../../models/doctor');

//include jwt fro signing
const jwt = require('jsonwebtoken');

//register a doctor
module.exports.register = async function(req, res){
  try{
    //check if a doctor with the given username already exists
    let doctor = await Doctor.findOne({username: req.body.username});
    if(!doctor){
      //if no doctor with the given username exists create a new doctor
      doctor = await Doctor.create(req.body);
      if(doctor){
        //if new doctor created
        return res.status(200).json({
          message: "Registration successful"
        });
      }
      else{
        //unable to create a new doctor
        return res.status(500).json({
          message: "Error in creating account, please try again"
        });
      }
    }else{
      //if a doctor with the username already exists
      return res.status(400).json({
        message: "User already exists"
      });
    }
  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

module.exports.login = async function(req, res){
  try{
    //fetch a doctor with the given username
    let doctor = await Doctor.findOne({username: req.body.username});
    console.log(doctor);
    //if doctor not found or passwords doesn't match
    if(!doctor || doctor.password != req.body.password){
      return res.status(401).json({
        message: "Invalid username or passowrd"
      });
    }
    //if doctor found remove the password from response
    doctor = doctor.toJSON();
    delete doctor.password;
    return res.status(200).json({
      message: "Login successful",
      //sign the token using jwt with the given secret key and set the expiry duration
      token: jwt.sign(doctor, 'abc', {expiresIn: '1000000000'})
    })
  }catch(err){
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}