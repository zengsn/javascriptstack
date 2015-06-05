// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var User = require('mongoose').model('User'),
	Teacher = require('mongoose').model('Teacher'),
	Student = require('mongoose').model('Student'),
	passport = require('passport');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = '用户名已存在！';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Duang！未知错误！';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}

	// Return the message error
	return message;
};

exports.getLogin = function(req, res, next) {
	if (req.user) {
		res.json(req.user);
	} else {
		res.send({status: -1});
	}
};

// Create a new controller method that renders the signin page
exports.toSignin = function(req, res, next) {
	// If user is not connected render the signin page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signin page
		res.render('signin', {
			// Set the page title variable
			title: '登录',
			// Set the flash message variable
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.send({
			status: 0,
			message: 'Already login!'
		});
	}
};

// Create a new controller method that renders the signup page
exports.toSignup = function(req, res, next) {
	// If user is not connected render the signup page, otherwise redirect the user back to the main application page
	if (!req.user) {
		// Use the 'response' object to render the signup page
		res.render('signup', {
			// Set the page title variable
			title: 'Sign-up Form',
			// Set the flash message variable
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
	var result = {};
	// If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
	if (!req.user) {
		// console.dir(req.body);
		// Create a new 'User' model instance
		var user = new User(req.body);
		var message = null;

		// Set the user provider property
		user.provider = 'local';

		// Try saving the new user document
		user.save(function(err) {
			// If an error occurs, use flash messages to report the error
			if (err) {
				// Use the error handling method to get the error message
				var message = getErrorMessage(err);
				result.status = -1;
				result.message = message;
				res.send(result);
			} else {
				var readyLogin = false;
				// 检查用户类型
				if (user.type == 'teacher') {
					var teacher = new Teacher({
						user: user
					});
					teacher.save(function(errT) {
						if (errT) {
							readyLogin = true;
						}
					});
				} else { // 学生帐号
					var student = new Student({
						user: user,
						className: req.body.className,
						schoolNumber: req.body.schoolNumber
					});
					student.save(function(errS) {
						if (errS) {
							readyLogin = true;
						}
					});
				}
				// If the user was created successfully use the Passport 'login' method to login
				req.login(user, function(err) {
					// If a login error occurs move to the next middleware
					if (err) { //return next(err);
						var message = getErrorMessage(err);
						result.status = -1;
						result.message = message;
					} else {
						result.status = 0;
						result.username = user.username;
					}
					res.send(result);
				});
			}
		});
	} else {
		result.status = -1;
		result.message = "Bad Request!";
		result.user = req.user;
		res.send(result);
	}
};
// Create a new controller method that creates new 'regular' users
exports.signin = function(req, res, next) {
	var result = {};
	if (!req.user) {
		var username = req.body.username;
		var password = req.body.password;
		// find from db
		User.findOne({
			username: username 
		}, function(err, user) {
			if (err) {
				result.status = -1;
				result.message = getErrorMessage(err);
				res.send(result);
			} else if (user) {
				//console.log(user.username);		
				req.login(user, function(err2) {
					if (err2) { //return next(err);
						result.status = -1;
						result.message = 'Sign in failed!';
					} else {
						result.status = 0;
						result.username = user.username;
					}
					res.send(result);
				});
			} else {
				result.status = -1;
				result.message = "No such user! ";
				res.send(result);
			}
		});	
	} else {
		result.status = -1;
		result.message = "Bad Request!";
		result.user = req.user;
		res.send(result);
	}
};

// Create a new controller method that creates new 'OAuth' users
exports.saveOAuthUserProfile = function(req, profile, done) {
	// Try finding a user document that was registered using the current OAuth provider
	User.findOne({
		provider: profile.provider,
		providerId: profile.providerId
	}, function(err, user) {
		// If an error occurs continue to the next middleware
		if (err) {
			return done(err);
		} else {
			// If a user could not be found, create a new user, otherwise, continue to the next middleware
			if (!user) {
				// Set a possible base username
				var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

				// Find a unique available username
				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
					// Set the available user name 
					profile.username = availableUsername;
					
					// Create the user
					user = new User(profile);

					// Try saving the new user document
					user.save(function(err) {
						// Continue to the next middleware
						return done(err, user);
					});
				});
			} else {
				// Continue to the next middleware
				return done(err, user);
			}
		}
	});
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
	// Use the Passport 'logout' method to logout
	req.logout();

	// Redirect the user back to the main application page
	res.send({
		status: 0,
		redirect: '/',
		message: 'Logout yet!'
	});
};