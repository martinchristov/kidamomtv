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

    $scope.movieloading=true;
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

        rootScope.$broadcast("keypress")
    }
  }])

  .controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
    $scope.$on("enter",function(){
      depth.more();
      if($scope.searchLevel==0){
        setTimeout(function(){
            $scope.searchLevel=2;
            $scope.$apply();
        },20);
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
      $scope.itemsloading=false;
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
      $scope.itemsloading=false;
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
        setTimeout(function(){
            depth.more();
            LoginContext=true;
            $("#users input:first").focus();
            $scope.$apply();
        },3000);
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
                LoginContext=true;
                $("#users input:first").focus();
            }
        })
      // $scope.$on("enter", function () {
      //   Backend.login($scope.data.email, $scope.data.password).then(function success(){
      //     window.location.reload();
      //   });
      // });
  $scope.error=""
        $scope.logIn = function(){
            // $scope.data.email="martin.christov@gmail.com";
            // $scope.data.password="772323";
            Backend.login($scope.data.email, $scope.data.password).then(function success(d){
                if(d.hasOwnProperty("identifier")==false){
                    $scope.error="Грешен email или парола.";
                }
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