//include passport
const passport = require('passport');

//get the jwt strategy from passport-jwt
const JWTStrategy = require('passport-jwt').Strategy;

//extract the jwt
const extractJWT = require('passport-jwt').ExtractJwt;

//include doctor model
const Doctor = require('../models/doctor');

//set the jwt options; request bearer and secret key
let opts = {
    jwtFromRequest : extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'abc'
};

//authentication using jwt
passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
    // console.log(jwt_payload);
    Doctor.findById(jwt_payload._id, function(err, doctor) {
        if (err) {
            // console.log("Error ", err);
            return done(err, false);
        }
        if (doctor) {
            //set the doctor in req object as user 
            // console.log("doctor ", doctor);
            return done(null, doctor);
        } else {
            // console.log("doctor not found");
            return done(null, false);
        }
    });
}));

//export the strategy
module.exports = passport;