// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'CourseSchema'
var CourseSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: '课程名称不能为空',
		trim: true
	},
	shortName: {
		type: String,
		unique: true,
		required: '课程英文简称不能为空',
		trim: true
	},
	engilshName: {
		type: String,
		unique: true,
		trim: true
	},
	tag: String,
	email: {
		type: String,
		// Validate the email format
		match: [/.+\@.+\..+/, "邮件格式不正确"]
	},
	introduction: {
		type: String,
		trim: true
	},
	teacher: {
		type: Schema.ObjectId,
		ref: 'Teacher'
	},
	start: {
		type: Date,
		default: Date.now
	}, 
	end: {
		type: Date,
		default: Date.now
	}, 
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	}
});

CourseSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('Course', CourseSchema);