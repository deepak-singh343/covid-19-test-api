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

describe('Patients', () => {	
	/*
  * Test the /POST route for patients registration
  */
	
	// update token before running test cases
	let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE1NjA4NGFkMDI3NzBlZDAxMTU3ODciLCJ1c2VybmFtZSI6IkRlZXBhayIsImNyZWF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsIl9fdiI6MCwiaWF0IjoxNTk1MjM2NDkxLCJleHAiOjE1OTYyMzY0OTF9.gpkLQ0OTuZMspCsEXhXLOchBz51gj3a_XmK8C2Jawpk';
	
	let authBearerToken = 'bearer ' + token;
	
	describe('/POST register patient', () => {

		it('it should return unauthorized if token is wrong or expired', (done) => {
			let patient = {
				mobile: "123456789"
			}
			chai.request(server)
				.post('/api/v1/patients/register')
				.set('Authorization', 'bearer JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE1NDI2YjQzMmM1ODBjMjQxZGZhNzQiLCJ1c2VybmFtZSI6IkRlZXBhazE1OTUyMjg3NzkwMjMiLCJjcmVhdGVkQXQiOiIyMDIwLTA3LTIwVDA3OjA2OjE5LjIwM1oiLCJ1cGRhdGVkQXQiOiIyMDIwLTA3LTIwVDA3OjA2OjE5LjIwM1oiLCJfX3YiOjAsImlhdCI6MTU5NTIyOTAyMSwiZXhwIjoxNTk1MjMwMDIxfQ.A4dm9FPeO0oEdJQDJ7ukwnw9m-gSsnEVcGPXbufSZHE')
				.send(patient)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					done();
				});
		});
	
		// update authorization before running test cases
		let mobileNum = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
		it('register a patient if valid authorization and has mobile number', (done) => {
			let patient = {
				mobile: mobileNum
			}
			chai.request(server)
				.post('/api/v1/patients/register')
				.set('Authorization', authBearerToken)
				.send(patient)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Patient registered successfully');
					res.body.should.have.property('patient');
					res.body.patient.should.have.property('mobile');
					res.body.patient.should.have.property('mobile').eql(mobileNum);
					done();
				});
		});
	
		// update authorization before running test cases
		it('return patient details if valid authorization and patient already exists with the given number', (done) => {
			let patient = {
				mobile: mobileNum
			}
			chai.request(server)
				.post('/api/v1/patients/register')
				.set('Authorization', authBearerToken)
				.send(patient)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Patient details');
					res.body.should.have.property('patient');
					res.body.patient.should.have.property('mobile');
					res.body.patient.should.have.property('mobile').eql(mobileNum);
					done();
				});
		});
	})


	/*
  * Test the /GET route for patient report creation
  */
	describe('/GET create patient report', () => {

		it('it should return unauthorized if token is wrong or expired', (done) => {
			let patientId = '5f15656472fbe824c44e00be';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/create_report`)
				.set('Authorization', 'bearer eyGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE1NjA4NGFkMDI3NzBlZDAxMTU3ODciLCJ1c2VybmFtZSI6IkRlZXBhayIsImNyZWF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsInVwZGF0ZWRBdCI6IjIwMjAtMDctMjBUMDk6MTQ6NDQuNTc4WiIsIl9fdiI6MCwiaWF0IjoxNTk1MjM2NDkxLCJleHAiOjE1OTYyMzY0OTF9.gpkLQ0OTuZMspCsEXhXLOchBz51gj3a_XmK8C2Jawpk')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					done();
				});
		});

		it('it should not create a report if patient id is wrong and authorization is valid', (done) => {
			let patientId = '5f43ce3512e71830c7dfd3';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/create_report`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Invalid details');
					done();
				});
		});

		it('it should create a report if patient id is valid and authorization is valid', (done) => {
			let patientId = '5f15656472fbe824c44e00be';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/create_report`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Report created successfully');
					res.body.should.have.property('report');
					res.body.report.should.have.property('patient');
					res.body.report.should.have.property('patient').eql(patientId);
					done();
				});
		});
	});


	/*
	* Test the /GET route for fetching all the reports of a patient
  */
	describe('/GET all reports of a patient', () => {

		it('it should return unauthorized if token is wrong or expired', (done) => {
			let patientId = '5f1543ce3512e71830c7dfd3';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/all_reports`)
				.set('Authorization', 'bearer eybGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjE1NDI2YjQzMmM1ODBjMjQxZGZhNzQiLCJ1c2VybmFtZSI6IkRlZXBhazE1OTUyMjg3NzkwMjMiLCJjcmVhdGVkQXQiOiIyMDIwLTA3LTIwVDA3OjA2OjE5LjIwM1oiLCJ1cGRhdGVkQXQiOiIyMDIwLTA3LTIwVDA3OjA2OjE5LjIwM1oiLCJfX3YiOjAsImlhdCI6MTU5NTIyOTAyMSwiZXhwIjoxNTk1MjMwMDIxfQ.A4dm9FPeO0oEdJQDJ7ukwnw9m-gSsnEVcGPXbufSZHE')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					done();
				});
		});

		it('it should not fetch reports if patient id is wrong and authorization is valid', (done) => {
			let patientId = '5f1543ce3512e717dfd3';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/all_reports`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('Invalid details');
					done();
				});
		});

		/*
			ADD PATIENT ID BELOW
		*/
		it('it should fetch all reports if patient id is valid and authorization is valid', (done) => {
			let patientId = '5f15656472fbe824c44e00be';
			chai.request(server)
				.get(`/api/v1/patients/${patientId}/all_reports`)
				.set('Authorization', authBearerToken)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('patientMobile');
					res.body.should.have.property('message');
					res.body.should.have.property('message').eql('All Reports of ' + res.body.patientMobile);
					res.body.should.have.property('reports');
					res.body.reports.should.be.a('array');
					done();
				});
		});
	});
});