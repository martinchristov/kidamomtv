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
    $scope.loading=false;

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
          if(!LoginContext)e.preventDefault();
          which = 'keyup'; break;
        case 40:
          if(!LoginContext)e.preventDefault();
          which = 'keydown'; break;
        case 37:
          if(!LoginContext)e.preventDefault();
          which = 'keyleft'; break;
        case 39:
          if(!LoginContext)e.preventDefault();
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
      if($scope.searchLevel==0){
        setTimeout(function(){
              $scope.searchLevel=2;
              $scope.$apply();
            },20);
      }
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
      if ($scope.items.length) {
        $scope.currentItem = $scope.items[0];
        $scope.items.forEach(function (item) {
          item.duration = (item.duration/60).toFixed();
        })
      }
    })
  }])

  .controller('Play', ['$scope', '$routeParams', '$http', 'movie', 'playlist', function ($scope, $routeParams, $http, movie, playlist) {
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.movie = movie;
    $scope.playlist = playlist.movies;
    $scope.playlistId = playlist.id;

    movie.videos.forEach(function (item) {
      if (item.languageLocale === 'bg') $scope.movieUrl = item.sources.tv;
    });
    if ($scope.playlist && $scope.playlist.length) {
      $scope.playlist.forEach(function (item, index) {
        if (item.id === movie.id)
          $scope.currentInList = index;
      });
    }
  }])
  .controller('Playlists', ['$scope', 'Backend', '$location', function ($scope, Backend, $location){
    $scope.Menu.enable();
    $scope.items = [];
    Backend.getPlaylists().then(function success(playlists) {
      $scope.items = playlists;
      $scope.items.forEach(function (item) {
        if (item.movies.length) item.photo = item.movies[0].photo;
      })
      $scope.currentItem = $scope.items && $scope.items[0];
    });

    $scope.$on('enter', function () {
      if (!$scope.currentItem.movies.length) return;
      $location.path('/play/' + $scope.currentItem.movies[0].id + "/" + $scope.currentItem.id);
    })

  }])

  .controller('Users', ['$scope', 'depth', 'Backend', '$route', function ($scope, depth, Backend, $route) {
    $scope.data = {};

    $scope.loggedIn = Backend.isAuth();

    if (!Backend.isAuth()) {
        depth.more();
        LoginContext=true;
        setTimeout(function(){
            $("#users input:first").focus();
        },1000);
        $scope.$on("back",function(){
            if(depth.get()==1){
                depth.less();
                $("#users input:first").blur();
                LoginContext=false;
            }
        })
        $scope.$on("enter",function(){
            if(depth.get()==0){
                depth.more();
                $("#users input:first").focus();
                LoginContext=true;
            }
        })
      // $scope.$on("enter", function () {
      //   Backend.login($scope.data.email, $scope.data.password).then(function success(){
      //     window.location.reload();
      //   });
      // });

        $scope.logIn = function(){
            $scope.data.email="martin.christov@gmail.com";
            $scope.data.password="772323";
            Backend.login($scope.data.email, $scope.data.password).then(function success(d){

            });
        }
    }
    else {
      $scope.items = [];
      Backend.getProfiles().then(function success(profiles){
        $scope.items = profiles;
        $scope.items.forEach(function (item) {
          item.photo = item.avatar;
        });
      });
      $scope.$on('enter', function () {
        Backend.logout();
        window.location.reload();
      })
    }
  }])

  var LoginContext = false;