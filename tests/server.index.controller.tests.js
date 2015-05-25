// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the test dependencies
var app = require('../server'),
	request 	= require('supertest'),
	should 		= require('should'),
	mongoose 	= require('mongoose');

// Create an 'Articles' controller test suite
describe('Index Controller Unit Tests:', function() {
	// Define a pre-tests function
	beforeEach(function(done) {
		done();
	});

	// Test the 'Article' GET methods
	describe('Testing the GET methods', function() {
		it('Should be able to get the version of API', function(done) {
			// Create a SuperTest request
			request(app).get('/api')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Object;
					res.body.should.have.property('version');

					done();
				});
		});
	});

	// Define a post-tests function
	afterEach(function(done) {
		done();
	});
});