// Invoke 'strict' JavaScript mode
'use strict';

// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	var auth = require('../controllers/server.auth.controller');

	// Mount the 'index' controller's 'render' method
	app.get('/api/auth/signin', auth.toSignin);
	app.post('/api/auth/signin', auth.doSignin);

	app.get('/api/auth/signup', auth.toSignup);
	app.post('/api/auth/signup', auth.doSignup);

	app.get('/api/auth/signout', auth.doSignout);
};