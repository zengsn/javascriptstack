// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'users' module
angular.module('index', ['ngRoute'])

.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'views/index.client.view.html'
	});
});