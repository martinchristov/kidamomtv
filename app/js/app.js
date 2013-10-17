'use strict';


// Declare app level module which depends on filters, and services
var kidamom = angular.module('kidamom', [
  'ngRoute',
  'kidamom.filters',
  'kidamom.services',
  'kidamom.directives',
  'kidamom.controllers'
])

.config(["$routeProvider",function($routeProvider){
	$routeProvider
		.when('/',{controller:"Movies", templateUrl:"partials/movies.html"})
		.when('/#playlists', {controller:"Playlists", templateUrl:"partials/playlists.html"})

}])

