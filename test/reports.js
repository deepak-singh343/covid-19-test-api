//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Patient = require('../models/patient');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Reports', () => {	
	/*
  * Test the /GET route for fetching the reports of all patients based on status
  */
	
	// update token before running test cases
	let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE1NjA4NGFkMDI3NzBlZDAxMTU3ODciLCJ1c2VybmFtZSI6IkRlZXBhayIsImNyZWF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsIl9fdiI6MCwiaWF0IjoxNTk1MjM2NDkxLCJleHAiOjE1OTYyMzY0OTF9.gpkLQ0OTuZMspCsEXhXLOchBz51gj3a_XmK8C2Jawpk';
	
	let authBearerToken = 'bearer ' + token;

  describe('/GET all reports by status', () => {

		it('it should return unauthorized if token is wrong or expired', (done) => {
			let status = 'Travelled-Quarantine';
			chai.request(server)
				.get(`/api/v1/reports/${status}`)
				.set('Authorization', 'bearer eyJhbgciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWI2ODhiYWRiMjgwMTNhYzA2Y2ExOWQiLCJ1c2VybmFtZSI6ImFydW5zcmlkaGVyMTU4OTAyMDg1ODE5NCIsImNyZWF0ZWRBdCI6IjIwMjAtMDUtMDlUMTA6NDA6NTguMjY4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDUtMDlUMTA6NDA6NTguMjY4WiIsIl9fdiI6MCwiaWF0IjoxNTg5MDI1NjU0LCJleHAiOjE1ODkwMjY2NTR9.AuBrNiKC4TFkmXAuPcFgoB4ct8IeOYcoql_lON-LC2k')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					done();
				});
		});

    it('it should not fetch reports if status field is not present or wrong', (done) => {
			let status = 'fever';
			chai.request(server)
        .get(`/api/v1/reports/${status}`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
          res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Invalid details');
					done();
				});
    });

    it('it should fetch reports of all patients that match a valid status and is authorized', (done) => {
			let statusArray = ['Negative', 'Travelled-Quarantine', 'Symptoms-Quarantine', 'Positive-Admit'];
      let status = statusArray[Math.floor(Math.random() * statusArray.length)];
			chai.request(server)
        .get(`/api/v1/reports/${status}`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
          res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
          res.body.should.have.property('message').eql('All reports whose status is ' + status);
          res.body.should.have.property('reports');
          res.body.reports.should.be.a('array');
					done();
				});
    });
    
	});
});