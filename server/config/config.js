// Author: Shaoning Zeng
// 2015.5.24 at Beijing, China
'use strict';

// Load the correct configuration file according to the 'NODE_ENV' variable
module.exports = require('./env/' + process.env.NODE_ENV + '.js');