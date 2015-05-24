// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app 		= require('../server'),
	util 		= require('util'),
	request 	= require('supertest'),
	should 		= require('should'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User');

// Define global test variables
var user;

// Create an 'Articles' controller test suite
describe('Auth Controller Unit Tests:', function() {
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
	describe('Testing the auth methods \n', function() {
		it('a) Should be able to sign up a new account', function(done) {
			var newUser = new User({
				firstName: 'Full',
				lastName: 'Name',
				displayName: 'Full Name',
				email: 'test@test.com',
				username: 'username1',
				password: 'password1',
				provider : 'local'
			});
			// Create a SuperTest request
			request(app).post('/api/auth/signup')
				.send(newUser)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					//console.log(util.inspect(res.body, { }));
					res.body.should.be.an.Object; 
					res.body.should.have.property('status', 0);
					res.body.should.have.property('username', newUser.username);

					done();
				});
		});
		it('b) Should be able to sign in with an account', function(done) {
			// Create a SuperTest request
			request(app).post('/api/auth/signin')
				.set('username', user.username)
				.set('password', user.password)
				.send({
					username: user.username,
					password: user.password
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					//console.log(util.inspect(res.body, { }));
					res.body.should.be.an.Object;
					res.body.should.have.property('status', 0);
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