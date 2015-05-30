// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app 	= require('../server.js'),
	should 	= require('should'),
	mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Student	= mongoose.model('Student');

// Define global variables
var user, student;

// Create an 'Student' model test suite
describe('Student Unit Tests:', function() {
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
			student = new Student({
				schoolNumber: 'SY123456',
				className: '11计算机网络',
				user: user
			});
			done();
		});
	});

	// Test the 'Student' model save method
	describe('Testing the save method', function() {
		it('Should be able to save a student without problems', function() {
			student.save(function(err) {
				should.not.exist(err);
			});
		});

		it('Should not be able to save a student without a corelating user', function() {
			student.user = null;
			
			student.save(function(err) {
				should.exist(err);
			});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		// Clean the database
		Student.remove(function() {
			User.remove(function() {
				done();
			});
		});
	});
});