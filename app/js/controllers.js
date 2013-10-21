'use strict';

/* Controllers */

angular.module('kidamom.controllers', []).
  
  controller('Main', ['$scope', 'depth', function($scope, depth){
  	$scope.scrollH=50; $scope.loggedIn=false;$scope.state=0;

  	$scope.isMenuInactive = function(){
  		if(depth.get()==0)return false;
  		else return true;
  	}
  }]).

  controller('Search', ['$scope','depth', function ($scope, depth) {
  	
  	$scope.keyPressed = function(e){
  		if(e.which==13){
  			e.preventDefault();
  			// window.location.href="";
  			depth.more();
  			if(depth.get()==1){
  				document.getElementById('searchInput').focus();
  			}
  		}
  		else if(e.which==8){
  			e.preventDefault();
  			depth.less();
  		}
  	}
  }]).

  controller('Movies', ['$scope','$routeParams', function($scope, $routeParams){
  	$scope.movies = [
  		{
  			photo:"/sampledata/1.jpg",
  			title:"The nut job",
  			desc:"Surly, a curmudgeon, independent squirrel is banished from his park and forced to survive in the city. Lucky for him, he stumbles on the one thing that may be able to save his life, and the rest of park community, as they gear up for winter - Maury's Nut Store.",
  			duration:95,
  			age:6
  		},
  		{
  			photo:"/sampledata/2.jpg",
  			title:"Epic",
  			desc:"lorem ipsum some more text here",
  			duration:95,
  			age:6
  		},
  		{
  			photo:"/sampledata/3.jpg",
  			title:"The croods",
  			desc:"lorem ipsum some more text here",
  			duration:95,
  			age:6
  		},
  		{
  			photo:"/sampledata/4.jpg",
  			title:"Cloudy with a chance of meatballs",
  			desc:"lorem ipsum some more text here",
  			duration:95,
  			age:6
  		},
      {
        photo:"/sampledata/3.jpg",
        title:"The croods",
        desc:"lorem ipsum some more text here",
        duration:95,
        age:6
      },
      {
        photo:"/sampledata/4.jpg",
        title:"Cloudy with a chance of meatballs",
        desc:"lorem ipsum some more text here",
        duration:95,
        age:6
      }
  	]
  	$scope.currentMovieIndex = 0;
  	$scope.currentMovie = $scope.movies[0];
  	$scope.playlist = $routeParams.playlist;



  	$scope.keyPressed=function(e){
  		if(e.which==37){
  			$scope.currentMovieIndex--;
  			if($scope.currentMovieIndex<0)$scope.currentMovieIndex=0;
  		}
  		else if(e.which==39){
  			$scope.currentMovieIndex++;
  			if($scope.currentMovieIndex>=$scope.movies.length)$scope.currentMovieIndex=$scope.movies.length-1;
  		}
  		$scope.currentMovie = $scope.movies[$scope.currentMovieIndex];
  	}

  }]).

  controller('Playlists', ['$scope', function($scope){
  	

  }]).

  controller('Users', ['$scope', function($scope){
  	

  }])