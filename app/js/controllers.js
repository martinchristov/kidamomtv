'use strict';

/* Controllers */

angular.module('kidamom.controllers', [])
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      '**'
      ]);
  })
  
  .controller('Main', ['$scope', 'depth', '$rootScope', 'Menu', function ($scope, depth, rootScope, Menu){
    $scope.Menu = Menu;
    $scope.loggedIn=true; 

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
  }])

  .controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
  	
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
  }])
  .controller('Movies', ['$scope','$routeParams', 'Movies', function ($scope, $routeParams, Movies){
    $scope.Menu.enable();
  	$scope.items = Movies.getAll();
  }])

  .controller('Play', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.loading=true;
    $scope.playlist=[];
    $http.get(appURI.getmovie+"?id="+$routeParams.movieid).success(function (movie) {
        $scope.loading=false;
        $scope.movie = movie;
    })
    if($routeParams.playlistid)
      $http.get(appURI.getplaylist+"?id="+$routeParams.playlistid).success(function (playlist) {
        $scope.playlist = playlist;
        for(var i=0;i<$scope.playlist.length;i++){
            if($scope.playlist[i].id==$scope.movie.id){
                $scope.currentInPlaylist = i; break;
            }
        }
      })

  }])
  .controller('Playlists', ['$scope', function($scope){
  	$scope.items = [
      {
        photo:"sampledata/4.jpg",
        title:"Playlist 1",
        movies:[
          "sampledata/3.jpg", "sampledata/2.jpg", "sampledata/4.jpg"
        ]
      },
      {
        photo:"sampledata/4.jpg",
        title:"Playlist 2",
        movies:[
          "sampledata/3.jpg", "sampledata/2.jpg", "sampledata/4.jpg"
        ]
      },
      {
        photo:"sampledata/2.jpg",
        title:"Playlist 3",
        movies:[
          "sampledata/3.jpg", "sampledata/2.jpg", "sampledata/4.jpg"
        ]
      },
      {
        photo:"sampledata/3.jpg",
        title:"Playlist 4",
        movies:[
          "sampledata/3.jpg", "sampledata/2.jpg", "sampledata/4.jpg"
        ]
      }
    ]

  }])

  .controller('Users', ['$scope', 'depth', function($scope, depth){
    $scope.items = [
      {
        photo:"sampledata/user1.jpg",
        name:"",
        id:0
      },
      {
        photo:"sampledata/user2.jpg",
        name:"",
        id:0
      },
      {
        photo:"sampledata/user3.jpg",
        name:"",
        id:0
      },
      {
        photo:"sampledata/logout.jpg",
        name:"",
        id:0
      }
    ]
    $scope.loggedIn = $scope.$parent.loggedIn;
  	$scope.logIn = function(){
      $scope.$parent.loggedIn = $scope.loggedIn = true;
      window.location.reload();
    }

    $scope.$on("enter",function(){
      if($scope.$$childTail.currentItem===$scope.items[$scope.items.length-1]){
        $scope.$parent.loggedIn = $scope.loggedIn = false;
        window.location.reload();
      }
      else {
        window.location.href=appURI.root+"index.html#/movies/recommended"; 
        window.location.reload();
      }
    })

  }])