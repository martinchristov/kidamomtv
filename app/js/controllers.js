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

  controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
  	
  	$scope.items=[];
  	var tmt = 0;
  	$scope.$watch('s',function () {
  		clearInterval(tmt);
  		if($scope.s.length>0)
  		tmt = setTimeout(function(){
  			$http.get(appURI.search+"?s="+$scope.s).success(function(data) {
				$scope.items = data;
				$scope.currentItemIndex=0;
				$scope.currentItem = data[0];
		  	});
  		},200);
  	})
    $rootScope.$on('keyPressed',function(_e,e){
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
    })
  }]).

  controller('Movies', ['$scope','$routeParams', function($scope, $routeParams){
  	$scope.items = [
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

  }]).

  controller('Playlists', ['$scope', function($scope){
  	

  }]).

  controller('Users', ['$scope', function($scope){
  	

  }])