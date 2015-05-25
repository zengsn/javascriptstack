// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	var auth = require('../controllers/server.auth.controller');

	// Mount the 'index' controller's 'render' method
	app.get('/api/auth/signin', auth.toSignin);
	app.post('/api/auth/signin', auth.signin);

	app.get('/api/auth/signup', auth.toSignup);
	app.post('/api/auth/signup', auth.signup);

	app.get('/api/auth/signout', auth.signout);
};