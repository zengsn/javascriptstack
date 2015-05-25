// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	var index = require('../controllers/server.index.controller');

	// Mount the 'index' controller's 'render' method
	app.get('/', index.render);

	app.get('/api', index.api);
};