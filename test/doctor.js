//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Doctor = require('../models/doctor');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Doctors', () => {
    /*
    * Test the /POST route for doctors registration
    */
  describe('/POST register doctor', () => {

    let username = "Deepak"+Date.now();
	  it('it should not register a doctor without username and password fields', (done) => {
	  	let doctor = {
	  		username: username
	  	}
			chai.request(server)
        .post('/api/v1/doctors/register')
		    .send(doctor)
		    .end((err, res) => {
			  	res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Internal Server Error');
		      done();
		    });
    });
    
    it('it should register a doctor with unique username and a password ', (done) => {
	  	let doctor = {
        username: username,
        password: "abc"
	  	}
			chai.request(server)
      .post('/api/v1/doctors/register')
      .send(doctor)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Registration successful');
		      done();
		    });
	  });

    it('it should not register a doctor if username already exists', (done) => {
	  	let doctor = {
        username: username,
        password: "abc"
	  	}
			chai.request(server)
      .post('/api/v1/doctors/register')
      .send(doctor)
		    .end((err, res) => {
			  	res.should.have.status(400);
			  	res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('User already exists');
		      done();
		    });
    });
  });




   /*
  * Test the /POST route for doctors login
  */
  describe('/POST login doctor', () => {
    it('it should not login if username field is missing', (done) => {
      let doctor = {
        password: "abc"
      }
      chai.request(server)
        .post('/api/v1/doctors/login')
        .send(doctor)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Invalid username or passowrd');
          done();
        });
    });
    it('it should not login if password field is missing', (done) => {
      let doctor = {
        username: "Deepak"
      }
      chai.request(server)
        .post('/api/v1/doctors/login')
        .send(doctor)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Invalid username or passowrd');
          done();
        });
    });
    it('it should not login if username and password fields dont match', (done) => {
      let doctor = {
        username: "Deepak",
        password: "a"
      }
      chai.request(server)
        .post('/api/v1/doctors/login')
        .send(doctor)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Invalid username or passowrd');
          done();
        });
    });
    it('it should login if username and password fields match and return a token', (done) => {
      let doctor = {
        username: "Deepak",
        password: "abc"
      }
      chai.request(server)
        .post('/api/v1/doctors/login')
        .send(doctor)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Login successful');
          res.body.should.have.property('token');
          done();
        });
    });
  });
});