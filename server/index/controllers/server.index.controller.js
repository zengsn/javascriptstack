// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Create a new 'render' controller method
exports.render = function(req, res) {
	// Use the 'response' object to render the 'index' view with a 'title' and a stringified 'user' properties
	// res.render('index', {
	// 	title: 'Teachant.com - Online Teacher Assistant',
	// 	user: JSON.stringify(req.user)
	// });
	res.redirect('/welearn');
};

// GET (/api)
exports.api = function(req, res) {
	res.json({ version: '0.0.1'} );
};