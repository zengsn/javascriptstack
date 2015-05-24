// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	User = mongoose.model('User');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

// Create a new controller method that creates new users
exports.create = function(req, res) {
	// Create a new article object
	var user = new User(req.body);

	// Try saving the article
	user.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the user 
			res.json(user);
		}
	});
};

// Create a new controller method that retrieves a list of users
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of users
	User.find().sort('-created').exec(function(err, users) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the user 
			res.json(users);
		}
	});
};

// Create a new controller method that returns an existing user
exports.read = function(req, res) {
	res.json(req.user);
};

// Create a new controller method that updates an existing user
exports.update = function(req, res) {
	// Get the user from the 'request' object
	var user = req.user;

	// Update the user fields
	user.displayName = user.body.displayName;

	// Try saving the updated user
	user.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the user 
			res.json(user);
		}
	});
};

// Create a new controller method that delete an existing user
exports.delete = function(req, res) {
	// Get the user from the 'request' object
	var user = req.user;

	// Use the model 'remove' method to delete the user
	user.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the user 
			res.json(user);
		}
	});
};

// Create a new controller middleware that retrieves a single existing user
exports.userByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single user 
	User.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));

		// If an user is found use the 'request' object to pass it to the next middleware
		req.user = user;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an user operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the user send the appropriate error message
	if (req.user.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};

// Create a new controller middleware that is used to authorize authenticated operations 
exports.requiresLogin = function(req, res, next) {
	// If a user is not authenticated send the appropriate error message
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	// Call the next middleware
	next();
};