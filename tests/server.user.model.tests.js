// Invoke 'strict' JavaScript mode
'use strict';

// Load the test dependencies
var app = require('../server.js'),
	should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

// Define global variables
var user;

// Create an 'Article' model test suite
describe('User Model Unit Tests:', function() {
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

	// Test the 'Article' model save method
	describe('Testing the save method', function() {
		it('Should be able to save without problems', function() {
			user.save(function(err) {
				should.not.exist(err);
			});
		});

		it('Should not be able to save an user without an username', function() {
			user.username = '';
			
			user.save(function(err) {
				should.exist(err);
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