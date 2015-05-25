// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var courses = require('../controllers/server.courses.controller');

// Define the routes module' method
module.exports = function(app) {
	app.route('/api/courses')
	   .get(courses.list)
	   .post(courses.create);
	app.route('/api/mycourses')
	   .get(courses.listMy);
	
	// Set up the 'courses' parameterized routes
	app.route('/api/courses/:courseId')
	   .get(courses.read)
	   .put(courses.requiresLogin, courses.hasAuthorization, courses.update)
	   .delete(courses.requiresLogin, courses.hasAuthorization, courses.delete);

	// Set up the 'courseId' parameter middleware   
	app.param('courseId', courses.getById);
};