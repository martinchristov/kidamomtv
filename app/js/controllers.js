'use strict';
var VK_ENTER, VK_BACK_SPACE;

/* Controllers */

angular.module('kidamom.controllers', [])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      '**'
      ]);
  })
  
  .controller('Main', ['$scope', 'depth', '$rootScope', 'Menu', function ($scope, depth, rootScope, Menu){
    $scope.Menu = Menu;

  	$scope.isMenuInactive = function(){
  		if(depth.get()==0)return false;
  		else return true;
  	}
    if(VK_ENTER == undefined) VK_ENTER=13;
    if(VK_BACK_SPACE == undefined) VK_BACK_SPACE=8;

    //key navigation. to be moved to a directive
    $scope.keyDown = function(e){
      var which = "";
      switch(e.which){
        case VK_ENTER:
          which = "enter"; break;
        case VK_BACK_SPACE:
          which = 'back';
          if(depth.get() > 0)
          e.preventDefault(); break;
        case 38:
          e.preventDefault();
          which = 'keyup'; break;
        case 40:
          e.preventDefault();
          which = 'keydown'; break;
        case 37:
          e.preventDefault();
          which = 'keyleft'; break;
        case 39:
          e.preventDefault();
          which = 'keyright'; break;
      }
      if(which!="")
        rootScope.$broadcast(which);
    }
  }])

  .controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
  	
  	// $scope.items=[];
  	// var tmt = 0;
   //  $scope.s="";
  	// $scope.$watch('s',function () {
  	// 	clearInterval(tmt);
  	// 	if($scope.s.length>0)
  	// 	tmt = setTimeout(function(){
  	// 		$http.get(appURI.search+"?s="+$scope.s).success(function(data) {
			// 	$scope.items = data;
			// 	$scope.currentItemIndex=0;
			// 	$scope.currentItem = data[0];
		 //  	});
  	// 	},200);
  	// })

    $scope.$on("enter",function(){
      depth.more();
      if($scope.searchLevel==0)$scope.searchLevel=2;
      if(depth.get()==1){
        // document.getElementById('searchInput').focus();
      }
    })
    $scope.$on("back",function(){
      if(depth.get()==1)$scope.searchLevel=0;
      depth.less();
    })
  }])
  
  .controller('Movies', ['$scope','$routeParams', 'Backend', function ($scope, $routeParams, Backend){
    var playlist = $routeParams.playlist;
    $scope.Menu.enable();
  	$scope.items = [];
    Backend.getHomeMovies().then(function success(result) {
      $scope.items = result[playlist];
      $scope.currentItem = $scope.items[0];
      console.log($scope.items);
    })
  }])

  .controller('Play', ['$scope', '$routeParams', '$http', 'movie', function ($scope, $routeParams, $http, movie) {
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.movie = movie;

  }])
  .controller('Playlists', ['$scope', 'Backend', function ($scope, Backend){
    $scope.Menu.enable();
    Backend.getPlaylists().then(function success(result) {
      console.log(result);
    });
  	$scope.items = [
      {
        photo:"sampledata/Donkey_Xote_movie_poster.jpg",
        title:"Мойте любими филми",
        movies:[
          "sampledata/Donkey_Xote_movie_poster.jpg", "sampledata/Umnikyt-Jack.jpg", "sampledata/happy-elf.jpg"
        ]
      },
      {
        photo:"sampledata/Kaspyr-Koleda.jpg",
        title:"Каспър и Маша",
        movies:[
          "sampledata/Kaspyr-Koleda.jpg", "sampledata/masha.jpg"
        ]
      },
    ]

  }])

  .controller('Users', ['$scope', 'depth', 'Backend', '$route', function ($scope, depth, Backend, $route) {
    $scope.data = {};

    $scope.loggedIn = Backend.identifier !== null;
    if (!Backend.identifier) {
      $scope.$on("enter", function () {
        Backend.login($scope.data.email, $scope.data.password).then(function success(){
          window.location.reload();
        });
      });
    }
    else {
      $scope.items = [];
      Backend.getProfiles().then(function success(profiles){
        $scope.items = profiles;
      });

      $scope.$on("enter", function () {
      })
    }
  }])