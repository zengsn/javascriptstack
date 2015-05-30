// Teacher 老师
// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'TeacherSchema'
var TeacherSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		required: "用户帐号不存在！",
		ref: 'User'
	},
	introduction: {
		type: String,
		trim: true
	},
	title: {
		type: String
	}
});

TeacherSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'Teacher' model out of the 'TeacherSchema'
mongoose.model('Teacher', TeacherSchema);