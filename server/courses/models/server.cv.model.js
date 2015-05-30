// CV short for Curricula-Variable 选课
// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'CVSchema'
var CVSchema = new Schema({
	student: {
		type: Schema.ObjectId,
		required: "学生帐号不存在！",
		ref: 'Student'
	},
	course: {
		type: Schema.ObjectId,
		required: "课程不存在！",
		ref: 'Course'
	},
	status: {
		type: Number,
		default: 0
	},
	credit: {
		type: String
	},
	reviews: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

CVSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'CV' model out of the 'CVSchema'
mongoose.model('CV', CVSchema);