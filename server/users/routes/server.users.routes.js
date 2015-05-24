// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../controllers/server.users.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'users' base routes 
	app.route('/api/users')
	   .get(users.list);
	
	// Set up the 'users' parameterized routes
	app.route('/api/users/:userId')
	   .get(users.read)
	   .put(users.requiresLogin, users.hasAuthorization, users.update)
	   .delete(users.requiresLogin, users.hasAuthorization, users.delete);

	// Set up the 'articleId' parameter middleware   
	app.param('userId', users.userByID);
};