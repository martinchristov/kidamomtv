'use strict';

/* Controllers */

angular.module('kidamom.controllers', []).
  
  controller('Main', ['$scope', 'depth', '$rootScope', function($scope, depth, rootScope){
  	$scope.scrollH=50; $scope.loggedIn=false;$scope.state=0;

  	$scope.isMenuInactive = function(){
  		if(depth.get()==0)return false;
  		else return true;
  	}

    //key navigation. to be moved to a directive
    $scope.keyDown = function(e){
      var which = "";
      switch(e.which){
        case 13:
          which = "enter"; break;
        case 8:
          which = 'back';
          e.preventDefault(); break;
        case 38:
          which = 'keyup'; break;
        case 40:
          which = 'keydown'; break;
        case 37:
          which = 'keyleft'; break;
        case 39:
          which = 'keyright'; break;
      }
      if(which!="")
        rootScope.$broadcast(which);
    }
  }]).

  controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
  	
  	$scope.items=[];
  	var tmt = 0;
    $scope.s="";
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

    $scope.$on("enter",function(){
      depth.more();
      if(depth.get()==1){
        document.getElementById('searchInput').focus();
      }
    })
    $scope.$on("back",function(){
      depth.less();
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

  controller('Users', ['$scope', 'depth', function($scope, depth){
    $scope.items = [
      {
        photo:"/sampledata/user1.jpg",
        title:"",
        id:0
      },
      {
        photo:"/sampledata/user2.jpg",
        title:"",
        id:0
      },
      {
        photo:"/sampledata/user3.jpg",
        title:"",
        id:0
      },
      {
        photo:"/sampledata/logout.jpg",
        title:"",
        id:0
      }
    ]
    $scope.loggedIn = $scope.$parent.loggedIn;
  	$scope.logIn = function(){
      $scope.$parent.loggedIn = $scope.loggedIn = true;
    }

    $scope.$on("enter",function(){
      if($scope.currentItem===$scope.items[$scope.items.length-1]){
        $scope.$parent.loggedIn = $scope.loggedIn = false;
      }
    })

  }])