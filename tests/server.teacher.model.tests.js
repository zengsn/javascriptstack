// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app 	= require('../server.js'),
	should 	= require('should'),
	mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Teacher	= mongoose.model('Teacher');

// Define global variables
var user, teacher;

// Create an 'Teacher' model test suite
describe('Teacher Unit Tests:', function() {
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
			teacher = new Teacher({
				title: '讲师',
				user: user
			});
			done();
		});
	});

	// Test the 'Teacher' model save method
	describe('Testing the save method', function() {
		it('Should be able to save a teacher without problems', function() {
			teacher.save(function(err) {
				should.not.exist(err);
			});
		});

		it('Should not be able to save a teacher without a corelating user', function() {
			teacher.user = null;
			
			teacher.save(function(err) {
				should.exist(err);
			});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		// Clean the database
		Teacher.remove(function() {
			User.remove(function() {
				done();
			});
		});
	});
});