// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Course 	= mongoose.model('Course');

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

// Create a new course based on user inputs
exports.create = function(req, res) {
	var course = new Course(req.body);
	course.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the user 
			res.json(course);
		}
	});
};

// List all courses created
exports.list = function(req, res) {
	Course.find().sort('-created').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(courses);
		}
	});
};

// List my courses created
exports.listMy = function(req, res) {
	Course.find().sort('-created').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(courses);
		}
	});
};

// Read course info
exports.read = function(req, res) {
	res.json(req.course);
};

// Update a course
exports.update = function(req, res) {
	var course = req.course;
	// set fields
	course.name = course.body.name;
	course.englishName = course.body.name;
	//course.shortName = course.body.name;
	course.tag = course.body.tag;
	course.email = course.body.email;

	// Try saving the updated user
	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else { 
			res.json(course);
		}
	});
};

// Delete an existing course
exports.delete = function(req, res) {
	var course = req.course;

	course.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(course);
		}
	});
};

// Get course by id (name, shortName, etc.)
exports.getById = function(req, res, next, id) {
	Course.findById(id).exec(function(err, course) {
		if (err) {
			return next(err);
		}
		if (!course) {
			return next(new Error('Failed to load course ' + id));
		}

		req.course = course;

		next();
	});
};

// Authorize an course operation 
exports.hasAuthorization = function(req, res, next) {
	// only creator can manage this course
	if (req.course.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	next();
};

// Authorize authenticated operations 
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};