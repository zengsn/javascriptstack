// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../server'),
	request 	= require('supertest'),
	should 		= require('should'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User');

// Define global test variables
var user;

// Create an 'Articles' controller test suite
describe('User Controller Unit Tests:', function() {
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
			done();
		});
	});

	// Test the 'Article' GET methods
	describe('Testing the GET methods', function() {
		it('Should be able to get the list of users', function(done) {
			// Create a SuperTest request
			request(app).get('/api/users')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Array.and.have.lengthOf(1);
					res.body[0].should.have.property('email', user.email);
					res.body[0].should.have.property('username', user.username);

					done();
				});
		});

		it('Should be able to get the specific user', function(done) {
			// Create a SuperTest request
			request(app).get('/api/users/' + user.id)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Object.and.have.property('email', user.email);
					res.body.should.have.property('username', user.username);

					done();
				});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		// Clean the database
		User.remove(function() {
			done();
		});
	});
});