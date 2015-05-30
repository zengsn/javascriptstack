// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app 	= require('../server.js'),
	should 	= require('should'),
	mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Student	= mongoose.model('Student'),
	Course 	= mongoose.model('Course'),
	CV	 	= mongoose.model('CV');

// Define global variables
var user, student, course, cv;

// Create an 'CV' model test suite
describe('Curricula-Variable Model Unit Tests:', function() {
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
			course.save(function() {
				student = new Student({
					user: user,
					schoolNumber: 'SY123456',
					className: '11计算机网络'
				});
				student.save(function() {
					cv = new CV({
						student: student,
						course: course
					});
					done();
				});
			});			
		});
	});

	// Test the 'Course' model save method
	describe('Testing the save method', function() {
		it('Should be able to save a cv without problems', function() {
			cv.save(function(err) {
				should.not.exist(err);
			});
		});

		it('Should not be able to save a cv without course or student', function() {
			cv.student = null;
			cv.save(function(err) {
				should.exist(err);
			});
			cv.student = student;
			cv.course  = null;
			cv.save(function(err) {
				should.exist(err);
			});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		// Clean the database
		CV.remove(function() {
			Student.remove(function() {
				Course.remove(function() {
					User.remove(function() {
						done();
					});
				});
			});
		});
	});
});