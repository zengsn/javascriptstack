// Student 学生
// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'StudentSchema'
var StudentSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		required: "用户帐号不存在！",
		ref: 'User'
	},
	introduction: {
		type: String,
		trim: true
	},
	className: {
		type: String,
		trim: true
	},
	schoolNumber: {
		type: String,
		required: "学号不能为空",
		trim: true
	}
});

StudentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'Student' model out of the 'StudentSchema'
mongoose.model('Student', StudentSchema);