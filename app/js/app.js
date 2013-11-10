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
		.when('/search',{controller:"Search", templateUrl:"partials/search.html"})
		.when('/movies/:playlist',{controller:"Movies", templateUrl:"partials/movies.html"})
		.when('/playlists', {controller:"Playlists", templateUrl:"partials/playlists.html"})
		.when('/users', {controller:"Users", templateUrl:"partials/users.html"})
		.when('/play/:movieid/:playlistid?',  { controller:"Play", templateUrl:"partials/play.html",
			resolve: {
				movie: ['$q', '$route', 'Backend', function ($q, $route, Backend) {
					var params = $route.current.params;
					if (!params.movieid) { return $q.reject(); }
					return Backend.getMovie(params.movieid);
				}],
				playlist: ['$q', '$route', 'Backend', function ($q, $route, Backend) {
					var params = $route.current.params;
					if (!params.playlistid) { return []; }
					return Backend.getPlaylist(params.playlistid);
				}]
			}})

		.otherwise({redirectTo:'/movies/popular'})

}])



var appURI = {
	search:"sampledata/search.json",
	getmovie:"sampledata/getmovie.json",
	getplaylist:"sampledata/getplaylist.json",
	root:"/",
	api: "http://kidamom.com/api",
	base: "http://kidamom.com/123"
}