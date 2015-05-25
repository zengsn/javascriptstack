// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app = require('../server'),
	request 	= require('supertest'),
	should 		= require('should'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User'),
	Course 		= mongoose.model('Course');

// Define global test variables
var user, course;

// Create an 'Course' controller test suite
describe('Course Controller Unit Tests:', function() {
	// Define a pre-tests function
	beforeEach(function(done) {
		// Create a new 'User' model instance
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider : 'local'
		});

		// Save the new 'User' model instance
		user.save(function() {
			course = new Course({
				name: 'UML与可视化建模',
				english: 'UML & Visual Modeling',
				shortName: 'uml',
				creator: user
			});
			done();
		});
	});

	// Test the 'Course' GET methods
	describe('Testing the GET methods', function() {
		// Create 
		it('Should be able to create a course', function(done) {
			// Create a SuperTest request
			request(app).post('/api/courses')
				.send(course) // post data
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Object;
					res.body.should.have.property('name', course.name);
					res.body.should.have.property('shortName', course.shortName);

					done();
				});
		});
		// List
		it('Should be able to get the list of courses', function(done) {
			course.save(function() {
				request(app).get('/api/courses')
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						res.body.should.be.an.Array.and.have.lengthOf(1);
						res.body[0].should.have.property('name', course.name);
						res.body[0].should.have.property('shortName', course.shortName);

						done();
					}
				);
			});
		});
		// Read
		it('Should be able to get the specific course', function(done) {
			course.save(function() {
				request(app).get('/api/courses/' + course.id)
					.set('Accept', 'application/json')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						res.body.should.be.an.Object;
						res.body.should.have.property('name', course.name);
						res.body.should.have.property('shortName', course.shortName);

						done();
					}
				);
			});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		// Clean the database
		Course.remove(function() {
			User.remove(function() {
				done();
			});
		});
	});
});