'use strict';

/* Controllers */

angular.module('kidamom.controllers', []).
  
  controller('Main', ['$scope', function($scope){
  	$scope.scrollH = 50;

  }]).

  controller('Movies', ['$scope', function($scope){
  	$scope.movies = [
  		{
  			photo:"/sampledata/1.jpg",
  			title:"The nut job",
  			desc:"lorem"
  		},
  		{
  			photo:"/sampledata/2.jpg",
  			title:"Epic",
  			desc:"lorem"
  		},
  		{
  			photo:"/sampledata/3.jpg",
  			title:"The croods",
  			desc:"lorem"
  		},
  		{
  			photo:"/sampledata/4.jpg",
  			title:"Cloudy with a chance of meatballs",
  			desc:"lorem"
  		}
  	]

  	$scope.currentMovie = $scope.movies[0];

  	$scope.keyPressed=function(e){
  		if(e.which==37){

  		}
  		else if(e.which==39){

  		}
  	}

  }]).

  controller('Playlists', ['$scope', function($scope){
  	

  }])