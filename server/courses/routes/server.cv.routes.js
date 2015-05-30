// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var cv = require('../controllers/server.cv.controller');

// Define the routes module' method
module.exports = function(app) {
	app.route('/api/curriculavariable')
	   .get(cv.list)
	   .post(cv.create);
	
	// List CV by course
	app.route('/api/curriculavariable/:courseId')
	   .get(cv.listByCourse)
	   .put(cv.requiresLogin, cv.hasAuthorization, cv.update)
	   .delete(cv.requiresLogin, cv.hasAuthorization, cv.delete);

	// Set up the 'courseId' parameter middleware   
	app.param('courseId', cv.getByCourse);
};