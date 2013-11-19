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
    $scope.playLabel="пусни";
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
          holdint = setTimeout(function(){
            console.log('setting interval');
              holdint = setInterval(hold,300);
          },2000);
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

        //
    }
    function hold(){
        rootScope.$broadcast("enter");
    }
    var holdint=0;
    $scope.keyUp = function(e){
        if(e.which==VK_ENTER){
            clearInterval(holdint);
        }

    }
  }])

  .controller('Search', ['$scope','depth','$http', '$rootScope', function ($scope, depth, $http, $rootScope) {
  	$scope.carousel = {};
			// 	$scope.carousel.index=0;
			// 	$scope.carousel.item = data[0];
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
    $scope.carousel = {};
    var playlist = $routeParams.playlist;
    var dict = {
      "nofavourites":"В момента нямате добавени любими филмчета. Можете да си добавите от нашия сайт.",
      "nolastwatched":"Нямате последно гледани филмчета."
    }
    $scope.noItemsLabel=dict["no"+playlist];
    $scope.Menu.enable();
  	$scope.items = [];
    Backend.getHomeMovies().then(function success(result) {
      $scope.items = result[playlist];
      $scope.carousel.loading = false;
      if ($scope.items.length) {
        $scope.carousel.item = $scope.items[0];
        $scope.items.forEach(function (item) {
          item.duration = (item.duration/60).toFixed();
        })
      }
    })
  }])

  .controller('Play', ['$scope', '$routeParams', '$http', 'movie', 'playlist', function ($scope, $routeParams, $http, movie, playlist) {
    $scope.carousel = {};
    $scope.Menu.visible = false;
    $scope.Menu.disable();
    $scope.movie = movie;
    $scope.playlist = playlist.movies;
    $scope.playlistId = playlist.id;

    $scope.languages=[];
    for(var i in $scope.movie.videos){
        $scope.languages.push({
            key:$scope.movie.videos[i].languageLocale,
            locale:langLocale[$scope.movie.videos[i].languageLocale],
            sources:$scope.movie.videos[i].sources
        })
    }



    movie.videos.forEach(function (item) {
      if (item.languageLocale === 'bg') $scope.movieUrl = item.sources.tv;
    });
    $scope.currentInList=0;
    if ($scope.playlist && $scope.playlist.length) {
      $scope.playlist.forEach(function (item, index) {
        if (item.id === movie.id)
          $scope.currentInList = index;
      });
    }
    else $scope.playlist = []
  }])
  .controller('Playlists', ['$scope', 'Backend', '$location', function ($scope, Backend, $location){
    $scope.carousel = {};
    $scope.Menu.enable();
    $scope.items = [];
    $scope.noItemsLabel="В момента нямате плейлисти. Можете да си съставите чрез нашия сайт.";
    Backend.getPlaylists().then(function success(playlists) {
      $scope.items = playlists;
      $scope.carousel.loading = false;
      $scope.items.forEach(function (item) {
        if (item.movies.length) item.photo = item.movies[0].photo;
      })
      $scope.carousel.item = $scope.items && $scope.items[0];
    });

    $scope.$on('enter', function () {
      if (!$scope.carousel.item.movies.length) return;
      $location.path('/play/' + $scope.carousel.item.movies[0].id + "/" + $scope.carousel.item.id);
    })

  }])

  .controller('Users', ['$scope', 'depth', 'Backend', '$route', function ($scope, depth, Backend, $route) {
    $scope.carousel = {};
    $scope.data = {};
    $scope.playLabel="зареди профил";
    $scope.loggedIn = Backend.isAuth();

    $scope.back = function(){
      depth.less();
      LoginContext=false;
      $("#users input:first").blur();
    }

    if (!Backend.isAuth()) {
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
        $scope.error=""
        $scope.data.email="";$scope.data.password="";
        $scope.logIn = function(){

          if($scope.data.email.length>0&&$scope.data.password.length>0)
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
          if (item.id == Backend.profile) $scope.carousel.item = item;
        });
        $scope.items.push({ id: null, photo: 'img/logout.jpg', name:"изход"})
        $scope.carousel.loading = false;
      });
      $scope.$on('enter', function () {
        if ($scope.carousel.item.id !== null) {
          Backend.switchProfile($scope.carousel.item.id).then(function success(result) {
            window.location.reload();
          })
        }
        else {
          Backend.logout();
          window.location.href="#/";
          window.location.reload();
          // window.location.reload();
        }
      })
    }
  }])

  var LoginContext = false;