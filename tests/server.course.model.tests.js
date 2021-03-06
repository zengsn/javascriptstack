// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app 	= require('../server.js'),
	should 	= require('should'),
	mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Course 	= mongoose.model('Course');

// Define global variables
var user, course;

// Create an 'Course' model test suite
describe('Course Model Unit Tests:', function() {
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

	// Test the 'Course' model save method
	describe('Testing the save method', function() {
		it('Should be able to save a course without problems', function() {
			course.save(function(err) {
				should.not.exist(err);
			});
		});

		it('Should not be able to save a course without an name', function() {
			course.name = '';
			
			course.save(function(err) {
				should.exist(err);
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