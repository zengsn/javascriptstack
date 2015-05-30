// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	User 	= mongoose.model('User'),
	Student	= mongoose.model('Student'),
	Course 	= mongoose.model('Course'),
	CV  	= mongoose.model('CV');

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

// Curricula-Variable
exports.create = function(req, res) {
	var user = req.user;
	var courseId = req.body.courseId;
	// find course
	Course.findById(courseId).exec(function(err, course) {
		if (err) {
			return res.status(400).send({'error': getErrorMessage(err)});
		}
		if (!course) {
			return res.status(400).send({'error': '课程不存在！' + courseId});
		}

		var cv = new CV({
			student: req.student,
			course: course
		});		
		cv.save(function(err) {
			if (err) {
				return res.status(400).send({ 'error': getErrorMessage(err)});
			} else {
				res.json(cv);
			}
		});
	});
};

// List all courses created
exports.list = function(req, res) {
	res.json({todo: 'Not yet!'});
};

// List my courses created
exports.listMy = function(req, res) {
	CV.find({'student.id': res.user.id}).sort('-created').exec(function(err, cvList) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(cvList);
		}
	});
};

// List students of the course
exports.listByCourse = function(req, res) {
	res.json(req.cvList);
};

// Find all CV by course
exports.findByCourse = function(req, res, next, courseId) {
	CV.find({'course.id' : courseId}).exec(function(err, cvList) {
		if (err) {
			return next(err);
		}
		if (!cvList) {
			return next(new Error('Failed to load cv ' + courseId));
		}

		req.cvList = cvList;

		next();
	});
};

// Update a course
exports.update = function(req, res) {
	var cv = req.cv;
	// set fields
	cv.status = req.body.status;

	// Try saving the updated user
	cv.save(function(err) {
		if (err) {
			return res.status(400).send({
				error: getErrorMessage(err)
			});
		} else { 
			res.json(cv);
		}
	});
};

// Delete an existing course
exports.delete = function(req, res) {
	var cv = req.cv;

	cv.remove(function(err) {
		if (err) {
			return res.status(400).send({
				error: getErrorMessage(err)
			});
		} else {
			res.json(cv);
		}
	});
};

// Find all CV by course
exports.findById = function(req, res, next, id) {
	CV.findById(id).exec(function(err, cv) {
		if (err) {
			return next(err);
		}
		if (!cv) {
			return next(new Error('Failed to load cv ' + id));
		}

		req.cv = cv;

		next();
	});
};

// Authorize an course operation 
exports.hasAuthorization = function(req, res, next) {
	// only creator can manage this course
	if (req.cv.student.id !== req.student.id) {
		return res.status(403).send({ error: '权限不足！'});
	}

	next();
};

// Authorize authenticated operations 
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({ error: '未登录！' });
	} else {
		var user = req.user;
		Student.findOne({'user.id': user.id}, function(err, student) {
			if (!student) {
				return res.status(401).send({ error: '不是学生！'});
			} else {
				req.student = student;
			}
		});
	}

	next();
};